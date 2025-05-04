import express from 'express';
import Device from '../models/DeviceStats.js'; // assuming this is your main device model
import notifyUsersOnRiskChange from '../scripts/notifyUser.js';

const router = express.Router();

// ✅ Simple risk classifier (replace with real logic)
function classifyRisk(eventCount) {
  if (eventCount > 50) return 'high';
  if (eventCount > 20) return 'moderate';
  return 'low';
}

// ✅ Route: refresh classification + notify
router.get('/refresh-classification', async (req, res) => {
  try {
    const devices = await Device.find();

    for (const device of devices) {
      const oldRisk = device.riskLevel;
      const newRisk = classifyRisk(device.eventCount || 0);

      if (oldRisk !== newRisk) {
        device.riskLevel = newRisk;
        await device.save();
        await notifyUsersOnRiskChange(device.deviceId, oldRisk, newRisk);
      }
    }

    res.status(200).json({ message: 'Classification refreshed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refresh classification' });
  }
});

export default router;

