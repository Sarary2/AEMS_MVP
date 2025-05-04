// src/utils/fetchEventCounts.js
export async function fetchEventCounts(email) {
    try {
      const res = await fetch(`http://localhost:5001/maude/alerts/${email}`);
      const raw = await res.json();
  
      const grouped = raw.reduce((acc, event) => {
        const date = event.date?.slice(0, 10); // YYYY-MM-DD
        if (!date) return acc;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const formatted = Object.entries(grouped).map(([date, events]) => ({
        date,
        events,
      }));
  
      return formatted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (err) {
      console.error("❌ Error fetching event counts:", err);
      return [];
    }
  }
  