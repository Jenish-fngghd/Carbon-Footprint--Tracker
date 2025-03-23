import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TemperatureTrendChartProps {
  data: number[]; // Array of temperature values from the Dashboard
}

export const TemperatureTrendChart = ({ data }: TemperatureTrendChartProps) => {
  // Transform the data array into a format suitable for Recharts
  const chartData = data.map((temperature, index) => ({
    time: index, // Using index as a simple time placeholder; can be replaced with timestamps if available
    temperature,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
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
            value: 'Temperature (°C)', 
            angle: -90, 
            position: 'insideLeft', 
            style: { textAnchor: 'middle', fill: '#888' } 
          }} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#333', 
            border: '1px solid #555',
            color: '#fff'
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: number) => [`${value.toFixed(1)}°C`, "Temperature"]}
        />
        <Legend wrapperStyle={{ color: '#888' }} />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#FF5722" 
          strokeWidth={2}
          activeDot={{ r: 8 }} 
          name="Temperature"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};