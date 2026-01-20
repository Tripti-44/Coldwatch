import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';
import { HistoryEntry } from '@/types/sensor';

interface SensorChartProps {
  data: HistoryEntry[];
  type: 'temperature' | 'humidity' | 'gas';
  title: string;
}

const chartConfig = {
  temperature: {
    color: 'hsl(0, 84%, 60%)',
    gradientId: 'tempGradient',
    unit: '°C',
  },
  humidity: {
    color: 'hsl(200, 90%, 55%)',
    gradientId: 'humidGradient',
    unit: '%',
  },
  gas: {
    color: 'hsl(45, 93%, 55%)',
    gradientId: 'gasGradient',
    unit: 'PPM',
  },
};

const SensorChart: React.FC<SensorChartProps> = ({ data, type, title }) => {
  const config = chartConfig[type];

  const chartData = useMemo(() => {
    return data.slice(0, 20).reverse().map((entry, index) => ({
      time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: entry[type],
      index,
    }));
  }, [data, type]);

  return (
    <div className="chart-container flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={10}
              tickLine={false}
              tickFormatter={(value) => `${value}${config.unit}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(215, 20%, 55%)' }}
              formatter={(value: number) => [`${value.toFixed(1)} ${config.unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              fill={`url(#${config.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;
