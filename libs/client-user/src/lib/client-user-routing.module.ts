import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAnonimousGuard, AppAuthenticatedGuard } from '@app/client-store';

import { AppUserAuthComponent } from './components/auth/auth.component';
import { AppUserDataComponent } from './components/data/data.component';
import { AppUserProfileComponent } from './components/profile/profile.component';
import { AppUserRtcChatComponent } from './components/rtc-chat/rtc-chat.component';

const routes: Route[] = [
  {
    path: '',
    canActivate: [AppAuthenticatedGuard],
    component: AppUserProfileComponent,
  },
  {
    path: 'auth',
    canActivate: [AppAnonimousGuard],
    component: AppUserAuthComponent,
  },
  {
    path: 'data',
    canActivate: [AppAuthenticatedGuard],
    component: AppUserDataComponent,
  },
  {
    path: 'rtc-chat',
    canActivate: [AppAuthenticatedGuard],
    component: AppUserRtcChatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppClientUserRoutingModule {}
