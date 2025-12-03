'use client';

import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskGauge({ score, level, size = 'lg' }: RiskGaugeProps) {
  const sizeConfig = {
    sm: { outer: 'w-24 h-24', inner: 'w-20 h-20', text: 'text-xl', label: 'text-xs' },
    md: { outer: 'w-32 h-32', inner: 'w-28 h-28', text: 'text-3xl', label: 'text-sm' },
    lg: { outer: 'w-48 h-48', inner: 'w-40 h-40', text: 'text-5xl', label: 'text-base' },
  };

  const colors = {
    safe: {
      stroke: '#22c55e',
      bg: 'bg-green-50',
      text: 'text-green-600',
      label: '안전',
    },
    caution: {
      stroke: '#eab308',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      label: '주의',
    },
    danger: {
      stroke: '#ef4444',
      bg: 'bg-red-50',
      text: 'text-red-600',
      label: '위험',
    },
  };

  const config = colors[level];
  const sizes = sizeConfig[size];

  // Calculate stroke dash for progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={cn('relative', sizes.outer)}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={config.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center',
            sizes.inner,
            'm-auto rounded-full',
            config.bg
          )}
        >
          <span className={cn('font-bold', sizes.text, config.text)}>
            {score}
          </span>
          <span className={cn('font-medium', sizes.label, config.text)}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}

interface RiskFactorBarProps {
  label: string;
  value: number;
  unit: string;
  score: number;
  threshold: {
    safe: number;
    caution: number;
    danger: number;
  };
  isInverse?: boolean; // For visibility where lower is worse
}

export function RiskFactorBar({
  label,
  value,
  unit,
  score,
  threshold,
  isInverse = false,
}: RiskFactorBarProps) {
  const getLevel = (score: number): RiskLevel => {
    if (score <= 40) return 'safe';
    if (score <= 70) return 'caution';
    return 'danger';
  };

  const level = getLevel(score);

  const colors = {
    safe: 'bg-green-500',
    caution: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const textColors = {
    safe: 'text-green-600',
    caution: 'text-yellow-600',
    danger: 'text-red-600',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={cn('font-bold', textColors[level])}>
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={cn('h-3 rounded-full transition-all duration-500', colors[level])}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>안전: {isInverse ? `>${threshold.safe}` : `<${threshold.safe}`}{unit}</span>
        <span>주의: {threshold.caution}{unit}</span>
        <span>위험: {isInverse ? `<${threshold.danger}` : `>${threshold.danger}`}{unit}</span>
      </div>
    </div>
  );
}
