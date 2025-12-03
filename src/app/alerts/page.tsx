'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, XCircle, Info, Check, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { Alert } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AlertsPage() {
  const {
    alerts,
    unreadAlertCount,
    lastUpdated,
    refreshData,
    acknowledgeAlert,
  } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      refreshData();
      setIsInitialized(true);
    }
  }, [isInitialized, refreshData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, '이영희');
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');
  const unreadAlerts = alerts.filter(a => !a.readAt);

  if (!isInitialized) {
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
    <div className="min-h-screen bg-gray-50">
      <Header
        unreadAlerts={unreadAlertCount}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">알림 센터</h1>
              <p className="text-gray-500">모든 알림을 확인하고 관리하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">미확인 알림</p>
              <p className="text-2xl font-bold text-purple-600">{unreadAlertCount}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">긴급</p>
                <p className="text-2xl font-bold text-red-700">{criticalAlerts.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">경고</p>
                <p className="text-2xl font-bold text-yellow-700">{warningAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">정보</p>
                <p className="text-2xl font-bold text-blue-700">{infoAlerts.length}</p>
              </div>
              <Info className="w-8 h-8 text-blue-400" />
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">미확인</p>
                <p className="text-2xl font-bold text-purple-700">{unreadAlerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-purple-400" />
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              알림 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">전체 ({alerts.length})</TabsTrigger>
                <TabsTrigger value="critical" className="text-red-600">
                  긴급 ({criticalAlerts.length})
                </TabsTrigger>
                <TabsTrigger value="warning" className="text-yellow-600">
                  경고 ({warningAlerts.length})
                </TabsTrigger>
                <TabsTrigger value="info" className="text-blue-600">
                  정보 ({infoAlerts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {alerts.length === 0 ? (
                  <EmptyState />
                ) : (
                  alerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="critical" className="space-y-3">
                {criticalAlerts.length === 0 ? (
                  <EmptyState message="긴급 알림이 없습니다" />
                ) : (
                  criticalAlerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="warning" className="space-y-3">
                {warningAlerts.length === 0 ? (
                  <EmptyState message="경고 알림이 없습니다" />
                ) : (
                  warningAlerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="info" className="space-y-3">
                {infoAlerts.length === 0 ? (
                  <EmptyState message="정보 알림이 없습니다" />
                ) : (
                  infoAlerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8 border-t">
          <p className="font-medium text-gray-700 mb-1">
            MARS - Maritime AI Risk-prediction System
          </p>
          <p>AI 기반 해상작업 위험예측 시스템</p>
          <p className="mt-2 text-blue-600 font-semibold">
            한국어촌어항공단 2025년 안전혁신 공모전 출품작
          </p>
          <p className="mt-1 text-gray-600">
            제작: 박용환 (크리에이티브 넥서스)
          </p>
        </footer>
      </main>
    </div>
  );
}

function EmptyState({ message = '알림이 없습니다' }: { message?: string }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
      <p className="text-lg">{message}</p>
    </div>
  );
}

function AlertItem({
  alert,
  onAcknowledge,
}: {
  alert: Alert;
  onAcknowledge?: (alertId: string) => void;
}) {
  const severityConfig = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      label: '정보',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      label: '경고',
    },
    critical: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      label: '긴급',
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  const isUnread = !alert.readAt;
  const isAcknowledged = !!alert.acknowledgedAt;

  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        config.bgColor,
        config.borderColor,
        isUnread && 'ring-2 ring-offset-2',
        alert.severity === 'critical' && isUnread && 'ring-red-300'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('p-2 rounded-full', config.bgColor)}>
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{alert.title}</h4>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                config.bgColor,
                config.iconColor
              )}>
                {config.label}
              </span>
              {isUnread && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                  NEW
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
          <Link href={`/site/${alert.siteId}`}>
            <p className="text-sm text-blue-600 hover:underline mb-2">
              {alert.siteName}
            </p>
          </Link>
          <p className="text-gray-600">{alert.message}</p>

          {alert.previousLevel && alert.currentLevel && (
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="text-gray-500">상태 변경:</span>
              <LevelBadge level={alert.previousLevel} />
              <span>→</span>
              <LevelBadge level={alert.currentLevel} />
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            {!isAcknowledged && onAcknowledge && alert.severity !== 'info' && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border hover:bg-gray-50 transition-colors text-sm"
              >
                <Check className="w-4 h-4" />
                확인 완료
              </button>
            )}

            {isAcknowledged && (
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {alert.acknowledgedBy}님이 확인함
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors = {
    safe: 'bg-green-200 text-green-800',
    caution: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
  };

  const labels = {
    safe: '안전',
    caution: '주의',
    danger: '위험',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-sm font-medium', colors[level as keyof typeof colors])}>
      {labels[level as keyof typeof labels]}
    </span>
  );
}
