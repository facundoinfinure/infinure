import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';

export enum UserRole {
  CEO = 'ceo',
  DIRECTOR = 'director',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, any>;

  @Column({ type: 'boolean', default: false, name: 'mfa_enabled' })
  mfaEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'mfa_secret' })
  mfaSecret: string;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'last_login' })
  lastLogin: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Organization, organization => organization.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany('Conversation', 'user')
  conversations: any[];

  @OneToMany('UserActivity', 'user')
  activities: any[];
} 