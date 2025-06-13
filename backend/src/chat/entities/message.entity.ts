import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

export type ChatRole = 'user' | 'assistant' | 'system';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;

  @Column({ type: 'varchar', length: 20 })
  role!: ChatRole;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
} 