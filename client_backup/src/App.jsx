import React from 'react';
import FdaFeed from './components/FdaFeed';
import UserAlerts from './components/UserAlerts';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">AEMS Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">FDA Feed</h2>
          <FdaFeed />
        </div>
        <div className="p-6 space-y-6">
          <Register />
          <Login />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md col-span-full">
          <h2 className="text-xl font-semibold mb-2">User Alerts</h2>
          <UserAlerts email="test@aems.com" />
        </div>
      </div>
    </div>
  );
}
