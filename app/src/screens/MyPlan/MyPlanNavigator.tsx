import { createStackNavigator } from '@react-navigation/stack';
import { ToastProvider } from 'components/Error/Toast/ToastProvider';
import { LoadingModal } from 'components/LoadingModal/LoadingModal';
import { HolidayDateProvider } from 'context/calenderContext';
import { FoodProvider } from 'context/FoodContext';
import { MenuProvider } from 'context/MenuContext';
import { useRegistration } from 'context/RegistrationContext';
import { UserProfileProvider } from 'context/UserDataContext';
import React from 'react';
import PaymentWebView from 'screens/PaymentWebView';
import Registartion from 'screens/Subscription/Registration';
import RenewSubscription from 'screens/Subscription/RenewSubscription';
import MyPlanScreen from './Calender';
import FoodScreen from './FoodScreen';
import MenuSelectionScreen from './MenuSelection';
import { ChildProvider } from 'context/ChildContext';

const Stack = createStackNavigator();

const MyPlanNavigator = () => {
  
const { currentStep, loading, isSubscriptionExpired, subscriptionEndDate } = useRegistration();
if (loading || currentStep === null) {
  return <LoadingModal loading={true} setLoading={() => {}} />;
}

// A user with an active (non-expired) subscription should always go to the plan view,
// even if the step API returns an incomplete step value.
const hasActiveSubscription = !!subscriptionEndDate && !isSubscriptionExpired;

// Route to plan view if subscription active, renewal if expired, registration if incomplete
const initialScreen =
  hasActiveSubscription ? 'PlanCalendar' :
  isSubscriptionExpired ? 'RenewSubscription' :
  currentStep < 4 ? 'Registartion' :
  'PlanCalendar';

  return (
    <MenuProvider>
      <FoodProvider>
        <ToastProvider>
          <ChildProvider>
          <UserProfileProvider>
            <HolidayDateProvider>
              <Stack.Navigator initialRouteName={initialScreen}>
                <Stack.Screen
                  name="MenuSelection"
                  component={MenuSelectionScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="FoodList"
                  component={FoodScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="PlanCalendar"
                  component={MyPlanScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Registartion"
                  component={Registartion}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="RenewSubscription"
                  component={RenewSubscription}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="WebViewScreen"
                  component={PaymentWebView}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            </HolidayDateProvider>
          </UserProfileProvider>
          </ChildProvider>
        </ToastProvider>
      </FoodProvider>
    </MenuProvider>
  );
};

export default MyPlanNavigator;

