const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
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

async function testRows() {
  const env = loadEnv();
  const apiKey = (env.DATA_GO_KR_API_KEY || '').replace(/^['"]|['"]$/g, '').trim();
  const finalServiceKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);
  
  const sizes = [100, 200, 500];
  for (const size of sizes) {
    const start = Date.now();
    const url = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api?serviceKey=${finalServiceKey}&type=json&numOfRows=${size}&pageNo=1`;
    console.log(`📡 Fetching size ${size}...`);
    try {
      const res = await fetch(url);
      const data = await res.json();
      const end = Date.now();
      const items = data?.response?.body?.items || [];
      console.log(`✅ Size ${size} done: ${items.length || 0} items in ${end - start}ms`);
    } catch (err) {
      console.error(`❌ Size ${size} failed:`, err.message);
    }
  }
}

testRows();
