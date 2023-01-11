import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userRepository } from '../repository/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...userRepository],
})
export class BoardsModule {}
