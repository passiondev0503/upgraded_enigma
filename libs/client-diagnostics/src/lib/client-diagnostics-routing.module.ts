import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppAnonimousGuard } from '@app/client-store-user';

import { AppDiagnosticsHomeComponent } from './components/home/diagnostics-home.component';
import { AppDiagnosticsIndexComponent } from './components/index/diagnostics-index.component';
import { AppDiagnosticsInfoComponent } from './components/info/diagnostics-info.component';

/**
 * The diagnostics module routes.
 */
const diagRoutes: Route[] = [
  {
    path: '',
    component: AppDiagnosticsIndexComponent,
    children: [
      {
        path: '',
        canActivate: [AppAnonimousGuard],
        component: AppDiagnosticsHomeComponent,
      },
      {
        path: 'info',
        component: AppDiagnosticsInfoComponent,
      },
    ],
  },
];

/**
 * The diagnostics module routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(diagRoutes)],
  exports: [RouterModule],
})
export class AppClientDiagnosticsRoutingModule {}
