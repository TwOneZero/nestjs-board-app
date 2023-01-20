import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UserRepository } from 'src/repository/user.repository';

export interface JwtPayload {
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  //회원가입
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPWD = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      username,
      password: hashedPWD,
    });
    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
    console.log('회원가입 됨', username);
  }

  //로그인
  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const exUser = await this.userRepository.findOneBy({ username });
    if (exUser && (await bcrypt.compare(password, exUser.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      console.log('로그인 성공');

      return { accessToken: accessToken };
    } else {
      throw new UnauthorizedException('login 실패');
    }
  }
}
