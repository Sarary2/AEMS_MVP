import React, { useState, useEffect } from 'react';

export default function DeviceTracker() {
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem("trackedDevices");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error parsing trackedDevices from localStorage:", err);
      return [];
    }
  });

  // Save to localStorage when devices change
  useEffect(() => {
    localStorage.setItem("trackedDevices", JSON.stringify(devices));
  }, [devices]);

  const addDevice = (e) => {
    e.preventDefault();
    const form = e.target;
    const newDevice = form.device.value.trim();
    if (newDevice && !devices.includes(newDevice)) {
      setDevices([...devices, newDevice]);
    }
    form.reset();
  };

  const removeDevice = (deviceToRemove) => {
    setDevices(devices.filter(d => d !== deviceToRemove));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">🔧 Tracked Devices</h2>
      <form onSubmit={addDevice} className="mb-4 flex gap-2">
        <input
          name="device"
          type="text"
          placeholder="Enter device name"
          className="border p-2 flex-1 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {devices.length === 0 ? (
        <p className="text-gray-500">No devices added yet.</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((device, idx) => (
            <li key={idx} className="flex justify-between items-center border p-2 rounded">
              <span>{device}</span>
              <button
                onClick={() => removeDevice(device)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
