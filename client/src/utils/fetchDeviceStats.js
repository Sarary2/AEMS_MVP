// src/utils/fetchDeviceStats.js
export async function fetchDeviceStats() {
    try {
      const response = await fetch('http://localhost:5001/api/devices/risk');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (err) {
      console.error('❌ Error fetching device stats:', err);
      return [];
    }
  }
  