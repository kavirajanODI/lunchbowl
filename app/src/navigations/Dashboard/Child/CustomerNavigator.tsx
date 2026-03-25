import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from 'screens/Dashboard/HomeScreen';
import MealDetailScreen from 'screens/Menu/MealDetailScreen';
import Notifications from 'screens/Notification/Notifications';
const Stack = createStackNavigator();
const CustomerNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MealDetailScreen"
        component={MealDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="notifications"
        component={Notifications}
        options={{headerShown: false}}
      />
 
    </Stack.Navigator>
  );
};

export default CustomerNavigator;
