// Site Types
export type SiteType = 'barge' | 'diving' | 'lifting' | 'general';
export type SiteStatus = 'active' | 'paused' | 'completed';
export type RiskLevel = 'safe' | 'caution' | 'danger';
export type Recommendation = 'proceed' | 'caution' | 'stop';
export type Region = '서해' | '남해' | '동해';

export interface Site {
  id: string;
  name: string;
  type: SiteType;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: Region;
  };
  manager: {
    name: string;
    phone: string;
  };
  status: SiteStatus;
  createdAt: string;
}

// Weather & Ocean Data
export interface WeatherData {
  windSpeed: number;        // m/s
  windDirection: number;    // degrees
  precipitation: number;    // mm
  temperature: number;      // °C
  humidity: number;         // %
  visibility: number;       // km
}

export interface OceanData {
  waveHeight: number;       // m
  wavePeriod: number;       // seconds
  tidalCurrent: number;     // knot
  waterTemperature: number; // °C
}

export interface EnvironmentData {
  siteId: string;
  timestamp: string;
  weather: WeatherData;
  ocean: OceanData;
}

// Risk Analysis
export interface RiskFactor {
  score: number;
  weight: number;
  value: number;
  unit: string;
  threshold: {
    safe: number;
    caution: number;
    danger: number;
  };
}

export interface RiskAnalysis {
  siteId: string;
  timestamp: string;
  overallScore: number;
  riskLevel: RiskLevel;
  recommendation: Recommendation;
  factors: {
    wind: RiskFactor;
    wave: RiskFactor;
    precipitation: RiskFactor;
    visibility: RiskFactor;
    tidal: RiskFactor;
  };
  aiConfidence: number;
  message: string;
}

// Alerts
export type AlertType = 'level_change' | 'threshold' | 'forecast' | 'system';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  siteId: string;
  siteName: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  previousLevel?: RiskLevel;
  currentLevel?: RiskLevel;
  createdAt: string;
  readAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

// Forecast
export interface ForecastPoint {
  timestamp: string;
  hour: number;
  riskScore: number;
  riskLevel: RiskLevel;
  weather: {
    windSpeed: number;
    waveHeight: number;
    precipitation: number;
  };
}

// Dashboard Summary
export interface DashboardSummary {
  totalSites: number;
  safeSites: number;
  cautionSites: number;
  dangerSites: number;
  activeAlerts: number;
  lastUpdated: string;
}

// Site with full data
export interface SiteWithRisk extends Site {
  environment: EnvironmentData;
  risk: RiskAnalysis;
}
