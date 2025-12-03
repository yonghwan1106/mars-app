'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
} from 'lucide-react';

interface WeatherWidgetProps {
  region?: string;
}

// Mock current weather for demo
const mockWeather = {
  condition: 'partly_cloudy',
  temperature: 18,
  humidity: 65,
  windSpeed: 8.5,
  visibility: 12,
  precipitation: 0,
};

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  partly_cloudy: Cloud,
  rainy: CloudRain,
};

export function WeatherWidget({ region = '전국' }: WeatherWidgetProps) {
  const WeatherIcon = weatherIcons[mockWeather.condition as keyof typeof weatherIcons] || Cloud;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <WeatherIcon className="w-5 h-5 text-blue-500" />
          현재 기상
          <span className="text-sm font-normal text-gray-500">({region})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Thermometer className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">기온</p>
              <p className="font-bold">{mockWeather.temperature}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wind className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">풍속</p>
              <p className="font-bold">{mockWeather.windSpeed}m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">습도</p>
              <p className="font-bold">{mockWeather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">가시거리</p>
              <p className="font-bold">{mockWeather.visibility}km</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
