import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@app/client-material';
import { appTranslateModuleProviders } from '@app/client-translate';
import { TranslateModule } from '@ngx-translate/core';
import { AppD3ChartsModule } from '@rfprodz/client-d3-charts';

import { AppUserAuthComponent } from './components/auth/auth.component';
import { AppUserDataComponent } from './components/data/data.component';
import { AppUserProfileComponent } from './components/profile/profile.component';
import { AppUserRtcChatComponent } from './components/rtc-chat/rtc-chat.component';
import { AppUserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, AppMaterialModule, AppD3ChartsModule, AppUserRoutingModule],
  declarations: [AppUserAuthComponent, AppUserDataComponent, AppUserProfileComponent, AppUserRtcChatComponent],
  providers: [...appTranslateModuleProviders],
})
export class AppUserModule {}
