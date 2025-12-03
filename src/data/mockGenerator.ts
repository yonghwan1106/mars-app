import {
  EnvironmentData,
  RiskAnalysis,
  RiskLevel,
  Recommendation,
  Alert,
  ForecastPoint,
  Site,
} from '@/types';
import { sites } from './sites';

// Helper functions
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomVariation = (base: number, variance: number): number => {
  return base + (Math.random() - 0.5) * 2 * variance;
};

// Risk calculation weights by site type
const weights: Record<string, Record<string, number>> = {
  barge: { wind: 0.35, wave: 0.35, precipitation: 0.15, visibility: 0.10, tidal: 0.05 },
  diving: { wind: 0.10, wave: 0.30, precipitation: 0.10, visibility: 0.20, tidal: 0.30 },
  lifting: { wind: 0.45, wave: 0.25, precipitation: 0.15, visibility: 0.15, tidal: 0.00 },
  general: { wind: 0.30, wave: 0.30, precipitation: 0.20, visibility: 0.10, tidal: 0.10 },
};

// Risk score calculation for each factor
const calculateWindRisk = (windSpeed: number): number => {
  if (windSpeed <= 7) return (windSpeed / 7) * 30;
  if (windSpeed <= 13) return 30 + ((windSpeed - 7) / 6) * 30;
  if (windSpeed <= 20) return 60 + ((windSpeed - 13) / 7) * 20;
  return Math.min(100, 80 + ((windSpeed - 20) / 10) * 20);
};

const calculateWaveRisk = (waveHeight: number): number => {
  if (waveHeight <= 0.5) return (waveHeight / 0.5) * 20;
  if (waveHeight <= 1.5) return 20 + ((waveHeight - 0.5) / 1) * 30;
  if (waveHeight <= 2.5) return 50 + ((waveHeight - 1.5) / 1) * 25;
  return Math.min(100, 75 + ((waveHeight - 2.5) / 1.5) * 25);
};

const calculatePrecipitationRisk = (precipitation: number): number => {
  if (precipitation === 0) return 0;
  if (precipitation <= 3) return 10 + (precipitation / 3) * 30;
  if (precipitation <= 15) return 40 + ((precipitation - 3) / 12) * 30;
  return Math.min(100, 70 + ((precipitation - 15) / 15) * 30);
};

const calculateVisibilityRisk = (visibility: number): number => {
  if (visibility >= 10) return 0;
  if (visibility >= 5) return ((10 - visibility) / 5) * 30;
  if (visibility >= 1) return 30 + ((5 - visibility) / 4) * 40;
  return Math.min(100, 70 + ((1 - visibility) / 1) * 30);
};

const calculateTidalRisk = (tidalCurrent: number): number => {
  if (tidalCurrent <= 1) return (tidalCurrent / 1) * 20;
  if (tidalCurrent <= 2) return 20 + ((tidalCurrent - 1) / 1) * 30;
  if (tidalCurrent <= 3) return 50 + ((tidalCurrent - 2) / 1) * 30;
  return Math.min(100, 80 + ((tidalCurrent - 3) / 2) * 20);
};

// Pre-defined scenarios for each site (for consistent demo experience)
interface SiteScenario {
  baseWeather: {
    windSpeed: number;
    precipitation: number;
    visibility: number;
  };
  baseOcean: {
    waveHeight: number;
    tidalCurrent: number;
  };
  variance: number; // How much values can vary
}

const siteScenarios: Record<string, SiteScenario> = {
  'site-001': { // 인천항 - 안전
    baseWeather: { windSpeed: 5, precipitation: 0, visibility: 15 },
    baseOcean: { waveHeight: 0.3, tidalCurrent: 0.5 },
    variance: 0.2,
  },
  'site-002': { // 부산 영도 - 주의
    baseWeather: { windSpeed: 9, precipitation: 0, visibility: 10 },
    baseOcean: { waveHeight: 1.2, tidalCurrent: 1.5 },
    variance: 0.3,
  },
  'site-003': { // 여수 - 안전
    baseWeather: { windSpeed: 6, precipitation: 0, visibility: 12 },
    baseOcean: { waveHeight: 0.5, tidalCurrent: 0.8 },
    variance: 0.2,
  },
  'site-004': { // 포항 - 위험
    baseWeather: { windSpeed: 16, precipitation: 2, visibility: 6 },
    baseOcean: { waveHeight: 2.3, tidalCurrent: 2.0 },
    variance: 0.25,
  },
  'site-005': { // 제주 서귀포 - 안전
    baseWeather: { windSpeed: 4, precipitation: 0, visibility: 18 },
    baseOcean: { waveHeight: 0.4, tidalCurrent: 0.6 },
    variance: 0.2,
  },
  'site-006': { // 울산 온산 - 주의
    baseWeather: { windSpeed: 10, precipitation: 1, visibility: 8 },
    baseOcean: { waveHeight: 1.0, tidalCurrent: 1.2 },
    variance: 0.3,
  },
  'site-007': { // 목포 - 안전
    baseWeather: { windSpeed: 5, precipitation: 0, visibility: 14 },
    baseOcean: { waveHeight: 0.4, tidalCurrent: 0.7 },
    variance: 0.2,
  },
  'site-008': { // 강릉 주문진 - 안전
    baseWeather: { windSpeed: 6, precipitation: 0, visibility: 16 },
    baseOcean: { waveHeight: 0.6, tidalCurrent: 0.4 },
    variance: 0.2,
  },
  'site-009': { // 통영 - 주의
    baseWeather: { windSpeed: 8, precipitation: 0, visibility: 9 },
    baseOcean: { waveHeight: 0.9, tidalCurrent: 1.8 },
    variance: 0.3,
  },
  'site-010': { // 군산 새만금 - 안전
    baseWeather: { windSpeed: 5, precipitation: 0, visibility: 13 },
    baseOcean: { waveHeight: 0.3, tidalCurrent: 0.5 },
    variance: 0.2,
  },
};

