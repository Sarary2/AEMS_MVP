import mongoose from 'mongoose';

const adverseEventSchema = new mongoose.Schema({
  report_number: String,
  event_type: String,
  date_received: String,
  manufacturer: String,
  device_name: String,         // was ' Brand Name' in CSV
  description: String,         // from 'Event Text'
  raw: Object                  // optional: full original row
});

export default mongoose.model('AdverseEvent', adverseEventSchema);



