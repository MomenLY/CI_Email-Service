import { getIdColumnDecorator } from 'src/utils/helper';
import { BaseEntity, Entity, Column } from 'typeorm';

const databaseType = process.env.DB_TYPE || 'mongo';
@Entity({ database: databaseType, name: 'templateLayer' })
export class TemplateLayer extends BaseEntity {
  @getIdColumnDecorator()
  _id: string;

  @Column({ nullable: false })
  TLTemplateLayer: string;

  @Column()
  TLAccountId: string;

  @Column()
  TLProviderId: string;
}
