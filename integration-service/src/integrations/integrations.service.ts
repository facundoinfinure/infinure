import { Injectable } from '@nestjs/common';
import { AirbyteManagerService } from '../services/airbyte-manager.service';
import { ConnectorRegistry } from '../connectors/connector-registry';

@Injectable()
export class IntegrationsService {
  // For the MVP we work with a hard-coded organization id. Later this will come from auth context
  private readonly orgId = 'demo-org';

  constructor(
    private readonly airbyteManager: AirbyteManagerService,
    private readonly connectorRegistry: ConnectorRegistry
  ) {}

  /* --------------------- Sources --------------------- */
  listSources() {
    return this.airbyteManager.listOrganizationSources(this.orgId);
  }

  createSource(body: any) {
    return this.airbyteManager.setupDataSource(this.orgId, body);
  }

  triggerSync(sourceId: string) {
    // In production, look up connection by sourceId – for the demo we expect connectionId passed directly
    return this.airbyteManager.triggerSync(sourceId);
  }

  /* --------------------- Connectors --------------------- */
  listConnectors(industry = 'saas') {
    return this.connectorRegistry.getConnectorsByIndustry(industry);
  }
} 