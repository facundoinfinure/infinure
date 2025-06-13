import { Injectable, Logger } from '@nestjs/common';

interface AuditEntry {
  organizationId: string;
  userId?: string;
  action: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditService');

  async log(entry: AuditEntry): Promise<void> {
    // For the proof-of-concept we simply log to console.
    // In production, this should be persisted to an audit log table or service.
    this.logger.log(`[${entry.organizationId}] ${entry.action} – ${entry.resourceId || 'N/A'} ${JSON.stringify(entry.metadata || {})}`);
  }
} 