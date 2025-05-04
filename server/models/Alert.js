import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  message: { type: String, required: true },
  alertType: { type: String, default: 'risk-update' }, // future-proof
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
