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
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [recalls, setRecalls] = useState([]);

  useEffect(() => {
    if (user) {
      console.log("👤 Firebase user email:", user.email);
      setAlertsLoading(true);

      axios.get(`http://localhost:5001/api/alerts/${user.email}`)
        .then((res) => {
          console.log("📦 Received alerts from backend:", res.data);
          setAlerts(res.data);
        })
        .catch((err) => {
          console.error("❌ Error fetching alerts:", err);
        })
        .finally(() => setAlertsLoading(false));

      axios.get(`http://localhost:5001/api/recalls`)
        .then((res) => setRecalls(res.data))
        .catch((err) => console.error("❌ Error fetching recalls:", err));
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide">AEMS</h1>
          <p className="text-sm text-blue-200">Monitoring. Alerts. Safety.</p>
        </div>
        <nav className="space-y-3 text-lg">
          <a href="#tracked" className="block hover:bg-blue-800 p-2 rounded">📌 Tracked Devices</a>
          <a href="#alerts" className="block hover:bg-blue-800 p-2 rounded">🔔 Alerts</a>
          <a href="#recalls" className="block hover:bg-blue-800 p-2 rounded">📢 Recalls</a>
        </nav>
      </aside>

      <main className="flex-1 p-8 space-y-8">
        <section id="tracked" className="bg-white p-6 rounded-lg shadow">
          <DeviceTracker />
        </section>

        <section id="alerts" className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">🧠 Combined Alerts</h3>
          {alertsLoading ? (
            <p className="text-gray-500">Loading alerts...</p>
          ) : (
            <FdaFeed alerts={alerts} />
          )}
        </section>

        <section id="recalls" className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">📢 Device Recalls</h3>
          {recalls.length > 0 ? (
            <ul className="space-y-2">
              {recalls.map((recall, idx) => (
                <li key={idx} className="text-sm border-b pb-2">
                  <strong>Device:</strong> {recall.device_name}<br />
                  <strong>Reason:</strong> {recall.recall_reason}
                </li>
              ))}
            </ul>
          ) : <p>No recalls found.</p>}
        </section>

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
