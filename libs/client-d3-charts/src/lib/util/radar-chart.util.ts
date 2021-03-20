import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

import {
  IDrawRadarChartOptions,
  IRadarChartDataNode,
  TRadarChartData,
} from '../interfaces/radar-chart-interface';

// eslint-disable-next-line max-lines-per-function -- TODO: tech debt
export const drawRadarChart = (
  container: ElementRef<HTMLDivElement>,
  data: TRadarChartData,
  options?: Partial<IDrawRadarChartOptions>,
) => {
  const id = container.nativeElement.id ?? 'radar-0';
  const transitionDuration = 200;
  const chartConfig: IDrawRadarChartOptions = {
    w: 600,
    h: 600,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    levels: 3, // how many levels or inner circles should there be drawn
    maxValue: 0, // what is the value that the biggest circle will represent
    labelFactor: 1.25, // how much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, // the number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, // the opacity of the area of the blob
    dotRadius: 4, // the size of the colored circles of each blog
    opacityCircles: 0.1, // the opacity of the circles of each blob
    strokeWidth: 2, // the width of the stroke around each blob
    roundStrokes: false, // if true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
  };

  /**
   * Copy options to configuration object.
   */
  if (typeof options !== 'undefined') {
    for (const i in options) {
      if (typeof options[i] !== 'undefined') {
        chartConfig[i] = options[i];
      }
    }
  }

  /**
   * Set max value.
   */
  const maxValue = Math.max(
    chartConfig.maxValue,
    d3.max(data, i => d3.max(i.map(o => o.value))) ?? 0,
  );

  /**
   * Get axis names.
   */
  const allAxis = data[0].map(function (i, j) {
    return i.axis;
  });
  const totalAxis = allAxis.length;
  /**
   * Radius of the outermost circle.
   */
  const radius = Math.min(chartConfig.w / 2, chartConfig.h / 2);
  /**
   * Slice width in radians.
   */
  const angleSlice = (Math.PI * 2) / totalAxis;

  /**
   * Radius scale.
   */
  const rScale = d3.scaleLinear([0, radius]).domain([0, maxValue]);

  /**
   * Create the container SVG and g,
   */
  // clear chart container
  d3.select(`#${id}`).select('svg').remove();
  // initialize the radar chart SVG
  const svg = d3
    .select(`#${id}`)
    .append('svg')
    .attr('width', chartConfig.w + chartConfig.margin.left + chartConfig.margin.right)
    .attr('height', chartConfig.h + chartConfig.margin.top + chartConfig.margin.bottom)
    .attr('class', id);
  // append a g element
  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${chartConfig.w / 2 + chartConfig.margin.left},${
        chartConfig.h / 2 + chartConfig.margin.top
      })`,
    );

  /**
   * Glow filter for some extra pizzazz.
   */
  // filter for the outside glow
  const filter = g.append('defs').append('filter').attr('id', 'glow');
  filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  /**
   * @note TODO: wrap as a separate function.
   * Draw the Circular grid.
   */
  // grid & axis wrapper
  const axisGrid = g.append('g').attr('class', 'axisWrapper');
  // background circles
  axisGrid
    .selectAll('.levels')
    .data(d3.range(1, chartConfig.levels + 1).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', function (d, i) {
      return (radius / chartConfig.levels) * d;
    })
    .style('fill', '#CDCDCD')
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', chartConfig.opacityCircles)
    .style('filter', 'url(#glow)');
  // text indicating at what % each level is
  const axisGridX = 4;
  axisGrid
    .selectAll('.axisLabel')
    .data(d3.range(1, chartConfig.levels + 1).reverse())
    .enter()
    .append('text')
    .attr('class', 'axisLabel')
    .attr('x', axisGridX)
    .attr('y', function (d) {
      return (-d * radius) / chartConfig.levels;
    })
    .attr('dy', '0.4em')
    .style('font-size', '10px')
    .attr('fill', '#737373')
    .text(function (d, i) {
      return (maxValue * d) / chartConfig.levels;
    });

  /**
   * @note TODO: wrap as a separate function.
   * Draw the axis.
   */
  // create the straight lines radiating outward from the center
  const axis = axisGrid.selectAll('.axis').data(allAxis).enter().append('g').attr('class', 'axis');
  // append the lines
  axis
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function (d, i) {
      const multiplier = 1.1;
      return rScale(maxValue * multiplier) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y2', function (d, i) {
      const multiplier = 1.1;
      return rScale(maxValue * multiplier) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr('class', 'line')
    .style('stroke', 'white')
    .style('stroke-width', '2px');
  // append the labels at each axis
  axis
    .append('text')
    .attr('class', 'legend')
    .style('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', function (d, i) {
      return rScale(maxValue * chartConfig.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y', function (d, i) {
      return rScale(maxValue * chartConfig.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .text(function (d) {
      return d;
    })
    .call(wrapSvgText, chartConfig.wrapWidth);

  /**
   * @note TODO: wrap as a separate function.
   * Draw the radar chart blobs.
   */
  // the radial line function
  const radarLine = d3
    .lineRadial<IRadarChartDataNode>()
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });
  // create a wrapper for the blobs
  const blobWrapper = g
    .selectAll('.radarWrapper')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'radarWrapper');
  // append the backgrounds
  blobWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', function (d, i) {
      return radarLine(d);
    })
    .style('fill', function (d, i) {
      return chartConfig.color(i.toString());
    })
    .style('fill-opacity', chartConfig.opacityArea)
    .on('mouseover', function (d, i) {
      // dim all blobs
      const radarAreaFillOpacity = 0.1;
      d3.selectAll('.radarArea')
        .transition()
        .duration(transitionDuration)
        .style('fill-opacity', radarAreaFillOpacity);
      // bring back the hovered over blob
      const fillOpacity = 0.7;
      d3.select(this).transition().duration(transitionDuration).style('fill-opacity', fillOpacity);
    })
    .on('mouseout', function () {
      // bring back all blobs
      d3.selectAll('.radarArea')
        .transition()
        .duration(transitionDuration)
        .style('fill-opacity', chartConfig.opacityArea);
    });
  // create the outlines
  blobWrapper
    .append('path')
    .attr('class', 'radarStroke')
    .attr('d', function (d, i) {
      return radarLine(d);
    })
    .style('stroke-width', `${chartConfig.strokeWidth}px`)
    .style('stroke', function (d, i) {
      return chartConfig.color(i.toString());
    })
    .style('fill', 'none')
    .style('filter', 'url(#glow)');
  // append the circles
  const blobWrapperFillOpacity = 0.8;
  blobWrapper
    .selectAll('.radarCircle')
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append('circle')
    .attr('class', 'radarCircle')
    .attr('r', chartConfig.dotRadius)
    .attr('cx', function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('cy', function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style('fill', function (d, i, j) {
      return chartConfig.color(j.toString());
    })
    .style('fill-opacity', blobWrapperFillOpacity);

  /**
   * @note TODO: wrap as a separate function.
   * Append invisible circles for tooltip.
   */
  // wrapper for the invisible circles on top
  const blobCircleWrapper = g
    .selectAll('.radarCircleWrapper')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'radarCircleWrapper');
  // set up the small tooltip for when you hover over a circle
  const tooltip = g.append('text').attr('class', 'tooltip').style('opacity', 0);
  // append a set of invisible circles on top for the mouseover pop-up
  const blobCircleWrapperRadiusMultiplier = 1.5;
  blobCircleWrapper
    .selectAll<SVGElement, IRadarChartDataNode>('.radarInvisibleCircle')
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append('circle')
    .attr('class', 'radarInvisibleCircle')
    .attr('r', chartConfig.dotRadius * blobCircleWrapperRadiusMultiplier)
    .attr('cx', function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('cy', function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function (event: MouseEvent, i) {
      const modifier = 10;
      const newX = parseFloat(d3.select(this).attr('cx')) - modifier;
      const newY = parseFloat(d3.select(this).attr('cy')) - modifier;

      const nodeData = ((event.target as unknown) as Record<string, IRadarChartDataNode>).__data__;
      const tooltipText = `${nodeData.value} events`;
      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(tooltipText)
        .transition()
        .duration(transitionDuration)
        .style('opacity', 1);
    })
    .on('mouseout', function () {
      tooltip.transition().duration(transitionDuration).style('opacity', 0);
    });
};

function wrapSvgText(
  svgText: d3.Selection<SVGTextElement, string, SVGGElement, unknown>,
  width: number,
) {
  svgText.each(function (this: SVGTextElement) {
    const text = d3.select<SVGElement, string>(this);
    const words = text.text().split(/\s+/).reverse();
    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.4;
    const y = text.attr('y');
    const x = text.attr('x');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', `${dy}em`);

    let word = words.pop();

    while (typeof word !== 'undefined') {
      line.push(word ?? '');
      tspan.text(line.join(' '));
      if ((tspan.node()?.getComputedTextLength() ?? 0) > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word ?? ''];
        lineNumber += 1;
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${lineNumber * lineHeight + dy}em`)
          .text(word ?? '');
      }
      word = words.pop();
    }
  });
}
