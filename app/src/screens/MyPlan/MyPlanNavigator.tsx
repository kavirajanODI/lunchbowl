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
import AddChildScreen from 'screens/Subscription/AddChildScreen';
import AddChildPaymentScreen from 'screens/Subscription/AddChildPaymentScreen';
import PaymentSuccessScreen from 'screens/Payment/PaymentSuccessScreen';
import PaymentFailedScreen from 'screens/Payment/PaymentFailedScreen';
import MyPlanScreen from './Calender';
import FoodScreen from './FoodScreen';
import MenuSelectionScreen from './MenuSelection';
import { ChildProvider } from 'context/ChildContext';

const Stack = createStackNavigator();

const MyPlanNavigator = () => {

const { currentStep, loading } = useRegistration();
if (loading) {
  return <LoadingModal loading={true} setLoading={() => {}} />;
}

  return (
    <MenuProvider>
      <FoodProvider>
        <ToastProvider>
          <ChildProvider>
          <UserProfileProvider>
            <HolidayDateProvider>
              <Stack.Navigator initialRouteName="PlanCalendar">
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
                  name="AddChildScreen"
                  component={AddChildScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="AddChildPaymentScreen"
                  component={AddChildPaymentScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="WebViewScreen"
                  component={PaymentWebView}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="PaymentSuccess"
                  component={PaymentSuccessScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="PaymentFailed"
                  component={PaymentFailedScreen}
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

