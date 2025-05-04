import express from 'express';
import DeviceStats from '../models/DeviceStats.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the env from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });


// GET /devices/classified
router.get('/classified', async (req, res) => {
  try {
    const devices = await DeviceStats.find().sort({ event_count: -1 });
    res.json(devices);
  } catch (err) {
    console.error('❌ Error fetching classified devices:', err.message);
    res.status(500).json({ error: 'Failed to fetch classified devices' });
  }
});

export default router;