// Generate environment data for a site
export const generateEnvironmentData = (siteId: string): EnvironmentData => {
  const scenario = siteScenarios[siteId] || siteScenarios['site-001'];
  const v = scenario.variance;

  return {
    siteId,
    timestamp: new Date().toISOString(),
    weather: {
      windSpeed: Math.max(0, randomVariation(scenario.baseWeather.windSpeed, scenario.baseWeather.windSpeed * v)),
      windDirection: randomInRange(0, 360),
      precipitation: Math.max(0, randomVariation(scenario.baseWeather.precipitation, Math.max(1, scenario.baseWeather.precipitation * v))),
      temperature: randomInRange(15, 25),
      humidity: randomInRange(60, 80),
      visibility: Math.max(1, randomVariation(scenario.baseWeather.visibility, scenario.baseWeather.visibility * v)),
    },
    ocean: {
      waveHeight: Math.max(0, randomVariation(scenario.baseOcean.waveHeight, scenario.baseOcean.waveHeight * v)),
      wavePeriod: randomInRange(4, 10),
      tidalCurrent: Math.max(0, randomVariation(scenario.baseOcean.tidalCurrent, scenario.baseOcean.tidalCurrent * v)),
      waterTemperature: randomInRange(18, 24),
    },
  };
};

// Calculate risk analysis for environment data
export const calculateRiskAnalysis = (
  environment: EnvironmentData,
  siteType: Site['type']
): RiskAnalysis => {
  const w = weights[siteType];

  const windScore = calculateWindRisk(environment.weather.windSpeed);
  const waveScore = calculateWaveRisk(environment.ocean.waveHeight);
  const precipScore = calculatePrecipitationRisk(environment.weather.precipitation);
  const visibilityScore = calculateVisibilityRisk(environment.weather.visibility);
  const tidalScore = calculateTidalRisk(environment.ocean.tidalCurrent);

  const overallScore = Math.round(
    windScore * w.wind +
    waveScore * w.wave +
    precipScore * w.precipitation +
    visibilityScore * w.visibility +
    tidalScore * w.tidal
  );

  let riskLevel: RiskLevel;
  let recommendation: Recommendation;
  let message: string;

  if (overallScore <= 40) {
    riskLevel = 'safe';
    recommendation = 'proceed';
    message = '현재 기상 및 해양 조건이 양호합니다. 정상 작업을 진행하세요.';
  } else if (overallScore <= 70) {
    riskLevel = 'caution';
    recommendation = 'caution';
    message = '일부 위험 요소가 감지되었습니다. 안전 조치를 강화하고 상황을 주시하며 작업하세요.';
  } else {
    riskLevel = 'danger';
    recommendation = 'stop';
    const mainFactor = getMainRiskFactor(environment);
    message = `${mainFactor}로 인해 작업 위험도가 높습니다. 즉시 작업을 중단하고 안전한 장소로 대피하세요.`;
  }

  return {
    siteId: environment.siteId,
    timestamp: environment.timestamp,
    overallScore,
    riskLevel,
    recommendation,
    factors: {
      wind: {
        score: Math.round(windScore),
        weight: w.wind,
        value: environment.weather.windSpeed,
        unit: 'm/s',
        threshold: { safe: 7, caution: 13, danger: 20 },
      },
      wave: {
        score: Math.round(waveScore),
        weight: w.wave,
        value: environment.ocean.waveHeight,
        unit: 'm',
        threshold: { safe: 0.5, caution: 1.5, danger: 2.5 },
      },
      precipitation: {
        score: Math.round(precipScore),
        weight: w.precipitation,
        value: environment.weather.precipitation,
        unit: 'mm',
        threshold: { safe: 0, caution: 3, danger: 15 },
      },
      visibility: {
        score: Math.round(visibilityScore),
        weight: w.visibility,
        value: environment.weather.visibility,
        unit: 'km',
        threshold: { safe: 10, caution: 5, danger: 1 },
      },
      tidal: {
        score: Math.round(tidalScore),
        weight: w.tidal,
        value: environment.ocean.tidalCurrent,
        unit: 'knot',
        threshold: { safe: 1, caution: 2, danger: 3 },
      },
    },
    aiConfidence: randomInRange(85, 98),
    message,
  };
};

