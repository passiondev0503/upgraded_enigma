import { AppApiEnvironment } from '@app/backend-interfaces';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppAuthController } from './controllers/auth/auth.controller';
import { AppUserController } from './controllers/user/user.controller';
import { AppAuthService, AUTH_SERVICE_TOKEN } from './services/auth/auth.service';
import { AppUserService, USER_SERVICE_TOKEN } from './services/user/user.service';

export const authModuleProviders: Provider[] = [
  AppAuthService,
  {
    provide: AUTH_SERVICE_TOKEN,
    useExisting: AppAuthService,
  },
  AppUserService,
  {
    provide: USER_SERVICE_TOKEN,
    useExisting: AppUserService,
  },
];

@Module({
  controllers: [AppAuthController, AppUserController],
})
export class AppAuthModule {
  public static forRoot(environment: AppApiEnvironment): DynamicModule {
    return {
      module: AppAuthModule,
      imports: [
        JwtModule.register({
          secret: environment.jwtSecret,
        }),
      ],
      providers: [...authModuleProviders],
      exports: [JwtModule],
    };
  }
}
