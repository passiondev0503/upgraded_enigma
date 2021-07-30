import { NgModule } from '@angular/core';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AppChatbotStoreModule } from './chatbot/chatbot.module';
import { AppDiagnosticsModule } from './diagnostics/diagnostics.module';
import { AppHttpApiModule } from './http-api/http-api.module';
import { AppHttpProgressStoreModule } from './http-progress/http-progress.module';
import { AppSidebarStoreModule } from './sidebar/sidebar.module';
import { AppThemeStoreModule } from './theme/theme.module';
import { USER_STATE_TOKEN } from './user/user.interface';
import { AppUserStoreModule } from './user/user.module';
import { AppWebsocketModule } from './websocket/websocket.module';

@NgModule({
  imports: [
    AppHttpApiModule,
    AppHttpProgressStoreModule.forRoot(),
    AppUserStoreModule,
    AppSidebarStoreModule,
    AppWebsocketModule,
    AppChatbotStoreModule,
    AppThemeStoreModule,
    AppDiagnosticsModule,
    NgxsStoragePluginModule.forRoot({
      key: USER_STATE_TOKEN,
    }),
  ],
  exports: [
    AppHttpApiModule,
    AppHttpProgressStoreModule,
    AppUserStoreModule,
    AppSidebarStoreModule,
    AppWebsocketModule,
    AppChatbotStoreModule,
    AppThemeStoreModule,
    AppDiagnosticsModule,
  ],
})
export class AppClientStoreModule {}
