import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Board } from 'src/entities/board.entity';
import { BoardStatus } from './boards-status.enum';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/auth.decorator';
import { User } from 'src/entities/user.entity';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Logger } from '@nestjs/common/services';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(private boardsService: BoardsService) {
    this.boardsService = boardsService;
  }

  @Get()
  getAllBoards(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardsService.getAllBoards();
  }

  // @Get()
  // getAUserBoards(@GetUser() user: User): Promise<Board[]> {
  //   return this.boardsService.getAUserBoards(user);
  // }

  @Get('/:id')
  getBoardById(@Param('id') id: number, @GetUser() user: User): Promise<Board> {
    return this.boardsService.getBoardById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  deleteBoardById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoardById(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status, user);
  }
}
