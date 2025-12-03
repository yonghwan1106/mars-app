'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DashboardSummary } from '@/types';
import { Building2, CheckCircle, AlertTriangle, XCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: '전체 현장',
      value: summary.totalSites,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: '안전',
      value: summary.safeSites,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: '주의',
      value: summary.cautionSites,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: '위험',
      value: summary.dangerSites,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pulse: summary.dangerSites > 0,
    },
    {
      title: '미확인 알림',
      value: summary.activeAlerts,
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn(
            'border-2 transition-all hover:shadow-md',
            card.borderColor
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className={cn('text-3xl font-bold mt-1', card.color)}>
                  {card.value}
                </p>
              </div>
              <div
                className={cn(
                  'p-3 rounded-full relative',
                  card.bgColor
                )}
              >
                <card.icon className={cn('w-6 h-6', card.color)} />
                {card.pulse && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
