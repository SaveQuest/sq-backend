import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { envSchema } from './config/env.validator';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();
const env = envSchema.parse(process.env)

const isDev = env.NODE_ENV === "development"
export const configs: PostgresConnectionOptions = {
    type: 'postgres',

    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,

    migrationsRun: false,
    dropSchema: isDev,
    
    synchronize: isDev,
    
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    entities: [__dirname + '/**/*.entity.{ts,js}'],
    
    namingStrategy: new SnakeNamingStrategy()
};

const dataSource = new DataSource(configs);
export default dataSource;