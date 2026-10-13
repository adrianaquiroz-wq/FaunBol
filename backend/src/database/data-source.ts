import 'dotenv/config';
import { join } from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AnimalOrmEntity } from '../animals/infrastructure/animal.orm-entity.js';
import { EcoregionOrmEntity } from '../ecoregions/infrastructure/ecoregion.orm-entity.js';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity.js';

/**
 * Single source of truth for the DB connection, shared by the Nest app,
 * the TypeORM CLI (migrations) and the seed script.
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'animales_extincion_db',
  entities: [AnimalOrmEntity, EcoregionOrmEntity, UserOrmEntity],
  migrations: [join(import.meta.dirname, 'migrations', '*.js')],
  uuidExtension: 'pgcrypto',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
};

export default new DataSource(dataSourceOptions);
