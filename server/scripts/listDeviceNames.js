import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdverseEvent from '../models/AdverseEvent.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Group by unique device names and print them
    const devices = await AdverseEvent.distinct("device_name", { device_name: { $ne: null } });
    const sorted = devices.map(d => d.trim()).filter(Boolean).sort();

    console.log("📦 MAUDE device_name values:\n", sorted);
    console.log(`\n📊 Total unique device names: ${sorted.length}`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    mongoose.disconnect();
  });
