import { BackendDiagnosticsService } from '@app/backend-diagnostics';
import { DynamicModule, Module } from '@nestjs/common';

import { BackendEventsGateway } from './gateway/events.gateway';

@Module({})
export class BackendWebsocketModule {
  public static forRoot(): DynamicModule {
    return {
      module: BackendWebsocketModule,
      providers: [BackendEventsGateway, BackendDiagnosticsService],
    };
  }
}
