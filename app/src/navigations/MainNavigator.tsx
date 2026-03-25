import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useAuth} from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../screens/Onboarding/SplashScreen';

const MainNavigator = () => {
  const {isLoggedIn, isProfileSetupDone, userId, isLoading} = useAuth();

  if (isLoading) {
    return <SplashScreen navigation={undefined} />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default MainNavigator;
