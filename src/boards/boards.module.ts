import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from 'src/repository/board.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmExModule } from 'src/repository/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([BoardRepository]), AuthModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
