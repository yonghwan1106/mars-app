'use client';

import { useState } from 'react';
import { Bell, RefreshCw, Settings, User, Info, Map, Home, FileText, Phone, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  unreadAlerts: number;
  lastUpdated: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function Header({ unreadAlerts, lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko });
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    pathname === '/'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  대시보드
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    pathname === '/about'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  프로젝트 소개
                </Button>
              </Link>
              <Link href="/user-journey">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    pathname === '/user-journey'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  사용자 여정
                </Button>
              </Link>
              <Link href="/work-log">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    pathname === '/work-log'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  작업일지
                </Button>
              </Link>
              <Link href="/emergency">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    pathname === '/emergency'
                      ? 'text-red-600 bg-red-50'
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  비상연락
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-3 space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${
                  pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600'
                }`}
              >
                <Home className="w-4 h-4" />
                대시보드
              </Button>
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${
                  pathname === '/about'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600'
                }`}
              >
                <Info className="w-4 h-4" />
                프로젝트 소개
              </Button>
            </Link>
            <Link href="/user-journey" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${
                  pathname === '/user-journey'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600'
                }`}
              >
                <Map className="w-4 h-4" />
                사용자 여정
              </Button>
            </Link>
            <Link href="/work-log" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${
                  pathname === '/work-log'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                작업일지
              </Button>
            </Link>
            <Link href="/emergency" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${
                  pathname === '/emergency'
                    ? 'text-red-600 bg-red-50'
                    : 'text-red-600'
                }`}
              >
                <Phone className="w-4 h-4" />
                비상연락
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
