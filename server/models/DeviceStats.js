import mongoose from 'mongoose';

const deviceStatsSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  device_name: { type: String },
  eventCount: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' }
});

const DeviceStats = mongoose.model('DeviceStats', deviceStatsSchema);
export default DeviceStats;
