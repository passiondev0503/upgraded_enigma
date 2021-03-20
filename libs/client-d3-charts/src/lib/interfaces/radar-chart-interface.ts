import * as d3 from 'd3';

export interface IRadarChartDataNode {
  axis: string;
  value: number;
}

export type TRadarChartData = IRadarChartDataNode[][];

export interface IDrawRadarChartOptions {
  w: number;
  h: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  maxValue: number;
  levels: number;
  labelFactor: number;
  wrapWidth: number;
  opacityArea: number;
  dotRadius: number;
  opacityCircles: number;
  strokeWidth: number;
  roundStrokes: boolean;
  color: d3.ScaleOrdinal<string, string>;
}
