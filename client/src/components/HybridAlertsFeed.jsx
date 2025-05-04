// src/components/HybridAlertsFeed.jsx
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

export default function HybridAlertsFeed() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5001/api/alerts/${user.email}`)
        .then((res) => {
          setAlerts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error fetching hybrid alerts:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const badgeColor = (source) =>
    source === 'FDA'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';

  const severityColor = (level) =>
    level === 'major'
      ? 'text-red-600'
      : level === 'moderate'
      ? 'text-yellow-600'
      : 'text-green-600';

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">🔔 Hybrid Alerts (FDA + MAUDE)</h3>
      {loading ? (
        <p className="text-gray-500">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-green-600">✅ No alerts found for your tracked devices.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert, idx) => (
            <li key={idx} className="border-b pb-3 text-sm">
              <div className="flex justify-between items-center">
                <div className={`text-xs px-2 py-1 rounded-full ${badgeColor(alert.source)}`}>
                  {alert.source}
                </div>
                <div className={`text-xs font-semibold ${severityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>
              <div><strong>Device:</strong> {alert.device}</div>
              <div><strong>Issue:</strong> {alert.issue}</div>
              <div><strong>Date:</strong> {alert.date}</div>
              <div><strong>Description:</strong> {alert.summary}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
