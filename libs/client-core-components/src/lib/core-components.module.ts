import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '@app/client-material';
import { AppPipesModule } from '@app/client-pipes';
import { AppTranslateModule } from '@app/client-translate';

import { AppContentComponent } from './components/content/content.component';
import { AppNavbarComponent } from './components/navbar/navbar.component';
import { AppThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { AppToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  imports: [FlexLayoutModule, CommonModule, AppMaterialModule, AppTranslateModule, AppPipesModule, RouterModule],
  declarations: [AppContentComponent, AppNavbarComponent, AppToolbarComponent, AppThemeToggleComponent],
  exports: [AppContentComponent, AppNavbarComponent, AppToolbarComponent, AppThemeToggleComponent],
})
export class AppCoreComponentsModule {}
