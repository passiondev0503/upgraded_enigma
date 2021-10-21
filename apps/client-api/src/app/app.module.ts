import { BackendAuthModule } from '@app/backend-auth';
import { BackendDiagnosticsModule } from '@app/backend-diagnostics';
import { API_ENV } from '@app/backend-interfaces';
import { BackendLoggerMiddleware } from '@app/backend-logger';
import { BackendWebsocketModule } from '@app/backend-websocket';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { environment } from '../environments/environment';

/**
 * Client API application module.
 * This api is shipped as part of the Electron app.
 * This api is not deployed to firebase, it integrates with firebase deployed api over http.
 * It should not contain any system level security keys.
 */
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    BackendAuthModule.forRoot(environment),
    BackendDiagnosticsModule.forRoot(),
    BackendWebsocketModule.forRoot(),
  ],
  providers: [
    {
      provide: API_ENV,
      useValue: environment,
    },
  ],
})
export class ClientApiAppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(BackendLoggerMiddleware).forRoutes('*');
  }
}
