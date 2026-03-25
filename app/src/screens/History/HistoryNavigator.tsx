import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrderHistoryScreen from './OrderHistoryScreen';
import HistoryDetailPage from './HistoryDetailPage';

const Stack = createStackNavigator();

const HistoryNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="OrderHistory">
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
    </Stack.Navigator>
  );
};

export default HistoryNavigator;
