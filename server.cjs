const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// Correct way to use node-fetch v3 in CommonJS:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables for security
const API_KEY = process.env.API_KEY; // Your short key, e.g. 998f19f8-8ca6-4ff7-aeca-d09abf498ac5
const AGENT_ID = process.env.AGENT_ID;

function generateJwt() {
  const payload = {
    // Add orgId if required by Vapi, otherwise remove
    token: { tag: "private" }
  };
  return jwt.sign(payload, API_KEY, { algorithm: "HS256", expiresIn: "1h" });
}

app.post('/api/vapi', async (req, res) => {
  const { message } = req.body;
  try {
    const jwtToken = generateJwt();
    const response = await fetch('https://api.vapi.ai/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        query: message
      })
    });
    const data = await response.json();
    console.log('Vapi.ai response:', data); // Log the full response for debugging
    res.json(data);
  } catch (err) {
    console.error('Error in /api/vapi:', err); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));