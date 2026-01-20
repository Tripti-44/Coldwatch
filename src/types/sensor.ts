export interface SensorData {
  temperature: number;
  humidity: number;
  gas: number;
  timestamp: Date;
}

export interface SensorThresholds {
  temperature: { warning: number; critical: number };
  humidity: { warning: number; critical: number };
  gas: { warning: number; critical: number };
}

export interface SensorStatus {
  temperature: 'normal' | 'warning' | 'critical';
  humidity: 'normal' | 'warning' | 'critical';
  gas: 'normal' | 'warning' | 'critical';
  overall: 'normal' | 'warning' | 'critical';
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  sensor: 'temperature' | 'humidity' | 'gas';
  value: number;
  threshold: number;
  status: 'warning' | 'critical';
  message: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  gas: number;
}
