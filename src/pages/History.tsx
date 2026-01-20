import React, { useState, useMemo } from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { useSensorData } from '@/contexts/SensorContext';
import { cn } from '@/lib/utils';

type SensorFilter = 'all' | 'temperature' | 'humidity' | 'gas';

const filterButtons: { value: SensorFilter; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All Sensors', icon: Wind },
  { value: 'temperature', label: 'Temperature', icon: Thermometer },
  { value: 'humidity', label: 'Humidity', icon: Droplets },
  { value: 'gas', label: 'Gas', icon: Wind },
];

const History: React.FC = () => {
  const { history } = useSensorData();
  const [filter, setFilter] = useState<SensorFilter>('all');

  const columns = useMemo(() => {
    if (filter === 'all') {
      return ['Time', 'Temperature (°C)', 'Humidity (%)', 'Gas (PPM)'];
    }
    const labels = {
      temperature: ['Time', 'Temperature (°C)'],
      humidity: ['Time', 'Humidity (%)'],
      gas: ['Time', 'Gas (PPM)'],
    };
    return labels[filter];
  }, [filter]);

  return (
    <div className="h-full p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground">View historical sensor readings</p>
        </div>
        <span className="text-sm text-muted-foreground">{history.length} records</span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = filter === btn.value;
          return (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="w-4 h-4" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="flex-1 glass-card overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {history.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  {(filter === 'all' || filter === 'temperature') && (
                    <td className="px-4 py-3 text-sm font-mono text-chart-temperature">
                      {entry.temperature.toFixed(1)}
                    </td>
                  )}
                  {(filter === 'all' || filter === 'humidity') && (
                    <td className="px-4 py-3 text-sm font-mono text-chart-humidity">
                      {entry.humidity.toFixed(1)}
                    </td>
                  )}
                  {(filter === 'all' || filter === 'gas') && (
                    <td className="px-4 py-3 text-sm font-mono text-chart-gas">
                      {entry.gas}
                    </td>
                  )}
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                    No history data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
