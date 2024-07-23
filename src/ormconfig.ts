import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { envSchema } from './configuration/env.validation';

dotenv.config();
const env = envSchema.parse(process.env)

export const configs: PostgresConnectionOptions = {
    type: 'postgres',

    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,

    migrationsRun: false,
    dropSchema: false,
    
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    entities: [__dirname + '/**/*.entity.{ts,js}'],
};

const dataSource = new DataSource(configs);
export default dataSource;