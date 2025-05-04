import express from 'express';
import User from '../models/User.js';
import AdverseEvent from '../models/AdverseEvent.js';
import axios from 'axios';

const router = express.Router();

router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user || !user.devices || user.devices.length === 0) return res.json([]);

    const trackedDevices = user.devices.map(d =>
      d.toLowerCase().replace(/(medical|system|device|inc|corp|ltd|technology)/gi, '').trim()
    );

    const fdaQuery = trackedDevices.map((d) => `"${d}"`).join(" OR ");
    let fdaAlerts = [];
    try {
      const response = await axios.get("https://api.fda.gov/device/event.json", {
        params: {
          search: `openfda.device_name:(${fdaQuery})`,
          limit: 10,
        },
      });
      fdaAlerts = (response.data.results || []).map((event) => {
        const device = event.device?.[0] || {};
        const openfda = device.openfda || {};
        return {
          source: 'FDA',
          device: device.brand_name || openfda.device_name?.[0] || "Unknown device",
          issue: event.event_type || "Unknown issue",
          severity: event.event_type === "Death" ? "major" : event.event_type === "Malfunction" ? "moderate" : "minor",
          date: event.date_received || event.date_of_event || "Unknown date",
          summary: event.mdr_text?.[0]?.text || "No description provided."
        };
      });
    } catch (fdaErr) {
      console.error("❌ FDA fetch error:", fdaErr.message);
    }

    const maudeAlerts = await AdverseEvent.find({
      $or: trackedDevices.map((device) => ({
        device_name: { $regex: new RegExp(device, "i") },
      })),
    }).limit(20);

    const formattedMaude = maudeAlerts.map((e) => {
      const issue = e.event_type || e["Event Type"] || "Unknown issue";
      return {
        source: 'MAUDE',
        device: e.device_name || e["Brand Name"] || "Unknown device",
        issue,
        severity: issue === "Death" ? "major" : issue === "Malfunction" ? "moderate" : "minor",
        date: e.date_received || e["Date Received"] || e.raw?.["Date Received"] || "Unknown date",
        summary: e.description || e["Event Text"] || e.raw?.["Event Text"] || "No description"
      };
    });

    const allAlerts = [...fdaAlerts, ...formattedMaude];
    res.json(allAlerts);
  } catch (err) {
    console.error("❌ Combined alert error:", err.message);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;

