import mongoose from 'mongoose';

const recallSchema = new mongoose.Schema({
  device_name: String,
  recall_reason: String,
  recall_date: String,
  severity: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' }
});

export default mongoose.model('Recall', recallSchema);
