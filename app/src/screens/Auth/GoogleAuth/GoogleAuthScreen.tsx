import React, {useState} from 'react';
import {View, Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SvgXml} from 'react-native-svg';
import {API_URL} from '../../../config/apiConfig';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {googleIcon} from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const GoogleAuthScreen = ({navigation}: {navigation: any}) => {
  const [showWebView, setShowWebView] = useState(false);

  const handleGoogleLogin = () => {
    setShowWebView(true);
  };

  const extractTokenFromUrl = (url: string): string | null => {
    const tokenMatch = url.match(/token=([^&]+)/);
    return tokenMatch ? tokenMatch[1] : null;
  };

  const onNavigationStateChange = async (navState: any) => {
    const {url} = navState;

    if (url.includes('auth/success?token=')) {
      const token = extractTokenFromUrl(url);

      if (token) {
        await AsyncStorage.setItem('authToken', token);
        Alert.alert('Login Success', 'You are now authenticated');
        setShowWebView(false);
        navigation.replace('Home'); // ✅ redirect to Home after success
      } else {
        Alert.alert('Authentication failed', 'Token not found');
      }
    }
  };

  if (showWebView) {
    return (
      <WebView
        source={{uri: `${API_URL}/auth/google`}}
        onNavigationStateChange={onNavigationStateChange}
      />
    );
  }

  return (
    <ThemeGradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Continue with Google</Text>
        <Text style={styles.subtitle}>
          Securely sign in using your Google account.
        </Text>

        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.8}
          onPress={handleGoogleLogin}>
          <SvgXml xml={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Back to Sign Up"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          borderRadius={wp('2%')}
          paddingVertical={hp('1.5%')}
          fontSize={wp('4%')}
          fontFamily="Poppins-SemiBold"
        />
      </View>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  title: {
    fontSize: wp('8%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
    textTransform: 'uppercase',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: Colors.bodyText,
    fontFamily: Fonts.OpenSans.regular,
    marginBottom: hp('5%'),
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 25,
    width: '100%',
    paddingVertical: hp('2%'),
    marginBottom: hp('3%'),
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  googleIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('3%'),
  },
  googleText: {
    fontSize: wp('4%'),
    color: Colors.black,
    fontFamily: Fonts.OpenSans.semiBold,
  },
  backButton: {
    width: '100%',
  },
});

export default GoogleAuthScreen;
