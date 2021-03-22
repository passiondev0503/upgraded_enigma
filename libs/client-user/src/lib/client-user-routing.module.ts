import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAnonimousGuard, AppAuthenticatedGuard } from '@upgraded-enigma/client-store';

import { AppUserAuthComponent } from './components/auth/auth.component';
import { AppUserDataComponent } from './components/data/data.component';
import { AppUserProfileComponent } from './components/profile/profile.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppClientUserRoutingModule {}
