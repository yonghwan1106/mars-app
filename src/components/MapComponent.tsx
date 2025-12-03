'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { SiteWithRisk } from '@/types';
import { RiskBadge } from './RiskBadge';
import { getSiteTypeLabel } from '@/data/sites';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useEffect } from 'react';

// Custom marker icons
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ${color === '#ef4444' ? 'animation: pulse 1s infinite;' : ''}
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const icons = {
  safe: createIcon('#22c55e'),
  caution: createIcon('#eab308'),
  danger: createIcon('#ef4444'),
};

// Korea bounds
const koreaBounds: [[number, number], [number, number]] = [
  [33.0, 124.0],
  [38.5, 132.0],
];

function MapController({ sites }: { sites: SiteWithRisk[] }) {
  const map = useMap();

  useEffect(() => {
    if (sites.length > 0) {
      const bounds = L.latLngBounds(sites.map(s => [s.location.lat, s.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sites, map]);

  return null;
}

interface MapComponentProps {
  sites: SiteWithRisk[];
}

export default function MapComponent({ sites }: MapComponentProps) {
  // Add CSS for pulse animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const center: [number, number] = [35.9078, 127.7669]; // Center of Korea

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      maxBounds={koreaBounds}
      minZoom={6}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController sites={sites} />
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={[site.location.lat, site.location.lng]}
          icon={icons[site.risk.riskLevel]}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">{site.name}</h3>
                <RiskBadge level={site.risk.riskLevel} size="sm" />
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>유형:</strong> {getSiteTypeLabel(site.type)}</p>
                <p><strong>지역:</strong> {site.location.region}</p>
                <p><strong>위험도:</strong> {site.risk.overallScore}점</p>
                <p><strong>풍속:</strong> {site.environment.weather.windSpeed.toFixed(1)}m/s</p>
                <p><strong>파고:</strong> {site.environment.ocean.waveHeight.toFixed(1)}m</p>
                <p><strong>담당자:</strong> {site.manager.name}</p>
              </div>
              <Link
                href={`/site/${site.id}`}
                className="block mt-3 text-center text-sm text-white bg-blue-600 hover:bg-blue-700 rounded py-1.5 transition-colors"
              >
                상세 보기
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
