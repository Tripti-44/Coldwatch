import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useSensorData } from '@/contexts/SensorContext';
import { cn } from '@/lib/utils';

const CriticalAlert: React.FC = () => {
  const { status, currentData } = useSensorData();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status.overall === 'critical' && !dismissed) {
      setIsVisible(true);
    } else if (status.overall !== 'critical') {
      setDismissed(false);
    }
  }, [status.overall, dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  if (!isVisible) return null;

  const criticalSensors = [];
  if (status.temperature === 'critical') criticalSensors.push(`Temperature: ${currentData.temperature}°C`);
  if (status.humidity === 'critical') criticalSensors.push(`Humidity: ${currentData.humidity}%`);
  if (status.gas === 'critical') criticalSensors.push(`Gas: ${currentData.gas} PPM`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border-2 border-destructive rounded-xl p-6 max-w-md mx-4 shadow-2xl animate-pulse-glow">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-destructive/20">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-destructive mb-2">Critical Alert</h2>
            <p className="text-muted-foreground mb-4">
              One or more sensors have exceeded critical thresholds. Immediate attention required.
            </p>
            <div className="space-y-2 mb-4">
              {criticalSensors.map((sensor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-mono text-destructive">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  {sensor}
                </div>
              ))}
            </div>
            <button
              onClick={handleDismiss}
              className="w-full py-2 px-4 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              Acknowledge
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlert;
