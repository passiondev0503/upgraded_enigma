import { ApiEnvironment } from '@app/backend-interfaces';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BackendAuthController } from './controller/auth.controller';
import { BackendUserController } from './controller/user.controller';
import { BackendAuthService } from './service/auth.service';
import { BackendUserService } from './service/user.service';

export const authModuleProviders: Provider[] = [BackendAuthService, BackendUserService];

@Module({
  controllers: [BackendAuthController, BackendUserController],
})
export class BackendAuthModule {
  public static forRoot(environment: ApiEnvironment): DynamicModule {
    return {
      module: BackendAuthModule,
      providers: [...authModuleProviders],
      imports: [
        JwtModule.register({
          secret: environment.jwtSecret,
        }),
      ],
      exports: [JwtModule],
    };
  }
}
