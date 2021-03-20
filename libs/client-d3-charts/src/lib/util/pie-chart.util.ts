import { ElementRef } from '@angular/core';
import { getRandomColor } from '@mono/client-util';
import { arc, pie, PieArcDatum } from 'd3-shape';

import { IPieChartDataNode, PIE_CHART_ARC_CONFIG } from '../interfaces/pie-chart.interface';

export const drawPieChart = (
  canvas: ElementRef<HTMLCanvasElement>,
  chartData: IPieChartDataNode[],
) => {
  const context = canvas.nativeElement.getContext('2d');
  if (context !== null && typeof context !== 'undefined' && typeof canvas !== 'undefined') {
    const width = canvas.nativeElement.width;
    const height = canvas.nativeElement.height;
    const divisor = 2;
    const radius = Math.min(width, height) / divisor;

    context.clearRect(0, 0, width, height);

    const createArc = arc<PieArcDatum<IPieChartDataNode>>()
      .outerRadius(radius - PIE_CHART_ARC_CONFIG.ARC_INNER_RADIUS)
      .innerRadius(PIE_CHART_ARC_CONFIG.ARC_OUTER_RADIUS)
      .context(context);

    const createLabel = arc<PieArcDatum<IPieChartDataNode>>()
      .outerRadius(radius - PIE_CHART_ARC_CONFIG.LABEL_INNER_RADIUS)
      .innerRadius(radius - PIE_CHART_ARC_CONFIG.LABEL_OUTER_RADIUS)
      .context(context);

    const createPieChart = pie<IPieChartDataNode>().value(datum => datum.y);

    const scale = 1.25;
    context.translate(
      (width / divisor - radius) / scale,
      (height / divisor - radius / divisor) / scale,
    );

    context.transform(scale, 0, 0, scale, 0, 0);

    const arcs = createPieChart(chartData);

    arcs.forEach(datum => {
      context.fillStyle = getRandomColor();
      context.beginPath();
      createArc(datum);
      context.closePath();
      context.fill();
    });

    arcs.forEach(datum => {
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#000';
      const c = createLabel.centroid(datum);
      context.fillText(datum.data.key, c[0], c[1]);
    });
  }
};
