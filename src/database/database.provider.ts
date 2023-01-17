import { DataSource } from 'typeorm';
import * as config from 'config';
import { stringify } from 'querystring';

const dbConfig = config.get('db');

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: process.env.RDS_HOSTNAME || dbConfig.type,
        host: process.env.RDS_HOST || dbConfig.host,
        port: process.env.RDS_PORT || dbConfig.port,
        username: process.env.RDS_USERNAME || dbConfig.username,
        password: process.env.RDS_PASSWORD || dbConfig.password,
        database: process.env.RDS_DB_NAME || dbConfig.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: dbConfig.synchronize,
      });

      return dataSource.initialize();
    },
  },
];
