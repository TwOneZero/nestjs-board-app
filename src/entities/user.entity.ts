import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Board } from './board.entity';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, { message: '영어랑 숫자만 됨' })
  password: string;

  @OneToMany((type) => Board, (board) => board.user, { eager: true })
  boards: Board[];

  async validationPassword(password: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  }

  async makeHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPWD = await bcrypt.hash(password, salt);
    return hashedPWD;
  }
}
