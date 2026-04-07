import {createStackNavigator} from '@react-navigation/stack';
import {UserProfileProvider} from 'context/UserDataContext';
import React from 'react';
import UserDashboardScreen from 'screens/Settings/UserDashboard/UserDashboardScreen';

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
      </Stack.Navigator>
    </UserProfileProvider>
  );
};

export default UserDashboardTabNavigator;
