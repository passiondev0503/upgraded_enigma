import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAnonimousGuard, AppAuthenticatedGuard } from '@app/client-store-user';

import { AppUserAuthComponent } from './components/auth/auth.component';
import { AppUserDataComponent } from './components/data/data.component';
import { AppUserProfileComponent } from './components/profile/profile.component';
import { AppUserRtcChatComponent } from './components/rtc-chat/rtc-chat.component';

/**
 * The user module routes.
 */
const userRoutes: Route[] = [
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

/**
 * The user module routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class AppClientUserRoutingModule {}
