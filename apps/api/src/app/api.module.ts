import { AppDiagnosticsModule } from '@app/backend-diagnostics';
import { API_ENV } from '@app/backend-interfaces';
import { AppLoggerModule } from '@app/backend-logger';
import { AppWebsocketModule } from '@app/backend-websocket';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

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
    AppDiagnosticsModule.forRoot(),
    AppWebsocketModule.forRoot(),
    AppLoggerModule,
  ],
  providers: [
    {
      provide: API_ENV,
      useValue: environment,
    },
  ],
})
export class AppApiModule {}
