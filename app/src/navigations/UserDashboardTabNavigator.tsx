import {createStackNavigator} from '@react-navigation/stack';
import {UserProfileProvider} from 'context/UserDataContext';
import React from 'react';
import UserDashboardScreen from 'screens/Settings/UserDashboard/UserDashboardScreen';
import EditParentDetailsScreen from 'screens/Settings/UserDashboard/EditParentDetailsScreen';
import EditChildDetailsScreen from 'screens/Settings/UserDashboard/EditChildDetailsScreen';
import AddChildScreen from 'screens/Subscription/AddChildScreen';
import AddChildPaymentScreen from 'screens/Subscription/AddChildPaymentScreen';
import PaymentWebView from 'screens/PaymentWebView';

const Stack = createStackNavigator();

const UserDashboardTabNavigator = () => {
  return (
    <UserProfileProvider>
      <Stack.Navigator initialRouteName="UserDashboardScreen">
        <Stack.Screen
          name="UserDashboardScreen"
          component={UserDashboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditParentDetailsScreen"
          component={EditParentDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditChildDetailsScreen"
          component={EditChildDetailsScreen}
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
      </Stack.Navigator>
    </UserProfileProvider>
  );
};

export default UserDashboardTabNavigator;
