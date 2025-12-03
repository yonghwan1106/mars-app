'use client';

import { Recommendation, RiskLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Bot, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  recommendation: Recommendation;
  riskLevel: RiskLevel;
  message: string;
  aiConfidence: number;
}

const config = {
  proceed: {
    icon: CheckCircle,
    title: '작업 가능',
    subtitle: '현재 조건에서 정상 작업이 가능합니다',
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-green-50',
    borderColor: 'border-green-400',
  },
  caution: {
    icon: AlertTriangle,
    title: '주의 필요',
    subtitle: '안전 조치 강화 후 작업을 진행하세요',
    bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-50',
    borderColor: 'border-yellow-400',
  },
  stop: {
    icon: XCircle,
    title: '작업 중지 권고',
    subtitle: '즉시 작업을 중단하고 안전한 장소로 대피하세요',
    bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
    textColor: 'text-red-50',
    borderColor: 'border-red-400',
  },
};

export function RecommendationCard({
  recommendation,
  riskLevel,
  message,
  aiConfidence,
}: RecommendationCardProps) {
  const { icon: Icon, title, subtitle, bgColor, textColor, borderColor } = config[recommendation];

  return (
    <Card className={cn('overflow-hidden border-2', borderColor)}>
      <div className={cn('p-6', bgColor)}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Icon className={cn('w-8 h-8', textColor)} />
          </div>
          <div className="flex-1">
            <h3 className={cn('text-2xl font-bold', textColor)}>{title}</h3>
            <p className={cn('text-sm mt-1 opacity-90', textColor)}>{subtitle}</p>
          </div>
          {recommendation === 'stop' && (
            <div className="animate-pulse">
              <Shield className={cn('w-10 h-10', textColor)} />
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4 bg-white">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">AI 권고 메시지</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                신뢰도 {aiConfidence.toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