const getMainRiskFactor = (environment: EnvironmentData): string => {
  const factors: { name: string; score: number }[] = [
    { name: '강풍', score: calculateWindRisk(environment.weather.windSpeed) },
    { name: '높은 파고', score: calculateWaveRisk(environment.ocean.waveHeight) },
    { name: '강수', score: calculatePrecipitationRisk(environment.weather.precipitation) },
    { name: '낮은 가시거리', score: calculateVisibilityRisk(environment.weather.visibility) },
    { name: '강한 조류', score: calculateTidalRisk(environment.ocean.tidalCurrent) },
  ];

  factors.sort((a, b) => b.score - a.score);
  return factors[0].name;
};

// Generate forecast data for next 24 hours
export const generateForecast = (siteId: string, siteType: Site['type']): ForecastPoint[] => {
  const scenario = siteScenarios[siteId] || siteScenarios['site-001'];
  const forecast: ForecastPoint[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours();

    // Simulate weather patterns (worse in afternoon for wind, better at night)
    const timeMultiplier = 1 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);

    const windSpeed = Math.max(0, scenario.baseWeather.windSpeed * timeMultiplier + (Math.random() - 0.5) * 4);
    const waveHeight = Math.max(0, scenario.baseOcean.waveHeight * timeMultiplier + (Math.random() - 0.5) * 0.5);
    const precipitation = Math.max(0, scenario.baseWeather.precipitation * (1 + Math.random() * 0.5));

    const envData: EnvironmentData = {
      siteId,
      timestamp: time.toISOString(),
      weather: {
        windSpeed,
        windDirection: 0,
        precipitation,
        temperature: 20,
        humidity: 70,
        visibility: scenario.baseWeather.visibility,
      },
      ocean: {
        waveHeight,
        wavePeriod: 6,
        tidalCurrent: scenario.baseOcean.tidalCurrent,
        waterTemperature: 20,
      },
    };

    const risk = calculateRiskAnalysis(envData, siteType);

    forecast.push({
      timestamp: time.toISOString(),
      hour,
      riskScore: risk.overallScore,
      riskLevel: risk.riskLevel,
      weather: {
        windSpeed: Math.round(windSpeed * 10) / 10,
        waveHeight: Math.round(waveHeight * 10) / 10,
        precipitation: Math.round(precipitation * 10) / 10,
      },
    });
  }

  return forecast;
};

// Generate initial alerts
export const generateInitialAlerts = (): Alert[] => {
  const now = new Date();

  return [
    {
      id: 'alert-001',
      siteId: 'site-004',
      siteName: '포항 신항만 준설공사',
      type: 'level_change',
      severity: 'critical',
      title: '위험 등급 상승',
      message: '풍속 16m/s, 파고 2.3m로 위험 수준입니다. 즉시 작업을 중단해주세요.',
      previousLevel: 'caution',
      currentLevel: 'danger',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-002',
      siteId: 'site-002',
      siteName: '부산 영도 방파제 보수',
      type: 'threshold',
      severity: 'warning',
      title: '파고 주의 수준 도달',
      message: '현재 파고 1.2m로 잠수 작업 주의가 필요합니다.',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-003',
      siteId: 'site-006',
      siteName: '울산 온산항 방파제',
      type: 'forecast',
      severity: 'warning',
      title: '기상 악화 예보',
      message: '오후 3시경 풍속 12m/s 이상으로 상승할 것으로 예측됩니다.',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-004',
      siteId: 'site-009',
      siteName: '통영 해저터널 점검',
      type: 'threshold',
      severity: 'warning',
      title: '조류 주의',
      message: '조류 속도 1.8knot으로 잠수 작업 시 주의가 필요합니다.',
      createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-005',
      siteId: 'site-001',
      siteName: '인천항 제2부두 확장공사',
      type: 'level_change',
      severity: 'info',
      title: '안전 상태 유지',
      message: '모든 조건이 양호합니다. 안전하게 작업을 진행하세요.',
      previousLevel: 'safe',
      currentLevel: 'safe',
      createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      readAt: new Date(now.getTime() - 55 * 60 * 1000).toISOString(),
    },
  ];
};

// Get all sites with current risk data
export const getAllSitesWithRisk = () => {
  return sites.map(site => {
    const environment = generateEnvironmentData(site.id);
    const risk = calculateRiskAnalysis(environment, site.type);
    return {
      ...site,
      environment,
      risk,
    };
  });
};
