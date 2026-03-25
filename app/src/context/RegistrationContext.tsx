import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from 'context/AuthContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import RegistrationService from 'services/RegistartionService/registartion';

type RegistrationContextType = {
  currentStep: number | null;
  hasCompletedRegistration: boolean;
  isSubscriptionExpired: boolean;
  subscriptionEndDate: string | null;
  loading: boolean;
  refreshRegistration: () => Promise<void>;
};

const RegistrationContext = createContext<RegistrationContextType>({
  currentStep: null,
  hasCompletedRegistration: false,
  isSubscriptionExpired: false,
  subscriptionEndDate: null,
  loading: true,
  refreshRegistration: async () => {},
});

export const RegistrationProvider = ({ children }: any) => {
  const { userId } = useAuth();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRegistrationStatus = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res: any = await RegistrationService.registrationCheck({ _id: userId, path: 'Step-Check' });
      const fetchedStep = Number(res?.data?.step);
      setCurrentStep(fetchedStep);
      await AsyncStorage.setItem('@registrationStep', String(fetchedStep));

      // Persist subscription end date for expiry check.
      // The API returns subscriptions as an array; fall back to subscriptionPlan for
      // older/alternative response shapes.
      const subscriptions: any[] = res?.data?.subscriptions || [];
      const activeSub =
        subscriptions.find((s: any) => s.status === 'active') ||
        subscriptions[subscriptions.length - 1] ||
        null;
      const endDate: string | null =
        activeSub?.endDate ||
        res?.data?.subscriptionPlan?.endDate ||
        null;
      setSubscriptionEndDate(endDate);
      if (endDate) {
        await AsyncStorage.setItem('@subscriptionEndDate', endDate);
      } else {
        await AsyncStorage.removeItem('@subscriptionEndDate');
      }
    } catch (err) {
      console.log('Registration check API failed:', err);
      // Fall back to cached values if available
      const [cachedStep, cachedEndDate] = await Promise.all([
        AsyncStorage.getItem('@registrationStep'),
        AsyncStorage.getItem('@subscriptionEndDate'),
      ]);
      if (cachedStep) {
        setCurrentStep(Number(cachedStep));
      }
      if (cachedEndDate) {
        setSubscriptionEndDate(cachedEndDate);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Restore cached state so it is available as fallback if the API fails
      const [cachedStep, cachedEndDate] = await Promise.all([
        AsyncStorage.getItem('@registrationStep'),
        AsyncStorage.getItem('@subscriptionEndDate'),
      ]);
      if (cachedStep) {
        setCurrentStep(Number(cachedStep));
      }
      if (cachedEndDate) {
        setSubscriptionEndDate(cachedEndDate);
      }
      // Always wait for the API so routing decisions use authoritative data.
      // loading stays true until fetchRegistrationStatus sets it false in finally.
      await fetchRegistrationStatus();
    };
    init();
  }, [userId]);

  const isSubscriptionExpired = (() => {
    if (!subscriptionEndDate) return false;
    return new Date(subscriptionEndDate) < new Date();
  })();

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        hasCompletedRegistration: !!currentStep && currentStep >= 4,
        isSubscriptionExpired,
        subscriptionEndDate,
        loading,
        refreshRegistration: fetchRegistrationStatus,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);

