# Nest.js

## 목차

1. [Nest Js란](#1-nest-js-란)
2. [Nest.js 모듈이란](#2-nestjs-모듈이란)
3. [Provider, Service란](#3-provider-service-란)
4. [Service 만들고 주입하기](#4-service-만들고-주입하기)
5. [모델 정의하고 게시물 생성기능 구현](#5-모델-정의하고-게시물-생성기능)
6. [DTO](#6-dto)
7. [Nest.js Pipes](#7-nestjs-pipes)
8. [Custom Pipe](#8-custom-pipe)
9. [DB - repository 생성](#9-db---repository-생성)
10. [Auth 모듈 구현](#10-auth-모듈-구현)
11. [JWT, Passport 이용해 인증관리](#11-jwt-passport-이용해-인증관리)
12. [유저와 게시물 관계 형성](#12-유저와-게시물의-관계-형성-해주기)

- [로그남기기](#로그-남기기)

# 1. Nest Js 란

- 효율적, 확장 가능한 Node.js 서버 측 앱을 구축하기 위한 프레임 워크
- 프로그레시브 JS 를 사용하고, Typescript로 빌드되고 완벽하게 지원함 ( 개발자가 pure JS 로 코딩할 수도 있음)
- Functional Programming 및 Functinal Reactive Programming 요소를 사용할 수 있음

## 내부적인 구성

- Express와 같은 HTTP 서버 프레임 워크를 사용, 선택적으로 Fasify를 사용할 수 있음

## 철학

- Node 를 위한 라이브러리 도구가 많지만, 아키텍쳐의 주요문제를 효과적으로 해결하지 못함
- 테스트, 확장 가능, 느슨한 결합, 유지 보수과 쉬운 앱 아키텍쳐 제공

## 시작

- Nest CLI 로 시작하기
  - npm i -g @nestjs/cli → 전역으로 nest 명령어를 사용할 수 있게 함
  - nest new project-name

# 2. Nest.js 모듈이란?

- @Module() 데코레이터가 달린 클래스
- 각 응용 프로그램에는 하나 이상의 모듈(루트 모듈) 이 있다. Nest가 사용하는 시작점
- 밀접하게 관련된 기능 집합으로 요소를 구성하는 효과적인 방법
- EX > UserController , UserService, UserEntity 모듀 UserModule 안에 넣기
- 기본적으로 싱글톤이므로 여러 모듈간에 쉽게 동일한 인스턴스를 공유할 수 있음

<예시>

![Untitled](https://user-images.githubusercontent.com/74637926/212827659-c183020a-f8c7-404b-975b-95e55f0b71f7.png)

# 3. Provider, Service 란?

### Provider : Nest 의 기본 개념

→ 대부분의 Nest 클래스는 서비스, 레포지토리, 팩토리, 헬퍼 등 프로바이더로 취급됨

→ 종속성으로 주입하기 위함

→ 즉, 객체는 서로 다양한 관계를 가지며, 객체이 instance 를 연결하는 기능은 Nest의 런타임 시스템에 위임될 수 있다.

### Service : @Injectable

→ 서비스 instance 는 앱 전체에서 사용될 수 있음.

→ 컨트롤러에서 데이터 유효성 체크, DB 아이템 생성 등의 작업 처리

![Untitled](https://user-images.githubusercontent.com/74637926/212827643-63122dd4-0d68-4901-89f7-8fa733f1a2b9.png)

→ Dependency injection

# 4. Service 만들고 주입하기

![Untitled](https://user-images.githubusercontent.com/74637926/212827647-ef30c0dc-fc48-4b30-aef4-8cdfc006e50b.png)

→ Constructor() 에서 타입스크립트의 private(접근제한자) 기능을 사용하여 해당 클래스안에서만 사용할 수 있게 할 수 있다.

아래 코드를 위처럼 줄인 것이다.

```tsx
boardsService: BoardsService;
contructor( boardsService: BoardsService){
	this.boardsService:= boardsService;
}
```

# 5. 모델 정의하고 게시물 생성기능

- Board 모델을 interface를 통해 정의

```tsx
export interface Board {
  id: string;
  title: string;
  description: string;
  status: BoardStatus;
}

//공개글 or 비공개글
export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
```

- createBoard (Service)

```tsx
//board 생성
  createBoard(title: string, description: string) {
    const board: Board = {
      id: uuid(),
      title: title,
      description: description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    return board;
  }
```

# 6. DTO

- DTO 란?
  - 계층 간 데이터 교환을 위한 객체이다.
  - DB 에서 데이터를 얻어 Service 나 Controller 등으로 보낼 때 사용하는 객체
- 쓰는 이유?
  - 데이터의 유효성을 검사한다.
    - 정의된 모델의 속성에 대한 유효성

### Interface VS Class

- Class 를 통해 DTO 를 정의하는 것이 보다 좋다.
- 클래스는 JS ES6 표준의 일부이므로, 컴파일된 JS 에서 실제 엔티티로 유지됨.
  ⇒ 런타임 상에서 Nest 가 참조할 수 있음!|
- 파이프와 같은 기능을 런타임에서 사용할 수 있기 때문에 런타임에서 참조될 수 있는 것이 좋다!!

# 7. Nest.js Pipes

→ @Injectable() 데코레이터로 주석이 달린 클래스

- data transformation 과 data validation 위해서 사용됨

### Binding Pipes

파이프를 사용하는 방법(Binding pipes)은 세가지

- Handler-level Pipes
- Parameter-level Pipes
- Global-level Pipes

- DTO 에 데코레이터를 통해 validation 을 정의하고 Pipe 를 핸들러에 삽입

![Untitled](https://user-images.githubusercontent.com/74637926/212827651-f7bbc85f-e577-4e6b-abee-7f8ca908e0c8.png)

# 8. Custom Pipe

### PipeTransform 인터페이스 구현

![Untitled](https://user-images.githubusercontent.com/74637926/212827653-1a03197a-1bfd-4203-9e78-da68c562a327.png)

- value : 처리가 된 인자의 값
- metadata : 인자에 대한 메타데이터를 포함한 객체

# 9. DB - repository 생성

```tsx
import { DataSource } from 'typeorm';
import { Board } from '../entities/board.entity';

export const boardRepository = [
  {
    provide: 'BOARD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Board),
    inject: ['DATA_SOURCE'],
  },
];
```

→ repository 를 따로 만들고 Board 엔티티를 넣는다.

---

# 10. Auth 모듈 구현

```bash
nest g module auth
nest g controller auth
nest g service auth
로 모듈, 컨트롤러, 서비스 생성 후 주입
```

- auth.module.ts

```tsx
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userRepository } from 'src/repository/user.repository';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [...userRepository, AuthService],
})
export class AuthModule {}
```

# 11. JWT, Passport 이용해 인증관리

1. bcryptjs 라이브러리 사용 ( 회원가입,, 로그인 )

```tsx
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

export interface JwtPayload {
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //회원가입
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPWD = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPWD,
    });
    try {
      await this.userRepository.save(user);
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

    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      console.log('로그인 성공');

      return { accessToken: accessToken };
    } else {
      throw new UnauthorizedException('login 실패');
    }
  }
}
```

1. jwt 로 토큰 생성

## JWT 란 ?

JWT (JSON Web Token)는 당사자간에 정보를 JSON 개체로 안전하게 전송하기위한 컴팩트하고 독립적인 방식을 정의하는 개방형 표준 (RFC 7519).

이 정보는 디지털 서명이되어 있으므로 확인하고 신뢰 가능

간단하게 얘기하자면, 정보를 안전하게 전할 때 혹은 유저의 권한 같은 것을 체크를 하기 위해서 사용하는데 유용한 모듈

### JWT 구조

- Header
  - 토큰에 대한 메타데이터를 포함하고 있음,
    → 타입, 해싱알고리즘 등
- Payload
  - 유저정보, 만료기간, 주제 등의 주요 정보
- Verify Signature
  - 마지막 segment 는 토큰이 보낸 사람에 의해 서명되었고, 어떠한 식으로든 변경되지 않았는지 확인하는데 사용되는 서명
    → 헤더 및 페이로드 세그먼트, 서명 알고리즘, 키를 이용해 생성됨

### JWT 사용 흐름

유저 로그인 → 토큰 생성 → 토큰 보관

- 비교 과정
  → 서버에서 요청에서 같이 온 headers 랑 payload 를 가져오고
  → 서버안에 가지고 있는 Secret을 이용해서 Signature 부분을 다시 생성
  → 일치하면 통과
- 현재 auth.module.ts 에 imports 로 JwtModule 을 등록한다. 추가로 Passport 의 전략을 사용할 것이기 떄문에 PassportModule 도 같이 등록함.

```tsx
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userRepository } from 'src/repository/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'MySpecialSecret',
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [...userRepository, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

1. passport 와 함께 토큰 인증으로 유저정보 관리

```tsx
import { Inject, Injectable } from '@nestjs/common/decorators';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService, JwtPayload } from './auth.service';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: 'MySpecialSecret',
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
```

## UseGuard : 인증 미들웨어

- UseGuard() 에 파라미터로 들어오는, 지정된 경로로 통과할 수 있는 유저를 체크함
- import { AuthGuard } from '@nestjs/passport'; 를 통해 request 에 user객체를 넘겨준다.
  - 위 코드에서 strategy 에서 valtidate 를 통해 user를 넘겨주는 과정

# 12. **유저와 게시물의 관계 형성 해주기**

### 1. CustomDecorator 를 만들어서 User 정보만을 parameter로 넘김

UseGuard 를 통해 유저 토큰 인증 과정을 통해, 이때 컨트롤러 파라미터 @Req req 에 User 객체 정보가 담겨있다. 하지만, req.user 말고 user 만 파라미터로 뽑고 싶다면??

→ CustomDecorator 를 만들어서 request에서 유저 객체를 뽑아 인자로 넣어준다.

- @GetUser 데코레이터 (auth.decorator.ts)

```tsx
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

# 로그 남기기

- nest.js에 내장된 logger 모듈을 사용한다.
- controller 에서 사용할 땐 객체 인스턴스를 만들어 사용

  → const logger = new Logger(’ <어디서 로깅하는지 명시> ‘ )

# Configuration Files & Environment
