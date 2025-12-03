'use client';

import { SiteWithRisk } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RiskBadge, RiskIndicator } from '@/components/RiskBadge';
import { Progress } from '@/components/ui/progress';
import { getSiteTypeLabel } from '@/data/sites';
import { MapPin, User, Wind, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SiteListProps {
  sites: SiteWithRisk[];
  title?: string;
  maxHeight?: string;
}

export function SiteList({ sites, title = '현장 목록', maxHeight = '500px' }: SiteListProps) {
  // Sort by risk level (danger first, then caution, then safe)
  const sortedSites = [...sites].sort((a, b) => {
    const order = { danger: 0, caution: 1, safe: 2 };
    return order[a.risk.riskLevel] - order[b.risk.riskLevel];
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-2 px-4 pb-4">
            {sortedSites.map((site) => (
              <SiteListItem key={site.id} site={site} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function SiteListItem({ site }: { site: SiteWithRisk }) {
  const riskColors = {
    safe: 'border-l-green-500 bg-green-50/30',
    caution: 'border-l-yellow-500 bg-yellow-50/30',
    danger: 'border-l-red-500 bg-red-50/30',
  };

  const progressColors = {
    safe: 'bg-green-500',
    caution: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <Link href={`/site/${site.id}`}>
      <div
        className={cn(
          'p-3 rounded-lg border-l-4 border border-gray-200 cursor-pointer',
          'transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300',
          riskColors[site.risk.riskLevel]
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <RiskIndicator level={site.risk.riskLevel} pulse={site.risk.riskLevel === 'danger'} />
              <h3 className="font-semibold text-sm truncate">{site.name}</h3>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {site.location.region}
              </span>
              <span>{getSiteTypeLabel(site.type)}</span>
            </div>
          </div>
          <RiskBadge level={site.risk.riskLevel} size="sm" />
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">위험도</span>
            <span className="font-bold">{site.risk.overallScore}점</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full transition-all', progressColors[site.risk.riskLevel])}
              style={{ width: `${site.risk.overallScore}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            {site.environment.weather.windSpeed.toFixed(1)}m/s
          </span>
          <span className="flex items-center gap-1">
            <Waves className="w-3 h-3" />
            {site.environment.ocean.waveHeight.toFixed(1)}m
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {site.manager.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
