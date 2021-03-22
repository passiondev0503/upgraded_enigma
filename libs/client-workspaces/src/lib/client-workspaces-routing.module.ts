import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAuthenticatedGuard } from '@upgraded-enigma/client-store';

import { AppWorkspaceComponent } from './components/workspace/workspace.component';
import { AppWorkspacesListComponent } from './components/workspaces-list/workspaces-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AppAuthenticatedGuard],
    component: AppWorkspacesListComponent,
  },
  {
    path: 'item/:id',
    canActivate: [AppAuthenticatedGuard],
    component: AppWorkspaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppClientWorkspacesRoutingModule {}
