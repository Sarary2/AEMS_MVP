import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

import admin from './config/firebaseAdmin.js';
import DeviceStats from './models/DeviceStats.js';
import User from './models/User.js';
import AdverseEvent from './models/AdverseEvent.js';

import classifiedDevicesRoute from './routes/classifiedDevices.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import RecallModel from './models/Recall.js';
import combinedAlertsRoute from './routes/combinedAlerts.js';



dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5001;


// ✅ Proper CORS setup (only once, and early)
app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true
}));
app.use(express.json());
app.use('/api/alerts', combinedAlertsRoute);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('AEMS backend is running!');
});

// ✅ OpenFDA Alerts Route
app.get("/fda/alerts/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user || !user.devices || user.devices.length === 0) return res.json([]);

    // Step 1: Normalize device names
    const trackedDevices = user.devices.map(d =>
      d.toLowerCase()
        .replace(/(medical|system|device|inc|corp|ltd|technology)/gi, '') // remove filler
        .trim()
    );

    // Step 2: Create query string
    const query = trackedDevices.map((d) => `"${d}"`).join(" OR ");
    console.log("🔍 FDA Query:", query);

    // Step 3: Call FDA API
    const response = await axios.get("https://api.fda.gov/device/event.json", {
      params: {
        search: `openfda.device_name:(${query})`,
        limit: 10,
      },
    });

    // Step 4: Format alerts
    const alerts = (response.data.results || []).map((event) => {
      const device = event.device?.[0] || {};
      const openfda = device.openfda || {};
      return {
        device: device.brand_name || openfda.device_name?.[0] || "Unknown device",
        issue: event.event_type || "Unknown issue",
        severity: event.event_type === "Death" ? "major" : event.event_type === "Malfunction" ? "moderate" : "minor",
        date: event.date_received || event.date_of_event || "Unknown date",
        summary: event.mdr_text?.[0]?.text || "No description provided."
      };
    });

    res.json(alerts);
  } catch (err) {
    console.error("❌ FDA fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch FDA alerts" });
  }
});


// ✅ MAUDE Alerts Route
app.get("/maude/alerts/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user || !user.devices || user.devices.length === 0) return res.json([]);

    // Normalize device names
    const tracked = user.devices.map((d) => 
      d.toLowerCase()
        .replace(/(medical|device|system|inc|corp|ltd)/gi, '')
        .trim()
    );

    console.log("🔍 MAUDE search terms:", tracked);

    // Perform regex query
    const alerts = await AdverseEvent.find({
      $or: tracked.map((device) => ({
        device_name: { $regex: new RegExp(device, "i") },
      })),
    }).limit(20);

    const formatted = alerts.map((e) => {
      const issue = e.event_type || e["Event Type"] || "Unknown issue";
      return {
        device: e.device_name || e["Brand Name"] || "Unknown device",
        issue,
        problem: e.problem || e["Device Problem"] || e.raw?.["Device Problem"] || "Unknown problem",
        manufacturer: e.manufacturer || e["Manufacturer"] || e.raw?.["Manufacturer"] || "Unknown manufacturer",
        date: e.date_received || e["Date Received"] || e.raw?.["Date Received"] || "Unknown date",
        description: e.description || e["Event Text"] || e.raw?.["Event Text"] || "No description",
        severity: issue === "Death" ? "major" : issue === "Malfunction" ? "moderate" : "minor",
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ MAUDE fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch MAUDE alerts" });
  }
});


// ✅ Firebase-Protected Test Route
app.get('/protected', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Missing token');

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.send(`Hello, ${decoded.email}`);
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

// ✅ Device Classification Routes
app.get('/api/devices/risk', async (req, res) => {
  try {
    const { level, name } = req.query;
    const filter = {};
    if (level) filter.risk_level = level;
    if (name) filter.device_name = new RegExp(name, "i");

    const stats = await DeviceStats.find(filter).sort({ event_count: -1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch device risk data" });
  }
});

// ✅ Route Registration
app.use('/devices', classifiedDevicesRoute);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Add Recalls Route
app.get('/api/recalls', async (req, res) => {
  try {
    // Replace with actual model for recalls (this is just an example)
    const recalls = await RecallModel.find().limit(10);
    res.json(recalls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recalls' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
