import mongoose from 'mongoose';
import AdverseEvent from '../models/AdverseEvent.js';
import DeviceStats from '../models/DeviceStats.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the env from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ MongoDB connected');

const deviceCounts = {};

const events = await AdverseEvent.find({});
for (const event of events) {
  const device = event.device_name?.toLowerCase().trim();
  if (!device) continue;
  deviceCounts[device] = (deviceCounts[device] || 0) + 1;
}

const counts = Object.values(deviceCounts).sort((a, b) => a - b);
const low = counts[Math.floor(counts.length * 0.33)];
const high = counts[Math.floor(counts.length * 0.66)];

const getRiskLevel = (count) => {
  if (count > high) return 'high';
  if (count > low) return 'moderate';
  return 'low';
};

for (const [device, count] of Object.entries(deviceCounts)) {
  await DeviceStats.updateOne(
    { device_name: device },
    {
      $set: {
        event_count: count,
        risk_level: getRiskLevel(count),
        last_updated: new Date(),
      },
    },
    { upsert: true }
  );
}

console.log('✅ Device risk levels classified');
await mongoose.disconnect();
