import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppWorkspaceComponent } from './components/workspace/workspace.component';
import { AppWorkspacesListComponent } from './components/workspaces-list/workspaces-list.component';

/**
 * The workspaces module routes.
 */
const workspacesRoutes: Routes = [
  {
    path: '',
    component: AppWorkspacesListComponent,
  },
  {
    path: 'item/:id',
    component: AppWorkspaceComponent,
  },
];

/**
 * The workspaces module routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(workspacesRoutes)],
  exports: [RouterModule],
})
export class AppClientWorkspacesRoutingModule {}
