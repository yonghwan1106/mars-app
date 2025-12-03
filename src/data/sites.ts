import { Site } from '@/types';

export const sites: Site[] = [
  {
    id: 'site-001',
    name: '인천항 제2부두 확장공사',
    type: 'barge',
    location: {
      lat: 37.4563,
      lng: 126.6052,
      address: '인천광역시 중구 항동7가',
      region: '서해',
    },
    manager: {
      name: '김철수',
      phone: '010-1234-5678',
    },
    status: 'active',
    createdAt: '2024-03-15',
  },
  {
    id: 'site-002',
    name: '부산 영도 방파제 보수',
    type: 'diving',
    location: {
      lat: 35.0911,
      lng: 129.0689,
      address: '부산광역시 영도구 동삼동',
      region: '남해',
    },
    manager: {
      name: '이영희',
      phone: '010-2345-6789',
    },
    status: 'active',
    createdAt: '2024-04-01',
  },
  {
    id: 'site-003',
    name: '여수 해상케이블 설치',
    type: 'lifting',
    location: {
      lat: 34.7604,
      lng: 127.6622,
      address: '전라남도 여수시 돌산읍',
      region: '남해',
    },
    manager: {
      name: '박민수',
      phone: '010-3456-7890',
    },
    status: 'active',
    createdAt: '2024-05-10',
  },
  {
    id: 'site-004',
    name: '포항 신항만 준설공사',
    type: 'barge',
    location: {
      lat: 36.0190,
      lng: 129.3650,
      address: '경상북도 포항시 남구 구룡포읍',
      region: '동해',
    },
    manager: {
      name: '최동현',
      phone: '010-4567-8901',
    },
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: 'site-005',
    name: '제주 서귀포 어항 정비',
    type: 'diving',
    location: {
      lat: 33.2411,
      lng: 126.5597,
      address: '제주특별자치도 서귀포시 서귀동',
      region: '남해',
    },
    manager: {
      name: '정수연',
      phone: '010-5678-9012',
    },
    status: 'active',
    createdAt: '2024-06-01',
  },
  {
    id: 'site-006',
    name: '울산 온산항 방파제',
    type: 'barge',
    location: {
      lat: 35.4264,
      lng: 129.3553,
      address: '울산광역시 울주군 온산읍',
      region: '동해',
    },
    manager: {
      name: '강지훈',
      phone: '010-6789-0123',
    },
    status: 'active',
    createdAt: '2024-04-15',
  },
  {
    id: 'site-007',
    name: '목포 해상교량 기초공사',
    type: 'barge',
    location: {
      lat: 34.7936,
      lng: 126.3819,
      address: '전라남도 목포시 달동',
      region: '서해',
    },
    manager: {
      name: '윤서준',
      phone: '010-7890-1234',
    },
    status: 'active',
    createdAt: '2024-03-01',
  },
  {
    id: 'site-008',
    name: '강릉 주문진 어항 준설',
    type: 'barge',
    location: {
      lat: 37.8947,
      lng: 128.8306,
      address: '강원도 강릉시 주문진읍',
      region: '동해',
    },
    manager: {
      name: '임하은',
      phone: '010-8901-2345',
    },
    status: 'active',
    createdAt: '2024-05-20',
  },
  {
    id: 'site-009',
    name: '통영 해저터널 점검',
    type: 'diving',
    location: {
      lat: 34.8544,
      lng: 128.4331,
      address: '경상남도 통영시 당동',
      region: '남해',
    },
    manager: {
      name: '조현우',
      phone: '010-9012-3456',
    },
    status: 'active',
    createdAt: '2024-06-10',
  },
  {
    id: 'site-010',
    name: '군산 새만금 호안공사',
    type: 'barge',
    location: {
      lat: 35.9678,
      lng: 126.7136,
      address: '전라북도 군산시 비응도동',
      region: '서해',
    },
    manager: {
      name: '한예진',
      phone: '010-0123-4567',
    },
    status: 'active',
    createdAt: '2024-04-25',
  },
];

export const getSiteById = (id: string): Site | undefined => {
  return sites.find(site => site.id === id);
};

export const getSiteTypeLabel = (type: Site['type']): string => {
  const labels = {
    barge: '바지선 공사',
    diving: '잠수 작업',
    lifting: '중량물 인양',
    general: '일반 공사',
  };
  return labels[type];
};
