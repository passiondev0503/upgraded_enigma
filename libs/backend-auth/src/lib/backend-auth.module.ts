import { AppApiEnvironment } from '@app/backend-interfaces';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppAuthController } from './controller/auth.controller';
import { AppUserController } from './controller/user.controller';
import { AppAuthService } from './service/auth.service';
import { AppUserService } from './service/user.service';

export const authModuleProviders: Provider[] = [AppAuthService, AppUserService];

@Module({
  controllers: [AppAuthController, AppUserController],
})
export class AppAuthModule {
  public static forRoot(environment: AppApiEnvironment): DynamicModule {
    return {
      module: AppAuthModule,
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
