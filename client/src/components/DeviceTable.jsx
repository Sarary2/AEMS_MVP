import { useEffect, useState } from 'react';
import { fetchDeviceStats } from '../utils/fetchDeviceStats';

function getBadge(risk) {
  const levels = {
    low: 'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-700',
  };
  return levels[risk] || 'bg-gray-100 text-gray-700';
}

export default function DeviceTable() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDeviceStats().then(setDevices);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">📋 Tracked Devices Overview</h2>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="pb-2">Device</th>
            <th className="pb-2">Events</th>
            <th className="pb-2">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-2">{d.device_name}</td>
              <td className="py-2">{d.event_count}</td>
              <td className="py-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadge(d.risk_level)}`}>
                  {d.risk_level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  