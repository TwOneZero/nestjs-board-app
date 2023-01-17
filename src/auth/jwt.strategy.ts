import { Inject, Injectable } from '@nestjs/common/decorators';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService, JwtPayload } from './auth.service';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import * as config from 'config';
const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { username } = payload;
    //유저 확인
    const user: User = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
