import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppClientMaterialModule } from '@app/client-material';

import { AppClientWorkspacesRoutingModule } from './client-workspaces-routing.module';
import { AppWorkspaceComponent } from './components/workspace/workspace.component';
import { AppWorkspaceTimerComponent } from './components/workspace-timer/workspace-timer.component';
import { AppWorkspaceWidgetComponent } from './components/workspace-widget/workspace-widget.component';
import { AppWorkspacesListComponent } from './components/workspaces-list/workspaces-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, AppClientMaterialModule, AppClientWorkspacesRoutingModule],
  declarations: [AppWorkspacesListComponent, AppWorkspaceWidgetComponent, AppWorkspaceComponent, AppWorkspaceTimerComponent],
})
export class AppClientWorkspacesModule {}
