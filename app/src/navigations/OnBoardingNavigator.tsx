import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/Onboarding/SplashScreen';
import WalkThroughScreen from '../screens/Onboarding/WalkThroughScreen';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';

const Stack = createStackNavigator();

const OnBoardingNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const checkIntroStatus = async () => {
    try {
      const isAppIntroDone = await AsyncStorage.getItem('isAppIntroDone');
      setInitialRoute(
        isAppIntroDone === 'true' ? 'WelcomeScreen' : 'SplashScreen',
      );
    } catch (error) {
      console.error('Error reading isAppIntroDone from AsyncStorage', error);
      setInitialRoute('SplashScreen');
    }
  };

  useEffect(() => {
    checkIntroStatus();
  }, []);

  if (!initialRoute) {
    return null;
  }
  return (
    <Stack.Navigator initialRouteName={'SplashScreen'}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalkThroughScreen"
        component={WalkThroughScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      
    </Stack.Navigator>
  );
};

export default OnBoardingNavigator;
