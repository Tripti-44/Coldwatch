import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SensorStatus } from '@/types/sensor';

interface StatusPanelProps {
  status: SensorStatus;
  lastUpdate: Date | null;
}

const statusConfig = {
  normal: {
    icon: CheckCircle,
    label: 'All Systems Normal',
    description: 'All sensor readings are within acceptable thresholds',
    bgClass: 'bg-success/10 border-success/30',
    textClass: 'text-success',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    description: 'One or more sensors showing elevated readings',
    bgClass: 'bg-warning/10 border-warning/30',
    textClass: 'text-warning',
  },
  critical: {
    icon: XCircle,
    label: 'Critical Alert',
    description: 'Immediate attention required - readings exceed safe limits',
    bgClass: 'bg-destructive/10 border-destructive/30',
    textClass: 'text-destructive',
  },
};

const StatusPanel: React.FC<StatusPanelProps> = ({ status, lastUpdate }) => {
  const config = statusConfig[status.overall];
  const Icon = config.icon;

  return (
    <div className={cn('sensor-card border-2 h-full', config.bgClass)}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={cn('w-8 h-8', config.textClass)} />
        <div>
          <h3 className={cn('font-semibold text-lg', config.textClass)}>{config.label}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Temperature</span>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', {
              'bg-success': status.temperature === 'normal',
              'bg-warning': status.temperature === 'warning',
              'bg-destructive': status.temperature === 'critical',
            })} />
            <span className="text-sm font-medium capitalize">{status.temperature}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Humidity</span>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', {
              'bg-success': status.humidity === 'normal',
              'bg-warning': status.humidity === 'warning',
              'bg-destructive': status.humidity === 'critical',
            })} />
            <span className="text-sm font-medium capitalize">{status.humidity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Gas Level</span>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', {
              'bg-success': status.gas === 'normal',
              'bg-warning': status.gas === 'warning',
              'bg-destructive': status.gas === 'critical',
            })} />
            <span className="text-sm font-medium capitalize">{status.gas}</span>
          </div>
        </div>
      </div>

      {lastUpdate && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusPanel;
