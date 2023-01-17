import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { DatabaseModule } from 'src/database/database.module';
import { boardRepository } from 'src/repository/board.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [BoardsController],
  providers: [...boardRepository, BoardsService],
})
export class BoardsModule {}
