'use client';

import { useEffect, useState } from 'react';
import { SiteWithRisk } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center text-gray-500">
        <Map className="w-12 h-12 mx-auto mb-2 animate-pulse" />
        <p>지도 로딩 중...</p>
      </div>
    </div>
  ),
});

interface SiteMapProps {
  sites: SiteWithRisk[];
  height?: string;
}

export function SiteMap({ sites, height = '400px' }: SiteMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" />
          현장 위치
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 px-4 pb-4">
        <div style={{ height }} className="rounded-lg overflow-hidden border">
          {isMounted ? (
            <MapComponent sites={sites} />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">지도 로딩 중...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
