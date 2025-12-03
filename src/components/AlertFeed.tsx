'use client';

import { Alert } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, AlertTriangle, XCircle, Info, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

interface AlertFeedProps {
  alerts: Alert[];
  maxHeight?: string;
  onAcknowledge?: (alertId: string) => void;
}

export function AlertFeed({ alerts, maxHeight = '400px', onAcknowledge }: AlertFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          실시간 알림
          {alerts.filter(a => !a.readAt).length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {alerts.filter(a => !a.readAt).length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-2 px-4 pb-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>새로운 알림이 없습니다</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={onAcknowledge}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
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
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
    },
    critical: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
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
        'p-3 rounded-lg border transition-all',
        config.bgColor,
        config.borderColor,
        isUnread && 'ring-2 ring-offset-1',
        alert.severity === 'critical' && isUnread && 'ring-red-300 animate-pulse'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-1.5 rounded-full', config.bgColor)}>
          <Icon className={cn('w-4 h-4', config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm truncate">{alert.title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{timeAgo}</span>
          </div>
          <Link href={`/site/${alert.siteId}`}>
            <p className="text-xs text-blue-600 hover:underline mt-0.5">
              {alert.siteName}
            </p>
          </Link>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{alert.message}</p>

          {alert.previousLevel && alert.currentLevel && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-gray-500">상태 변경:</span>
              <LevelBadge level={alert.previousLevel} />
              <span>→</span>
              <LevelBadge level={alert.currentLevel} />
            </div>
          )}

          {!isAcknowledged && onAcknowledge && alert.severity !== 'info' && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="mt-2 flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Check className="w-3 h-3" />
              확인
            </button>
          )}

          {isAcknowledged && (
            <p className="mt-2 text-xs text-gray-400">
              {alert.acknowledgedBy}님이 확인함
            </p>
          )}
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
    <span className={cn('px-1.5 py-0.5 rounded text-xs font-medium', colors[level as keyof typeof colors])}>
      {labels[level as keyof typeof labels]}
    </span>
  );
}
