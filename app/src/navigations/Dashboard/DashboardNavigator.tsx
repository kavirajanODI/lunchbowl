import {createStackNavigator} from '@react-navigation/stack';
import {MealProvider} from 'context/MealContext';
import React from 'react';
import UnderConstruction from 'screens/404Screen';
import HomeScreen from 'screens/Dashboard/HomeScreen';
import PaymentWebView from 'screens/PaymentWebView';
import HistoryDetailPage from 'screens/History/HistoryDetailPage';
import OrderHistoryScreen from 'screens/History/OrderHistoryScreen';
import MealDetailScreen from 'screens/Menu/MealDetailScreen';
import NotificationScreen from 'screens/Notification/Notifications';
import AboutUsScreen from 'screens/Settings/AboutUs/About';
import DietaryTipDetailsScreen from 'screens/Dashboard/Highlights/DietaryTips/DietaryTipsScreen';
import DietaryTipsScreen from 'screens/Dashboard/Highlights/DietaryTips/Tips';
import EditProfileScreen from 'screens/Settings/EditProfile/EditProfileScreen';
import FaqScreen from 'screens/Settings/Faq/Faq';
import HelpCenterScreen from 'screens/Settings/HelpCenter/Help';
import OfferDetailScreen from 'screens/Settings/Offers/OfferDetailScreen';
import OffersScreen from 'screens/Settings/Offers/OffersScreen';
import ParentChildInfoScreen from 'screens/Settings/ParentChildInfo/ParentChildInfoScreen';
import TermsAndPolicyScreen from 'screens/Settings/PrivacyPolicy/PrivacyPolicy';
import SettingsScreen from 'screens/Settings/SettingScreen';
import WalletScreen from 'screens/Settings/Wallet/WalletScreen';
import ChangePasswordScreen from 'screens/Settings/ChangePassword/ChangePasswordScreen';
import {UserProfileProvider} from 'context/UserDataContext';

const Stack = createStackNavigator();
const DashboardNavigator = () => {
  return (
    <MealProvider>
      <UserProfileProvider>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="UnderConstruction"
            component={UnderConstruction}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MealDetailScreen"
            component={MealDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OffersScreen"
            component={OffersScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FaqScreen"
            component={FaqScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OfferDetailScreen"
            component={OfferDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HelpCenterScreen"
            component={HelpCenterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DietaryTipsScreen"
            component={DietaryTipsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DietaryTipDetailsScreen"
            component={DietaryTipDetailsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AboutUsScreen"
            component={AboutUsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TermsAndPolicyScreen"
            component={TermsAndPolicyScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ParentChildInfoScreen"
            component={ParentChildInfoScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HistoryDetailPage"
            component={HistoryDetailPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="WalletScreen"
            component={WalletScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="WebViewScreen"
            component={PaymentWebView}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </UserProfileProvider>
    </MealProvider>
  );
};

export default DashboardNavigator;

