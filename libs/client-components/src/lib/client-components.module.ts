import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppClientPipesModule } from '@upgraded-enigma/client-pipes';

import { AppContentComponent } from './content/content.component';
import { AppNavbarComponent } from './navbar/navbar.component';
import { AppToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [FlexLayoutModule, CommonModule, AppClientMaterialModule, AppClientPipesModule, RouterModule],
  declarations: [AppContentComponent, AppNavbarComponent, AppToolbarComponent],
  exports: [AppContentComponent, AppNavbarComponent, AppToolbarComponent],
})
export class AppClientComponentsModule {}
