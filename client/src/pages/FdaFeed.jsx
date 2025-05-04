import React from 'react';

export default function FdaFeed({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return <p className="text-green-600">✅ No alerts for your tracked devices.</p>;
  }

  return (
    <ul className="space-y-4">
      {alerts.map((alert, idx) => (
        <li key={idx} className="border p-4 bg-white rounded shadow text-sm">
          <div className="text-xs text-gray-500">📡 Source: {alert.source}</div>
          <div><strong>Device:</strong> {alert.device}</div>
          <div><strong>Issue:</strong> {alert.issue}</div>
          <div><strong>Severity:</strong> {alert.severity}</div>
          <div><strong>Date:</strong> {alert.date}</div>
          <div><strong>Summary:</strong> {alert.summary}</div>
        </li>
      ))}
    </ul>
  );
}


