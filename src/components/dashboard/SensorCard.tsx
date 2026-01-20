import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  type: 'temperature' | 'humidity' | 'gas';
  value: number;
  status: 'normal' | 'warning' | 'critical';
}

const sensorConfig = {
  temperature: {
    icon: Thermometer,
    label: 'Temperature',
    unit: '°C',
    color: 'text-chart-temperature',
    bgColor: 'bg-chart-temperature/10',
  },
  humidity: {
    icon: Droplets,
    label: 'Humidity',
    unit: '%',
    color: 'text-chart-humidity',
    bgColor: 'bg-chart-humidity/10',
  },
  gas: {
    icon: Wind,
    label: 'Gas Level',
    unit: 'PPM',
    color: 'text-chart-gas',
    bgColor: 'bg-chart-gas/10',
  },
};

const statusColors = {
  normal: 'border-success/30',
  warning: 'border-warning/50',
  critical: 'border-destructive/50 animate-pulse',
};

const SensorCard: React.FC<SensorCardProps> = ({ type, value, status }) => {
  const config = sensorConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('sensor-card border-2', statusColors[status])}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2 rounded-lg', config.bgColor)}>
          <Icon className={cn('w-5 h-5', config.color)} />
        </div>
        <div className={cn('status-indicator', {
          'status-normal': status === 'normal',
          'status-warning': status === 'warning',
          'status-critical': status === 'critical',
        })} />
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{config.label}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn('value-display', config.color)}>
            {value.toFixed(1)}
          </span>
          <span className="unit-label">{config.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
