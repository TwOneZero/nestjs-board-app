import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import * as config from 'config';
const dbConfig = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: process.env.RDS_HOSTNAME || dbConfig.type,
  host: process.env.RDS_HOST || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: dbConfig.synchronize,
};
