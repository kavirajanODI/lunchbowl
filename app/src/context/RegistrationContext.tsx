import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from 'context/AuthContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import RegistrationService from 'services/RegistartionService/registartion';
import UserService from 'services/userService';

type RegistrationContextType = {
  currentStep: number | null;
  hasCompletedRegistration: boolean;
  hasPlanHistory: boolean;
  isSubscriptionExpired: boolean;
  subscriptionEndDate: string | null;
  loading: boolean;
  refreshRegistration: () => Promise<void>;
};

const RegistrationContext = createContext<RegistrationContextType>({
  currentStep: null,
  hasCompletedRegistration: false,
  hasPlanHistory: false,
  isSubscriptionExpired: false,
  subscriptionEndDate: null,
  loading: true,
  refreshRegistration: async () => {},
});

export const RegistrationProvider = ({ children }: any) => {
  const { userId } = useAuth();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [hasPlanHistory, setHasPlanHistory] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRegistrationStatus = async () => {
    if (!userId) {
      setCurrentStep(null);
      setHasPlanHistory(false);
      setSubscriptionEndDate(null);
      setLoading(false);
      return;
    }
    try {
      const [registrationRes, accountDetailsRes]: any = await Promise.all([
        RegistrationService.registrationCheck({ _id: userId, path: 'Step-Check' }),
        UserService.getRegisteredUSerData(userId),
      ]);

      const fetchedStep = Number(registrationRes?.data?.step);
      setCurrentStep(fetchedStep);
      await AsyncStorage.setItem('@registrationStep', String(fetchedStep));

      // Step-Check only returns step/freeTrial, so plan history must come from
      // account-details/Form data AND from the step value itself.
      // step >= 4 means the user completed the full registration + payment flow.
      const accountData = accountDetailsRes?.data;
      const subscriptions: any[] = Array.isArray(accountData?.subscriptions)
        ? accountData.subscriptions
        : [];
      const nextHasPlanHistory =
        fetchedStep >= 4 ||
        subscriptions.length > 0 ||
        Number(accountData?.subscriptionCount || 0) > 0;
      setHasPlanHistory(nextHasPlanHistory);
      await AsyncStorage.setItem(
        '@hasPlanHistory',
        nextHasPlanHistory ? 'true' : 'false',
      );
      const latestSub = subscriptions
        .filter((s: any) => !!s?.endDate)
        .sort(
          (a: any, b: any) =>
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
        )[0] || null;
      const activeSub =
        subscriptions.find((s: any) => s.status === 'active') || latestSub;
      const endDate: string | null = activeSub?.endDate || null;
      setSubscriptionEndDate(endDate);
      if (endDate) {
        await AsyncStorage.setItem('@subscriptionEndDate', endDate);
      } else {
        await AsyncStorage.removeItem('@subscriptionEndDate');
      }
    } catch (err) {
      console.log('Registration/account details API failed:', err);
      // Fall back to cached values if available
      const [cachedStep, cachedEndDate, cachedHasPlanHistory] = await Promise.all([
        AsyncStorage.getItem('@registrationStep'),
        AsyncStorage.getItem('@subscriptionEndDate'),
        AsyncStorage.getItem('@hasPlanHistory'),
      ]);
      if (cachedStep) {
        setCurrentStep(Number(cachedStep));
      }
      if (cachedEndDate) {
        setSubscriptionEndDate(cachedEndDate);
      }
      if (cachedHasPlanHistory) {
        setHasPlanHistory(cachedHasPlanHistory === 'true');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Restore cached state so it is available as fallback if the API fails
      const [cachedStep, cachedEndDate, cachedHasPlanHistory] = await Promise.all([
        AsyncStorage.getItem('@registrationStep'),
        AsyncStorage.getItem('@subscriptionEndDate'),
        AsyncStorage.getItem('@hasPlanHistory'),
      ]);
      if (cachedStep) {
        setCurrentStep(Number(cachedStep));
      }
      if (cachedEndDate) {
        setSubscriptionEndDate(cachedEndDate);
      }
      if (cachedHasPlanHistory) {
        setHasPlanHistory(cachedHasPlanHistory === 'true');
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
        hasPlanHistory,
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
