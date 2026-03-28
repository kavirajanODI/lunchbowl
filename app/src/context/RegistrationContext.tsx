import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from 'context/AuthContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import RegistrationService from 'services/RegistartionService/registartion';
import UserService from 'services/userService';

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
      // Call Step-Check and account-details in parallel
      const [stepRes, profileRes]: any[] = await Promise.all([
        RegistrationService.registrationCheck({ _id: userId, path: 'Step-Check' }),
        UserService.getRegisteredUSerData(userId),
      ]);

      // Determine effective step: if the user has already paid, treat as step 4
      // regardless of what the Step-Check API returns (which may still have step:1
      // if the DB was not updated properly after payment).
      const apiStep = Number(stepRes?.data?.step ?? 1);
      const paymentStatus: string = profileRes?.data?.paymentStatus ?? '';
      const effectiveStep = paymentStatus === 'Success' ? Math.max(apiStep, 4) : apiStep;

      setCurrentStep(effectiveStep);
      await AsyncStorage.setItem('@registrationStep', String(effectiveStep));

      // Derive subscription end date from the profile (account-details) response,
      // which always returns populated subscriptions. Fall back to Step-Check
      // subscriptions for forward-compatibility.
      const profileSubs: any[] = profileRes?.data?.subscriptions || [];
      const stepSubs: any[] = stepRes?.data?.subscriptions || [];
      const subscriptions = profileSubs.length > 0 ? profileSubs : stepSubs;

      const activeSub =
        subscriptions.find((s: any) => s.status === 'active') ||
        subscriptions[subscriptions.length - 1] ||
        null;
      const endDate: string | null =
        activeSub?.endDate ||
        profileRes?.data?.subscriptionPlan?.endDate ||
        stepRes?.data?.subscriptionPlan?.endDate ||
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

