'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface WorkLogEntry {
  date: string;
  siteId: string;
  siteName: string;
  riskLevel: 'safe' | 'caution' | 'danger';
  riskScore: number;
  workStatus: 'completed' | 'partial' | 'cancelled';
  workHours: number;
  notes: string;
  weather: {
    windSpeed: number;
    waveHeight: number;
  };
}

// 목업 작업 일지 데이터 생성
const generateMockWorkLogs = (): WorkLogEntry[] => {
  const logs: WorkLogEntry[] = [];
  const sites = [
    { id: 'site-001', name: '인천항 제2부두 확장공사' },
    { id: 'site-002', name: '부산 영도 방파제 보수' },
    { id: 'site-004', name: '포항 신항만 준설공사' },
    { id: 'site-005', name: '제주 서귀포 어항 정비' },
  ];

  const statuses: WorkLogEntry['workStatus'][] = ['completed', 'partial', 'cancelled'];
  const riskLevels: WorkLogEntry['riskLevel'][] = ['safe', 'caution', 'danger'];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const site = sites[Math.floor(Math.random() * sites.length)];
    const riskLevel = riskLevels[Math.floor(Math.random() * 10) < 7 ? 0 : Math.floor(Math.random() * 10) < 9 ? 1 : 2];
    const workStatus = riskLevel === 'danger' ? 'cancelled' :
                       riskLevel === 'caution' ? (Math.random() > 0.5 ? 'partial' : 'completed') :
                       'completed';

    logs.push({
      date: date.toISOString().split('T')[0],
      siteId: site.id,
      siteName: site.name,
      riskLevel,
      riskScore: riskLevel === 'safe' ? Math.floor(Math.random() * 40) :
                 riskLevel === 'caution' ? 40 + Math.floor(Math.random() * 30) :
                 70 + Math.floor(Math.random() * 30),
      workStatus,
      workHours: workStatus === 'cancelled' ? 0 :
                 workStatus === 'partial' ? 2 + Math.floor(Math.random() * 4) :
                 6 + Math.floor(Math.random() * 4),
      notes: workStatus === 'cancelled' ? '기상 악화로 작업 취소' :
             workStatus === 'partial' ? '오후 기상 악화 예보로 조기 철수' :
             '정상 작업 완료',
      weather: {
        windSpeed: riskLevel === 'danger' ? 15 + Math.random() * 10 :
                   riskLevel === 'caution' ? 8 + Math.random() * 7 :
                   2 + Math.random() * 6,
        waveHeight: riskLevel === 'danger' ? 2 + Math.random() * 1.5 :
                    riskLevel === 'caution' ? 1 + Math.random() * 1 :
                    0.2 + Math.random() * 0.8,
      },
    });
  }

  return logs;
};

export default function WorkLogPage() {
  const { unreadAlertCount, lastUpdated, refreshData } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState<WorkLogEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
    setLogs(generateMockWorkLogs());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // 달력 관련 함수
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getLogForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return logs.find(log => log.date === dateStr);
  };

  const selectedLog = selectedDate ? logs.find(log => log.date === selectedDate) : null;

  // 통계 계산
  const currentMonthLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth.getMonth() &&
           logDate.getFullYear() === currentMonth.getFullYear();
  });

  const stats = {
    totalDays: currentMonthLogs.length,
    completedDays: currentMonthLogs.filter(l => l.workStatus === 'completed').length,
    partialDays: currentMonthLogs.filter(l => l.workStatus === 'partial').length,
    cancelledDays: currentMonthLogs.filter(l => l.workStatus === 'cancelled').length,
    totalHours: currentMonthLogs.reduce((sum, l) => sum + l.workHours, 0),
  };

  const getStatusIcon = (status: WorkLogEntry['workStatus']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: WorkLogEntry['workStatus']) => {
    switch (status) {
      case 'completed': return '완료';
      case 'partial': return '부분 완료';
      case 'cancelled': return '취소';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        unreadAlerts={unreadAlertCount}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="container mx-auto px-4 py-6 space-y-6 flex-1">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                대시보드
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                작업 일지
              </h1>
              <p className="text-sm text-gray-500 mt-1">일별 작업 현황 및 기상 조건 기록</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500">총 작업일</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalDays}일</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> 완료
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.completedDays}일</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-500" /> 부분 완료
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.partialDays}일</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" /> 취소
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.cancelledDays}일</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" /> 총 작업시간
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalHours}시간</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before the month starts */}
                {Array.from({ length: startingDay }, (_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const log = getLogForDate(day);
                  const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        aspect-square p-1 rounded-lg border transition-all
                        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-50'}
                        ${isToday ? 'ring-2 ring-blue-300' : ''}
                      `}
                    >
                      <div className="text-sm font-medium text-gray-700">{day}</div>
                      {log && (
                        <div className="mt-1 flex justify-center">
                          {getStatusIcon(log.workStatus)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> 완료
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" /> 부분 완료
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <XCircle className="w-4 h-4 text-red-500" /> 취소
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Detail */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">상세 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLog ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">날짜</div>
                    <div className="font-medium">{selectedLog.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">현장</div>
                    <Link href={`/site/${selectedLog.siteId}`} className="font-medium text-blue-600 hover:underline">
                      {selectedLog.siteName}
                    </Link>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">작업 상태</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedLog.workStatus)}
                      <span className="font-medium">{getStatusLabel(selectedLog.workStatus)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">위험도</div>
                    <Badge
                      className={`mt-1 ${
                        selectedLog.riskLevel === 'danger' ? 'bg-red-100 text-red-700' :
                        selectedLog.riskLevel === 'caution' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {selectedLog.riskScore}점 ({selectedLog.riskLevel === 'safe' ? '안전' :
                        selectedLog.riskLevel === 'caution' ? '주의' : '위험'})
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">작업 시간</div>
                    <div className="font-medium">{selectedLog.workHours}시간</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">기상 조건</div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-600">풍속:</span> {selectedLog.weather.windSpeed.toFixed(1)}m/s
                      <br />
                      <span className="text-gray-600">파고:</span> {selectedLog.weather.waveHeight.toFixed(1)}m
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">비고</div>
                    <div className="text-sm mt-1 p-2 bg-gray-50 rounded">
                      {selectedLog.notes}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>날짜를 선택하면<br />상세 정보가 표시됩니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
