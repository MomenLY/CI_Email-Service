// export class BlackListEmail {}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
const databaseType = process.env.DB_TYPE || 'mongo';
@Entity({database: databaseType, name: 'blacklistEmails'})
export class BlacklistEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
}

