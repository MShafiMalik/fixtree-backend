import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Support both CJS and ESM execution contexts
const baseDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Load environment variables
dotenv.config({ path: '.env' });
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [join(baseDir, '/../**/*.entity{.ts,.js}')],
  migrations: [join(baseDir, '/migrations/*{.ts,.js}')],
};

// DataSource instance for TypeORM CLI
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
