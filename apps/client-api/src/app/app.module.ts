import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BackendAuthModule } from '@upgraded-enigma/backend-auth';
import { BackendDiagnosticsModule } from '@upgraded-enigma/backend-diagnostics';
import { API_ENV } from '@upgraded-enigma/backend-interfaces';
import { BackendLoggerMiddleware } from '@upgraded-enigma/backend-logger';
import { BackendWebsocketModule } from '@upgraded-enigma/backend-websocket';

import { environment } from '../environments/environment';

/**
 * Client API application module.
 * This api is shipped as part of the Electron app.
 * This api is not deployed to firebase, it integrates with firebase deployed api over http.
 * It should not contain any system level security keys.
 */
@Module({
  imports: [
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
