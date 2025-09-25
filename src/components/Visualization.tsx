import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MathConfig, generateDataPoints } from '../utils/mathFunctions';

interface VisualizationProps {
  config: MathConfig;
  visualizationType: '2d' | '3d' | 'contour';
  onVisualizationTypeChange: (type: '2d' | '3d' | 'contour') => void;
}

const Visualization: React.FC<VisualizationProps> = ({ 
  config, 
  visualizationType, 
  onVisualizationTypeChange 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; z: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = generateDataPoints(config, 20);

    const xScale = d3.scaleLinear()
      .domain([config.xMin, config.xMax])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([config.yMin, config.yMax])
      .range([height, 0]);

    const zExtent = d3.extent(data, d => d.z) as [number, number];
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain(zExtent);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .attr('class', 'text-gray-600 dark:text-gray-300');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .attr('class', 'text-gray-600 dark:text-gray-300');

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + 50})`)
      .style('text-anchor', 'middle')
      .attr('class', 'text-sm font-medium fill-gray-700 dark:fill-gray-300')
      .text('X');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .style('text-anchor', 'middle')
      .attr('class', 'text-sm font-medium fill-gray-700 dark:fill-gray-300')
      .text('Y');

    if (visualizationType === '2d') {
      // 2D scatter plot
      g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 3)
        .style('fill', d => colorScale(d.z))
        .style('opacity', 0.7)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          setHoveredPoint(d);
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('r', 5)
            .style('opacity', 1);
        })
        .on('mouseout', (event) => {
          setHoveredPoint(null);
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('r', 3)
            .style('opacity', 0.7);
        });
    } else if (visualizationType === 'contour') {
      // Contour plot using rectangles
      const gridSize = Math.sqrt(data.length);
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;

      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i % gridSize) * cellWidth)
        .attr('y', (d, i) => Math.floor(i / gridSize) * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .style('fill', d => colorScale(d.z))
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          setHoveredPoint(d);
          d3.select(event.target)
            .style('opacity', 1)
            .style('stroke', '#333')
            .style('stroke-width', 2);
        })
        .on('mouseout', (event) => {
          setHoveredPoint(null);
          d3.select(event.target)
            .style('opacity', 0.8)
            .style('stroke', 'none');
        });
    } else {
      // 3D representation using size and color
      g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => Math.abs(d.z) / zExtent[1] * 10 + 2)
        .style('fill', d => colorScale(d.z))
        .style('opacity', 0.6)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          setHoveredPoint(d);
          d3.select(event.target)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('stroke', '#333')
            .style('stroke-width', 2);
        })
        .on('mouseout', (event) => {
          setHoveredPoint(null);
          d3.select(event.target)
            .transition()
            .duration(200)
            .style('opacity', 0.6)
            .style('stroke', 'none');
        });
    }

    // Add color legend
    const legendWidth = 20;
    const legendHeight = height / 2;
    const legend = g.append('g')
      .attr('transform', `translate(${width + 30}, ${height / 4})`);

    const legendScale = d3.scaleLinear()
      .domain(zExtent)
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5);

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', legendHeight)
      .attr('x2', 0).attr('y2', 0);

    gradient.selectAll('stop')
      .data(d3.range(0, 1.01, 0.1))
      .enter().append('stop')
      .attr('offset', d => d)
      .attr('stop-color', d => colorScale(zExtent[0] + d * (zExtent[1] - zExtent[0])));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    legend.append('g')
      .call(legendAxis)
      .attr('transform', `translate(${legendWidth}, 0)`)
      .attr('class', 'text-gray-600 dark:text-gray-300');

  }, [config, visualizationType]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Visualization</h3>
        
        <div className="flex space-x-2">
          {(['2d', '3d', 'contour'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onVisualizationTypeChange(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                visualizationType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height="600"
          viewBox="0 0 800 600"
          className="w-full h-auto border rounded-lg bg-gray-50 dark:bg-gray-900"
        />
        
        {hoveredPoint && (
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div>X: {hoveredPoint.x.toFixed(2)}</div>
              <div>Y: {hoveredPoint.y.toFixed(2)}</div>
              <div>Z: {hoveredPoint.z.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualization;