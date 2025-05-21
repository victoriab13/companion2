const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'addff671-63f0-43b0-a062-18392af6bb37';
const AGENT_ID = 'f9f0c202-6ba0-42c7-a66f-9a6f0a94f8e7';

app.post('/api/vapi', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch(`https://api.vapi.ai/v1/agents/${AGENT_ID}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));