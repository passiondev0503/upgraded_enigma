import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppSidebarRootComponent } from './components/sidebar-root/sidebar-root.component';
import { AppSidebarRoutingModule } from './sidebar-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatGridListModule, MatProgressBarModule, AppSidebarRoutingModule],
  declarations: [AppSidebarRootComponent],
})
export class AppSidebarModule {}
