// client/src/components/FdaFeed.jsx
// client/src/components/FdaFeed.jsx
import { useEffect, useState } from 'react';

export default function FdaFeed() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Fetch newest device adverse events (not filtered by "infusion pump")
    fetch('http://localhost:5001/fda/search?limit=5') // Removed q=infusion pump
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        console.log('📥 FDA data:', data);
        setEvents(data);
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setError('Failed to load FDA data');
      });
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-gray-500">No events found or still loading…</p>
      ) : (
        events.map((event, idx) => (
          <div key={idx} className="p-4 bg-white rounded shadow border">
            <h3 className="font-semibold text-blue-700">🆔 {event.report_number}</h3>
            <p><strong>Device:</strong> {event.brand_name}</p>
            <p><strong>Event Type:</strong> {event.event_type}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p className="text-sm mt-2 text-gray-600">
              {event.summary || 'No summary available.'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
