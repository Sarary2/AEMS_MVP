// src/components/FdaFeed.jsx
import { useEffect, useState } from 'react';

export default function FdaFeed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/fda/search?q=infusion pump&limit=5')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching FDA data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-gray-500">Loading latest FDA events...</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event, idx) => (
            <li key={idx} className="border-b pb-2 text-sm">
              <div><strong>Brand:</strong> {event.brand_name}</div>
              <div><strong>Type:</strong> {event.event_type}</div>
              <div><strong>Date:</strong> {event.date}</div>
              <div><strong>Summary:</strong> {event.summary || "No description available."}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
