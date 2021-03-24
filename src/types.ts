export interface HeatSeriesOptions {
  /* Configurable Heat Series options for grafana front-end */

  title: string;
  unit: string;
  numUsers: number;
  daysAgo: number;
  color: string;
  showCellValue: boolean;
  invertColorScale: boolean;
  cellFontSize: number;
  fontColor: string;
}


/* Interfaces below are required for HeatSeries_old (which was a failed attempt) */

export interface CustomHeatSeriesOptions {
  /* Configurable Custom Heat Series options for grafana front-end */

  numUsers: number;
  daysAgo: number;
  color: string;
}

interface MarginObject {
  /* Classic html/css style margin object. */

  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface DimensionsObject {
  /* Required props for Chart Dimensions and margins */

  width: number;
  height: number;
  margins: MarginObject;
}

export interface DataEntry {
  /* Data for one entry */

  date: string;
  userId: string;
  value: number;
}

interface DataObject {
  /* Data and Labels for Custom HeatMap */

  data: Array<number[] | DataEntry>;
  xLabels: string[]; // Should actually be a date object, but dummyDataGenerator returns trimmed strings for now.
  yLabels: string[]; // Labels have already been converted from number to string by the generator.
}

export interface CustomHeatMapProps {
  /* Required props for Custom Heat Map */

  dimensions: DimensionsObject;
  chartData: DataObject;
  baseColor: string;
  subtitle?: string; // Will act as a subtitle due to grafana's native panel title option
}
