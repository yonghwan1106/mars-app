'use client';

import { useEffect, useState, use } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { RiskBadge } from '@/components/RiskBadge';
import { RiskGauge, RiskFactorBar } from '@/components/RiskGauge';
import { ForecastChart } from '@/components/ForecastChart';
import { RecommendationCard } from '@/components/RecommendationCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getSiteById, getSiteTypeLabel } from '@/data/sites';
import { generateEnvironmentData, calculateRiskAnalysis, generateForecast } from '@/data/mockGenerator';
import { SiteWithRisk, ForecastPoint } from '@/types';
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Building2,
  Wind,
  Waves,
  CloudRain,
  Eye,
  Compass,
  Thermometer,
  Droplets,
  Timer,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SiteDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { unreadAlertCount, lastUpdated, refreshData } = useStore();

  const [siteData, setSiteData] = useState<SiteWithRisk | null>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSiteData = () => {
    const site = getSiteById(id);
    if (site) {
      const environment = generateEnvironmentData(site.id);
      const risk = calculateRiskAnalysis(environment, site.type);
      const forecastData = generateForecast(site.id, site.type);

      setSiteData({ ...site, environment, risk });
      setForecast(forecastData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSiteData();
    refreshData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadSiteData();
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSiteData();
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <p className="text-gray-500">현장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">현장을 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-4">요청한 현장 정보가 존재하지 않습니다.</p>
          <Link href="/">
            <Button>대시보드로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(siteData.environment.timestamp), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        unreadAlerts={unreadAlertCount}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Back button & Site header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                대시보드
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{siteData.name}</h1>
                <RiskBadge level={siteData.risk.riskLevel} size="md" />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {siteData.location.address}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {getSiteTypeLabel(siteData.type)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Timer className="w-4 h-4" />
            <span>마지막 갱신: {timeAgo}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Recommendation Card */}
        <RecommendationCard
          recommendation={siteData.risk.recommendation}
          riskLevel={siteData.risk.riskLevel}
          message={siteData.risk.message}
          aiConfidence={siteData.risk.aiConfidence}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Risk Gauge & Factors */}
          <div className="space-y-6">
            {/* Risk Gauge */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">종합 위험도</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-6">
                <RiskGauge score={siteData.risk.overallScore} level={siteData.risk.riskLevel} size="lg" />
              </CardContent>
            </Card>

            {/* Manager Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  현장 담당자
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">이름</span>
                    <span className="font-medium">{siteData.manager.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">연락처</span>
                    <a
                      href={`tel:${siteData.manager.phone}`}
                      className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      {siteData.manager.phone}
                    </a>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    긴급 연락
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center: Current Conditions & Risk Factors */}
          <div className="space-y-6">
            {/* Current Weather */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-600" />
                  현재 기상 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Wind className="w-4 h-4" />
                      <span className="text-sm">풍속</span>
                    </div>
                    <p className="text-xl font-bold">{siteData.environment.weather.windSpeed.toFixed(1)} m/s</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Waves className="w-4 h-4" />
                      <span className="text-sm">파고</span>
                    </div>
                    <p className="text-xl font-bold">{siteData.environment.ocean.waveHeight.toFixed(1)} m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <CloudRain className="w-4 h-4" />
                      <span className="text-sm">강수량</span>
                    </div>
                    <p className="text-xl font-bold">{siteData.environment.weather.precipitation.toFixed(1)} mm</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">가시거리</span>
                    </div>
                    <p className="text-xl font-bold">{siteData.environment.weather.visibility.toFixed(1)} km</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-sm">기온</span>
                    </div>
                    <p className="text-xl font-bold">{siteData.environment.weather.temperature.toFixed(1)}°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Droplets className="w-4 h-4" />
                      <span className="text-sm">조류</span>
                    </div>
                    <p className="text-xl font-bold">{siteData.environment.ocean.tidalCurrent.toFixed(1)} knot</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">요인별 위험도 분석</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <RiskFactorBar
                  label="풍속"
                  value={siteData.risk.factors.wind.value}
                  unit="m/s"
                  score={siteData.risk.factors.wind.score}
                  threshold={siteData.risk.factors.wind.threshold}
                />
                <RiskFactorBar
                  label="파고"
                  value={siteData.risk.factors.wave.value}
                  unit="m"
                  score={siteData.risk.factors.wave.score}
                  threshold={siteData.risk.factors.wave.threshold}
                />
                <RiskFactorBar
                  label="강수량"
                  value={siteData.risk.factors.precipitation.value}
                  unit="mm"
                  score={siteData.risk.factors.precipitation.score}
                  threshold={siteData.risk.factors.precipitation.threshold}
                />
                <RiskFactorBar
                  label="가시거리"
                  value={siteData.risk.factors.visibility.value}
                  unit="km"
                  score={siteData.risk.factors.visibility.score}
                  threshold={siteData.risk.factors.visibility.threshold}
                  isInverse
                />
                <RiskFactorBar
                  label="조류"
                  value={siteData.risk.factors.tidal.value}
                  unit="knot"
                  score={siteData.risk.factors.tidal.score}
                  threshold={siteData.risk.factors.tidal.threshold}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Forecast */}
          <div>
            <ForecastChart forecast={forecast} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8 border-t">
          <p className="font-medium text-gray-700 mb-1">
            MARS - Maritime AI Risk-prediction System
          </p>
          <p>AI 기반 해상작업 위험예측 시스템</p>
          <p className="mt-2 text-blue-600 font-semibold">
            🏆 한국어촌어항공단 2025년 안전혁신 공모전 출품작
          </p>
          <p className="mt-1 text-gray-600">
            제작: 박용환 (크리에이티브 넥서스)
          </p>
        </footer>
      </main>
    </div>
  );
}
