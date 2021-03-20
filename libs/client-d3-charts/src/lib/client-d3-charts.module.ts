import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppPieChartComponent } from './components/pie-chart/pie-chart.component';
import { AppRadarChartComponent } from './components/radar-chart/radar-chart.component';

/**
 * @note TODO: create d3 chart component wrappers and register in this module.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [AppPieChartComponent, AppRadarChartComponent],
  exports: [AppPieChartComponent, AppRadarChartComponent],
  entryComponents: [AppPieChartComponent, AppRadarChartComponent],
})
export class AppClientD3ChartsModule {}
