import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';

import { IPieChartDataNode } from '../../interfaces/pie-chart.interface';
import { drawPieChart } from '../../util/pie-chart.util';

interface IInputChanges {
  data?: SimpleChange | null;
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPieChartComponent implements AfterViewInit, OnChanges {
  @Input() public data: IPieChartDataNode[] = [];

  /**
   * D3 chart view child reference.
   */
  @ViewChild('canvas') private readonly canvas?: ElementRef<HTMLCanvasElement>;

  private drawChart() {
    if (typeof this.canvas !== 'undefined') {
      drawPieChart(this.canvas, this.data);
    }
  }

  /**
   * Draws chart.
   */
  public ngAfterViewInit(): void {
    this.drawChart();
  }

  /**
   * Redraws chart on changes.
   */
  public ngOnChanges(changes: IInputChanges): void {
    if (Boolean(changes.data?.currentValue)) {
      this.drawChart();
    }
  }
}
