import React from 'react';
import { PanelProps, getColorForTheme } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { CustomHeatSeriesOptions } from 'types';
import moment from 'moment';
// Import some custom helper functions
import { generateDummyData, getDateXDaysAgo } from 'functions';
// Import HeatMap Component built with d3.js
import { CustomHeatMap } from 'CustomHeatMap(old)/CustomHeatMap';

interface Props extends PanelProps<CustomHeatSeriesOptions> {}

export const HeatSeries: React.FC<Props> = ({ options, width, height }) => {
  const theme = getTheme();

  const { numUsers, daysAgo, color } = options;
  const { xLabels, yLabels, data } = generateDummyData(getDateXDaysAgo(daysAgo), moment(), numUsers, true);

  // Convert get base color string from options using grafana native
  const baseColor = getColorForTheme(color, theme);

  return (
    <div style={{ width, height }}>
      <CustomHeatMap 
        dimensions={{width, height, margins:{top: 30, right: 30, bottom: 30, left: 30}}}
        chartData={{data, xLabels, yLabels}}
        baseColor={baseColor}
      />
    </div>
  );
};

