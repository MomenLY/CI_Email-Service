import { Module, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const entities = getMetadataArgsStorage()
          .tables.map((tbl) => tbl.target as Type<any>)
          .filter((entity) =>
            entity.toString().toLowerCase().includes('entity'),
          );
        return {
          type: 'mongodb',
          url: process.env.MONGO_CONNECTION_STRING,
          database: process.env.DB_NAME,
          entities,
          logging: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class MongoModule {}
