import { getIdColumnDecorator } from 'src/utils/helper';
import { BaseEntity, Column, Entity } from 'typeorm';

const databaseType = process.env.DB_TYPE || 'mongo';
@Entity({ database: databaseType, name: 'emailTemplate' })
export class EmailTemplate extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column({ nullable: false })
  TAccountId: string;

  @Column({ nullable: false })
  TProviderId: string;

  @Column()
  TName: string;

  @Column()
  TSubject: string;

  @Column()
  TBody: string;

  @Column()
  TMagicQuotes: string;

  @Column()
  TTemplateCode: string;
}
