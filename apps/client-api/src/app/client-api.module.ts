import { AppAuthModule } from '@app/backend-auth';
import { AppDiagnosticsModule } from '@app/backend-diagnostics';
import { API_ENV } from '@app/backend-interfaces';
import { AppLoggerMiddleware } from '@app/backend-logger';
import { AppWebsocketModule } from '@app/backend-websocket';
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
    AppAuthModule.forRoot(environment),
    AppDiagnosticsModule.forRoot(),
    AppWebsocketModule.forRoot(),
  ],
  providers: [
    {
      provide: API_ENV,
      useValue: environment,
    },
  ],
})
export class AppClientApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
