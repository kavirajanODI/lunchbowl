/**
 * AppConfigContext
 *
 * Fetches runtime business-logic settings from the backend (/api/app-config)
 * and provides them throughout the app.  Hardcoded defaults are used while the
 * fetch is in-flight or if the network is unavailable, so existing behaviour is
 * never broken.
 *
 * Usage:
 *   const { config } = useAppConfig();
 *   const cost = config.pricePerDayPerChild; // 200
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import httpAxiosClient from 'config/httpclient';

// ─── Type ───────────────────────────────────────────────────────────────────────

export interface AppConfig {
  pricePerDayPerChild: number;
  planDurations: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
  };
  singleChildDiscounts: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
  };
  multiChildDiscounts: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
  };
  multiChildThreshold: number;
  holidayMealPricePerChild: number;
}

// ─── Defaults (match the backend defaults so the app works offline) ──────────────

export const DEFAULT_APP_CONFIG: AppConfig = {
  pricePerDayPerChild: 200,
  planDurations: {
    oneMonth: 22,
    threeMonths: 66,
    sixMonths: 132,
  },
  singleChildDiscounts: {
    oneMonth: 0,
    threeMonths: 5,
    sixMonths: 10,
  },
  multiChildDiscounts: {
    oneMonth: 5,
    threeMonths: 15,
    sixMonths: 20,
  },
  multiChildThreshold: 2,
  holidayMealPricePerChild: 200,
};

// ─── Context ────────────────────────────────────────────────────────────────────

interface AppConfigContextType {
  config: AppConfig;
  isConfigLoaded: boolean;
  refreshConfig: () => Promise<void>;
}

const AppConfigContext = createContext<AppConfigContextType>({
  config: DEFAULT_APP_CONFIG,
  isConfigLoaded: false,
  refreshConfig: async () => {},
});

// ─── Provider ───────────────────────────────────────────────────────────────────

export const AppConfigProvider = ({children}: {children: ReactNode}) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  const refreshConfig = async () => {
    try {
      const response = await httpAxiosClient.get('/app-config/');
      if (response?.data?.success && response.data.data) {
        setConfig({...DEFAULT_APP_CONFIG, ...response.data.data});
      }
    } catch (err) {
      // Network unavailable — keep using defaults; silently fail
      console.warn('[AppConfig] Failed to fetch remote config, using defaults:', err);
    } finally {
      setIsConfigLoaded(true);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <AppConfigContext.Provider value={{config, isConfigLoaded, refreshConfig}}>
      {children}
    </AppConfigContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────────

export const useAppConfig = () => useContext(AppConfigContext);
