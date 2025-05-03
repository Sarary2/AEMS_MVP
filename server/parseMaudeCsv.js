import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Flexible schema for dynamic field mapping
const adverseEventSchema = new mongoose.Schema({}, { strict: false });
const AdverseEvent = mongoose.model('AdverseEvent', adverseEventSchema);

// ✅ Custom headers matching your MAUDE CSV structure
const headers = [
  "Web Address",           // A
  "Report Number",         // B
  "Event Date",            // C
  "Event Type",            // D
  "Label Manufacturer",    // E (ignored)
  "Manufacturer",          // F ✅
  "Date Received",         // G ✅ (used as event date)
  "Brand Code",            // H
  "Brand Name",            // I ✅ device_name
  "Device Problem",        // J ✅ PROBLEM
  "Patient Problem",       // K
  "PMA/PMN Number",        // L
  "Exemption Number",      // M
  "Number of Events",      // N
  "Event Text"             // O
];

const results = [];

fs.createReadStream('./maude_data copy.csv')  // Ensure file path is correct
  .pipe(csv({ headers, separator: ';', skipLines: 1 }))
  .on('data', (row) => {
    const cleaned = {
      report_number: row['Report Number']?.trim(),
      event_type: row['Event Type']?.trim(),
      date_received: row['Date Received']?.trim(),   // G
      manufacturer: row['Manufacturer']?.trim(),     // F
      product_code: row['Brand Code']?.trim(),       // H
      device_name: row['Brand Name']?.trim(),        // I
      problem: row['Device Problem']?.trim(),        // J ✅
      description: row['Event Text']?.trim(),        // O
      raw: row, // Optional: store full row for debugging if needed
    };

    results.push(cleaned);
  })
  .on('end', async () => {
    try {
      await AdverseEvent.deleteMany(); // ⚠️ Overwrites existing data
      await AdverseEvent.insertMany(results);
      console.log(`✅ Inserted ${results.length} cleaned records into MongoDB`);
      mongoose.disconnect();
    } catch (err) {
      console.error('❌ Error inserting records:', err);
      mongoose.disconnect();
    }
  });
