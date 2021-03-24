# Grafana HeatSeries Panel Plugin

This project is a hobby project and is NOT suitable for production.

## Project Summary

##### Aim

This aim of this project was to build a Grafana Panel Plugin to display time series data using a Heat Map Visualisation. The initial version attempted to use only d3.js to build the entire react component from scratch, however this proved more complicated than expected and seemed unnecessary due to the amount of currently available heatmap implementations. The code for the initial (failed) attempt is included and can be loaded. The current version uses `react-heatmap-grid` to draw the graph.

##### Data

This Project does **not** interact with data that is provided by Grafana itself. A function `generateDummyData` is used to generate a dataset for a given timeframe and a given number of users. This function can generate either a 1-dimensional array of objects `eg. [{date:x, value:y}]` or a 2 dimensional array `eg. [[1,2,3], [4,5,6]]`

##### Notable Features

- Includes random data generator for both formats
- Uses [Moment.js](https://momentjs.com/) for all dates and date calculation
- React Functional Components, hooks and typescript
- X Dimensions (Days) customisable in panel options
- Y Dimensions (Users) customisable in panel options
- Variety of customisable options (base color, text color in cells, text size and more)

_Changing any of the panel options, including the dimensions, will re-render the component causing the data to be randomly generated again. Though, this might be sub-optimal for development purposes, this is the expected behaviour in production as when changing the # of users or days to display the plugin would make a new call to whatever source is producing the data and only request the data needed for that graph, rather than getting all data and filtering in the front-end._

## Possible Improvements

- **Fake Data source:** Instead of randomly generating data every lifecycle this would act as a sort of fake database which could be queried, with a list userIds to display and a date range. This would allow for some functional changes in the HeatSeries component to load in more users then shown in the graph and allow for scrolling.
- **Proper Date Handling:** Currently, the date generator will return the dates preformatted as strings*(YYYY-MM-DD)*. This is done for ease of use and compatibility between both versions but in production dates should remain a moment.js object or a date object until the very last step (visualising on the plot).
- Ability to aggregate data by week or month (would be triggered from a grafana plugin option)
- **Customisation:** The heatmap library that is currently used doesn't allow for axis labels, title, legend and further graph customisation options.

## High-level project overview

- **CustomHeatMap(old)**: This folder contains files of a first, failed attempt at creating the desired heatmap to display time series data. In this attempt the React Heatmap Component was custom built using plain [d3.js](https://d3js.org/).

* **function.tsx**: This file contains a variety of useful functions which are used throughout the project. They are stored globally and exported from this file, as multiple files use them (some functions might seem redundant/unused, these are functions that are used in the failed attempt above and are therefore preserved in this file.

- **HeatSeries.tsx**: This file handles fetching and passing data and grafana plugin options to the HeatMap component. The heatmap component is supplied by [react-heatmap-grid](https://github.com/arunghosh/react-heatmap-grid).

* **types.ts**: This file contains the typings, interfaces and required props for all the components in this project. Most importantly "HeatSeriesOptions" which is the configurable options for the final heatseries component, the other interfaces and proptypes are only necessary when running the old custom d3.js heatmap.

- **module.ts**: This file exports to final panel plugin and handles all configurable panel options from grafana.

## Using the Heat Series Panel

This projects expects prior knowledge of installing and developing Grafana Plugins.

If this is your first time running a grafana plugin in development mode, please refer to the [this tutorial](https://grafana.com/tutorials/build-a-panel-plugin/)

1. Clone this repository in your "grafana-plugins" folder (or whatever custom folder you have your grafana config pointing towards.

2) In the root of the project run:`yarn install` to install the required dependencies.

3. In the root of the project run: `yarn dev`to build a development version of the plugin.

4) Restart the grafana service to reload the new plugin (only needs to be done once after the plugin is first added.)

5. Optionally you could run `yarn watch` to automatically rebuild the project on file save.

6) In chrome, navigate to `localhost:3000` or whatever address you have your grafana config set up.

7. Add a new panel to an existing (or newly created) dashboard. ([More Information](https://grafana.com/docs/grafana/latest/panels/add-a-panel/))

8) Choose the Heat Series Visualisation from the list of possible visualisations. [Plugin Logo](https://i.imgur.com/fUIj6de.png)

9. Configure the display settings to your liking. [Plugin Options](https://i.imgur.com/y6t8zTH.png)

10) View The plugin and save your changes. [Dashboard Example](https://i.imgur.com/Z3QU1bO.png)

## Viewing the Custom HeatMap (failed attempt):

1. In the `src` folder rename `module.ts` to `module_new.ts` and rename `module_custom.ts`to `module.ts`.

2) Run `yarn dev`

3. The plugin should automatically reload on your dashboard to use the "custom heatmap version". (you might need to change some of the display options as the plugin config will have changed)

You should now see a similar heatmap, however it will be lacking some of the functionality and customizability.
