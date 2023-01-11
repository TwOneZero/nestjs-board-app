import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from 'src/entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BOARD_REPOSITORY')
    private boardRepository: Repository<Board>,
  ) {}

  //모든 board 가져오기
  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  //ID 를 통해 board 가져오기
  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`${id} 에 해당하는 것 없음`);
    }
    return found;
  }

  //board 생성
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });

    return await this.boardRepository.save(board);
  }

  //id를 통해 board 삭제하기
  async deleteBoardById(id: number) {
    const result = await this.boardRepository.delete(id);
    console.log('Delete Result : ', result);
    
  }
  //Board 의 공개 상태 업데이트
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
}
