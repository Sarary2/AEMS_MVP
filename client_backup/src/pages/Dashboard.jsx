import React from 'react';
import DeviceTracker from '../components/DeviceTracker';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

        {/* Tracked Devices Section */}
        <DeviceTracker userEmail="test@example.com" />
      </div>
    </div>
  );
};

export default Dashboard;
