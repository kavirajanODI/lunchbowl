import {Colors} from 'assets/styles/colors';
import React from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import useFirebaseNotifications from 'utils/Notifications';
import {AuthProvider} from './src/context/AuthContext';
import MainNavigator from './src/navigations/MainNavigator';
import './src/utils/firebaseConfig';
import {ToastProvider} from 'components/Error/Toast/ToastProvider';

const App = () => {
  useFirebaseNotifications();
  return (
    <AuthProvider>
      <ToastProvider>       
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.white}
          translucent={true}
        />
        <SafeAreaView style={styles.safeArea}>
          <MainNavigator />
        </SafeAreaView>
      </ToastProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
  },
});

export default App;
