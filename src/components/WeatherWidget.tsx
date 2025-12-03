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
    <Card className="bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <WeatherIcon className="w-6 h-6 text-blue-500" />
          현재 기상
          <span className="text-base font-normal text-gray-500">({region})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Thermometer className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">기온</p>
              <p className="text-xl font-bold text-gray-800">{mockWeather.temperature}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wind className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">풍속</p>
              <p className="text-xl font-bold text-gray-800">{mockWeather.windSpeed}m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
            <div className="p-3 bg-cyan-100 rounded-xl">
              <Droplets className="w-7 h-7 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">습도</p>
              <p className="text-xl font-bold text-gray-800">{mockWeather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Eye className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">가시거리</p>
              <p className="text-xl font-bold text-gray-800">{mockWeather.visibility}km</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
