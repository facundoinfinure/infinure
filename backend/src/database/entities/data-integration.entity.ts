import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('data_integrations')
export class DataIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  airbyteConnectionId: string;

  @Column({ type: 'varchar', length: 255 })
  airbyteSourceId: string;

  @Column({ type: 'jsonb' })
  connectionConfig: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  schemaMapping: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'hourly' })
  syncFrequency: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastSync: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, organization => organization.dataIntegrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User, user => user, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;
} 