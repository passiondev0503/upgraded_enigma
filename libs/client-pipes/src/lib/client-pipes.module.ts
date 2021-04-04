import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppButtonsVisibilityPipe } from './buttons-visibility/buttons-visibility.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [AppButtonsVisibilityPipe],
  exports: [AppButtonsVisibilityPipe],
})
export class AppClientPipesModule {}
