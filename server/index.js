require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/aems', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.get('/', (req, res) => res.send('✅ AEMS API is running'));

app.get('/fda/search', async (req, res) => {
  const keyword = req.query.q || 'infusion pump';
  const limit = req.query.limit || 5;
  try {
    const response = await axios.get('https://api.fda.gov/device/event.json', {
      params: { search: `device.generic_name:"${keyword}"`, limit },
    });

    const results = response.data.results.map(event => ({
      report_number: event.report_number,
      date: event.date_received,
      event_type: event.event_type,
      summary: event.event_description?.slice(0, 300),
      brand_name: event.device?.[0]?.brand_name || 'Unknown',
    }));

    res.json(results);
  } catch (err) {
    console.error('❌ FDA Fetch Error:', err.message);
    res.status(500).json({ message: 'Error fetching FDA data' });
  }
});

app.get('/fda/alerts/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.trackedDevices.length) return res.json([]);

    const results = [];
    for (const device of user.trackedDevices) {
      const response = await axios.get('https://api.fda.gov/device/event.json', {
        params: { search: `device.generic_name:"${device}"`, limit: 3 },
      });
      const parsed = response.data.results.map(event => ({
        device,
        report_number: event.report_number,
        event_type: event.event_type,
        summary: event.event_description?.slice(0, 300) || 'No summary provided.',
        date: event.date_received
      }));
      results.push(...parsed);
    }

    res.json(results);
  } catch (err) {
    console.error('❌ FDA alert fetch error:', err.message);
    res.status(500).json({ message: 'Error fetching alerts from FDA' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
