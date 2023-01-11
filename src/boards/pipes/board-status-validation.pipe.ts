import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { BoardStatus } from '../boards-status.enum';

//status 의 유효성 검사
export class BoardStatusValidationPipe implements PipeTransform {
  private StatusOption: string[] = [BoardStatus.PUBLIC, BoardStatus.PRIVATE];

  transform(value: string) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not valid!`);
    }
    return value;
  }

  private isStatusValid(status: string) {
    const index = this.StatusOption.indexOf(status);
    //-1 이 아니면 valid한 상태 -> true 반환
    return index !== -1;
  }
}
