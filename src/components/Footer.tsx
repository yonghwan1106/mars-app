'use client';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          <p className="font-medium text-gray-700 mb-1">
            MARS - Maritime AI Risk-prediction System
          </p>
          <p>AI 기반 해상작업 위험예측 시스템</p>
          <p className="mt-2 text-blue-600 font-semibold">
            한국어촌어항공단 2025년 안전혁신 공모전 출품작
          </p>
          <p className="mt-1 text-gray-600">
            제작: 박용환 (크리에이티브 넥서스)
          </p>
        </div>
      </div>
    </footer>
  );
}
