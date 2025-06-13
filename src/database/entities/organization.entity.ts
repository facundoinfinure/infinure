import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { DataIntegration } from './data-integration.entity';
import { Conversation } from './conversation.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, name: 'industry_type' })
  industryType: string;

  @Column({ type: 'varchar', length: 50, default: 'starter', name: 'subscription_tier' })
  subscriptionTier: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, user => user.organization)
  users: User[];

  @OneToMany(() => DataIntegration, integration => integration.organization)
  dataIntegrations: DataIntegration[];

  @OneToMany(() => Conversation, conversation => conversation.organization)
  conversations: Conversation[];
} 