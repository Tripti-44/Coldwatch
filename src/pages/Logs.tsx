import React from 'react';
import { AlertTriangle, AlertCircle, Thermometer, Droplets, Wind } from 'lucide-react';
import { useSensorData } from '@/contexts/SensorContext';
import { cn } from '@/lib/utils';
import { LogEntry } from '@/types/sensor';

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  gas: Wind,
};

const Logs: React.FC = () => {
  const { logs } = useSensorData();

  return (
    <div className="h-full p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Logs</h1>
          <p className="text-muted-foreground">Threshold breach events and alerts</p>
        </div>
        <span className="text-sm text-muted-foreground">{logs.length} events</span>
      </div>

      {/* Logs Table */}
      <div className="flex-1 glass-card overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-12">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sensor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Threshold
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.map((log) => {
                const SensorIcon = sensorIcons[log.sensor];
                return (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {log.status === 'critical' ? (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <SensorIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{log.sensor}</span>
                      </div>
                    </td>
                    <td className={cn(
                      'px-4 py-3 text-sm font-mono font-medium',
                      log.status === 'critical' ? 'text-destructive' : 'text-warning'
                    )}>
                      {log.value.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {log.threshold}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {log.message}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-muted-foreground/50" />
                      <p>No events logged yet</p>
                      <p className="text-sm">Events will appear here when thresholds are breached</p>
                    </div>
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

export default Logs;
