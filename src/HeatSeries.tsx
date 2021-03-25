import React, { useState, useEffect } from 'react';
import { PanelProps, getColorForTheme } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { HeatSeriesOptions, DataObject } from 'types';
import moment from 'moment';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './styles/Calendar.css';
// Import some custom helper functions
import { extractRgbFromColor, generateDummyData, calculateCellColor, getDateXDaysAgo } from 'functions';

// @ts-ignore Package does not have registered types
import HeatMap from 'react-heatmap-grid';

interface Props extends PanelProps<HeatSeriesOptions> {}

export const HeatSeries: React.FC<Props> = ({ options, width, height }) => {
  const theme = getTheme();

  const { numUsers, daysAgo, color, cellFontSize, showCellValue, fontColor, invertColorScale } = options;
  const [dateRange, setDateRange] = useState({
    start: getDateXDaysAgo(daysAgo),
    end: moment(),
  });
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null); // Needed for daterangepicker
  const [dataState, setDataState] = useState<DataObject | null>(null);

  useEffect(()=>{
      setDateRange({
        start: getDateXDaysAgo(daysAgo),
        end: moment(),
      })
  },[daysAgo])

  useEffect(() => {
    const { start, end } = dateRange;
    setDataState(generateDummyData(start, end, numUsers, false));
  }, [dateRange, numUsers]);

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom:'20px' }}>
        <DateRangePicker
          startDate={dateRange.start}
          startDateId="graph_start_date_id"
          endDate={dateRange.end}
          endDateId="graph_end_date_id"
          onDatesChange={({ startDate, endDate }) => {
            setDateRange({ start: startDate || dateRange.start, end: endDate || dateRange.end });
          }}
          focusedInput={focusedInput}
          onFocusChange={e => setFocusedInput(e)}
          isOutsideRange={date => date > moment().endOf('day')}
        />
      </div>
      <div>
        {dataState ? (
          <HeatMap
            xLabels={dataState.xLabels}
            yLabels={dataState.yLabels}
            xLabelsLocation={'bottom'}
            xLabelWidth={60}
            data={dataState.data}
            height={(height - 150) / numUsers} // Vertical Padding of 150 to allow for the datepicker component
            cellStyle={(background: any, value: number, min: number, max: number, data: any, x: any, y: any) => ({
              // Using a custom function to calculate background color per cell
              background: calculateCellColor(baseColor, min, max, value, invertColorScale),
              fontSize: `${cellFontSize}px`,
              color: textColor,
            })}
            cellRender={(value: number) => {
              return (
                <div>
                  {// Checking if value >= 0 rather than if value exists to include 0 values
                  value >= 0 && showCellValue ? `${value}` : null}
                </div>
              );
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

/*
  resulting heatmap: https://i.imgur.com/8qZReF1.png
*/
