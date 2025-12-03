'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Database,
  Brain,
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Cloud,
  Waves,
  Wind,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AboutPage() {
  const [lastUpdated] = useState(new Date());

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

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <Badge className="bg-white/20 text-white mb-4">
            🏆 한국어촌어항공단 2025년 안전혁신 공모전 출품작
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            MARS - Maritime AI Risk-prediction System
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            AI 기반 해상작업 위험예측 및 작업가부 판단 지원 시스템
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-white/10 text-white">
              <Brain className="w-3 h-3 mr-1" /> AI 위험 예측
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              <Cloud className="w-3 h-3 mr-1" /> 실시간 기상 연동
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              <Bell className="w-3 h-3 mr-1" /> 자동 알림
            </Badge>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                현재 문제점
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-red-800">
              <p>• 해상 건설현장 작업가부 판단이 현장 관리자의 <strong>주관적 경험</strong>에 의존</p>
              <p>• 기상 급변 시 <strong>대응 지연</strong>으로 사고 위험 증가</p>
              <p>• 객관적 기준 부재로 인한 <strong>불필요한 작업 중단</strong> 또는 <strong>위험한 작업 강행</strong></p>
              <p>• 2021년 해양사고 2,720건 중 <strong>63.3%가 안전사고</strong> (실족, 해상추락 등)</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                MARS 솔루션
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-green-800">
              <p>• 기상청/해양수산부 <strong>공공데이터 실시간 연동</strong></p>
              <p>• AI가 <strong>객관적 위험도 점수</strong> 산출 (0-100점)</p>
              <p>• <strong>작업 유형별 맞춤 기준</strong> 적용 (바지선/잠수/중량물)</p>
              <p>• <strong>24시간 예측</strong>으로 사전 대비 가능</p>
            </CardContent>
          </Card>
        </div>

        {/* System Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              시스템 구성도
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Data Collection */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  데이터 수집
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-center gap-2">
                    <Wind className="w-4 h-4" /> 기상청 API (풍속, 강수, 기온)
                  </li>
                  <li className="flex items-center gap-2">
                    <Waves className="w-4 h-4" /> 해양정보 (파고, 조류, 수온)
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> 가시거리, 안개 정보
                  </li>
                </ul>
              </div>

              {/* AI Engine */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI 분석 엔진
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• 작업 유형별 가중치 적용</li>
                  <li>• 복합 위험 요소 분석</li>
                  <li>• 24시간 위험도 예측</li>
                  <li>• 과거 사고 패턴 학습</li>
                </ul>
              </div>

              {/* Output */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  알림 및 대응
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" /> 작업가능 (녹색)
                  </div>
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="w-4 h-4" /> 주의필요 (황색)
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-4 h-4" /> 작업중지 권고 (적색)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              작업 유형별 위험도 가중치
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">위험 요소</th>
                    <th className="text-center py-3 px-4">바지선 공사</th>
                    <th className="text-center py-3 px-4">잠수 작업</th>
                    <th className="text-center py-3 px-4">중량물 인양</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">풍속</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="destructive">35%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">10%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="destructive">45%</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">파고</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="destructive">35%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge>30%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge>25%</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">강수량</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">15%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">10%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">15%</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">가시거리</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">10%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge>20%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">15%</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">조류</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline">5%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge>30%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline">0%</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Expected Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              기대효과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">안전성 향상</h3>
                <p className="text-sm text-gray-600">
                  객관적 위험도 판단으로<br />
                  사고율 10% 이상 감소 기대
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">효율성 증대</h3>
                <p className="text-sm text-gray-600">
                  불필요한 작업 중단 감소<br />
                  공사 지연 비용 절감
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">의사결정 지원</h3>
                <p className="text-sm text-gray-600">
                  관리자 판단 부담 경감<br />
                  AI 기반 객관적 근거 제공
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicable Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600" />
              적용 대상
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-medium">바지선 공사</p>
                <p className="text-sm text-gray-500">어항 준설, 호안 공사</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-medium">잠수 작업</p>
                <p className="text-sm text-gray-500">수중 점검, 설치</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-medium">중량물 인양</p>
                <p className="text-sm text-gray-500">크레인 작업</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-medium">어항 시설물</p>
                <p className="text-sm text-gray-500">안전 점검</p>
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
