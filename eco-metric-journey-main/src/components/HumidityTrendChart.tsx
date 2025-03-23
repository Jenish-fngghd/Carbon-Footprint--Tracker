// src/components/HumidityTrendChart.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

interface HumidityTrendChartProps {
  data: number[];
}

export const HumidityTrendChart = ({ data }: HumidityTrendChartProps) => {
  const chartData = data.map((humidity, index) => ({
    time: index,
    humidity,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis 
          dataKey="time" 
          stroke="#888"
          tick={{ fill: '#888' }}
          label={{ value: 'Readings', position: 'insideBottomRight', offset: -5, fill: '#888' }}
        />
        <YAxis 
          stroke="#888"
          tick={{ fill: '#888' }}
          label={{ 
            value: 'Humidity (%)', 
            angle: -90, 
            position: 'insideLeft', 
            style: { textAnchor: 'middle', fill: '#888' } 
          }} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: '1px solid #334155',
            borderRadius: '4px',
            color: '#fff',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: number) => [`${value}%`, "Humidity"]}
        />
        <Legend wrapperStyle={{ color: '#888', paddingTop: '10px' }} />
        <Line 
          type="monotone" 
          dataKey="humidity" 
          stroke="#3B82F6" // Blue for humidity
          strokeWidth={3}
          activeDot={{ r: 8, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }} 
          name="Humidity"
          animationDuration={1000} // Add animation
        >
          <LabelList 
            dataKey="humidity" 
            position="top" 
            fill="#fff" 
            fontSize={12} 
            fontWeight="bold"
            formatter={(value: number) => `${value}%`} 
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};