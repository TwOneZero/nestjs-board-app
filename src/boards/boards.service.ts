import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from 'src/entities/board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BOARD_REPOSITORY')
    private boardRepository: Repository<Board>,
  ) {}
  d;
  //모든 board 가져오기
  async getAllBoards(): Promise<Board[]> {
    const boards = await this.boardRepository.find();
    if (!boards) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }
    return boards;
  }

  // //한 유저의 모든 boards 가져오기
  // async getAUserBoards(user: User): Promise<Boar[]> {
  //   const query = this.boardRepository.createQueryBuilder('board');
  //   query.where('board.userId = :userId', { userId: user.id });

  //   const boards = await query.getMany();
  //   return boards;
  // }

  //ID 를 통해 board 가져오기
  async getBoardById(id: number, user: User): Promise<Board> {
    const found = await this.boardRepository.findOneBy({ id, userId: user.id });
    if (!found) {
      throw new NotFoundException(`${id} 에 해당하는 것 없음`);
    }
    return found;
  }

  //board 생성
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    return await this.boardRepository.save(board);
  }

  //id를 통해 board 삭제하기
  async deleteBoardById(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, userId: user.id });
    console.log('Delete Result : ', result);
  }

  //Board 의 공개 상태 업데이트
  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    const board = await this.getBoardById(id, user);

    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
}
