import React from 'react';
import { PanelProps, getColorForTheme } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { HeatSeriesOptions } from 'types';
import moment from 'moment';
// Import some custom helper functions
import { extractRgbFromColor, generateDummyData, calculateCellColor, getDateXDaysAgo } from 'functions';

// @ts-ignore Package is not registered with npm so it will cause typing errors on build
import HeatMap from 'react-heatmap-grid';

interface Props extends PanelProps<HeatSeriesOptions> {}

export const HeatSeries: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = getTheme();

  const { numUsers, daysAgo, color, cellFontSize, showCellValue, fontColor, invertColorScale } = options;
  const { xLabels, yLabels, chartData } = generateDummyData(getDateXDaysAgo(daysAgo), moment(), numUsers, false);

  // Convert color string to array for use in heatmap
  const baseColor = extractRgbFromColor(getColorForTheme(color, theme));

  /* 
    Attempted to use Grafana's getTextColorForBackground, but:
    it does not handle opacity of cells well when working with rgba strings
    Hence the fontColor can be passed as a conditional plugin option 
  */
  const textColor = getColorForTheme(fontColor, theme);

  return (
    <div style={{ overflow: 'auto', width, height }}>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation={'bottom'}
        xLabelWidth={60}
        data={chartData}
        height={(height - 50) / numUsers} // Vertical Padding of 50
        cellStyle={(background: any, value: number, min: number, max: number, data: any, x: any, y: any) => ({
          // Using a custom function to calculate background color per cell
          background: calculateCellColor(baseColor, min, max, value, invertColorScale),
          fontSize: `${cellFontSize}px`,
          color: textColor,
        })}
        cellRender={(value: number) => {
          return (
            <div>
              {/* Checking if value >= 0 rather than if value exists to include 0 values*/
              value >= 0 && showCellValue ? `${value}` : null}
            </div>
          );
        }}
      />
    </div>
  );
};

/*
  resulting heatmap: https://i.imgur.com/8qZReF1.png
*/
