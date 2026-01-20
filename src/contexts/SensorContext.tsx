import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SensorData, SensorThresholds, SensorStatus, LogEntry, HistoryEntry } from '@/types/sensor';

interface SensorContextType {
  currentData: SensorData;
  thresholds: SensorThresholds;
  status: SensorStatus;
  logs: LogEntry[];
  history: HistoryEntry[];
  updateThresholds: (thresholds: SensorThresholds) => void;
  isConnected: boolean;
  lastUpdate: Date | null;
}

const defaultThresholds: SensorThresholds = {
  temperature: { warning: 8, critical: 12 },
  humidity: { warning: 70, critical: 85 },
  gas: { warning: 300, critical: 500 },
};

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const useSensorData = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensorData must be used within a SensorProvider');
  }
  return context;
};

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentData, setCurrentData] = useState<SensorData>({
    temperature: 4.2,
    humidity: 65,
    gas: 120,
    timestamp: new Date(),
  });

  const [thresholds, setThresholds] = useState<SensorThresholds>(() => {
    const saved = localStorage.getItem('sensorThresholds');
    return saved ? JSON.parse(saved) : defaultThresholds;
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());

  const getStatus = useCallback((data: SensorData, thresholds: SensorThresholds): SensorStatus => {
    const getLevel = (value: number, threshold: { warning: number; critical: number }, isGas = false): 'normal' | 'warning' | 'critical' => {
      if (isGas) {
        if (value >= threshold.critical) return 'critical';
        if (value >= threshold.warning) return 'warning';
        return 'normal';
      }
      if (value >= threshold.critical) return 'critical';
      if (value >= threshold.warning) return 'warning';
      return 'normal';
    };

    const tempStatus = getLevel(data.temperature, thresholds.temperature);
    const humidStatus = getLevel(data.humidity, thresholds.humidity);
    const gasStatus = getLevel(data.gas, thresholds.gas, true);

    const statuses = [tempStatus, humidStatus, gasStatus];
    let overall: 'normal' | 'warning' | 'critical' = 'normal';
    if (statuses.includes('critical')) overall = 'critical';
    else if (statuses.includes('warning')) overall = 'warning';

    return {
      temperature: tempStatus,
      humidity: humidStatus,
      gas: gasStatus,
      overall,
    };
  }, []);

  const [status, setStatus] = useState<SensorStatus>(() => getStatus(currentData, thresholds));

  const addLog = useCallback((sensor: 'temperature' | 'humidity' | 'gas', value: number, threshold: number, status: 'warning' | 'critical') => {
    const messages = {
      temperature: `Temperature ${status === 'critical' ? 'critically high' : 'above normal'}: ${value}°C`,
      humidity: `Humidity ${status === 'critical' ? 'critically high' : 'above normal'}: ${value}%`,
      gas: `Gas level ${status === 'critical' ? 'critical' : 'elevated'}: ${value} PPM`,
    };

    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sensor,
      value,
      threshold,
      status,
      message: messages[sensor],
    };

    setLogs(prev => [newLog, ...prev].slice(0, 500));
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => {
        // Simulate slight variations
        const newTemp = Math.max(0, Math.min(20, prev.temperature + (Math.random() - 0.5) * 0.5));
        const newHumidity = Math.max(30, Math.min(100, prev.humidity + (Math.random() - 0.5) * 2));
        const newGas = Math.max(50, Math.min(800, prev.gas + (Math.random() - 0.5) * 20));

        const newData = {
          temperature: Math.round(newTemp * 10) / 10,
          humidity: Math.round(newHumidity * 10) / 10,
          gas: Math.round(newGas),
          timestamp: new Date(),
        };

        // Add to history
        setHistory(prev => {
          const newEntry: HistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            temperature: newData.temperature,
            humidity: newData.humidity,
            gas: newData.gas,
          };
          return [newEntry, ...prev].slice(0, 1000);
        });

        // Check thresholds and add logs
        const newStatus = getStatus(newData, thresholds);
        
        if (newStatus.temperature !== 'normal' && prev.temperature < thresholds.temperature.warning) {
          addLog('temperature', newData.temperature, 
            newStatus.temperature === 'critical' ? thresholds.temperature.critical : thresholds.temperature.warning,
            newStatus.temperature);
        }
        
        if (newStatus.humidity !== 'normal' && prev.humidity < thresholds.humidity.warning) {
          addLog('humidity', newData.humidity,
            newStatus.humidity === 'critical' ? thresholds.humidity.critical : thresholds.humidity.warning,
            newStatus.humidity);
        }
        
        if (newStatus.gas !== 'normal' && prev.gas < thresholds.gas.warning) {
          addLog('gas', newData.gas,
            newStatus.gas === 'critical' ? thresholds.gas.critical : thresholds.gas.warning,
            newStatus.gas);
        }

        setStatus(newStatus);
        setLastUpdate(new Date());

        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [thresholds, getStatus, addLog]);

  const updateThresholds = useCallback((newThresholds: SensorThresholds) => {
    setThresholds(newThresholds);
    localStorage.setItem('sensorThresholds', JSON.stringify(newThresholds));
  }, []);

  return (
    <SensorContext.Provider
      value={{
        currentData,
        thresholds,
        status,
        logs,
        history,
        updateThresholds,
        isConnected,
        lastUpdate,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};
