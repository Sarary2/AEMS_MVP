import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import admin from './config/firebaseAdmin.js';

import User from './models/User.js';
import AdverseEvent from './models/AdverseEvent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors());
app.use(express.json());

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

    const trackedDevices = user.devices.map((d) => d.toLowerCase().trim());
    const query = trackedDevices.map((d) => `"${d}"`).join(" OR ");

    const response = await axios.get("https://api.fda.gov/device/event.json", {
      params: { search: `device.generic_name:(${query})`, limit: 10 },
    });

    const alerts = response.data.results.map((event) => {
      let deviceName = "Unknown device";
      if (Array.isArray(event.devices) && event.devices.length > 0) {
        const names = event.devices
          .map((d) => d.generic_name || d.brand_name)
          .filter(Boolean);
        if (names.length > 0) deviceName = names.join(', ');
      }

      return {
        device: deviceName,
        issue: event.event_type || "Unknown issue",
        severity:
          event.event_type === "Death"
            ? "major"
            : event.event_type === "Malfunction"
            ? "moderate"
            : "minor",
        date: event.date_received || "Unknown date",
      };
    });

    res.json(alerts);
  } catch (err) {
    console.error("❌ FDA fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch FDA alerts" });
  }
});

// ✅ MAUDE Alerts Route (Fully Fixed)
app.get("/maude/alerts/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user || !user.devices || user.devices.length === 0) {
      return res.json([]);
    }

    const tracked = user.devices.map((d) => d.toLowerCase().trim());

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
        severity:
          issue === "Death"
            ? "major"
            : issue === "Malfunction"
            ? "moderate"
            : "minor",
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

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
