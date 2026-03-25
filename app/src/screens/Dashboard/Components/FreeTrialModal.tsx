import CheckBox from '@react-native-community/checkbox';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {encryptRequest, generateOrderId} from 'utils/paymentUtils';
import ccavenueConfig from '../../../config/ccavenueConfig';

const FREE_TRIAL_AMOUNT = 150;

interface FreeTrialModalProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

type Tab = 'login' | 'signup';
type Step = 'auth' | 'otp';

interface PendingFormData {
  mobile: string;
  path: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AuthUserData {
  userId?: string;
  fullname?: string;
  email?: string;
  phone_number?: string;
}

const FreeTrialModal: React.FC<FreeTrialModalProps> = ({
  visible,
  onClose,
  navigation,
}) => {
  const {SendOtp, login, signup} = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [step, setStep] = useState<Step>('auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPrivacy, setLoginPrivacy] = useState(false);

  // Signup form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPrivacy, setSignupPrivacy] = useState(false);

  // OTP
  const [otp, setOtp] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const [pendingFormData, setPendingFormData] = useState<PendingFormData | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const resetForm = () => {
    setActiveTab('login');
    setStep('auth');
    setLoginPhone('');
    setLoginPrivacy(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setSignupPhone('');
    setSignupPrivacy(false);
    setOtp('');
    setPendingFormData(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSendOtp = async () => {
    let formData: any;

    if (activeTab === 'login') {
      const cleanNumber = loginPhone.replace(/\D/g, '');
      if (cleanNumber.length !== 10) {
        return setError('Please enter a valid 10-digit mobile number.');
      }
      if (!loginPrivacy) {
        return setError('Please agree to the privacy policy.');
      }
      formData = {mobile: cleanNumber, path: 'logIn'};
    } else {
      const cleanNumber = signupPhone.replace(/\D/g, '');
      if (!firstName.trim()) {
        return setError('Please enter your first name.');
      }
      if (!lastName.trim()) {
        return setError('Please enter your last name.');
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return setError('Please enter a valid email address.');
      }
      if (cleanNumber.length !== 10) {
        return setError('Please enter a valid 10-digit mobile number.');
      }
      if (!signupPrivacy) {
        return setError('Please agree to the privacy policy.');
      }
      formData = {firstName, lastName, email, mobile: cleanNumber, path: 'signUp'};
    }

    try {
      setLoading(true);
      const response = await SendOtp(formData);
      if (response?.success) {
        setPendingFormData(formData);
        setStep('otp');
      } else {
        setError(response?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      return setError('Please enter a valid 4-digit OTP.');
    }

    try {
      setLoading(true);
      setError(null);
      let response: any;

      if (pendingFormData?.path === 'signUp') {
        response = await signup({
          mobile: pendingFormData.mobile,
          firstName: pendingFormData.firstName ?? '',
          lastName: pendingFormData.lastName,
          email: pendingFormData.email,
          otp,
          path: 'signUp-otp',
        } as any);
      } else {
        response = await login({
          mobile: pendingFormData?.mobile ?? '',
          otp,
          path: 'logIn-otp',
        });
      }

      if (response?.success) {
        const userData = response.data || {};
        handleClose();
        proceedToPayment(userData);
      } else {
        setError(response?.message || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = (userData: AuthUserData) => {
    const orderId = generateOrderId();
    const paymentData: Record<string, any> = {
      merchant_id: ccavenueConfig.merchant_id,
      order_id: orderId,
      amount: FREE_TRIAL_AMOUNT,
      currency: ccavenueConfig.currency,
      redirect_url: ccavenueConfig.redirect_url,
      cancel_url: ccavenueConfig.cancel_url,
      language: ccavenueConfig.language,
      billing_name: (userData.fullname || 'Customer').substring(0, 50),
      billing_email: (userData.email || 'no-email@example.com').substring(0, 50),
      billing_tel: (userData.phone_number || '0000000000').substring(0, 20),
      billing_address: 'Free Trial',
      billing_city: 'Chennai',
      billing_state: 'Tamil Nadu',
      billing_zip: '600001',
      billing_country: 'India',
      merchant_param1: userData.userId || '',
      merchant_param2: 'FREE_TRIAL',
      merchant_param3: orderId,
    };

    const plainText = Object.entries(paymentData)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    const encryptedData = encryptRequest(plainText, ccavenueConfig.working_key);

    navigation.navigate('WebViewScreen', {
      encRequest: encryptedData,
      accessCode: ccavenueConfig.access_code,
      endpoint: ccavenueConfig.endpoint,
    });
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pasted = text.replace(/\D/g, '').slice(0, 4);
      setOtp(pasted);
      const focusIndex = Math.min(pasted.length, 3);
      otpRefs.current[focusIndex]?.focus();
      return;
    }
    const otpArray = otp.split('');
    otpArray[index] = text;
    const newCode = otpArray.join('').slice(0, 4);
    setOtp(newCode);
    if (text && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const otpArray = otp.split('');
        otpArray[index - 1] = '';
        setOtp(otpArray.join(''));
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const isLoginFormValid =
    loginPhone.replace(/\D/g, '').length === 10 && loginPrivacy;
  const isSignupFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    signupPhone.replace(/\D/g, '').length === 10 &&
    signupPrivacy;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {step === 'otp' ? 'Verify OTP' : 'Start Free Trial'}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <ErrorMessage error={error} onClose={() => setError(null)} />
            )}

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {step === 'auth' ? (
                <>
                  {/* Tabs */}
                  <View style={styles.tabBar}>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'login' && styles.activeTab,
                      ]}
                      onPress={() => {
                        setActiveTab('login');
                        setError(null);
                      }}>
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'login' && styles.activeTabText,
                        ]}>
                        Login
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'signup' && styles.activeTab,
                      ]}
                      onPress={() => {
                        setActiveTab('signup');
                        setError(null);
                      }}>
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'signup' && styles.activeTabText,
                        ]}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {activeTab === 'login' ? (
                    <View style={styles.formContainer}>
                      <Text style={styles.label}>Phone Number</Text>
                      <ThemeInputPrimary
                        value={loginPhone}
                        onChangeText={(t: string) => {
                          setLoginPhone(t);
                          setError(null);
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                        placeholder="Enter Mobile Number"
                      />
                      <View style={styles.checkboxContainer}>
                        <CheckBox
                          value={loginPrivacy}
                          onValueChange={setLoginPrivacy}
                          tintColors={{
                            true: Colors.primaryOrange,
                            false: Colors.default,
                          }}
                        />
                        <Text style={styles.checkboxLabel}>
                          I accept the Privacy Policy
                        </Text>
                      </View>
                      <PrimaryButton
                        title="Send OTP"
                        onPress={handleSendOtp}
                        disabled={!isLoginFormValid}
                        style={styles.button}
                      />
                    </View>
                  ) : (
                    <View style={styles.formContainer}>
                      <Text style={styles.label}>First Name</Text>
                      <ThemeInputPrimary
                        value={firstName}
                        onChangeText={(t: string) => {
                          setFirstName(t);
                          setError(null);
                        }}
                        placeholder="Enter First Name"
                      />
                      <Text style={styles.label}>Last Name</Text>
                      <ThemeInputPrimary
                        value={lastName}
                        onChangeText={(t: string) => {
                          setLastName(t);
                          setError(null);
                        }}
                        placeholder="Enter Last Name"
                      />
                      <Text style={styles.label}>Email</Text>
                      <ThemeInputPrimary
                        value={email}
                        onChangeText={(t: string) => {
                          setEmail(t);
                          setError(null);
                        }}
                        placeholder="Enter Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      <Text style={styles.label}>Phone Number</Text>
                      <ThemeInputPrimary
                        value={signupPhone}
                        onChangeText={(t: string) => {
                          setSignupPhone(t);
                          setError(null);
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                        placeholder="Enter Mobile Number"
                      />
                      <View style={styles.checkboxContainer}>
                        <CheckBox
                          value={signupPrivacy}
                          onValueChange={setSignupPrivacy}
                          tintColors={{
                            true: Colors.primaryOrange,
                            false: Colors.default,
                          }}
                        />
                        <Text style={styles.checkboxLabel}>
                          I accept the Privacy Policy
                        </Text>
                      </View>
                      <PrimaryButton
                        title="Send OTP"
                        onPress={handleSendOtp}
                        disabled={!isSignupFormValid}
                        style={styles.button}
                      />
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.formContainer}>
                  <Text style={styles.otpDesc}>
                    We&apos;ve sent an OTP to your registered mobile number.
                  </Text>
                  <Text style={styles.label}>Enter One Time Password</Text>
                  <View style={styles.otpWrapper}>
                    {[0, 1, 2, 3].map(index => (
                      <TextInput
                        key={index}
                        ref={ref => (otpRefs.current[index] = ref)}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChangeText={text => handleOtpChange(text, index)}
                        onKeyPress={e => handleOtpKeyPress(e, index)}
                        autoFocus={index === 0}
                      />
                    ))}
                  </View>
                  <View style={styles.trialAmountInfo}>
                    <Text style={styles.trialAmountText}>
                      Free Trial Payment: ₹{FREE_TRIAL_AMOUNT}
                    </Text>
                  </View>
                  <PrimaryButton
                    title={`Verify & Pay ₹${FREE_TRIAL_AMOUNT}`}
                    onPress={handleVerifyOtp}
                    disabled={otp.length !== 4}
                    style={styles.button}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setStep('auth');
                      setOtp('');
                      setError(null);
                    }}>
                    <Text style={styles.backLink}>← Back</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <LoadingModal loading={loading} setLoading={setLoading} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  closeBtn: {
    padding: wp('2%'),
  },
  closeBtnText: {
    fontSize: wp('5%'),
    color: Colors.default,
  },
  scrollContent: {
    paddingBottom: hp('2%'),
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: wp('2%'),
    backgroundColor: Colors.bg,
    marginBottom: hp('2%'),
    padding: wp('1%'),
  },
  tab: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    borderRadius: wp('1.5%'),
  },
  activeTab: {
    backgroundColor: Colors.primaryOrange,
  },
  tabText: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.default,
  },
  activeTabText: {
    color: Colors.white,
  },
  formContainer: {
    gap: hp('0.5%'),
  },
  label: {
    fontSize: wp('4%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    marginBottom: hp('0.5%'),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  checkboxLabel: {
    fontSize: wp('3.8%'),
    color: Colors.bodyText,
    fontFamily: Fonts.OpenSans.regular,
    flexShrink: 1,
  },
  button: {
    width: '100%',
    marginTop: hp('1%'),
  },
  otpDesc: {
    fontSize: wp('3.8%'),
    color: Colors.bodyText,
    fontFamily: Fonts.OpenSans.regular,
    marginBottom: hp('2%'),
  },
  otpWrapper: {
    flexDirection: 'row',
    gap: wp('4%'),
    marginBottom: hp('2%'),
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
  trialAmountInfo: {
    backgroundColor: Colors.lightRed,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginVertical: hp('1%'),
  },
  trialAmountText: {
    fontSize: wp('4.5%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
    textAlign: 'center',
  },
  backLink: {
    marginTop: hp('2%'),
    textAlign: 'center',
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    fontSize: wp('4%'),
  },
});

export default FreeTrialModal;
