import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import React, {useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {ApiResponseModel} from 'src/model/apiResponseModel';
import {LoginForm, SignupForm} from 'src/model/authModel';
import {logo} from 'styles/svg-icons';
import {useAuth} from '../../../context/AuthContext';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

type OtpVerificationRouteParams = {
  mobile: string;
  path: string;
  otp?: string;
};

type AuthStackParamList = {
  OtpVerification: OtpVerificationRouteParams;
  ProfileSetup: {userId: string};
};

const OtpVerificationScreen = () => {
  const navigation =
    useNavigation<
      import('@react-navigation/native').NavigationProp<AuthStackParamList>
    >();
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {login, signup, isProfileSetupDone, userId} = useAuth();
  const route = useRoute<RouteProp<AuthStackParamList, 'OtpVerification'>>();
  const {mobile, path, ...rest} = route.params;
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [resendTimer, setResendTimer] = useState(60);


  const handleVerify = async () => {
    let verificationPath = path;
    if (Object.keys(rest).length > 0 && path === 'signUp') {
      verificationPath = 'signUp-otp';
    } else if (Object.keys(rest).length > 0 && path === 'login') {
      verificationPath = 'login-otp';
    }

    if (otpInput.length !== 4) {
      setError('Please enter a valid 4-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const VerifyloginData: LoginForm = {
        mobile,
        otp: otpInput,
        path: verificationPath,
        ...rest,
      };

      console.log('OTP request body ===>', VerifyloginData);

      let response: ApiResponseModel;

      if (verificationPath === 'signUp-otp') {
        const VerifySignupData: SignupForm = {
          ...rest,
          mobile,
          otp: otpInput,
          path: verificationPath,
          firstName: ''
        };
        response = await signup(VerifySignupData);
      } else {
        const VerifyLoginData: LoginForm = {
          mobile,
          otp: otpInput,
          path: verificationPath,
        };
        response = await login(VerifyLoginData);
      }

      if (response.success && response.data) {
        if (!isProfileSetupDone && userId) {
          navigation.navigate('ProfileSetup', {userId});
        }
      } else {
        setError(response.message || 'An unknown error occurred');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const otpArray = otpInput.split('');
    if (text.length > 1) {
      const newOtp = text.slice(0, 4);
      setOtpInput(newOtp);
      return;
    }

    otpArray[index] = text;
    const newCode = otpArray.join('').slice(0, 4);
    setOtpInput(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otpInput[index] && index > 0) {
        const otpArray = otpInput.split('');
        otpArray[index - 1] = '';
        setOtpInput(otpArray.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <ThemeGradientBackground>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <HeaderBackButton title="back" />
              <View style={styles.logoContainer}>
                <SvgXml xml={logo} style={styles.logo} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>verify otp</Text>
                <Text style={styles.subtitleText}>
                  We've sent an OTP to your Mobile number. OTP:
                </Text>
              </View>

              {error && (
                <ErrorMessage error={error} onClose={handleCloseError} />
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Enter One Time Password
                  <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.otpWrapper}>
                  {[0, 1, 2, 3].map(index => (
                    <TextInput
                      key={index}
                      ref={ref => (inputRefs.current[index] = ref)}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otpInput[index] || ''}
                      onChangeText={text => handleOtpChange(text, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      autoFocus={index === 0}
                      returnKeyType="next"
                    />
                  ))}
                </View>
              </View>
              <PrimaryButton
                title="Verify One Time Password"
                onPress={handleVerify}
                style={{
                  width: wp('90%'),
                }}
              />
              <LoadingModal loading={loading} setLoading={setLoading} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemeGradientBackground>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: wp('7%'),
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: hp('3%'),
    marginTop: hp('1%'),
  },
  logo: {
    width: wp('30%'),
    height: wp('30%'),
  },
  titleContainer: {
    width: '100%',
    marginBottom: hp('3%'),
  },
  titleText: {
    fontSize: wp('8%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
    marginBottom: hp('0.5%'),
    textTransform: 'uppercase',
  },
  subtitleText: {
    fontSize: wp('4%'),
    color: Colors.bodyText,
    fontFamily: 'Poppins-Regular',
  },
  label: {
    fontSize: wp('4%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    marginBottom: hp('2%'),
  },
  required: {
    color: Colors.primaryOrange,
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp('2%'),
    marginVertical: hp('1.5%'),
  },
  otpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('4%'),
    width: '65%',
  },
  otpInput: {
    width: wp('14%'),
    height: hp('6%'),
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 10,
    fontSize: wp('5%'),
    textAlign: 'center',
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  signInButton: {
    height: hp('6%'),
    justifyContent: 'center',
    width: '100%',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: Colors.bodyText,
  },
  resendText: {
    fontSize: 14,
    color: Colors.primaryOrange,
    fontWeight: '600',
  },
});
