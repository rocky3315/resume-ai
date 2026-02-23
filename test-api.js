const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.DEEPSEEK_API_KEY;
console.log('API Key exists:', !!apiKey);
console.log('API Key prefix:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');

const data = JSON.stringify({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 10
});

const options = {
  hostname: 'api.deepseek.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response:', body.substring(0, 500));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
