const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️ No .env file');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[key] = value.trim();
    }
  });
  return env;
}

async function checkTotal() {
  const env = loadEnv();
  const apiKey = (env.DATA_GO_KR_API_KEY || '').replace(/^['"]|['"]$/g, '').trim();
  if (!apiKey) {
    console.log('No API Key');
    return;
  }
  const finalServiceKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);
  const url = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api?serviceKey=${finalServiceKey}&type=json&numOfRows=1&pageNo=1`;
  
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Response headers/body summary:');
    console.log(JSON.stringify(data.response.header, null, 2));
    console.log('Total Count:', data.response.body.totalCount);
  } catch (err) {
    console.error('Error:', err);
  }
}

checkTotal();
