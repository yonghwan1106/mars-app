import { create } from 'zustand';
import { Alert, SiteWithRisk, DashboardSummary } from '@/types';
import { sites } from '@/data/sites';
import {
  generateEnvironmentData,
  calculateRiskAnalysis,
  generateInitialAlerts,
} from '@/data/mockGenerator';

interface AppState {
  // Sites data
  sitesWithRisk: SiteWithRisk[];
  selectedSiteId: string | null;

  // Alerts
  alerts: Alert[];
  unreadAlertCount: number;

  // Dashboard
  summary: DashboardSummary;

  // Last update timestamp
  lastUpdated: Date;

  // Actions
  refreshData: () => void;
  selectSite: (siteId: string | null) => void;
  markAlertAsRead: (alertId: string) => void;
  acknowledgeAlert: (alertId: string, userName: string) => void;
  addAlert: (alert: Alert) => void;
}

const calculateSummary = (sitesWithRisk: SiteWithRisk[], alerts: Alert[]): DashboardSummary => {
  return {
    totalSites: sitesWithRisk.length,
    safeSites: sitesWithRisk.filter(s => s.risk.riskLevel === 'safe').length,
    cautionSites: sitesWithRisk.filter(s => s.risk.riskLevel === 'caution').length,
    dangerSites: sitesWithRisk.filter(s => s.risk.riskLevel === 'danger').length,
    activeAlerts: alerts.filter(a => !a.acknowledgedAt).length,
    lastUpdated: new Date().toISOString(),
  };
};

const generateSitesWithRisk = (): SiteWithRisk[] => {
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

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  sitesWithRisk: [],
  selectedSiteId: null,
  alerts: [],
  unreadAlertCount: 0,
  summary: {
    totalSites: 0,
    safeSites: 0,
    cautionSites: 0,
    dangerSites: 0,
    activeAlerts: 0,
    lastUpdated: new Date().toISOString(),
  },
  lastUpdated: new Date(),

  // Actions
  refreshData: () => {
    const sitesWithRisk = generateSitesWithRisk();
    const currentAlerts = get().alerts.length > 0 ? get().alerts : generateInitialAlerts();

    // Check for level changes and generate new alerts
    const previousSites = get().sitesWithRisk;
    const newAlerts: Alert[] = [];

    if (previousSites.length > 0) {
      sitesWithRisk.forEach(site => {
        const prevSite = previousSites.find(s => s.id === site.id);
        if (prevSite && prevSite.risk.riskLevel !== site.risk.riskLevel) {
          // Level changed, generate alert
          const severity = site.risk.riskLevel === 'danger' ? 'critical' :
                          site.risk.riskLevel === 'caution' ? 'warning' : 'info';

          newAlerts.push({
            id: `alert-${Date.now()}-${site.id}`,
            siteId: site.id,
            siteName: site.name,
            type: 'level_change',
            severity,
            title: site.risk.riskLevel === 'danger' ? '위험 등급 상승' :
                   site.risk.riskLevel === 'caution' ? '주의 등급 변경' : '안전 상태 복귀',
            message: site.risk.message,
            previousLevel: prevSite.risk.riskLevel,
            currentLevel: site.risk.riskLevel,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    const allAlerts = [...newAlerts, ...currentAlerts].slice(0, 50); // Keep last 50 alerts
    const summary = calculateSummary(sitesWithRisk, allAlerts);

    set({
      sitesWithRisk,
      alerts: allAlerts,
      unreadAlertCount: allAlerts.filter(a => !a.readAt).length,
      summary,
      lastUpdated: new Date(),
    });
  },

  selectSite: (siteId) => {
    set({ selectedSiteId: siteId });
  },

  markAlertAsRead: (alertId) => {
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, readAt: new Date().toISOString() }
          : alert
      ),
      unreadAlertCount: state.alerts.filter(a => a.id !== alertId && !a.readAt).length,
    }));
  },

  acknowledgeAlert: (alertId, userName) => {
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              readAt: alert.readAt || new Date().toISOString(),
              acknowledgedAt: new Date().toISOString(),
              acknowledgedBy: userName,
            }
          : alert
      ),
    }));
  },

  addAlert: (alert) => {
    set(state => ({
      alerts: [alert, ...state.alerts].slice(0, 50),
      unreadAlertCount: state.unreadAlertCount + 1,
    }));
  },
}));
