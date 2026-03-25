import CheckBox from '@react-native-community/checkbox';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {validateLoginForm} from 'screens/validations';
import {facebookIcon, googleIcon, logo} from 'styles/svg-icons';
import {useAuth} from '../../../context/AuthContext';

const LoginScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const [error, setError] = useState<string | null>(null);
  const {SendOtp, isProfileSetupDone, userId} = useAuth();
  const [loading, setLoading] = useState(false);
  const {message, success} = route.params || {message: null, success: null};
  const [mobile, setPhoneNumber] = useState('');
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        handleCloseError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const SendOtpFromLunchBowl = async () => {
    const err = validateLoginForm({
      formattedValue: mobile,
      isPrivacyChecked,
    });
    if (err) return setError(err);
    const cleanNumber = mobile.replace(/\D/g, '');
    const path = 'logIn';
    try {
      setLoading(true);
      const LoginData = {mobile: cleanNumber, path};
      const response = await SendOtp(LoginData);
      if (response?.success) {
        navigation.navigate('OtpVerificationScreen', {
          mobile: cleanNumber,
          path: 'logIn-otp',
        });
      } else {
        setError(response?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error);
      setError(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    navigation.navigate('GoogleAuth');
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handlePhoneChange = (text: string) => {
  setPhoneNumber(text);
  const cleanNumber = text.replace(/\D/g, '');
  setIsPhoneValid(cleanNumber.length === 10);
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
              {/*########## LOGO   ############ */}

              <View style={styles.logoContainer}>
                <SvgXml xml={logo} style={styles.logo} />
              </View>

              {/*########## TITLE   ############ */}

              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Log in</Text>
                <Text style={styles.subtitleText}>
                  Enter your mobile number to continue.
                </Text>
              </View>

              {/*########## EROOR SHOW   ############ */}

              {error && (
                <ErrorMessage error={error} onClose={handleCloseError} />
              )}

              <View style={styles.inputContainer}>
                {/*####### PHONE NUMBER  ############## */}

                <Text style={styles.label}>Phone Number</Text>

                <ThemeInputPrimary
                  value={mobile}
                  onChangeText={handlePhoneChange}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                />
                {/*####### CHECKBOX CONTAINER  ######### */}

                <View style={[styles.checkboxContainer]}>
                  <CheckBox
                    value={isPrivacyChecked}
                    onValueChange={setIsPrivacyChecked}
                    tintColors={{
                      true: Colors.primaryOrange,
                      false: Colors.default,
                    }}
                  />
                  <Text style={styles.checkboxLabel}>
                    By clicking, I accept the{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() =>
                        navigation.navigate('T&C & PrivacyPolicy')
                      }>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>

                {/*########## SUBMIT BUTTON  ############ */}

                <PrimaryButton
                  title="Send One Time Password"
                  onPress={SendOtpFromLunchBowl}
                  disabled={!isPhoneValid}
                  style={[styles.signInButton]}
                />
              </View>

              {/*########## DEVIDER   ############ */}

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or Login with</Text>
                <View style={styles.line} />
              </View>

              {/*########## SOCIAL BUTTON   ######### */}

              <View style={styles.socialButtonRow}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}>
                  <SvgXml xml={googleIcon} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <SvgXml xml={facebookIcon} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              {/*########## FOOTER   ######### */}

              <View style={styles.footer}>
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Don’t have an Account?</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.createAccountLink}>Signup</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/*########## LOADER    ######### */}

              <LoadingModal loading={loading} setLoading={setLoading} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: wp('8%'),
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  logo: {
    width: wp('30%'),
    height: wp('30%'),
  },
  title: {
    alignItems: 'flex-end',
    fontFamily: Fonts.Urbanist.regular,
    flexDirection: 'row',
  },
  titleContainer: {
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
    color: Colors.default,
    fontFamily: Fonts.OpenSans.regular,
  },
  label: {
    fontSize: wp('5%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    marginBottom: hp('1%'),
  },

  inputContainer: {
    gap: hp('1%'),
    fontSize: wp('14%'),
    fontFamily: Fonts.Urbanist.semiBold,
  },
  descriptionContainer: {
    fontSize: wp('4%'),
    color: Colors.black,
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  checkboxContainer: {
    marginTop: '6%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxLabel: {
    fontSize: wp('3.8%'),
    color: Colors.default,
    fontFamily: Fonts.OpenSans.regular,
    flexShrink: 1,
  },
  signInButton: {
    height: hp('6%'),
    justifyContent: 'center',
    width: '100%',
  },
  linkText: {
    color: Colors.primaryOrange,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
    marginBottom: hp('2%'),
    width: '100%',
    gap: wp('2%'),
    paddingHorizontal: wp('5%'),
  },
  line: {
    flex: 1,
    height: 1,
    marginHorizontal: wp('2%'),
    backgroundColor: Colors.default,
  },
  orText: {
    fontSize: hp('1.7%'),
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.bold,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 10,
    backgroundColor: Colors.white,
    width: '48%',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
    marginVertical: hp('0.3%'),
  },
  socialButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: wp('3%'),
    marginBottom: hp('2%'),
  },

  socialIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('3%'),
  },
  socialButtonText: {
    fontSize: wp('4%'),
    color: Colors.bodyText,
    fontFamily: Fonts.OpenSans.regular,
  },

  footer: {
    marginTop: hp('15%'),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp('4%'),
    color: Colors.black,
  },
  createAccountLink: {
    fontSize: wp('4%'),
    color: Colors.primaryOrange,
    fontWeight: '500',
    marginLeft: 5,
  },
});

export default LoginScreen;
