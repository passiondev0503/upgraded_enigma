import { DynamicModule, Module } from '@nestjs/common';
import { BackendDiagnosticsService } from '@upgraded-enigma/backend-diagnostics';

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
