import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BoardsModule, AuthModule],
})
export class AppModule {}
