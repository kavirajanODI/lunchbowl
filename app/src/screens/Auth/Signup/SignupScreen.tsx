import CheckBox from '@react-native-community/checkbox';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import React, {useEffect, useRef, useState} from 'react';
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
import PhoneInput from 'react-native-phone-number-input';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {validateSignUpForm} from 'screens/validations';
import {facebookIcon, googleIcon, logo} from 'styles/svg-icons';
import {useAuth} from '../../../context/AuthContext';

const SignUpScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const [error, setError] = useState<string | null>(null);
  const {SendOtp, isProfileSetupDone, userId} = useAuth();
  const [loading, setLoading] = useState(false);
  const {message, success} = route.params || {message: null, success: null};
  const [loginSuccess, setLoginSuccess] = useState(false);
  const phoneInputRef = useRef<PhoneInput>(null);
  const [mobile, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setemail] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        handleCloseError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const halndleSignUp = async () => {

   

    const err = validateSignUpForm({
      firstName,
      lastName,
      email,
      formattedValue: mobile,
      isPrivacyChecked,
    });
    if (err) return setError(err);

    try {
      setLoading(true);
      const path = "signUp"
      const LoginData = {firstName, lastName, email, mobile, path};
      const response = await SendOtp(LoginData);
      if (response?.success && response?.smsLogId?.variables?.[0]) {
        navigation.navigate('OtpVerificationScreen', {
          ...LoginData,
        });
      } else {
        setError(
          response?.message || 'Something went wrong while sending OTP.',
        );
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

   const isFormValid =
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      mobile.trim().length === 10 &&
      isPrivacyChecked;

  return (
    <ThemeGradientBackground>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <SvgXml xml={logo} style={styles.logo} />
              </View>

              {/*######### TITEL  ########### */}

              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Sign up</Text>
                <Text style={styles.subtitleText}>
                  Enter your details to continue.{' '}
                </Text>
              </View>
              
              {/*######## EROR THROW  ######### */}

              {error && (
                <ErrorMessage error={error} onClose={handleCloseError} />
              )}

              {/*######## FIRST NAME ######### */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <ThemeInputPrimary
                  value={firstName}
                  onChangeText={setFirstName}
                  label="Full Name* (with Initial or Surname)"
                  placeholder="Enter Full name"
                />
              </View>

              {/*######## LAST NAME ######### */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <ThemeInputPrimary
                  value={lastName}
                  onChangeText={setLastName}
                  label="Last Name* (with Initial or Surname)"
                  placeholder="Enter Last name"
                />
              </View>


              {/*########## EMAIL  ########### */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <ThemeInputPrimary
                  value={email}
                  onChangeText={setemail}
                  label="Email"
                  placeholder="Enter Email"
                />
              </View>

              {/*####### PHONE NUMBER  ######### */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <ThemeInputPrimary
                  value={mobile}
                  onChangeText={setPhoneNumber}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                />
              </View>

              {/*######### CHECKBOX ############# */}

              <View style={[styles.checkboxContainer]}>
                <CheckBox
                  value={isPrivacyChecked}
                  onValueChange={setIsPrivacyChecked}
                  tintColors={{
                    true: Colors.primaryOrange,
                    false: Colors.primaryOrange,
                  }}
                />
                <Text style={styles.checkboxLabel}>
                  By clicking, I accept the{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => navigation.navigate('T&C & PrivacyPolicy')}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              {/*######### BUTTON FIELD ######### */}

               <PrimaryButton
                title="Send One Time Password"
                onPress={halndleSignUp}
                 style={styles.signInButton}
                disabled={!isFormValid || loading}
              />

              {/*######### DIVIDER  ############# */}

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or Login with</Text>
                <View style={styles.line} />
              </View>

              {/*###### CONTINUE SOCIAL  ######## */}

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

              {/*######### FOOTER  ############### */}

              <View style={styles.footer}>
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Don’t have an Account?</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.createAccountLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/*######### LOADING  ############## */}

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
    alignItems: 'flex-end',
    fontFamily: Fonts.Urbanist.regular,
    flexDirection: 'row',
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
    color: Colors.default,
    fontFamily: Fonts.OpenSans.regular,
  },
  label: {
    fontSize: wp('4%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
  },

  inputContainer: {
    width: '100%',
    marginVertical: hp('0.5%'),
    gap: hp('1%'),
    fontSize: wp('14%'),
    fontFamily: Fonts.OpenSans.semiBold,
  },
  descriptionContainer: {
    fontSize: wp('4%'),
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxBox: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    borderWidth: 1,
    borderColor: Colors.default,
    marginRight: wp('2.5%'),
    borderRadius: 4,
    backgroundColor: Colors.white,
  },

  checkboxChecked: {
    backgroundColor: Colors.primaryOrange,
    borderColor: Colors.primaryOrange,
  },

  checkboxLabel: {
    fontSize: wp('3.8%'),
    color: Colors.bodyText,
    fontFamily: Fonts.OpenSans.regular,
    flexShrink: 1,
  },

  linkText: {
    color: Colors.primaryOrange,

    textDecorationLine: 'underline',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
    width: '100%',
    gap: wp('2%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightRed,
    marginHorizontal: wp('2%'),
  },
  orText: {
    fontSize: hp('2%'),
    color: Colors.bodyText,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 25,
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
    color: Colors.black,
    fontFamily: 'Inter',
  },
  signInButton: {
    height: hp('6%'),
    justifyContent: 'center',
    width: '100%',
  },
  footer: {
    marginTop: hp('5%'),
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
    marginLeft: 5,
  },
});

export default SignUpScreen;
