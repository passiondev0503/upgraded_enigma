import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@app/client-material';

import { AppWorkspaceComponent } from './components/workspace/workspace.component';
import { AppWorkspaceTimerComponent } from './components/workspace-timer/workspace-timer.component';
import { AppWorkspaceWidgetComponent } from './components/workspace-widget/workspace-widget.component';
import { AppWorkspacesListComponent } from './components/workspaces-list/workspaces-list.component';
import { AppWorkspacesRoutingModule } from './workspaces-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AppMaterialModule, AppWorkspacesRoutingModule],
  declarations: [AppWorkspacesListComponent, AppWorkspaceWidgetComponent, AppWorkspaceComponent, AppWorkspaceTimerComponent],
})
export class AppWorkspacesModule {}
