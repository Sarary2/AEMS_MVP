// src/components/UserAlerts.jsx
import { useEffect, useState } from 'react';

export default function UserAlerts({ email }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/fda/alerts/${email}`)
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching alerts:', err);
        setLoading(false);
      });
  }, [email]);

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">🔔 Alerts for {email}</h2>
      {loading ? (
        <p className="text-gray-500">Fetching alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-green-600">✅ No alerts for your tracked devices.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert, idx) => (
            <li key={idx} className="border-b pb-2 text-sm">
              <div><strong>Device:</strong> {alert.device}</div>
              <div><strong>Type:</strong> {alert.event_type}</div>
              <div><strong>Date:</strong> {alert.date}</div>
              <div><strong>Summary:</strong> {alert.summary || 'No description provided.'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
