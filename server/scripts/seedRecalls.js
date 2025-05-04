import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recall from '../models/Recall.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
await Recall.insertMany([
  {
    device_name: 'Infusion Pump',
    recall_reason: 'Unexpected shutdown during use',
    recall_date: '2024-11-22',
    severity: 'high'
  },
  {
    device_name: 'Heart Monitor',
    recall_reason: 'Software bug causing false alarms',
    recall_date: '2024-12-01',
    severity: 'moderate'
  }
]);
console.log('✅ Recalls seeded');
await mongoose.disconnect();
