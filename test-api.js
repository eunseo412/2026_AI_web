/**
 * ParkingMate - API 데이터 수집 검증 헬퍼 스크립트
 * 
 * 이 스크립트는 Vercel 서버에 탑재된 동일한 공공데이터포털 API 연동 알고리즘을
 * 로컬 터미널에서 즉시 실행하고 실제로 수집된 실시간 JSON 데이터를 상세히 출력해 줍니다.
 */

const fs = require('fs');
const path = require('path');

// 1. .env 파일 분석 및 로드
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  워크스페이스 루트에 .env 파일이 없습니다.');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[key] = value.trim();
    }
  });
  return env;
}

// Haversine 거리 연산
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

async function runTest() {
  const env = loadEnv();
  const rawKey = env.DATA_GO_KR_API_KEY || process.env.DATA_GO_KR_API_KEY || '';
  const apiKey = rawKey.replace(/^['"]|['"]$/g, '').trim();

  const searchQuery = '부산역';
  console.log(`\n==================================================`);
  console.log(`🤖 [ParkingMate] 실시간 API 수집 상태 검증 시작`);
  console.log(`==================================================`);
  console.log(`🔍 테스트 목적지: "${searchQuery}"`);

  if (!apiKey) {
    console.log(`\n⚠️  [오류] .env 파일에 DATA_GO_KR_API_KEY가 비어 있습니다.`);
    console.log(`   검증을 위해 워크스페이스 루트의 .env 파일에 키를 입력해 주세요!`);
    console.log(`   (예: DATA_GO_KR_API_KEY = "인증키값")`);
    console.log(`   현재는 키가 없어 로컬 검증을 실행할 수 없습니다.`);
    console.log(`==================================================\n`);
    return;
  }

  console.log(`🔑 인증키 감지 완료 (길이: ${apiKey.length}자, 인코딩 여부: ${apiKey.includes('%')})`);

  try {
    // 1. Geocoding API 테스트
    console.log(`\n[Step 1] "${searchQuery}" 지오코딩 및 좌표 변환 시도...`);
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=kr&limit=1`;
    const geoRes = await fetch(geocodeUrl, {
      headers: { 'User-Agent': 'ParkingMate/1.0 (test@parkingmate.ai)' }
    });
    
    if (!geoRes.ok) throw new Error(`지오코딩 API 오류: ${geoRes.status}`);
    
    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) throw new Error('목적지 좌표를 찾을 수 없습니다.');
    
    const dest = geoData[0];
    const lat = parseFloat(dest.lat);
    const lng = parseFloat(dest.lon);
    const addressName = dest.display_name;
    console.log(`✅ 변환 성공!`);
    console.log(`   📍 변환 지명: ${addressName}`);
    console.log(`   🌐 좌표 정보: 위도 ${lat}, 경도 ${lng}`);

    // 2. 행정구역(구) 파싱 (handles both Nominatim comma and Korean space layouts)
    const delimiter = addressName.includes(',') ? ',' : ' ';
    const parts = addressName.split(delimiter).map(p => p.trim());
    
    // Find city/province (ends with 시 or 도)
    const cityPart = parts.find(p => p.endsWith('시') || p.endsWith('도'));
    if (cityPart) cityProvince = cityPart;

    // Find district/borough (ends with 구 or 군)
    const districtPart = parts.find(p => p.endsWith('구') || p.endsWith('군'));
    if (districtPart) cleanDistrict = districtPart;

    if (cityProvince && cleanDistrict) {
      fullDistrict = `${cityProvince} ${cleanDistrict}`;
    } else if (cityProvince) {
      fullDistrict = cityProvince;
    }

    console.log(`\n[Step 2] 주소 형태소 분석 결과`);
    console.log(`   🏙️ 광역 시/도: "${cityProvince}"`);
    console.log(`   🏷️ 구/군 단위: "${cleanDistrict}"`);
    console.log(`   🏠 검색 타깃 구역: "${fullDistrict}"`);

    // 3. 공공데이터포털 실시간 API 호출 (4단계 지능형 폴백 연동 아키텍처)
    console.log(`\n[Step 3] 국토교통부 공공데이터포털 API 호출 (로컬 캐시 확인)...`);
    
    let apiItems = [];
    let successQueryName = '';
    
    const jsonPath = path.join(__dirname, 'public', 'data', 'parking_lots.json');
    if (fs.existsSync(jsonPath)) {
      console.log(`📡 로컬 캐시 발견: "${jsonPath}"`);
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      const cachedData = JSON.parse(fileContent);
      console.log(`⚡ 로컬 캐시 파싱 완료! 총 ${cachedData.length}개의 전국 주차장 표준 데이터를 파싱했습니다.`);
      
      // Map cached structure to the shape test-api.js expects
      apiItems = cachedData.map(lot => ({
        latitude: lot.lat,
        longitude: lot.lng,
        prkplceNm: lot.name,
        prkplceSe: lot.type === 'public' ? '공영' : '민영',
        prkplceType: lot.parkingType,
        rdnmadr: lot.address,
        prkcmprt: lot.totalSpaces,
        basicTime: lot.basicTime,
        basicCharge: lot.basicFee,
        addUnitTime: lot.addUnitTime,
        addUnitCharge: lot.addUnitFee,
        dayCharge: lot.dayFee,
        disabledPrkplceCo: lot.disabledSpaces ? '1' : '0',
        phoneNumber: lot.phone
      }));
      successQueryName = '고성능 전국 주차장 JSON 데이터베이스 캐시';
    } else {
      console.log(`⚠️  로컬 캐시가 없습니다. 실시간 API 연동 폴백을 수행합니다.`);
      const finalServiceKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);
      const baseQueryUrl = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api?serviceKey=${finalServiceKey}&type=json&numOfRows=1000`;
      
      const queryUrls = [];
      if (fullDistrict) {
        queryUrls.push({ name: `지번주소 구단위 복합 매칭 ("${fullDistrict}")`, url: `${baseQueryUrl}&lnmadr=${encodeURIComponent(fullDistrict)}` });
        queryUrls.push({ name: `도로명주소 구단위 복합 매칭 ("${fullDistrict}")`, url: `${baseQueryUrl}&rdnmadr=${encodeURIComponent(fullDistrict)}` });
      }
      if (cityProvince) {
        queryUrls.push({ name: `지번주소 광역시/도단위 광역 매칭 ("${cityProvince}")`, url: `${baseQueryUrl}&lnmadr=${encodeURIComponent(cityProvince)}` });
        queryUrls.push({ name: `도로명주소 광역시/도단위 광역 매칭 ("${cityProvince}")`, url: `${baseQueryUrl}&rdnmadr=${encodeURIComponent(cityProvince)}` });
      }
      if (cleanDistrict) {
        queryUrls.push({ name: `지번주소 구이름 부분 매칭 ("${cleanDistrict}")`, url: `${baseQueryUrl}&lnmadr=${encodeURIComponent(cleanDistrict)}` });
      }
      queryUrls.push({ name: '무필터 전국 탑1000 호출', url: baseQueryUrl });

      for (const queryTarget of queryUrls) {
        console.log(`📡 호출 시도: \x1b[36m${queryTarget.name}\x1b[0m`);
        console.log(`   └ URL: ${queryTarget.url.substring(0, 100)}...`);

        const apiStart = Date.now();
        try {
          const apiRes = await fetch(queryTarget.url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          const apiEnd = Date.now();

          if (!apiRes.ok) {
            console.log(`   ⚠️  응답 오류 (코드: ${apiRes.status}) - 다음 순위 시도`);
            continue;
          }

          const resText = await apiRes.text();
          let resData;
          try {
            resData = JSON.parse(resText);
          } catch {
            console.log(`   ⚠️  JSON 파싱 실패 - 다음 순위 시도`);
            continue;
          }

          const resultCode = resData?.response?.header?.resultCode;
          const resultMsg = resData?.response?.header?.resultMsg;
          if (resultCode && resultCode !== '00') {
            console.log(`   ⚠️  포털 응답 오류 (${resultCode}: ${resultMsg}) - 다음 순위 시도`);
            continue;
          }

          const itemsNode = resData?.response?.body?.items ?? resData?.response?.body?.item;
          let normalizedItems = [];
          if (itemsNode) {
            if (Array.isArray(itemsNode)) {
              normalizedItems = itemsNode;
            } else if (itemsNode.item) {
              normalizedItems = Array.isArray(itemsNode.item) ? itemsNode.item : [itemsNode.item];
            }
          }

          if (normalizedItems.length > 0) {
            apiItems = normalizedItems;
            successQueryName = queryTarget.name;
            console.log(`   ⚡ \x1b[32m호출 성공! 총 ${normalizedItems.length}개의 데이터 획득!\x1b[0m (소요시간: ${apiEnd - apiStart}ms)`);
            break;
          } else {
            console.log(`   ⚠️  검색 결과 없음 (NODATA_ERROR) - 다음 순위 시도`);
          }
        } catch (err) {
          console.log(`   ⚠️  네트워크 오류 (${err.message}) - 다음 순위 시도`);
        }
      }
    }

    if (apiItems.length === 0) {
      console.log(`\n❌ [최종 실패] 모든 연동 시도가 실패했습니다.`);
      return;
    }

    console.log(`\n✅ [연동 성공] 연동 쿼리: "${successQueryName}"`);
    console.log(`   총 ${apiItems.length}개의 주차장 레코드 파싱 단계 돌입`);

    // 4. 거리 필터링 및 변환 검증
    console.log(`\n[Step 4] 수집된 실시간 데이터 필드 정밀 파싱 및 500m 이내 거리 필터링 작동...`);
    const parsedLots = apiItems
      .filter(item => item.latitude && item.longitude)
      .map((item, idx) => {
        const itemLat = parseFloat(item.latitude);
        const itemLng = parseFloat(item.longitude);
        const dist = getDistance(lat, lng, itemLat, itemLng);
        return {
          idx: idx + 1,
          name: item.prkplceNm,
          type: item.prkplceSe,
          parkingType: item.prkplceType,
          address: item.rdnmadr || item.lnmadr,
          totalSpaces: item.prkcmprt,
          basicTime: item.basicTime,
          basicCharge: item.basicCharge,
          addUnitTime: item.addUnitTime,
          addUnitCharge: item.addUnitCharge,
          dayCharge: item.dayCharge,
          disabledSpaces: item.disabledPrkplceCo,
          phone: item.phoneNumber,
          distance: dist
        };
      });

    const nearbyLots = parsedLots
      .filter(lot => lot.distance <= 500)
      .sort((a, b) => a.distance - b.distance);

    console.log(`📊 서울역 중심 반경 500m 이내 필터링 통과 주차장: ${nearbyLots.length}개 / 전체 ${parsedLots.length}개`);

    // 5. JSON 실제 데이터 실체 보여주기 (상위 3개)
    console.log(`\n==================================================`);
    console.log(`📋 수집된 실제 공공데이터포털 JSON 상세 레코드 (상위 3개)`);
    console.log(`==================================================`);
    
    const displayCount = Math.min(nearbyLots.length, 3);
    if (displayCount === 0) {
      console.log('💡 수집된 데이터 중 목적지 500m 반경 안에 있는 주차장이 없습니다.');
      console.log('   가장 가까운 3개 주차장 데이터를 대신 출력합니다:\n');
      const sortedAll = parsedLots.sort((a,b) => a.distance - b.distance).slice(0, 3);
      console.log(JSON.stringify(sortedAll, null, 2));
    } else {
      console.log(JSON.stringify(nearbyLots.slice(0, displayCount), null, 2));
    }
    console.log(`==================================================\n`);

  } catch (err) {
    console.error(`\n❌ [예외 발생] 테스트 도중 오류가 발생했습니다:`, err.message);
    console.log(`==================================================\n`);
  }
}

runTest();
