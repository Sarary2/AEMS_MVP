import React, { useEffect, useState } from 'react';

export default function FdaFeed() {
  const [alerts, setAlerts] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      console.warn("No user email in localStorage — skipping FDA fetch.");
      return;
    }

    console.log("🔍 Fetching alerts for:", userEmail);

    fetch(`http://localhost:5001/fda/alerts/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ FDA Alerts:", data);
        setAlerts(data);
      })
      .catch(err => {
        console.error("❌ Failed to fetch FDA alerts:", err);
      });
  }, [userEmail]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">📢 FDA Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts found for your tracked devices.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert, index) => (
            <li key={index} className="border p-2 rounded bg-yellow-50">
              <strong>Device:</strong> {alert.device}<br />
              <strong>Issue:</strong> {alert.issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
