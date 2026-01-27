import React from 'react';
import SensorCard from '@/components/dashboard/SensorCard';
import StatusPanel from '@/components/dashboard/StatusPanel';
import SensorChart from '@/components/dashboard/SensorChart';
import { useSensorData } from '@/contexts/SensorContext';

const Dashboard: React.FC = () => {
  const { currentData, status, history, lastUpdate, isConnected } = useSensorData();

  return (
    <div className="h-full p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Real-time cold storage monitoring via ThingSpeak</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
          {isConnected ? 'Connected to ThingSpeak' : 'Disconnected'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Column - Sensor Cards & Status */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Sensor Cards */}
          <div className="grid grid-cols-1 gap-4">
            <SensorCard
              type="temperature"
              value={currentData.temperature}
              status={status.temperature}
            />
            <SensorCard
              type="humidity"
              value={currentData.humidity}
              status={status.humidity}
            />
            <SensorCard
              type="gas"
              value={currentData.gas}
              status={status.gas}
            />
          </div>

          {/* Status Panel */}
          <div className="flex-1 min-h-0">
            <StatusPanel status={status} lastUpdate={lastUpdate} />
          </div>
        </div>

        {/* Right Column - Charts */}
        <div className="col-span-8 grid grid-rows-3 gap-4">
          <SensorChart
            data={history}
            type="temperature"
            title="Temperature (°C)"
          />
          <SensorChart
            data={history}
            type="humidity"
            title="Humidity (%)"
          />
          <SensorChart
            data={history}
            type="gas"
            title="Gas Level (PPM)"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
