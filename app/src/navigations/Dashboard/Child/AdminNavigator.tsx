import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from 'screens/Dashboard/HomeScreen';


const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="CustomerDashboard"
        component={HomeScreen}
        options={{headerShown: false}}
      />
   
    </Stack.Navigator>
  );
};

export default AdminNavigator;
