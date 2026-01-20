import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import CriticalAlert from '@/components/alerts/CriticalAlert';
import { SensorProvider } from '@/contexts/SensorContext';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  return (
    <SensorProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <CriticalAlert />
      </div>
    </SensorProvider>
  );
};

export default DashboardLayout;
