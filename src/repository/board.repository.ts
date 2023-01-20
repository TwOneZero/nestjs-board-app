import { DataSource, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CustomRepository } from './typeorm-ex.decorator';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {}
