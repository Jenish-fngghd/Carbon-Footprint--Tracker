import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CO2EmissionsChartProps {
  data: number[]; // Array of CO2 values from the Dashboard
}

export const CO2EmissionsChart = ({ data }: CO2EmissionsChartProps) => {
  // Transform the data array into a format suitable for Recharts
  const chartData = data.map((co2, index) => ({
    time: index, // Using index as a simple time placeholder; can be replaced with timestamps if available
    co2,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
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
            value: 'CO₂ (ppm)', 
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
          formatter={(value: number) => [`${value} ppm`, "CO₂"]}
        />
        <Legend wrapperStyle={{ color: '#888' }} />
        <Area 
          type="monotone" 
          dataKey="co2" 
          stroke="#5C8D89"
          fill="#5C8D89"
          fillOpacity={0.3}
          strokeWidth={2}
          name="CO₂ Levels"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};