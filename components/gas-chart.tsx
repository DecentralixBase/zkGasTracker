"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GasData } from "@/types/gas";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';

interface GasChartProps {
  gasData: GasData[];
}

interface ChartDataPoint {
  timestamp: number;
  time: string;
  ethereum?: number;
  arbitrum?: number;
  optimism?: number;
  base?: number;
  polygon?: number;
}

export function GasChart({ gasData }: GasChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    console.log('Updating chart data with gas data:', gasData);
    
    // Create a new data point with current gas prices
    const now = Date.now();
    const timeString = new Date(now).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    
    const newDataPoint: ChartDataPoint = {
      timestamp: now,
      time: timeString,
    };

    // Add gas prices for each network
    gasData.forEach(data => {
      if (data.status === 'success') {
        const key = data.chainName.toLowerCase() as keyof ChartDataPoint;
        if (typeof key === 'string' && key !== 'timestamp' && key !== 'time') {
          (newDataPoint as any)[key] = data.gasPrice;
        }
      }
    });

    setChartData(prev => {
      const updated = [...prev, newDataPoint];
      // Keep only last 20 data points to prevent chart from becoming too crowded
      return updated.slice(-20);
    });
  }, [gasData]);

  const networkColors = {
    ethereum: '#627eea',
    arbitrum: '#28a0f0',
    optimism: '#ff0420',
    base: '#0052ff',
    polygon: '#8247e5',
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gas Price Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Gas Price Trends</span>
          <span className="text-sm text-muted-foreground font-normal">
            (Last {chartData.length} updates)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
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
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                fontSize={12}
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', opacity: 0.3 }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', opacity: 0.3 }}
                label={{ value: 'Gas Price (gwei)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} gwei`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Legend 
                fontSize={12}
                iconType="line"
              />
              
              {Object.entries(networkColors).map(([network, color]) => (
                <Line
                  key={network}
                  type="monotone"
                  dataKey={network}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: color }}
                  activeDot={{ r: 5, fill: color }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}