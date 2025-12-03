'use client';

import { Bell, RefreshCw, Settings, User, Info, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

interface HeaderProps {
  unreadAlerts: number;
  lastUpdated: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function Header({ unreadAlerts, lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko });

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MARS</h1>
                <p className="text-xs text-gray-500">해상작업 위험예측 시스템</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link href="/about">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                  <Info className="w-4 h-4" />
                  프로젝트 소개
                </Button>
              </Link>
              <Link href="/user-journey">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                  <Map className="w-4 h-4" />
                  User Journey
                </Button>
              </Link>
            </nav>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-4">
            {/* Last Updated */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span>마지막 갱신:</span>
              <span className="font-medium">{timeAgo}</span>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </Button>

            {/* Alerts */}
            <Link href="/alerts">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500"
                  >
                    {unreadAlerts > 9 ? '9+' : unreadAlerts}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            {/* User */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium">이영희</p>
                <p className="text-xs text-gray-500">안전보건실</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
