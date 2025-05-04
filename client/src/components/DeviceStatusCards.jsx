import { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Server } from 'lucide-react';
import { fetchDeviceStats } from '../utils/fetchDeviceStats';

export default function DeviceStatusCards() {
  const [stats, setStats] = useState({ total: 0, safe: 0, warning: 0, critical: 0 });

  useEffect(() => {
    fetchDeviceStats().then((data) => {
      const safe = data.filter(d => d.risk_level === 'low').length;
      const warning = data.filter(d => d.risk_level === 'moderate').length;
      const critical = data.filter(d => d.risk_level === 'high').length;
      setStats({
        total: data.length,
        safe,
        warning,
        critical,
      });
    });
  }, []);

  const boxes = [
    { label: 'Total Devices', count: stats.total, icon: <Server size={20} />, bg: 'bg-blue-100 text-blue-700' },
    { label: 'Safe', count: stats.safe, icon: <ShieldCheck size={20} />, bg: 'bg-green-100 text-green-700' },
    { label: 'Warning', count: stats.warning, icon: <AlertTriangle size={20} />, bg: 'bg-yellow-100 text-yellow-800' },
    { label: 'Critical', count: stats.critical, icon: <AlertOctagon size={20} />, bg: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {boxes.map(({ label, count, icon, bg }) => (
        <div key={label} className={`rounded-lg p-4 shadow ${bg}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{label}</div>
            {icon}
          </div>
          <div className="mt-2 text-2xl font-bold">{count}</div>
        </div>
      ))}
    </div>
  );
}

