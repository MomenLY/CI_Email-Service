import { Entity, BaseEntity, Column } from 'typeorm';
import { getIdColumnDecorator } from 'src/utils/helper';

const databaseType = process.env.DB_TYPE || 'mongo';
@Entity({ database: databaseType })
export class Subscriber extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column({ nullable: false })
  SAccountId: string;

  @Column()
  SAuthCode: string;

  @Column({ nullable: true })
  SFromEmailId: string;

  @Column()
  SEmailVerified: boolean;

  @Column({ nullable: true })
  SProviderId: string;
}
