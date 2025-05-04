import { useEffect, useState } from 'react';
import { fetchDeviceStats } from '../utils/fetchDeviceStats';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = {
  low: '#10b981',
  moderate: '#facc15',
  high: '#ef4444',
};

export default function RiskPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDeviceStats().then((devices) => {
      const safe = devices.filter(d => d.risk_level === 'low').length;
      const warning = devices.filter(d => d.risk_level === 'moderate').length;
      const critical = devices.filter(d => d.risk_level === 'high').length;

      setData([
        { name: 'Safe', value: safe, level: 'low' },
        { name: 'Warning', value: warning, level: 'moderate' },
        { name: 'Critical', value: critical, level: 'high' },
      ]);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">🧠 Risk Level Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.level]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
