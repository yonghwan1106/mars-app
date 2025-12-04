'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Building2,
  Anchor,
  Shield,
  HeartPulse,
  AlertTriangle,
  Ship,
  Radio,
  MapPin,
  ChevronLeft,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface EmergencyContact {
  id: string;
  category: string;
  name: string;
  phone: string;
  description: string;
  icon: React.ElementType;
  color: string;
  available: string;
}

const emergencyContacts: EmergencyContact[] = [
  // 긴급 신고
  {
    id: '1',
    category: '긴급 신고',
    name: '해양경찰청',
    phone: '122',
    description: '해상 사고, 조난 신고',
    icon: Anchor,
    color: 'bg-blue-500',
    available: '24시간',
  },
  {
    id: '2',
    category: '긴급 신고',
    name: '소방청 (해상 구조)',
    phone: '119',
    description: '화재, 구조, 응급',
    icon: HeartPulse,
    color: 'bg-red-500',
    available: '24시간',
  },
  {
    id: '3',
    category: '긴급 신고',
    name: '경찰청',
    phone: '112',
    description: '범죄 신고, 긴급 상황',
    icon: Shield,
    color: 'bg-indigo-500',
    available: '24시간',
  },

  // 해양 관련 기관
  {
    id: '4',
    category: '해양 관련 기관',
    name: '한국해양교통안전공단',
    phone: '044-200-5832',
    description: '해양 안전 관리',
    icon: Ship,
    color: 'bg-cyan-500',
    available: '평일 09:00-18:00',
  },
  {
    id: '5',
    category: '해양 관련 기관',
    name: '해양수산부 상황실',
    phone: '044-200-5555',
    description: '해양 재난 대응',
    icon: Building2,
    color: 'bg-teal-500',
    available: '24시간',
  },
  {
    id: '6',
    category: '해양 관련 기관',
    name: '한국어촌어항공단',
    phone: '1899-0075',
    description: '어항 시설 관리',
    icon: Anchor,
    color: 'bg-blue-600',
    available: '평일 09:00-18:00',
  },

  // 기상 정보
  {
    id: '7',
    category: '기상 정보',
    name: '기상청',
    phone: '131',
    description: '기상 예보, 특보',
    icon: Radio,
    color: 'bg-sky-500',
    available: '24시간',
  },
  {
    id: '8',
    category: '기상 정보',
    name: '국립해양조사원',
    phone: '032-880-0300',
    description: '해양 관측 정보',
    icon: Ship,
    color: 'bg-blue-400',
    available: '평일 09:00-18:00',
  },

  // 산업 안전
  {
    id: '9',
    category: '산업 안전',
    name: '한국산업안전보건공단',
    phone: '052-703-0500',
    description: '산업 재해 예방',
    icon: Shield,
    color: 'bg-orange-500',
    available: '평일 09:00-18:00',
  },
  {
    id: '10',
    category: '산업 안전',
    name: '고용노동부 산재신고',
    phone: '1588-0075',
    description: '산업 재해 신고',
    icon: AlertTriangle,
    color: 'bg-amber-500',
    available: '평일 09:00-18:00',
  },
];

// 내부 담당자 연락처
const internalContacts = [
  {
    name: '안전보건실',
    contact: '이영희',
    phone: '010-1234-5678',
    role: '안전관리 총괄',
  },
  {
    name: '현장관리팀',
    contact: '김철수',
    phone: '010-2345-6789',
    role: '현장 총괄',
  },
  {
    name: '비상대응팀',
    contact: '박민수',
    phone: '010-3456-7890',
    role: '비상 상황 대응',
  },
  {
    name: '장비관리팀',
    contact: '최동현',
    phone: '010-4567-8901',
    role: '장비 및 자재',
  },
];

export default function EmergencyPage() {
  const { unreadAlertCount, lastUpdated, refreshData } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const copyToClipboard = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const groupedContacts = emergencyContacts.reduce((acc, contact) => {
    if (!acc[contact.category]) {
      acc[contact.category] = [];
    }
    acc[contact.category].push(contact);
    return acc;
  }, {} as Record<string, EmergencyContact[]>);

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
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              대시보드
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-600" />
              비상 연락망
            </h1>
            <p className="text-sm text-gray-500 mt-1">긴급 상황 시 연락처 안내</p>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800">긴급 상황 발생 시</h3>
                <p className="text-sm text-red-700">
                  해상 조난, 사고 발생 시 즉시 <span className="font-bold">122(해양경찰)</span> 또는{' '}
                  <span className="font-bold">119(소방)</span>에 신고하세요.
                </p>
              </div>
              <div className="flex gap-2">
                <a href="tel:122">
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Phone className="w-4 h-4" />
                    122 전화
                  </Button>
                </a>
                <a href="tel:119">
                  <Button className="bg-red-600 hover:bg-red-700 gap-2">
                    <Phone className="w-4 h-4" />
                    119 전화
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* External Contacts */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedContacts).map(([category, contacts]) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contacts.map(contact => {
                      const IconComponent = contact.icon;
                      return (
                        <div
                          key={contact.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className={`w-10 h-10 ${contact.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{contact.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {contact.available}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{contact.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">{contact.phone}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(contact.phone, contact.id)}
                            >
                              {copiedId === contact.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <a href={`tel:${contact.phone}`}>
                              <Button size="sm" className="gap-1">
                                <Phone className="w-4 h-4" />
                                전화
                              </Button>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Internal Contacts */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  내부 비상 연락망
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {internalContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{contact.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {contact.role}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{contact.contact}</span>
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Guide */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-800">비상 대응 순서</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <span>인명 안전 확보 및 응급 조치</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <span>122 또는 119 긴급 신고</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <span>내부 안전보건실 보고</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      4
                    </span>
                    <span>현장 보존 및 증거 확보</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      5
                    </span>
                    <span>사고 보고서 작성</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Useful Links */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">유용한 링크</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a
                    href="https://www.kcg.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm">해양경찰청</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href="https://www.mof.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm">해양수산부</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href="https://www.weather.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm">기상청</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href="https://www.koem.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm">해양환경공단</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
