import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';

import { IDrawRadarChartOptions, IRadarChartDataNode } from '../../interfaces/radar-chart-interface';
import { drawRadarChart } from '../../util/radar-chart.util';

interface IInputChanges {
  data?: SimpleChange | null;
}

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRadarChartComponent implements AfterViewInit, OnChanges {
  @Input() public chartId = '0';

  @Input() public data: IRadarChartDataNode[][] = [[]];

  /**
   * D3 chart view child reference.
   */
  @ViewChild('container') private readonly container?: ElementRef<HTMLDivElement>;

  private chartOptions() {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const minWidth = 300;
    const modifiers = {
      width: 10,
      height: 20,
    };
    const width = Math.min(minWidth, window.innerWidth - modifiers.width) - margin.left - margin.right;
    const height = Math.min(width, window.innerHeight - margin.top - margin.bottom - modifiers.height);
    const options: Partial<IDrawRadarChartOptions> = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 15,
      levels: 5,
      roundStrokes: true,
    };
    return options;
  }

  private drawChart() {
    if (typeof this.container !== 'undefined') {
      const options = this.chartOptions();
      drawRadarChart(this.container, this.data, options);
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
    const currentValue: IRadarChartDataNode[][] = changes.data?.currentValue;
    if (typeof currentValue !== 'undefined' && currentValue !== null) {
      this.drawChart();
    }
  }
}
