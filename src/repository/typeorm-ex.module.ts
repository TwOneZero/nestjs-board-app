import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from './typeorm-ex.decorator';

export class TypeOrmExModule {
  //extends 로, new ~~ 로 인스턴스화된 클래스 유형을 제한함
  //(repositories: T[]) -> 생성자로, 배열로 받겠다는 의미임
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    //setMetadata로 저장된 repo를 가저욤
    for (const repository of repositories) {
      const entity = Reflect.getMetadata(
        TYPEORM_EX_CUSTOM_REPOSITORY,
        repository,
      );

      if (!entity) {
        continue;
      }

      //providers 배열에 entity 를 주입
      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
