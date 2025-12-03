'use client';

import { ForecastPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ForecastChartProps {
  forecast: ForecastPoint[];
  title?: string;
}

export function ForecastChart({ forecast, title = '24시간 위험도 예측' }: ForecastChartProps) {
  const data = forecast.map((point) => ({
    ...point,
    time: `${point.hour}시`,
    displayTime: point.hour === 0 ? '자정' : point.hour === 12 ? '정오' : `${point.hour}시`,
  }));

  // Find current hour index
  const currentHour = new Date().getHours();
  const currentIndex = data.findIndex((d) => d.hour === currentHour);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const levelColors = {
        safe: 'text-green-600',
        caution: 'text-yellow-600',
        danger: 'text-red-600',
      };
      const levelLabels = {
        safe: '안전',
        caution: '주의',
        danger: '위험',
      };

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p>
              위험도:{' '}
              <span className={`font-bold ${levelColors[data.riskLevel as keyof typeof levelColors]}`}>
                {data.riskScore}점 ({levelLabels[data.riskLevel as keyof typeof levelLabels]})
              </span>
            </p>
            <p>풍속: <span className="font-medium">{data.weather.windSpeed}m/s</span></p>
            <p>파고: <span className="font-medium">{data.weather.waveHeight}m</span></p>
            <p>강수: <span className="font-medium">{data.weather.precipitation}mm</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Danger zone */}
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '위험', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={40} stroke="#eab308" strokeDasharray="5 5" label={{ value: '주의', fill: '#eab308', fontSize: 10 }} />

              {/* Current time indicator */}
              {currentIndex >= 0 && (
                <ReferenceLine
                  x={data[currentIndex]?.displayTime}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  label={{ value: '현재', fill: '#3b82f6', fontSize: 10 }}
                />
              )}

              <Area
                type="monotone"
                dataKey="riskScore"
                fill="url(#riskGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const colors = {
                    safe: '#22c55e',
                    caution: '#eab308',
                    danger: '#ef4444',
                  };
                  return (
                    <circle
                      key={payload.hour}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={colors[payload.riskLevel as keyof typeof colors]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>안전 (0-40)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>주의 (41-70)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>위험 (71-100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
