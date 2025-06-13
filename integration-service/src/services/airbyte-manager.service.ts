import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { EncryptionService } from './encryption.service';
import { AuditService } from './audit.service';

interface DataSourceConfig {
  name: string;
  type: string;
  credentials: Record<string, any>;
  syncFrequency?: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

@Injectable()
export class AirbyteManagerService {
  private readonly api: AxiosInstance;
  private readonly logger = new Logger('AirbyteManager');
  // In-memory workspace mapping for demo purposes (orgId -> workspaceId)
  private readonly workspaceMap = new Map<string, string>();

  constructor(
    private readonly encryption: EncryptionService,
    private readonly audit: AuditService
  ) {
    this.api = axios.create({
      baseURL: process.env.AIRBYTE_API_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /* ----------------------------- Workspaces ----------------------------- */
  async createOrganizationWorkspace(orgId: string): Promise<string> {
    try {
      const res = await this.api.post('/v1/workspaces/create', {
        name: `org-${orgId}`,
        displayName: `Organization ${orgId}`,
        email: `admin@org-${orgId}.infinure.local`,
        anonymousDataCollection: false,
        news: false,
        securityUpdates: true
      });
      const workspaceId = res.data?.workspaceId;
      if (!workspaceId) throw new Error('Invalid Airbyte response');
      this.workspaceMap.set(orgId, workspaceId);
      await this.audit.log({ organizationId: orgId, action: 'WORKSPACE_CREATED', resourceId: workspaceId });
      return workspaceId;
    } catch (error: any) {
      this.logger.error('Failed to create workspace', error?.message);
      throw new HttpException('Failed to create workspace', HttpStatus.BAD_GATEWAY);
    }
  }

  private async getWorkspaceId(orgId: string): Promise<string> {
    if (this.workspaceMap.has(orgId)) return this.workspaceMap.get(orgId)!;
    // TODO: fetch from persistent store – for now create on-demand
    return this.createOrganizationWorkspace(orgId);
  }

  /* ----------------------------- Sources ----------------------------- */
  async listOrganizationSources(orgId: string) {
    const workspaceId = await this.getWorkspaceId(orgId);
    const res = await this.api.post('/v1/sources/list', { workspaceId });
    return res.data?.sources || [];
  }

  async setupDataSource(orgId: string, config: DataSourceConfig) {
    const workspaceId = await this.getWorkspaceId(orgId);

    // 1. Encrypt credentials before storing internally (Airbyte will still receive raw config)
    const encryptedCreds = this.encryption.encryptSensitiveData(config.credentials, orgId);

    // 2. Create source in Airbyte
    const sourceRes = await this.api.post('/v1/sources/create', {
      workspaceId,
      name: config.name,
      sourceDefinitionId: config.type,
      connectionConfiguration: config.credentials
    });
    const sourceId = sourceRes.data?.sourceId;

    if (!sourceId) throw new HttpException('Airbyte source creation failed', HttpStatus.BAD_GATEWAY);

    // 3. For demo: create a dummy destination pointing back to same workspace (would be warehouse in prod)
    const destRes = await this.api.post('/v1/destinations/create', {
      workspaceId,
      name: `org-${orgId}-warehouse`,
      destinationDefinitionId: '25c5221d-dce2-4163-ade9-739ef790f503', // Postgres destination (as example)
      connectionConfiguration: {
        host: process.env.DESTINATION_DB_HOST || 'db',
        port: 5432,
        database: 'infinure',
        username: 'postgres',
        password: 'postgres',
        schema: `org_${orgId}`
      }
    });
    const destinationId = destRes.data?.destinationId;

    // 4. Discover schema
    const catalogRes = await this.api.post('/v1/sources/discover_schema', { sourceId });
    const catalog = catalogRes.data?.catalog;

    // 5. Create connection
    const cronByFreq: Record<string, string> = {
      hourly: '0 * * * *',
      daily: '0 2 * * *',
      weekly: '0 2 * * 0',
      monthly: '0 2 1 * *'
    };

    const connRes = await this.api.post('/v1/connections/create', {
      sourceId,
      destinationId,
      syncCatalog: catalog,
      schedule: {
        scheduleType: 'cron',
        cronExpression: cronByFreq[config.syncFrequency || 'hourly']
      },
      namespaceDefinition: 'destination',
      namespaceFormat: `org_${orgId}_${config.name.toLowerCase()}`
    });
    const connectionId = connRes.data?.connectionId;

    // 6. Audit log
    await this.audit.log({
      organizationId: orgId,
      action: 'DATA_SOURCE_CREATED',
      resourceId: sourceId,
      metadata: { connectionId, sourceName: config.name }
    });

    // 7. Return minimal payload (credentials encrypted for storage)
    return {
      sourceId,
      connectionId,
      encryptedCredentials: encryptedCreds,
      status: 'configured'
    };
  }

  /* ----------------------------- Sync jobs ----------------------------- */
  async triggerSync(connectionId: string) {
    const res = await this.api.post('/v1/connections/sync', { connectionId });
    return res.data;
  }
} 