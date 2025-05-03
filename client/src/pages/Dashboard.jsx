import React from 'react';
import DeviceTracker from './DeviceTracker';
import FdaFeed from './FdaFeed';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-blue-700">📋 AEMS Device Monitoring</h1>
        <p className="text-gray-600 mt-1">Track devices and receive real-time alerts</p>
      </header>

      <section className="bg-white shadow p-6 rounded-lg">
        <DeviceTracker />
      </section>

      <section className="bg-white shadow p-6 rounded-lg">
        <FdaFeed />
      </section>
    </div>
  );
}
