import { getIdColumnDecorator } from 'src/utils/helper';
import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
interface EmailBody {
  templateCode: string;
  data: object;
  to: string[];
  cc: string[];
  bcc: string[];
  multiThread: boolean;
  providerId: string;
}
const databaseType = process.env.DB_TYPE || 'mongo';
@Entity({ database: databaseType, name: 'emailQueue' })
export class Email extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column('json')
  EBody: EmailBody;

  @Column()
  ESubscriberId: string;

  @Column()
  EStatus: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
