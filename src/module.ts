import { PanelPlugin } from '@grafana/data';
import { HeatSeriesOptions } from './types';
import { HeatSeries } from './HeatSeries';

export const plugin = new PanelPlugin<HeatSeriesOptions>(HeatSeries).setPanelOptions(builder => {
  return builder
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
      defaultValue: 15,
    })
    .addBooleanSwitch({
      path: 'invertColorScale',
      name: 'Invert Color Scale',
      description: 'If turned off: dark -> light, if turned on: light -> dark',
      defaultValue: false,
    })
    .addColorPicker({
      path: 'color',
      name: 'Base Color',
      description: 'Used the determine the base color of the heatmap',
      defaultValue: 'light-blue',
    })
    .addBooleanSwitch({
      path: 'showCellValue',
      name: 'Show Cell Value',
      description: 'Display the value for each cell inside the grid',
      defaultValue: false,
    })
    .addNumberInput({
      path: 'cellFontSize',
      name: 'Cell Value Font Size',
      description: 'Determines the font size of the values inside cells',
      defaultValue: 10,
      showIf: config => config.showCellValue,
    })
    .addColorPicker({
      path: 'fontColor',
      name: 'Font Color',
      description: 'Determines the color of the text inside cells',
      defaultValue: 'white',
      showIf: config => config.showCellValue,
    });
});
