import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Status constants
export enum EmailJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('email_jobs')
export class EmailJob extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subscriberId: string;

  @Column('json')
  config: {
    templateCode: string;
    data: object;
  };

  @Column({ type: 'int', default: 0 })
  totalEmails: number;

  @Column({ type: 'int', default: 0 })
  sentEmails: number;

  @Column({ type: 'int', default: 0 })
  failedEmails: number;

  @Column('enum', { enum: EmailJobStatus, default: EmailJobStatus.PENDING })
  status: EmailJobStatus;

  @Column('json', { default: [] })
  blacklistedEmails: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
