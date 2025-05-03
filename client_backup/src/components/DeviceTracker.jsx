import { useState, useEffect } from 'react';
import axios from 'axios';

const DeviceTracker = ({ userEmail }) => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState('');

  // Get tracked devices from backend
  useEffect(() => {
    axios.get(`/api/user/devices/${userEmail}`)
      .then(res => setDevices(res.data.devices))
      .catch(err => console.error(err));
  }, [userEmail]);

  const addDevice = () => {
    if (!newDevice.trim()) return;
    axios.post('/api/user/devices/add', { email: userEmail, device: newDevice })
      .then(res => {
        setDevices(res.data.devices);
        setNewDevice('');
      })
      .catch(err => console.error(err));
  };

  const removeDevice = (deviceToRemove) => {
    axios.post('/api/user/devices/remove', { email: userEmail, device: deviceToRemove })
      .then(res => setDevices(res.data.devices))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-full max-w-md mx-auto bg-white">
      <h2 className="text-xl font-semibold mb-4">Tracked Devices</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter device name"
          value={newDevice}
          onChange={(e) => setNewDevice(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addDevice}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {devices.length === 0 ? (
        <p className="text-gray-500">No devices tracked yet.</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((device, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{device}</span>
              <button
                onClick={() => removeDevice(device)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceTracker;
