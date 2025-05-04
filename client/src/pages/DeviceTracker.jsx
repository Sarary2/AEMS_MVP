import React, { useState, useEffect } from 'react';
import { getToken } from '../utils/getToken'; // This should return the Firebase token.

export default function DeviceTracker() {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    async function fetchDevices() {
      const token = await getToken(); // Get the token for authentication
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5001/api/devices', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDevices(data); // Update devices state with the fetched data
        } else {
          console.error('Failed to fetch devices');
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }

    fetchDevices();
  }, []);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
  
    const token = await getToken();
    try {
      await fetch('http://localhost:5001/api/user/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId: deviceName }),
      });
      setDevices([...devices, deviceName.trim()]);
      setDeviceName('');
    } catch (err) {
      console.error('Error adding device:', err);
    }
  };
  
  const handleRemoveDevice = async (device) => {
    const token = await getToken();
    try {
      await fetch(`http://localhost:5001/api/user/devices/${device}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevices(devices.filter((d) => d !== device));
    } catch (err) {
      console.error('Error removing device:', err);
    }
  };
  

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">🔧 Tracked Devices</h2>
      <form onSubmit={handleAddDevice} className="mb-4 flex gap-2">
        <input
          name="device"
          type="text"
          placeholder="Enter device name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="border p-2 flex-1 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {devices.length === 0 ? (
        <p className="text-gray-500">No devices found.</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((device, idx) => (
            <li key={idx} className="flex justify-between items-center border p-2 rounded">
              <span>{device}</span>
              <button
                onClick={() => handleRemoveDevice(device)}
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
