import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppSidebarRootComponent } from './components/sidebar-root/sidebar-root.component';

/**
 * The sidebar module routes.
 */
const sidebarRoutes: Route[] = [
  {
    path: 'root',
    component: AppSidebarRootComponent,
  },
];

/**
 * The sidebar module routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(sidebarRoutes)],
  exports: [RouterModule],
})
export class AppClientSidebarRoutingModule {}
