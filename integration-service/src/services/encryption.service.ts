import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Simple utility for field-level encryption of sensitive data.
 * In production this should be replaced by KMS backed key management.
 */
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly ivLength = 16; // 128-bit IV for GCM

  /**
   * Derive an organization-scoped 256-bit key from a master secret.
   * NOTE: For demo purposes we derive it via SHA-256. Replace with
   * a secure key management strategy (e.g. AWS KMS) in production.
   */
  private getOrganizationKey(orgId: string): Buffer {
    const masterKey = (process.env.ENCRYPTION_MASTER_KEY || 'dev_master_key_must_be_32_bytes_long').padEnd(32, '_');
    // Derive deterministic key combining masterKey + orgId
    return crypto.createHash('sha256').update(masterKey + orgId).digest();
  }

  encryptSensitiveData(data: any, orgId: string): string {
    const key = this.getOrganizationKey(orgId).subarray(0, 32); // 32 bytes
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();
    return [iv.toString('hex'), authTag.toString('hex'), encrypted].join(':');
  }

  decryptSensitiveData(ciphertext: string, orgId: string): any {
    const [ivHex, tagHex, encrypted] = ciphertext.split(':');
    if (!ivHex || !tagHex || !encrypted) throw new Error('Invalid encrypted data format');
    const key = this.getOrganizationKey(orgId).subarray(0, 32);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
} 