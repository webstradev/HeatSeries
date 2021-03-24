import React, { useRef, useEffect } from 'react';

// @ts-ignore (TODO create declaration file for d3)
import * as d3 from 'd3';
import { CustomHeatMapProps } from '../types';

export const CustomHeatMap: React.FC<CustomHeatMapProps> = ({ dimensions, chartData, baseColor }) => {
  const d3Container = useRef(null);

  const { width, height, margins } = dimensions;

  const graphWidth = width - margins.left - margins.right;
  const graphHeight = height - margins.top - margins.bottom;

  useEffect(() => {
    (async () => {
      if (chartData && d3Container.current) {
        const { data, xLabels, yLabels } = chartData;
        const svg = d3.select(d3Container.current);

        // Build X scales and axis:
        const x = d3
          .scaleBand()
          .range([0, graphWidth]) // Using graphWidth to account for margins
          .domain(xLabels)
          .padding(0.025); // TODO configure padding from grafana options
        svg
          .select('.x-axis')
          .attr('transform', 'translate(0,' + graphHeight + ')')
          .call(d3.axisBottom(x));

        // Build Y scales and axis:
        const y = d3
          .scaleBand()
          .range([graphHeight, 0]) // Using graphHeight to account for margins
          .domain(yLabels)
          .padding(0.025); // TODO configure padding from grafana options
        svg
          .select('.y-axis')
          .attr('transform', 'translate(' + graphWidth + ',0)')
          .call(d3.axisRight(y));

        // Build color scale
        const colorScale = d3
          .scaleLinear()
          .range(['white', baseColor])
          .domain([0, 100]);

        svg
          .selectAll('.square')
          .data(data)
          .join('rect')
          .attr('class', 'square')
          .attr('x', function(d: any) {
            return x(d.date);
          })
          .attr('y', function(d: any) {
            return y(d.userId);
          })
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .style('fill', function(d: any) {
            return colorScale(d.value);
          })
          .style('stroke-width', 4)
          .style('stroke', 'none')
          .style('opacity', 0.8);
      }
    })();
  }, [chartData, baseColor, graphHeight, graphWidth, d3Container.current]);

  return (
    <svg className="d3-component" width={width} height={height} ref={d3Container}>
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};
