import { NgModule } from '@angular/core';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AppChatbotModule } from './chatbot/chatbot.module';
import { AppDiagnosticsModule } from './diagnostics/diagnostics.module';
import { AppHttpApiModule } from './http-api/http-api.module';
import { AppHttpProgressModule } from './http-progress/http-progress.module';
import { AppSidebarModule } from './sidebar/sidebar.module';
import { AppThemeModule } from './theme/theme.module';
import { USER_STATE_TOKEN } from './user/user.interface';
import { AppUserModule } from './user/user.module';
import { AppWebsocketModule } from './websocket/websocket.module';

@NgModule({
  imports: [
    AppHttpApiModule,
    AppHttpProgressModule.forRoot(),
    AppUserModule,
    AppSidebarModule,
    AppWebsocketModule,
    AppChatbotModule,
    AppThemeModule,
    AppDiagnosticsModule,
    NgxsStoragePluginModule.forRoot({
      key: USER_STATE_TOKEN,
    }),
  ],
  exports: [
    AppHttpApiModule,
    AppHttpProgressModule,
    AppUserModule,
    AppSidebarModule,
    AppWebsocketModule,
    AppChatbotModule,
    AppThemeModule,
    AppDiagnosticsModule,
  ],
})
export class AppClientStoreModule {}
