import { PanelPlugin } from '@grafana/data';
import { CustomHeatSeriesOptions } from './types';

import { HeatSeries } from './CustomHeatMap(old)/HeatSeries_Custom';

export const plugin = new PanelPlugin<CustomHeatSeriesOptions>(HeatSeries).setPanelOptions(builder => {
  return (
    builder
      .addNumberInput({
        path: 'daysAgo',
        name: 'Number of Days',
        description: 'How many days to include (excluding today)',
        defaultValue: 10,
      })
      .addNumberInput({
        path: 'numUsers',
        name: 'Number of Users',
        description: 'Used to specify the number of users to display on the y-axis',
        defaultValue: 20,
      })
      .addColorPicker({
        path: 'color',
        name: 'Base Color',
        description: 'Used the determine the base color of the heatmap',
        defaultValue: 'dark-red',
      })
  );
});
