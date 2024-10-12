import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const dbConfig = {
  synchronize: false,
  migrationsRun: true,
  migrations: ['migrations/*.js'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: process.env.DB_NAME,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: process.env.DB_NAME,
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: process.env.DB_NAME,
      entities: ['**/*.entity.ts'],
    });
    break;
  default:
    throw new Error('unknown environment');
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return dbConfig;
  },
};

export default new DataSource(dbConfig as DataSourceOptions);
