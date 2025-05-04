// src/components/Sidebar.jsx
import { Home, Activity, RefreshCcw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
  { label: 'Events', icon: <Activity size={18} />, path: '/events' },
  { label: 'Recalls', icon: <RefreshCcw size={18} />, path: '/recalls' },
  { label: 'Settings', icon: <Settings size={18} />, path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-blue-800 text-white h-screen sticky top-0">
      <div className="text-xl font-bold py-6 px-4 tracking-wide border-b border-blue-700">
        AEMS
      </div>
      <nav className="px-4 py-6 space-y-4">
        {navItems.map(({ label, icon, path }) => (
          <Link
            key={label}
            to={path}
            className="flex items-center gap-3 text-sm font-medium hover:bg-blue-700 px-3 py-2 rounded transition"
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
