import { DataEntry } from './types';
import moment, { Moment } from 'moment';

export const extractRgbFromColor = (color: string) => {
  // Custom function to get the r,g,b values from either a hex color (#212121) or a rgb color string
  let rgbColor = color;

  // Check if passed color is a hex format
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    c = color.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    rgbColor = 'rgb(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ')';
  }
  // Convert rgb color string to rgb array and return
  return rgbColor.replace(/[^\d,]/g, '').split(',');
};

/*
  OLD Date Enumration Logic -> now rewritten with moment.js
*/
// const getDatesArray = (start:Date, end:Date) => {
//   for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
//     // For ease of use I am formatting the datestring in the generator, in production this would just return a dateObject
//     const date = new Date(dt).toISOString();
//     const formattedDate = date.substr(0, date.indexOf('T'));
//     arr.push(formattedDate);
//   }

//   return arr;
// }

const enumerateDaysBetweenDates = function(startDate: Moment, endDate: Moment) {
  /* 
    Lists all dates between start and end
    https://stackoverflow.com/a/23796069/5770147
  */

  var dates = [];

  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(endDate).endOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    const date = currDate.clone().toISOString();
    dates.push(date.substr(0, date.indexOf('T')));
  }

  return dates;
};

export const generateDummyData = (start: Moment, end: Moment, numUsers: number, flat: boolean) => {
  /* 
    Function to generate some fake data give the number of days (x) and number of users (y)
    Also passes the required x and y labels for a heatmap
    "Flat" argument is used to decided whether to return a 2d array or a 1d array with objects
  */

  const xLabels = enumerateDaysBetweenDates(start, end); // Generate date label for each date
  const yLabels = new Array(numUsers).fill(0).map((_, i) => `${numUsers - i}`); // Generate user id label for each users
  let chartData: Array< number[] | DataEntry>; // Either a 2d array of number OR a flat array of data entries

  if (flat) {
    const data: DataEntry[] = [];

    // Create a json object for each date for each user.
    xLabels.forEach(label => {
      yLabels.forEach(user => {
        data.push({
          date: label,
          userId: user,
          value: Math.floor(Math.random() * 100),
        });
      });
    });
    chartData = data;
  } else {
    // Create 2D-Array
    const data = new Array(numUsers)
      .fill(0) // Create an empty array with length of numUsers
      // For each user create an array with the length of the dates array and populate with random values between 0 and 100
      .map(() => new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 100)));
    chartData = data;
  }

  return { xLabels, yLabels, chartData };
};

export const calculateCellColor = (base: string[], min: number, max: number, value: number, invert: boolean) => {
  /* 
    Returns the required gradient of a base color for a heatmap plot
  */

  let opacity = (max - value) / (max - min);
  return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${invert ? 1 - opacity : opacity})`;
};

export const generateRandomDate = (start: Date, end: Date) => {
  /* 
    Generates a random date between a start and end date
  */

  const startTime = start.getTime();
  const endTime = end.getTime();

  return new Date(startTime + Math.random() * (endTime - startTime));
};

export const getDateXDaysAgo = (days: number) => {
  /* 
    Gets the date object for X days ago using moment.js
  */

  return moment().subtract(days, 'd');
};
