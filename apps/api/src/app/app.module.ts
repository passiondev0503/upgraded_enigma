import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BackendAuthModule } from '@upgraded-enigma/backend-auth';
import { BackendGqlModule } from '@upgraded-enigma/backend-gql';
import { BackendGrpcModule } from '@upgraded-enigma/backend-grpc';
import { API_ENV } from '@upgraded-enigma/backend-interfaces';
import { BackendLoggerMiddleware } from '@upgraded-enigma/backend-logger';
import { BackendWebsocketModule } from '@upgraded-enigma/backend-websocket';

import { environment } from '../environments/environment';

/**
 * Root API application module.
 */
@Module({
  imports: [
    BackendAuthModule,
    BackendWebsocketModule,
    BackendGqlModule.forRoot(environment),
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
