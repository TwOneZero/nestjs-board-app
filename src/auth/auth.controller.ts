import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth.decorator';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //회원가입
  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(
    @Body() authcredentialDto: AuthCredentialDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.signUp(authcredentialDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(
    @Body() authcredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authcredentialDto);
  }
}
