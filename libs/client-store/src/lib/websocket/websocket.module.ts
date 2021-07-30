import { ModuleWithProviders, NgModule } from '@angular/core';
import { IWebClientAppEnvironment } from '@app/client-util';
import { NgxsModule } from '@ngxs/store';

import { WS_CONFIG } from './websocket.interface';
import { AppWebsocketState } from './websocket.store';

@NgModule({
  imports: [NgxsModule.forFeature([AppWebsocketState])],
})
export class AppWebsocketModule {
  public static forRoot(env: IWebClientAppEnvironment): ModuleWithProviders<AppWebsocketModule> {
    return {
      ngModule: AppWebsocketModule,
      providers: [
        {
          provide: WS_CONFIG,
          useValue: {
            url: !env.production ? 'ws://localhost:8081/api/events' : 'wss://us-central1-upgraded-enigma.cloudfunctions.net/events',
          },
        },
      ],
    };
  }
}
