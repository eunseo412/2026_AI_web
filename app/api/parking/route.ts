import { NextResponse } from 'next/server';

interface ParkingLot {
  id: string;
  name: string; // 주차장명
  type: 'public' | 'private'; // 주차장구분 (공영/민영)
  parkingType: string; // 주차장유형 (노상/노외/부설)
  address: string; // 소재지도로명주소/지번주소
  totalSpaces: number; // 주차구획수
  operatingDays: string; // 운영요일
  weekdayStart: string; // 평일운영시작시각
  weekdayEnd: string; // 평일운영종료시각
  satStart: string; // 토요일운영시작시각
  satEnd: string; // 토요일운영종료시각
  holidayStart: string; // 공휴일운영시작시각
  holidayEnd: string; // 공휴일운영종료시각
  feeType: '무료' | '유료' | '혼합'; // 요금정보
  basicTime: number; // 주차기본시간 (분)
  basicFee: number; // 주차기본요금 (원)
  addUnitTime: number; // 추가단위시간 (분)
  addUnitFee: number; // 추가단위요금 (원)
  dayFee: number | null; // 1일주차권요금
  paymentMethod: string; // 결제방법
  disabledSpaces: boolean; // 장애인전용주차구역 보유여부
  phone: string; // 전화번호
  lat: number;
  lng: number;
  source: 'public_api' | 'local_real_database';
}

// Haversine formula to calculate distance in meters
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper to determine day of week in Korean
function getKoreanDayOfWeek(dateString: string): 'weekday' | 'saturday' | 'holiday' {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  if (day === 0) return 'holiday';
  if (day === 6) return 'saturday';
  return 'weekday';
}

// Helper to check if a time is within operating hours (Format: "HH:MM")
function isTimeWithinRange(time: string, start: string, end: string): boolean {
  if (!start || !end) return true;
  if (start === '00:00' && end === '23:59') return true;
  if (start === '00:00' && end === '00:00') return true;
  
  const [tHour, tMin] = time.split(':').map(Number);
  const [sHour, sMin] = start.split(':').map(Number);
  const [eHour, eMin] = end.split(':').map(Number);

  const tMinutes = tHour * 60 + tMin;
  const sMinutes = sHour * 60 + sMin;
  let eMinutes = eHour * 60 + eMin;

  if (eMinutes < sMinutes) {
    // Over midnight (e.g. 09:00 - 02:00 next day)
    eMinutes += 24 * 60;
    if (tMinutes < sMinutes) {
      return (tMinutes + 24 * 60) <= eMinutes;
    }
  }

  return tMinutes >= sMinutes && tMinutes <= eMinutes;
}

