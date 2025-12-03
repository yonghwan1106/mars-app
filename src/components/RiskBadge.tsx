'use client';

import { RiskLevel } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}

const config = {
  safe: {
    label: '안전',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-100',
  },
  caution: {
    label: '주의',
    icon: AlertTriangle,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100',
  },
  danger: {
    label: '위험',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-100',
  },
};

const sizeConfig = {
  sm: { badge: 'text-xs px-2 py-0.5', icon: 'w-3 h-3' },
  md: { badge: 'text-sm px-2.5 py-1', icon: 'w-4 h-4' },
  lg: { badge: 'text-base px-3 py-1.5', icon: 'w-5 h-5' },
};

export function RiskBadge({
  level,
  size = 'md',
  showIcon = true,
  showLabel = true,
}: RiskBadgeProps) {
  const { label, icon: Icon, className } = config[level];
  const { badge: badgeSize, icon: iconSize } = sizeConfig[size];

  return (
    <Badge
      variant="outline"
      className={cn(className, badgeSize, 'font-medium flex items-center gap-1')}
    >
      {showIcon && <Icon className={iconSize} />}
      {showLabel && <span>{label}</span>}
    </Badge>
  );
}

export function RiskIndicator({ level, pulse = false }: { level: RiskLevel; pulse?: boolean }) {
  const colors = {
    safe: 'bg-green-500',
    caution: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className="relative">
      <div className={cn('w-3 h-3 rounded-full', colors[level])} />
      {pulse && level === 'danger' && (
        <div
          className={cn(
            'absolute inset-0 w-3 h-3 rounded-full animate-ping',
            colors[level],
            'opacity-75'
          )}
        />
      )}
    </div>
  );
}
