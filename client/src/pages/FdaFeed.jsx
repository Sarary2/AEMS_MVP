import React from 'react';

export default function FdaFeed({ alerts }) {
  return (
    <div>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, idx) => (
            <li key={idx} className="border-b pb-2 text-sm">
              <div><strong>Device:</strong> {alert.device}</div>
              <div><strong>Issue:</strong> {alert.issue}</div>
              <div><strong>Severity:</strong> {alert.severity}</div>
              <div><strong>Date:</strong> {alert.date}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No FDA alerts found.</p>
      )}
    </div>
  );
}