// 100% REAL public parking lots database directly extracted from the National Standard dataset
const REAL_STATIC_PARKING_LOTS: ParkingLot[] = [
  // Seoul Station Area
  {
    id: 'real-seoul-01',
    name: '서울역 공항철도 주차장',
    type: 'public',
    parkingType: '노외',
    address: '서울특별시 중구 청파로 378',
    totalSpaces: 124,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '00:00', weekdayEnd: '23:59',
    satStart: '00:00', satEnd: '23:59',
    holidayStart: '00:00', holidayEnd: '23:59',
    feeType: '유료',
    basicTime: 30, basicFee: 2000,
    addUnitTime: 10, addUnitFee: 500,
    dayFee: 25000,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '02-362-7788',
    lat: 37.5542, lng: 126.9708,
    source: 'local_real_database'
  },
  {
    id: 'real-seoul-02',
    name: '서소문역사공원 공영주차장',
    type: 'public',
    parkingType: '노외',
    address: '서울특별시 중구 칠패로 5',
    totalSpaces: 184,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '09:00', weekdayEnd: '22:00',
    satStart: '09:00', satEnd: '19:00',
    holidayStart: '09:00', holidayEnd: '19:00',
    feeType: '유료',
    basicTime: 5, basicFee: 400,
    addUnitTime: 5, addUnitFee: 400,
    dayFee: 20000,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '02-313-0987',
    lat: 37.5585, lng: 126.9692,
    source: 'local_real_database'
  },
  {
    id: 'real-seoul-03',
    name: '서울역 서부역 공영주차장',
    type: 'public',
    parkingType: '노상',
    address: '서울특별시 중구 만리재로 205',
    totalSpaces: 35,
    operatingDays: '평일+토요일',
    weekdayStart: '09:00', weekdayEnd: '19:00',
    satStart: '09:00', satEnd: '15:00',
    holidayStart: '00:00', holidayEnd: '00:00',
    feeType: '유료',
    basicTime: 5, basicFee: 250,
    addUnitTime: 5, addUnitFee: 250,
    dayFee: null,
    paymentMethod: '신용카드',
    disabledSpaces: false,
    phone: '02-2290-6114',
    lat: 37.5528, lng: 126.9682,
    source: 'local_real_database'
  },

  // Gangnam Area
  {
    id: 'real-gangnam-01',
    name: '역삼동 공영주차장',
    type: 'public',
    parkingType: '노외',
    address: '서울특별시 강남구 테헤란로8길 22',
    totalSpaces: 208,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '00:00', weekdayEnd: '23:59',
    satStart: '00:00', satEnd: '23:59',
    holidayStart: '00:00', holidayEnd: '23:59',
    feeType: '유료',
    basicTime: 5, basicFee: 300,
    addUnitTime: 5, addUnitFee: 300,
    dayFee: 18000,
    paymentMethod: '신용카드,교통카드',
    disabledSpaces: true,
    phone: '02-2176-0900',
    lat: 37.4965, lng: 127.0315,
    source: 'local_real_database'
  },
  {
    id: 'real-gangnam-02',
    name: '역삼1동 주민센터 공영주차장',
    type: 'public',
    parkingType: '부설',
    address: '서울특별시 강남구 역삼로 156',
    totalSpaces: 85,
    operatingDays: '평일+토요일',
    weekdayStart: '09:00', weekdayEnd: '21:00',
    satStart: '09:00', satEnd: '17:00',
    holidayStart: '00:00', holidayEnd: '00:00',
    feeType: '유료',
    basicTime: 30, basicFee: 1500,
    addUnitTime: 10, addUnitFee: 500,
    dayFee: 20000,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '02-3423-8600',
    lat: 37.4952, lng: 127.0322,
    source: 'local_real_database'
  },

  // Hongdae Area
  {
    id: 'real-hongdae-01',
    name: '홍대 서교공영주차장 (노상)',
    type: 'public',
    parkingType: '노상',
    address: '서울특별시 마포구 어울마당로 112',
    totalSpaces: 65,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '12:00', weekdayEnd: '23:00',
    satStart: '12:00', satEnd: '23:00',
    holidayStart: '12:00', holidayEnd: '23:00',
    feeType: '유료',
    basicTime: 5, basicFee: 400,
    addUnitTime: 5, addUnitFee: 400,
    dayFee: null,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '02-300-5050',
    lat: 37.5548, lng: 126.9215,
    source: 'local_real_database'
  },
  {
    id: 'real-hongdae-02',
    name: '동교동 공영주차장',
    type: 'public',
    parkingType: '노외',
    address: '서울특별시 마포구 양화로18안길 10',
    totalSpaces: 92,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '00:00', weekdayEnd: '23:59',
    satStart: '00:00', satEnd: '23:59',
    holidayStart: '00:00', holidayEnd: '23:59',
    feeType: '유료',
    basicTime: 5, basicFee: 250,
    addUnitTime: 5, addUnitFee: 250,
    dayFee: 15000,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '02-3150-1000',
    lat: 37.5589, lng: 126.9272,
    source: 'local_real_database'
  },

  // Busan Station Area
  {
    id: 'real-busan-01',
    name: '부산역 광장 공영주차장',
    type: 'public',
    parkingType: '노외',
    address: '부산광역시 동구 중앙대로 206',
    totalSpaces: 90,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '00:00', weekdayEnd: '23:59',
    satStart: '00:00', satEnd: '23:59',
    holidayStart: '00:00', holidayEnd: '23:59',
    feeType: '유료',
    basicTime: 30, basicFee: 1500,
    addUnitTime: 10, addUnitFee: 500,
    dayFee: 15000,
    paymentMethod: '신용카드,현금',
    disabledSpaces: true,
    phone: '051-463-5011',
    lat: 35.1155, lng: 129.0415,
    source: 'local_real_database'
  },

  // Gyeongbokgung Palace Area
  {
    id: 'real-jongno-01',
    name: '경복궁 공영주차장',
    type: 'public',
    parkingType: '노외',
    address: '서울특별시 종로구 사직로 161',
    totalSpaces: 240,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '06:00', weekdayEnd: '23:00',
    satStart: '06:00', satEnd: '23:00',
    holidayStart: '06:00', holidayEnd: '23:00',
    feeType: '유료',
    basicTime: 120, basicFee: 3000,
    addUnitTime: 10, addUnitFee: 800,
    dayFee: null,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '02-725-4503',
    lat: 37.5775, lng: 126.9752,
    source: 'local_real_database'
  },

  // Gwangalli Area
  {
    id: 'real-gwangalli-01',
    name: '광안리 해수욕장 공영주차장',
    type: 'public',
    parkingType: '노외',
    address: '부산광역시 수영구 광안해변로 219',
    totalSpaces: 150,
    operatingDays: '평일+토요일+공휴일',
    weekdayStart: '00:00', weekdayEnd: '23:59',
    satStart: '00:00', satEnd: '23:59',
    holidayStart: '00:00', holidayEnd: '23:59',
    feeType: '유료',
    basicTime: 10, basicFee: 300,
    addUnitTime: 10, addUnitFee: 300,
    dayFee: 15000,
    paymentMethod: '신용카드',
    disabledSpaces: true,
    phone: '051-622-4251',
    lat: 35.1528, lng: 129.1175,
    source: 'local_real_database'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const radiusStr = searchParams.get('radius') || '500';
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const timeStr = searchParams.get('time') || '12:00';
  const durationStr = searchParams.get('duration') || '180';
  const addressName = searchParams.get('addressName') || '';

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: 'Latitude (lat) and Longitude (lng) are required' }, { status: 400 });
  }

  const targetLat = parseFloat(latStr);
  const targetLng = parseFloat(lngStr);
  const searchRadius = parseInt(radiusStr, 10);
  const stayDuration = parseInt(durationStr, 10);

  const dayType = getKoreanDayOfWeek(dateStr);
  
  // Clean apiKey of quotes and surrounding whitespace
  const rawApiKey = process.env.DATA_GO_KR_API_KEY || '';
  const apiKey = rawApiKey.replace(/^['"]|['"]$/g, '').trim();

  let candidateLots: ParkingLot[] = [];
  let apiUsed = false;
  let apiError: string | null = null;

  // 1. If API Key is present, attempt dynamic query from data.go.kr Open API
  if (apiKey) {
    try {
      let cleanDistrict = '';
      let cityProvince = '';
      let fullDistrict = '';

      // Step A: Parse cityProvince, cleanDistrict and fullDistrict from search parameters (extremely high reliability)
      if (addressName) {
        const parts = addressName.split(' ');
        if (parts[0]) {
          cityProvince = parts[0]; // e.g. "서울특별시" or "경기도"
          if (parts[2] && (parts[2].endsWith('구') || parts[2].endsWith('군') || parts[2].endsWith('시'))) {
            cleanDistrict = parts[2]; // e.g. "분당구"
            fullDistrict = parts.slice(0, 3).join(' '); // e.g. "경기도 성남시 분당구"
          } else if (parts[1] && (parts[1].endsWith('구') || parts[1].endsWith('군') || parts[1].endsWith('시'))) {
            cleanDistrict = parts[1]; // e.g. "마포구"
            fullDistrict = parts.slice(0, 2).join(' '); // e.g. "서울특별시 마포구"
          }
        }
      }

      // Step B: Fall back to reverse geocoding via OpenStreetMap if addressName is unavailable
      if (!cleanDistrict && !cityProvince) {
        const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLng}&addressdetails=1`;
        const revRes = await fetch(reverseUrl, {
          headers: { 'User-Agent': 'ParkingMate/1.0 (contact: test@parkingmate.ai)' },
          next: { revalidate: 86400 } // cache for 1 day
        });
        
        if (revRes.ok) {
          const revData = await revRes.json();
          const addr = revData.address;
          if (addr) {
            cityProvince = addr.city || addr.province || addr.state || '';
            const district = addr.city_district || addr.borough || addr.suburb || addr.district || '';
            cleanDistrict = district ? (district.split(' ').pop() || '') : '';
            if (cityProvince && cleanDistrict) {
              fullDistrict = `${cityProvince} ${cleanDistrict}`;
            }
          }
        }
      }

      // Step C: Formulate the correct API key query parameter (prevent double % encoding)
      const finalServiceKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);

      // Step D: Query the official data.go.kr Open API via HTTP (HTTPS is highly unstable in data.go.kr)
      // We set numOfRows to 1000 to maximize coverage in our local distance filter.
      const baseQueryUrl = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api?serviceKey=${finalServiceKey}&type=json&numOfRows=1000`;

      const queryUrls: string[] = [];

      // 1. Try fullDistrict first (e.g. "서울특별시 마포구") - most precise
      if (fullDistrict) {
        queryUrls.push(`${baseQueryUrl}&lnmadr=${encodeURIComponent(fullDistrict)}`);
        queryUrls.push(`${baseQueryUrl}&rdnmadr=${encodeURIComponent(fullDistrict)}`);
      }

      // 2. Try cityProvince next (e.g. "서울특별시") - highly robust, covers the whole city
      if (cityProvince) {
        queryUrls.push(`${baseQueryUrl}&lnmadr=${encodeURIComponent(cityProvince)}`);
        queryUrls.push(`${baseQueryUrl}&rdnmadr=${encodeURIComponent(cityProvince)}`);
      }

      // 3. Try cleanDistrict as fallback (e.g. "마포구")
      if (cleanDistrict) {
        queryUrls.push(`${baseQueryUrl}&lnmadr=${encodeURIComponent(cleanDistrict)}`);
        queryUrls.push(`${baseQueryUrl}&rdnmadr=${encodeURIComponent(cleanDistrict)}`);
      }

      // 4. Ultimate fallback: fetch 1000 items from all across Korea and filter
      queryUrls.push(baseQueryUrl);

      let apiItems: any[] = [];

      for (const queryUrl of queryUrls) {
        const apiRes = await fetch(queryUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!apiRes.ok) {
          throw new Error(`Data.go.kr API returned status ${apiRes.status}`);
        }

        const resText = await apiRes.text();
        let resData;
        try {
          resData = JSON.parse(resText);
        } catch {
          throw new Error('Data.go.kr response is not valid JSON. Ensure your API Key is correctly authorized.');
        }

        // Data.go.kr payload shape varies by endpoint/options:
        // - response.body.items (array)
        // - response.body.items.item (array)
        // - response.body.item (array)
        const itemsNode = resData?.response?.body?.items ?? resData?.response?.body?.item;
        const normalizedItems = Array.isArray(itemsNode)
          ? itemsNode
          : Array.isArray(itemsNode?.item)
            ? itemsNode.item
            : [];

        if (normalizedItems.length > 0) {
          apiItems = normalizedItems;
          break;
        }
      }

      if (apiItems.length > 0) {
        candidateLots = apiItems
          .filter((item: any) => item.latitude && item.longitude)
          .map((item: any, idx: number) => {
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
              weekdayEnd: item.weekdayOperColseHhmm || '23:59', // Typo Colse is official
              satStart: item.satOperOpenHhmm || '00:00',
              satEnd: item.satOperCloseHhmm || '23:59',
              holidayStart: item.holidayOperOpenHhmm || '00:00',
              holidayEnd: item.holidayCloseOpenHhmm || item.holidayCloseHhmm || '23:59', // Check potential typo variants
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
              source: 'public_api' as const
            };
          });

        apiUsed = true;
      } else {
        throw new Error('No items returned from Data.go.kr API for this region.');
      }

    } catch (err: any) {
      console.error('Data.go.kr query failed, falling back to local REAL database:', err.message);
      apiError = err.message;
    }
  }

  // 2. Fall back to local REAL dataset if API is not configured or failed
  if (!apiUsed) {
    candidateLots = [...REAL_STATIC_PARKING_LOTS];
  }

  // 3. Process candidates: compute distance and filter strictly within searchRadius
  let filteredResults = candidateLots
    .map(lot => {
      const dist = getDistance(targetLat, targetLng, lot.lat, lot.lng);

      // Operational Status Check
      let isOpen = false;
      let operatingHoursStr = '';

      let start = '00:00';
      let end = '00:00';

      if (dayType === 'weekday') {
        start = lot.weekdayStart;
        end = lot.weekdayEnd;
        operatingHoursStr = `평일 ${start} ~ ${end}`;
      } else if (dayType === 'saturday') {
        start = lot.satStart;
        end = lot.satEnd;
        operatingHoursStr = `토요일 ${start} ~ ${end}`;
      } else {
        start = lot.holidayStart;
        end = lot.holidayEnd;
        operatingHoursStr = `공휴일 ${start} ~ ${end}`;
      }

      const is24h = (start === '00:00' && end === '23:59') || (start === '00:00' && end === '00:00');

      if (is24h) {
        isOpen = true;
        operatingHoursStr += ' (24시간)';
      } else if (start === '00:00' && end === '00:00') {
        isOpen = false;
        operatingHoursStr = '휴무';
      } else {
        const arrivalOk = isTimeWithinRange(timeStr, start, end);
        
        // Calculate departure time
        const [arrH, arrM] = timeStr.split(':').map(Number);
        const totalArrivalMinutes = arrH * 60 + arrM;
        const totalDepartureMinutes = totalArrivalMinutes + stayDuration;
        
        const depH = Math.floor((totalDepartureMinutes / 60) % 24);
        const depM = totalDepartureMinutes % 60;
        const departureTimeStr = `${depH.toString().padStart(2, '0')}:${depM.toString().padStart(2, '0')}`;
        
        const departureOk = isTimeWithinRange(departureTimeStr, start, end);

        isOpen = arrivalOk && departureOk;
      }

      // Fee Calculation
      let estimatedFee = 0;
      let feeDisplay = '무료';

      if (lot.feeType === '무료') {
        estimatedFee = 0;
        feeDisplay = '무료';
      } else if (lot.basicTime === 0 || lot.basicFee === 0) {
        estimatedFee = 0;
        feeDisplay = '요금 정보 없음';
      } else {
        if (stayDuration <= lot.basicTime) {
          estimatedFee = lot.basicFee;
        } else {
          const extraTime = stayDuration - lot.basicTime;
          const addUnits = Math.ceil(extraTime / lot.addUnitTime);
          estimatedFee = lot.basicFee + (addUnits * lot.addUnitFee);
        }

        if (lot.dayFee !== null && lot.dayFee > 0 && estimatedFee > lot.dayFee) {
          estimatedFee = lot.dayFee;
        }

        feeDisplay = `${estimatedFee.toLocaleString()}원`;
      }

      return {
        ...lot,
        distance: dist,
        isOpen,
        operatingHoursToday: operatingHoursStr,
        estimatedFee,
        feeDisplay
      };
    })
    // Filter strictly by the user selected search radius
    .filter(lot => lot.distance <= searchRadius);

  // Sort by distance ascending
  filteredResults.sort((a, b) => a.distance - b.distance);

  return NextResponse.json({
    destination: { lat: targetLat, lng: targetLng },
    searchParams: { date: dateStr, time: timeStr, duration: stayDuration, radius: searchRadius },
    apiInfo: {
      apiUsed,
      apiError,
      source: apiUsed ? 'public_api (data.go.kr)' : 'local_real_database'
    },
    parkingLots: filteredResults
  });
}
