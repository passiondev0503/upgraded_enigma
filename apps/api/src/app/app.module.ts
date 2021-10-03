import { BackendDiagnosticsModule } from '@app/backend-diagnostics';
import { BackendGrpcModule } from '@app/backend-grpc';
import { API_ENV } from '@app/backend-interfaces';
import { BackendLoggerMiddleware } from '@app/backend-logger';
import { BackendWebsocketModule } from '@app/backend-websocket';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { environment } from '../environments/environment';

/**
 * Root API application module.
 */
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    BackendDiagnosticsModule.forRoot(),
    BackendWebsocketModule.forRoot(),
    BackendGrpcModule.forRoot(environment),
  ],
  providers: [
    {
      provide: API_ENV,
      useValue: environment,
    },
  ],
})
export class ApiAppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(BackendLoggerMiddleware).forRoutes('*');
  }
}
