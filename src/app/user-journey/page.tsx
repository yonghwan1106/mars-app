'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  User,
  HardHat,
  Building2,
  Briefcase,
  Sun,
  Coffee,
  CheckCircle,
  AlertTriangle,
  Bell,
  Phone,
  FileText,
  BarChart3,
  Shield,
  Clock,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function UserJourneyPage() {
  const [lastUpdated] = useState(new Date());
  const [selectedPersona, setSelectedPersona] = useState<'site' | 'hq' | 'exec'>('site');

  const personas = {
    site: {
      name: '김안전',
      role: '현장 안전관리자',
      icon: HardHat,
      color: 'blue',
      description: '바지선 공사 현장의 안전관리 책임자',
    },
    hq: {
      name: '이관제',
      role: '본사 안전관제팀',
      icon: Building2,
      color: 'purple',
      description: '전국 현장 통합 모니터링 담당',
    },
    exec: {
      name: '박임원',
      role: '안전보건실장',
      icon: Briefcase,
      color: 'green',
      description: '경영진 안전 의사결정권자',
    },
  };

  const journeys = {
    site: [
      {
        time: '06:00',
        icon: Sun,
        title: '출근 전 확인',
        action: 'MARS 앱에서 오늘 위험도 확인',
        emotion: 'neutral',
        detail: '모바일 앱 푸시 알림으로 당일 예측 위험도 수신',
        thought: '"오늘 오후에 파고가 높아지네, 작업 일정 조정해야겠다"',
      },
      {
        time: '07:00',
        icon: Coffee,
        title: '조회 시간',
        action: '작업자들에게 AI 위험 예측 결과 공유',
        emotion: 'positive',
        detail: 'MARS 대시보드를 프로젝터로 띄워 브리핑',
        thought: '"객관적인 데이터로 설명하니 작업자들도 납득하네"',
      },
      {
        time: '09:00',
        icon: CheckCircle,
        title: '오전 작업',
        action: '위험도 \'안전\' - 정상 작업 진행',
        emotion: 'positive',
        detail: '녹색 표시 확인 후 바지선 작업 시작',
        thought: '"AI가 안전하다고 하니 마음 편하게 작업 지시할 수 있어"',
      },
      {
        time: '13:00',
        icon: AlertTriangle,
        title: '상황 변화',
        action: '위험도 \'주의\'로 상승 알림 수신',
        emotion: 'caution',
        detail: '풍속 증가 감지, 14시 이후 위험 예측',
        thought: '"1시간 전에 미리 알려주니 대비할 시간이 있네"',
      },
      {
        time: '13:30',
        icon: Phone,
        title: '선제 대응',
        action: '작업 조기 종료 결정, 본사 보고',
        emotion: 'positive',
        detail: 'MARS 예측 근거로 의사결정, 자동 보고서 생성',
        thought: '"예전엔 경험으로 판단했는데, 이제 데이터로 설명할 수 있어"',
      },
      {
        time: '15:00',
        icon: Shield,
        title: '상황 종료',
        action: '기상 악화 확인, 사전 대피 완료',
        emotion: 'positive',
        detail: '실제 풍속 15m/s 도달, 인명피해 없음',
        thought: '"MARS 덕분에 안전하게 대응했다"',
      },
    ],
    hq: [
      {
        time: '08:00',
        icon: BarChart3,
        title: '일일 현황 파악',
        action: '전국 10개 현장 위험도 한눈에 확인',
        emotion: 'neutral',
        detail: '대시보드에서 위험/주의/안전 현장 분류 확인',
        thought: '"한 화면에서 전체 상황을 볼 수 있어 효율적이야"',
      },
      {
        time: '09:30',
        icon: AlertTriangle,
        title: '위험 현장 감지',
        action: '포항 현장 위험도 급상승 알림',
        emotion: 'caution',
        detail: '지도에서 빨간색 마커 확인, 상세 정보 조회',
        thought: '"현장보다 먼저 위험을 감지할 수 있네"',
      },
      {
        time: '10:00',
        icon: Phone,
        title: '현장 지원',
        action: '현장 관리자와 화상 회의',
        emotion: 'neutral',
        detail: 'MARS 예측 데이터 공유하며 대응 방안 논의',
        thought: '"같은 데이터를 보면서 이야기하니 의사소통이 명확해"',
      },
      {
        time: '14:00',
        icon: FileText,
        title: '보고서 작성',
        action: '일일 안전 보고서 자동 생성',
        emotion: 'positive',
        detail: 'MARS에서 위험 이벤트 요약 리포트 추출',
        thought: '"수작업으로 정리하던 시간이 절반으로 줄었어"',
      },
      {
        time: '17:00',
        icon: Clock,
        title: '익일 예측 확인',
        action: '내일 전국 현장 위험 예측 검토',
        emotion: 'neutral',
        detail: '24시간 예측으로 사전 인력/장비 배치 계획',
        thought: '"선제적 대응이 가능해져서 업무가 편해졌어"',
      },
    ],
    exec: [
      {
        time: '09:00',
        icon: BarChart3,
        title: '경영 현황 파악',
        action: '주간 안전 현황 대시보드 확인',
        emotion: 'neutral',
        detail: '위험 이벤트 추이, 대응률, 사고율 KPI 확인',
        thought: '"숫자로 안전 현황을 파악할 수 있어 좋아"',
      },
      {
        time: '10:00',
        icon: FileText,
        title: '보고 수신',
        action: '자동 생성된 주간 보고서 검토',
        emotion: 'positive',
        detail: 'MARS 데이터 기반 정량적 분석 리포트',
        thought: '"객관적 데이터가 있으니 이사회 보고가 수월해"',
      },
      {
        time: '14:00',
        icon: Shield,
        title: '정책 의사결정',
        action: 'AI 시스템 전사 확대 검토',
        emotion: 'positive',
        detail: '시범 운영 성과 분석, ROI 산출',
        thought: '"사고 예방 효과가 데이터로 입증되니 투자 결정이 쉬워"',
      },
    ],
  };

  const currentPersona = personas[selectedPersona];
  const currentJourney = journeys[selectedPersona];

  const emotionColors = {
    positive: 'bg-green-100 border-green-300 text-green-800',
    neutral: 'bg-gray-100 border-gray-300 text-gray-800',
    caution: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        unreadAlerts={0}
        lastUpdated={lastUpdated}
        onRefresh={() => {}}
        isRefreshing={false}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            대시보드로 돌아가기
          </Button>
        </Link>

        {/* Title */}
        <div className="text-center">
          <Badge className="mb-4 bg-blue-600">User Journey Map</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MARS 사용자 여정
          </h1>
          <p className="text-gray-600">
            페르소나별 시스템 활용 시나리오
          </p>
        </div>

        {/* Persona Selector */}
        <div className="flex justify-center gap-4">
          {Object.entries(personas).map(([key, persona]) => {
            const Icon = persona.icon;
            const isSelected = selectedPersona === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPersona(key as 'site' | 'hq' | 'exec')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${persona.color}-500 bg-${persona.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isSelected ? `bg-${persona.color}-600` : 'bg-gray-200'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <p className="font-bold text-sm">{persona.name}</p>
                <p className="text-xs text-gray-500">{persona.role}</p>
              </button>
            );
          })}
        </div>

        {/* Current Persona Info */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <currentPersona.icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentPersona.name}</h2>
                <p className="text-blue-100">{currentPersona.role}</p>
                <p className="text-sm text-blue-200 mt-1">{currentPersona.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Timeline */}
        <div className="space-y-4">
          {currentJourney.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                {/* Time */}
                <div className="w-20 text-right">
                  <span className="font-bold text-gray-900">{step.time}</span>
                </div>

                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.emotion === 'positive' ? 'bg-green-500' :
                    step.emotion === 'caution' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {index < currentJourney.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 my-2" />
                  )}
                </div>

                {/* Content */}
                <Card className={`flex-1 border-l-4 ${
                  step.emotion === 'positive' ? 'border-l-green-500' :
                  step.emotion === 'caution' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{step.title}</h3>
                      <Badge className={emotionColors[step.emotion as keyof typeof emotionColors]}>
                        {step.emotion === 'positive' ? '긍정' :
                         step.emotion === 'caution' ? '주의' : '중립'}
                      </Badge>
                    </div>
                    <p className="text-blue-600 font-medium mb-2">{step.action}</p>
                    <p className="text-gray-600 text-sm mb-3">{step.detail}</p>
                    <div className="bg-gray-50 p-3 rounded-lg italic text-gray-700 text-sm">
                      {step.thought}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Key Takeaways */}
        <Card>
          <CardHeader>
            <CardTitle>핵심 가치</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold">사전 예측</h4>
                <p className="text-sm text-gray-600">24시간 전 위험 예측으로 선제 대응</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-bold">객관적 판단</h4>
                <p className="text-sm text-gray-600">AI 기반 데이터로 의사결정 근거 제공</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-bold">업무 효율화</h4>
                <p className="text-sm text-gray-600">자동 보고서, 통합 모니터링</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8 border-t">
          <p className="font-medium text-gray-700 mb-1">
            MARS - Maritime AI Risk-prediction System
          </p>
          <p>AI 기반 해상작업 위험예측 시스템</p>
          <p className="mt-2 text-blue-600 font-semibold">
            🏆 한국어촌어항공단 2025년 안전혁신 공모전 출품작
          </p>
          <p className="mt-1 text-gray-600">
            제작: 박용환 (크리에이티브 넥서스)
          </p>
        </footer>
      </main>
    </div>
  );
}
