import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppClientMaterialModule } from '@app/client-material';
import { appSharedUiTranslateModuleProviders } from '@app/client-translate';
import { TranslateModule } from '@ngx-translate/core';

import { AppClientUserRoutingModule } from './client-user-routing.module';
import { AppUserAuthComponent } from './components/auth/auth.component';
import { AppUserDataComponent } from './components/data/data.component';
import { AppUserProfileComponent } from './components/profile/profile.component';
import { AppUserRtcChatComponent } from './components/rtc-chat/rtc-chat.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AppClientMaterialModule,
    AppClientUserRoutingModule,
  ],
  declarations: [AppUserAuthComponent, AppUserDataComponent, AppUserProfileComponent, AppUserRtcChatComponent],
  providers: [...appSharedUiTranslateModuleProviders],
})
export class AppClientUserModule {}
