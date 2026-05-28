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

async function testParallel() {
  const env = loadEnv();
  const apiKey = (env.DATA_GO_KR_API_KEY || '').replace(/^['"]|['"]$/g, '').trim();
  if (!apiKey) {
    console.log('No API Key');
    return;
  }
  const finalServiceKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);
  
  console.log('🚀 Starting parallel fetch of all pages...');
  const start = Date.now();
  
  // Total count is 18527, so we need 19 pages of 1000 items each
  const totalPages = 19;
  const promises = [];
  
  for (let page = 1; page <= totalPages; page++) {
    const url = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api?serviceKey=${finalServiceKey}&type=json&numOfRows=1000&pageNo=${page}`;
    promises.push(
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Page ${page} failed: ${res.status}`);
          return res.json();
        })
        .then(data => {
          const itemsNode = data?.response?.body?.items ?? data?.response?.body?.item;
          let items = [];
          if (itemsNode) {
            if (Array.isArray(itemsNode)) {
              items = itemsNode;
            } else if (itemsNode.item) {
              items = Array.isArray(itemsNode.item) ? itemsNode.item : [itemsNode.item];
            }
          }
          console.log(`✅ Page ${page} loaded: ${items.length} items`);
          return items;
        })
        .catch(err => {
          console.error(`❌ Page ${page} error:`, err.message);
          return [];
        })
    );
  }
  
  const results = await Promise.all(promises);
  const allItems = results.flat();
  const end = Date.now();
  
  console.log(`\n=============================================`);
  console.log(`⏱️ Fetch completed in ${((end - start) / 1000).toFixed(2)} seconds`);
  console.log(`📊 Total items fetched: ${allItems.length}`);
  console.log(`=============================================`);
}

testParallel();
