import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const adverseEventSchema = new mongoose.Schema({}, { strict: false });
const AdverseEvent = mongoose.model('AdverseEvent', adverseEventSchema);

// ✅ Manually define headers because they’re not real headers in the file
const headers = [
  "Web Address",
  "Report Number",
  "Event Date",
  "Event Type",
  "Manufacturer",
  "Date Received",
  "Product Code",
  "Brand Name",
  "Device Problem",
  "Patient Problem",
  "PMA/PMN Number",
  "Exemption Number",
  "Number of Events",
  "Event Text"
];

const results = [];

fs.createReadStream('./maude_data copy.csv')
  .pipe(csv({ headers, separator: ';', skipLines: 1 })) // ⬅️ KEY FIX HERE
  .on('data', (row) => {
    const cleaned = {
      report_number: row['Report Number']?.trim(),
      event_type: row['Event Type']?.trim(),
      date_received: row['Date Received']?.trim(),
      manufacturer: row['Manufacturer']?.trim(),
      product_code: row['Product Code']?.trim(),
      device_name: row['Brand Name']?.trim(),
      description: row['Event Text']?.trim(),
    };
    results.push(cleaned);
  })
  .on('end', async () => {
    try {
      await AdverseEvent.deleteMany();
      await AdverseEvent.insertMany(results);
      console.log(`✅ Inserted ${results.length} cleaned records into MongoDB`);
      mongoose.disconnect();
    } catch (err) {
      console.error('❌ Error inserting records:', err);
      mongoose.disconnect();
    }
  });





