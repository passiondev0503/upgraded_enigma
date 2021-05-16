import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';

import { AppClientWorkspacesRoutingModule } from './client-workspaces-routing.module';
import { AppWorkspaceComponent } from './components/workspace/workspace.component';
import { AppWorkspaceWidgetComponent } from './components/workspace-widget/workspace-widget.component';
import { AppWorkspacesListComponent } from './components/workspaces-list/workspaces-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AppClientMaterialModule, AppClientWorkspacesRoutingModule],
  declarations: [AppWorkspacesListComponent, AppWorkspaceWidgetComponent, AppWorkspaceComponent],
})
export class AppClientWorkspacesModule {}
