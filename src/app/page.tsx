'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { SummaryCards } from '@/components/SummaryCards';
import { SiteList } from '@/components/SiteList';
import { AlertFeed } from '@/components/AlertFeed';
import { SiteMap } from '@/components/SiteMap';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Clock, Trophy } from 'lucide-react';

export default function Dashboard() {
  const {
    sitesWithRisk,
    alerts,
    summary,
    unreadAlertCount,
    lastUpdated,
    refreshData,
    acknowledgeAlert,
  } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial data load
  useEffect(() => {
    if (!isInitialized) {
      refreshData();
      setIsInitialized(true);
    }
  }, [isInitialized, refreshData]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, '이영희');
  };

  if (!isInitialized || sitesWithRisk.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">MARS</h1>
          <p className="text-gray-500 mt-2">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        unreadAlerts={unreadAlertCount}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="container mx-auto px-4 py-6 space-y-6 flex-1">
        {/* 공모전 뱃지 */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full px-4 py-2 shadow-sm">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-800">
              한국어촌어항공단 2025년 안전혁신 공모전 출품작
            </span>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span>실시간 모니터링 중</span>
          <span className="text-gray-400">|</span>
          <Clock className="w-4 h-4" />
          <span>30초마다 자동 갱신</span>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        {/* Weather Widget */}
        <WeatherWidget />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and Site List */}
          <div className="lg:col-span-2 space-y-6">
            <SiteMap sites={sitesWithRisk} height="500px" />

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">전체 ({sitesWithRisk.length})</TabsTrigger>
                <TabsTrigger value="danger" className="text-red-600">
                  위험 ({summary.dangerSites})
                </TabsTrigger>
                <TabsTrigger value="caution" className="text-yellow-600">
                  주의 ({summary.cautionSites})
                </TabsTrigger>
                <TabsTrigger value="safe" className="text-green-600">
                  안전 ({summary.safeSites})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <SiteList sites={sitesWithRisk} title="전체 현장" maxHeight="400px" />
              </TabsContent>
              <TabsContent value="danger">
                <SiteList
                  sites={sitesWithRisk.filter(s => s.risk.riskLevel === 'danger')}
                  title="위험 현장"
                  maxHeight="400px"
                />
              </TabsContent>
              <TabsContent value="caution">
                <SiteList
                  sites={sitesWithRisk.filter(s => s.risk.riskLevel === 'caution')}
                  title="주의 현장"
                  maxHeight="400px"
                />
              </TabsContent>
              <TabsContent value="safe">
                <SiteList
                  sites={sitesWithRisk.filter(s => s.risk.riskLevel === 'safe')}
                  title="안전 현장"
                  maxHeight="400px"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Alert Feed */}
          <div className="lg:col-span-1">
            <AlertFeed
              alerts={alerts}
              maxHeight="900px"
              onAcknowledge={handleAcknowledge}
            />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
