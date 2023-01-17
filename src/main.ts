import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  await app.listen(serverConfig.port);
  Logger.log(`Application running on port ${serverConfig.port}`);
}
bootstrap();
