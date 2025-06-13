import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { AirbyteManagerService } from '../services/airbyte-manager.service';
import { EncryptionService } from '../services/encryption.service';
import { AuditService } from '../services/audit.service';
import { ConnectorRegistry } from '../connectors/connector-registry';

@Module({
  providers: [IntegrationsService, AirbyteManagerService, EncryptionService, AuditService, ConnectorRegistry],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {} 