import { ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PostgresModule } from 'src/databases/postgres.module';
import { MongoModule } from 'src/databases/mongo.module';
import * as dotenv from 'dotenv';
// import { Subscriber } from 'src/subscriber/entities/subscriber.entity';

dotenv.config();

export const getIdColumnDecorator = () => {
  if (process.env.DB_TYPE === 'postgres') {
    return PrimaryGeneratedColumn('uuid');
  } else {
    return ObjectIdColumn();
  }
};

export const determineDB = () => {
  return process.env.DB_TYPE;
};

export const determineDatabaseModule = () => {
  return process.env.DB_TYPE === 'postgres' ? PostgresModule : MongoModule;
};
