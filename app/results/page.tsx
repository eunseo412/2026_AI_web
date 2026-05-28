import React from 'react';
import { headers } from 'next/headers';
import ResultsClient from './results-client';

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
  date?: string;
  time?: string;
  duration?: string;
  radius?: string;
}

export default async function ResultsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const date = typeof resolvedParams.date === 'string' ? resolvedParams.date : new Date().toISOString().split('T')[0];
  const time = typeof resolvedParams.time === 'string' ? resolvedParams.time : '12:00';
  const duration = typeof resolvedParams.duration === 'string' ? parseInt(resolvedParams.duration, 10) : 180;
  const radius = typeof resolvedParams.radius === 'string' ? parseInt(resolvedParams.radius, 10) : 500;

  // Derive absolute base URL dynamically (works locally and deployed on Vercel seamlessly)
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  let destinationName = query;
  let destinationCoord = { lat: 37.5559, lng: 126.9723 }; // Default Seoul Station
  let parkingLots = [];
  let apiInfo = { apiUsed: false, apiError: null, source: 'local_real_database' };

  if (query) {
    try {
      // 1. Convert destination query to coordinates
      const geocodeRes = await fetch(`${baseUrl}/api/geocode?q=${encodeURIComponent(query)}`, {
        cache: 'no-store'
      });
      
      if (geocodeRes.ok) {
        const geocodeData = await geocodeRes.json();
        destinationName = geocodeData.displayName;
        destinationCoord = { lat: geocodeData.lat, lng: geocodeData.lng };

        // 2. Fetch real parking lots near these coordinates
        const parkingParams = new URLSearchParams({
          lat: destinationCoord.lat.toString(),
          lng: destinationCoord.lng.toString(),
          radius: radius.toString(),
          date,
          time,
          duration: duration.toString(),
          addressName: destinationName
        });

        const parkingRes = await fetch(`${baseUrl}/api/parking?${parkingParams.toString()}`, {
          cache: 'no-store'
        });

        if (parkingRes.ok) {
          const parkingData = await parkingRes.json();
          parkingLots = parkingData.parkingLots || [];
          apiInfo = parkingData.apiInfo || apiInfo;
        }
      }
    } catch (err: any) {
      console.error('Error fetching dashboard results data in server component:', err);
      apiInfo.apiError = err.message;
    }
  }

  return (
    <ResultsClient
      destinationName={destinationName}
      destinationCoord={destinationCoord}
      searchParams={{ date, time, duration, radius }}
      apiInfo={apiInfo}
      initialLots={parkingLots}
    />
  );
}
