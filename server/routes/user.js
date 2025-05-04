import express from 'express';
import UserDevice from '../models/UserDevice.js';
import Alert from '../models/Alert.js';
import { firebaseAuth } from '../middleware/firebaseAuth.js';

const router = express.Router();

// ✅ Apply Firebase Auth middleware to all routes
router.use(firebaseAuth);

// ✅ Track a device
router.post('/devices', async (req, res) => {
  const { uid } = req.user;
  const { deviceId } = req.body;

  if (!deviceId) return res.status(400).json({ message: 'Device ID is required.' });

  try {
    await UserDevice.findOneAndUpdate(
      { userId: uid, deviceId },
      { userId: uid, deviceId },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Device tracked.' });
  } catch (err) {
    res.status(500).json({ error: 'Error tracking device.', details: err.message });
  }
});

// ✅ Get all tracked devices
router.get('/devices', async (req, res) => {
  const { uid } = req.user;

  try {
    const devices = await UserDevice.find({ userId: uid });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tracked devices.', details: err.message });
  }
});

// ✅ Untrack a device
router.delete('/devices/:deviceId', async (req, res) => {
  const { uid } = req.user;
  const { deviceId } = req.params;

  try {
    await UserDevice.deleteOne({ userId: uid, deviceId });
    res.status(200).json({ message: 'Device untracked.' });
  } catch (err) {
    res.status(500).json({ error: 'Error untracking device.', details: err.message });
  }
});

// ✅ Get user alerts
router.get('/alerts', async (req, res) => {
  const { uid } = req.user;

  try {
    const alerts = await Alert.find({ userId: uid }).sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching alerts.', details: err.message });
  }
});

export default router;
