import React, { useState, useEffect } from 'react';
import DeviceTracker from './DeviceTracker';
import FdaFeed from './FdaFeed';
import Login from './Login';
import Register from './Register';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import axios from 'axios';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [alerts, setAlerts] = useState([]);
  const [recalls, setRecalls] = useState([]);

  // Fetching data after the user is logged in
  useEffect(() => {
    if (user) {
      // Fetch FDA alerts
      axios.get(`http://localhost:5001/fda/alerts/${user.email}`)
        .then(response => {
          setAlerts(response.data);
        })
        .catch(error => {
          console.error("Error fetching FDA alerts:", error);
        });

      // Fetch recalls
      axios.get(`http://localhost:5001/api/recalls`)
        .then(response => {
          setRecalls(response.data);
        })
        .catch(error => {
          console.error("Error fetching recalls:", error);
        });
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide">AEMS</h1>
          <p className="text-sm text-blue-200">Monitoring. Alerts. Safety.</p>
        </div>
        <nav className="space-y-3 text-lg">
          <a href="#tracked" className="block hover:bg-blue-800 p-2 rounded">📌 Tracked Devices</a>
          <a href="#alerts" className="block hover:bg-blue-800 p-2 rounded">🔔 Alerts</a>
          <a href="#recalls" className="block hover:bg-blue-800 p-2 rounded">📢 Recalls</a>
          <a href="#evaluate" className="block hover:bg-blue-800 p-2 rounded">🩺 Device Evaluation</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Tracked Devices Section */}
        <section id="tracked" className="bg-white p-6 rounded-lg shadow">
          <DeviceTracker />
        </section>

        {/* Alerts Section */}
        <section id="alerts" className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold">FDA Alerts</h3>
          <FdaFeed alerts={alerts} />
        </section>

        {/* Recalls Section */}
        <section id="recalls" className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Device Recalls</h3>
          <ul>
            {recalls.length > 0 ? recalls.map((recall, idx) => (
              <li key={idx} className="mb-4">
                <div><strong>Device Name:</strong> {recall.device_name}</div>
                <div><strong>Recall Reason:</strong> {recall.recall_reason}</div>
              </li>
            )) : (
              <p>No recalls found.</p>
            )}
          </ul>
        </section>

        {/* Login/Register */}
        {!user ? (
          <>
            <Login />
            <Register />
          </>
        ) : (
          <button
            onClick={() => auth.signOut()}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded text-sm font-semibold"
          >
            Logout
          </button>
        )}
      </main>
    </div>
  );
}
