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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPageWithRetry(page, finalServiceKey, maxRetries = 5) {
  const url = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api?serviceKey=${finalServiceKey}&type=json&numOfRows=100&pageNo=${page}`;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      
      const resultCode = data?.response?.header?.resultCode;
      const resultMsg = data?.response?.header?.resultMsg;
      if (resultCode && resultCode !== '00') {
        throw new Error(`API Error ${resultCode}: ${resultMsg}`);
      }
      
      const itemsNode = data?.response?.body?.items ?? data?.response?.body?.item;
      let items = [];
      if (itemsNode) {
        if (Array.isArray(itemsNode)) {
          items = itemsNode;
        } else if (itemsNode.item) {
          items = Array.isArray(itemsNode.item) ? itemsNode.item : [itemsNode.item];
        }
      }
      return items;
    } catch (err) {
      console.log(`⚠️ Page ${page} (Attempt ${attempt}/${maxRetries}) failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(1500 * attempt); // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

async function downloadFast() {
  const env = loadEnv();
  const apiKey = (env.DATA_GO_KR_API_KEY || '').replace(/^['"]|['"]$/g, '').trim();
  if (!apiKey) {
    console.error('❌ Error: DATA_GO_KR_API_KEY not found in .env');
    return;
  }
  const finalServiceKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);
  
  console.log('🏁 Starting high-speed chunked downloader for all parking lots from data.go.kr...');
  const start = Date.now();
  
  // Total count is 18527. With size 100, we have 186 pages.
  const totalPages = 186;
  const allItems = [];
  const concurrencyLimit = 8; // Fetch 8 pages in parallel to stay safe but fast
  
  // Create an array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Process in batches
  for (let i = 0; i < pages.length; i += concurrencyLimit) {
    const batch = pages.slice(i, i + concurrencyLimit);
    console.log(`📡 Fetching batch: pages ${batch[0]} ~ ${batch[batch.length - 1]}...`);
    
    const batchStart = Date.now();
    const promises = batch.map(page => 
      fetchPageWithRetry(page, finalServiceKey)
        .then(items => {
          return { page, items, success: true };
        })
        .catch(err => {
          console.error(`❌ Page ${page} failed completely:`, err.message);
          return { page, items: [], success: false };
        })
    );
    
    const results = await Promise.all(promises);
    const batchEnd = Date.now();
    
    let batchLoadedCount = 0;
    results.forEach(res => {
      if (res.success) {
        allItems.push(...res.items);
        batchLoadedCount += res.items.length;
      }
    });
    
    console.log(`✅ Batch complete in ${batchEnd - batchStart}ms. Loaded ${batchLoadedCount} items. (Total: ${allItems.length}/${18527})`);
    
    // Tiny sleep between batches to avoid server throttle
    await sleep(250);
  }
  
  console.log(`\n🎉 Download complete! Total raw records: ${allItems.length}`);
  
  // Filter and normalize
  const validLots = allItems
    .filter(item => item.latitude && item.longitude && item.prkplceNm)
    .map((item, idx) => {
      const basicTime = parseInt(item.basicTime || '0', 10);
      const basicFee = parseInt(item.basicCharge || '0', 10);
      const addUnitTime = parseInt(item.addUnitTime || '0', 10);
      const addUnitFee = parseInt(item.addUnitCharge || '0', 10);
      const dayFee = item.dayCharge ? parseInt(item.dayCharge, 10) : null;
      
      return {
        id: `api-prk-${idx}-${item.prkplceNm.replace(/\s+/g, '-')}`,
        name: item.prkplceNm,
        type: item.prkplceSe === '공영' ? 'public' : 'private',
        parkingType: item.prkplceType || '노외',
        address: item.rdnmadr || item.lnmadr || '소재지 정보 없음',
        totalSpaces: parseInt(item.prkcmprt || '0', 10),
        operatingDays: item.feedingDay || '평일+토요일+공휴일',
        weekdayStart: item.weekdayOperOpenHhmm || '00:00',
        weekdayEnd: item.weekdayOperColseHhmm || '23:59',
        satStart: item.satOperOpenHhmm || '00:00',
        satEnd: item.satOperCloseHhmm || '23:59',
        holidayStart: item.holidayOperOpenHhmm || '00:00',
        holidayEnd: item.holidayCloseOpenHhmm || item.holidayCloseHhmm || '23:59',
        feeType: item.chrgeInfo === '무료' ? '무료' : (item.chrgeInfo === '혼합' ? '혼합' : '유료'),
        basicTime,
        basicFee,
        addUnitTime,
        addUnitFee,
        dayFee: dayFee && dayFee > 0 ? dayFee : null,
        paymentMethod: item.pagemtMet || '신용카드',
        disabledSpaces: item.disabledPrkplceCo ? parseInt(item.disabledPrkplceCo, 10) > 0 : false,
        phone: item.phoneNumber || '정보 없음',
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        source: 'public_api'
      };
    });
    
  console.log(`📊 Valid normalized records with coordinates: ${validLots.length}`);
  
  // Write to public/data/parking_lots.json
  const dataDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const outFile = path.join(dataDir, 'parking_lots.json');
  fs.writeFileSync(outFile, JSON.stringify(validLots, null, 2), 'utf8');
  
  const end = Date.now();
  console.log(`💾 Saved ${validLots.length} records to: ${outFile}`);
  console.log(`⏱️ Total time elapsed: ${((end - start) / 1000).toFixed(2)} seconds`);
}

downloadFast();
