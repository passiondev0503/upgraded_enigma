import { AppDiagnosticsService } from '@app/backend-diagnostics';
import { DynamicModule, Module } from '@nestjs/common';

import { AppEventsGateway } from './gateway/events.gateway';

@Module({})
export class AppWebsocketModule {
  public static forRoot(): DynamicModule {
    return {
      module: AppWebsocketModule,
      providers: [AppEventsGateway, AppDiagnosticsService],
    };
  }
}
