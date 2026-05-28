import { NextResponse } from 'next/server';

// Local high-quality coordinate directory for popular Korean destinations (seamless testing)
const KNOWN_DESTINATIONS: Record<string, { lat: number; lng: number; displayName: string }> = {
  '서울역': { lat: 37.5559, lng: 126.9723, displayName: '서울특별시 중구 한강대로 405 (서울역)' },
  '강남역': { lat: 37.4979, lng: 127.0276, displayName: '서울특별시 강남구 강남대로 396 (강남역)' },
  '홍대': { lat: 37.5575, lng: 126.9244, displayName: '서울특별시 마포구 양화로 160 (홍대입구역)' },
  '홍대입구역': { lat: 37.5575, lng: 126.9244, displayName: '서울특별시 마포구 양화로 160 (홍대입구역)' },
  '부산역': { lat: 35.1152, lng: 129.0422, displayName: '부산광역시 동구 중앙대로 206 (부산역)' },
  '경복궁': { lat: 37.5796, lng: 126.9770, displayName: '서울특별시 종로구 사직로 161 (경복궁)' },
  '광안리': { lat: 35.1532, lng: 129.1189, displayName: '부산광역시 수영구 광안해변로 219 (광안리해수욕장)' },
  '광안리해수욕장': { lat: 35.1532, lng: 129.1189, displayName: '부산광역시 수영구 광안해변로 219 (광안리해수욕장)' },
  '인천공항': { lat: 37.4602, lng: 126.4407, displayName: '인천광역시 중구 공항로 272 (인천국제공항)' },
  '제주공항': { lat: 33.5104, lng: 126.4914, displayName: '제주특별자치도 제주시 공항로 2 (제주국제공항)' },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  // 1. Check local offline registry first for fast responses and reliable offline coding
  const lowercaseQuery = query.toLowerCase();
  for (const [key, val] of Object.entries(KNOWN_DESTINATIONS)) {
    if (lowercaseQuery.includes(key) || key.includes(lowercaseQuery)) {
      return NextResponse.json({
        lat: val.lat,
        lng: val.lng,
        displayName: val.displayName,
        source: 'local_database'
      });
    }
  }

  // 2. Fetch from OpenStreetMap Nominatim API
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=kr&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ParkingMate/1.0 (contact: test@parkingmate.ai)',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      },
      next: { revalidate: 86400 } // cache for 1 day
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned status ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const firstResult = data[0];
      return NextResponse.json({
        lat: parseFloat(firstResult.lat),
        lng: parseFloat(firstResult.lon),
        displayName: firstResult.display_name,
        source: 'openstreetmap_nominatim'
      });
    }

    // 3. Fallback to generating simulated coordinates in Seoul if search yields no results
    // Hash the query string to generate consistent pseudorandom coordinates around Seoul Station
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      hash = query.charCodeAt(i) + ((hash << 5) - hash);
    }
    const offsetLat = (Math.abs(hash % 100) / 1000) - 0.05; // -0.05 to +0.05
    const offsetLng = (Math.abs((hash >> 8) % 100) / 1000) - 0.05;

    const fallbackLat = 37.5559 + offsetLat;
    const fallbackLng = 126.9723 + offsetLng;

    return NextResponse.json({
      lat: fallbackLat,
      lng: fallbackLng,
      displayName: `"${query}" (검색 결과를 찾을 수 없어 임의 매칭된 위치: 서울특별시 중구 인근)`,
      source: 'simulated_fallback'
    });

  } catch (error) {
    console.error('Geocoding API error:', error);
    
    // Server-side fallback: Return coordinates near Seoul Station in case of network failure
    return NextResponse.json({
      lat: 37.5559,
      lng: 126.9723,
      displayName: `${query} (네트워크 오류로 대체된 위치: 서울특별시 중구 한강대로 405)`,
      source: 'network_fallback'
    });
  }
}
