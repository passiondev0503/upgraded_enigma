import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppHomeComponent } from './components/home/home.component';
import { AppIndexComponent } from './components/index/index.component';
import { AppInfoComponent } from './components/info/info.component';

const routes: Route[] = [
  {
    path: '',
    component: AppIndexComponent,
    children: [
      {
        path: '',
        component: AppHomeComponent,
      },
      {
        path: 'info',
        component: AppInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppClientDiagnosticsRoutingModule {}
