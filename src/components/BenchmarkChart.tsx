
import React, { useEffect, useRef } from 'react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { ComparisonResult, getMetricDisplayName } from '../utils/calculatorUtils';

interface BenchmarkChartProps {
  results: ComparisonResult[];
}

const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ results }) => {
  const prepareChartData = () => {
    return results.map(result => {
      // Convert decimal rates to percentages for display
      const userValue = result.metric === 'revPerRecipient' 
        ? result.userValue 
        : result.userValue * 100;
      
      const benchmarkValue = result.metric === 'revPerRecipient'
        ? result.benchmarkValue
        : result.benchmarkValue * 100;
      
      return {
        name: getMetricDisplayName(result.metric),
        user: userValue,
        benchmark: benchmarkValue,
        difference: result.isAboveBenchmark ? 'above' : 'below'
      };
    });
  };

  const chartData = prepareChartData();
  
  const getTickFormatter = (metric: string) => {
    if (metric === 'Revenue Per Recipient') {
      return (value: number) => `$${value.toFixed(2)}`;
    }
    return (value: number) => `${value.toFixed(2)}%`;
  };

  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={chartRef} className="w-full h-[400px] animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={getTickFormatter(chartData[0].name)} 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'user') return ['Your Value', chartData[0].name === 'Revenue Per Recipient' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`];
              return ['Industry Benchmark', chartData[0].name === 'Revenue Per Recipient' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`];
            }}
            labelFormatter={(label: string) => label}
          />
          <Legend 
            verticalAlign="top" 
            formatter={(value) => value === 'user' ? 'Your Metrics' : 'Industry Benchmark'} 
          />
          <Bar 
            dataKey="user" 
            name="user" 
            barSize={40}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.difference === 'above' ? '#10B981' : '#EF4444'} 
              />
            ))}
          </Bar>
          <ReferenceLine 
            y={0} 
            stroke="#000" 
          />
          {chartData.map((entry, index) => (
            <ReferenceLine 
              key={`ref-${index}`}
              x={entry.name} 
              y={entry.benchmark} 
              stroke="#6366F1" 
              strokeDasharray="3 3" 
              strokeWidth={2}
              label={{ 
                position: 'top', 
                value: 'Benchmark', 
                fill: '#6366F1',
                fontSize: 12
              }} 
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BenchmarkChart;
