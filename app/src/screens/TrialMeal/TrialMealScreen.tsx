import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import PrimaryFieldLabel from 'components/inputs/FieldLabel';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import {useUserProfile} from 'context/UserDataContext';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import RegistrationService from 'services/RegistartionService/registartion';
import ccavenueConfig from '../../config/ccavenueConfig';
import {encryptRequest, generateOrderId} from 'utils/paymentUtils';
import {HeaderBackIcon} from 'styles/svg-icons';

const TRIAL_MEAL_AMOUNT = 99;

const CLASS_OPTIONS = [
  {label: 'LKG', value: 'LKG'},
  {label: 'UKG', value: 'UKG'},
  {label: 'Class 1', value: 'Class 1'},
  {label: 'Class 2', value: 'Class 2'},
  {label: 'Class 3', value: 'Class 3'},
  {label: 'Class 4', value: 'Class 4'},
  {label: 'Class 5', value: 'Class 5'},
  {label: 'Class 6', value: 'Class 6'},
  {label: 'Class 7', value: 'Class 7'},
  {label: 'Class 8', value: 'Class 8'},
  {label: 'Class 9', value: 'Class 9'},
  {label: 'Class 10', value: 'Class 10'},
  {label: 'Class 11', value: 'Class 11'},
  {label: 'Class 12', value: 'Class 12'},
];

const FOOD_OPTIONS = [
  {
    label: 'PANEER SHASHLIK WITH HERB RICE',
    value: 'PANEER SHASHLIK WITH HERB RICE',
  },
  {
    label: 'COCONUT RICE – BROWN CHANA PORIYAL',
    value: 'COCONUT RICE – BROWN CHANA PORIYAL',
  },
  {
    label: 'AGLIO E OLIO PASTA AND GARLIC BREAD',
    value: 'AGLIO E OLIO PASTA AND GARLIC BREAD',
  },
  {
    label: 'PANEER BAO - WITH BUTTER GARLIC SAUTTE VEGETABLES',
    value: 'PANEER BAO - WITH BUTTER GARLIC SAUTTE VEGETABLES',
  },
  {
    label: 'DAL KHICHDI AND BABY POTATO FRY',
    value: 'DAL KHICHDI AND BABY POTATO FRY',
  },
];

const getMinDate = (): Date => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d;
};

const isSunday = (date: Date): boolean => date.getDay() === 0;

const formatDate = (d: Date): string => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function TrialMealScreen({navigation}: any) {
  const {user, userId, setUser} = useAuth();
  const {refreshProfileData} = useUserProfile();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [schools, setSchools] = useState<{label: string; value: string}[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedSchoolName, setSelectedSchoolName] = useState('');
  const [showRequestSchoolModal, setShowRequestSchoolModal] = useState(false);
  const [requestSchoolName, setRequestSchoolName] = useState('');
  const [requestLocation, setRequestLocation] = useState('');

  // Step 2 form fields
  const [parentFirstName, setParentFirstName] = useState('');
  const [parentLastName, setParentLastName] = useState('');
  const [mobileNumber] = useState(user?.phone_number || '');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [childName, setChildName] = useState('');
  const [childClass, setChildClass] = useState('');
  const [datePreference, setDatePreference] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [preferredFood, setPreferredFood] = useState('');
  const [doorNo, setDoorNo] = useState('');
  const [areaCity, setAreaCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSchools = async () => {
      setLoadingSchools(true);
      try {
        const response: any = await RegistrationService.getAllSchools();
        if (response && Array.isArray(response)) {
          setSchools(
            response.map((s: any) => ({
              label: `${s.name}${s.location ? ` - ${s.location}` : ''}`,
              value: s._id || s.name,
              name: s.name,
            })),
          );
        }
      } catch {
        // ignore
      } finally {
        setLoadingSchools(false);
      }
    };
    loadSchools();
  }, []);

  const handleSchoolChange = (value: string | number) => {
    setSelectedSchool(String(value));
    const found = (schools as any[]).find(s => s.value === value);
    setSelectedSchoolName(found?.name || String(value));
  };

  const handleDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (!selected) return;
    if (isSunday(selected)) {
      Alert.alert('Invalid Date', 'Sundays are not available. Please choose another day.');
      return;
    }
    const min = getMinDate();
    min.setHours(0, 0, 0, 0);
    const sel = new Date(selected);
    sel.setHours(0, 0, 0, 0);
    if (sel < min) {
      Alert.alert('Invalid Date', 'Please select a date at least 2 days from today.');
      return;
    }
    setDatePreference(selected);
    setErrors(prev => ({...prev, datePreference: ''}));
  };

  const handleRequestSchoolSubmit = async () => {
    if (!requestSchoolName.trim() || !requestLocation.trim()) {
      Alert.alert('Error', 'Please enter school name and location');
      return;
    }

    setLoading(true);
    try {
      const response = await RegistrationService.requestSchool({
        schoolName: requestSchoolName.trim(),
        location: requestLocation.trim(),
        parentName: user?.name || '',
        phone: user?.phone_number || user?.phone || '',
        email: user?.email || email || '',
      });

      if (!response?.success) {
        Alert.alert('Error', response.message || 'Failed to submit request');
        return;
      }

      setShowRequestSchoolModal(false);
      setRequestSchoolName('');
      setRequestLocation('');
      Alert.alert('Success', 'Request submitted successfully');
    } catch {
      Alert.alert('Error', 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!parentFirstName.trim() || !/^[A-Za-z\s]+$/.test(parentFirstName.trim()))
      newErrors.parentFirstName = 'First name is required (alphabets only)';
    if (!parentLastName.trim() || !/^[A-Za-z\s]+$/.test(parentLastName.trim()))
      newErrors.parentLastName = 'Last name is required (alphabets only)';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim()))
      newErrors.email = 'Valid email is required';
    if (altMobile && !/^[6789]\d{9}$/.test(altMobile))
      newErrors.altMobile = 'Must be 10 digits starting with 6, 7, 8 or 9';
    if (!childName.trim() || !/^[A-Za-z\s]+$/.test(childName.trim()))
      newErrors.childName = 'Child name is required (alphabets only)';
    if (!childClass)
      newErrors.childClass = 'Please select a class';
    if (!datePreference)
      newErrors.datePreference = 'Please select a date preference';
    if (!preferredFood)
      newErrors.preferredFood = 'Please select a preferred food';
    if (!doorNo.trim())
      newErrors.doorNo = 'Door / Building / Street is required';
    if (!areaCity.trim())
      newErrors.areaCity = 'Area / City is required';
    if (!pincode.trim() || !/^\d{6}$/.test(pincode))
      newErrors.pincode = 'Valid 6-digit pincode is required';
    if (!consentChecked)
      newErrors.consent = 'You must accept the consent to proceed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAndPay = async () => {
    if (!validateStep2()) return;
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      // Build the enquiry payload — it will be submitted AFTER successful payment
      const trialMealPayload = {
        firstName: parentFirstName.trim(),
        lastName: parentLastName.trim(),
        email: email.trim(),
        mobileNumber,
        altMobileNumber: altMobile || undefined,
        doorNo: doorNo.trim(),
        areaCity: areaCity.trim(),
        pincode: pincode.trim(),
        schoolName: selectedSchoolName,
        className: childClass,
        childName: childName.trim(),
        datePreference: datePreference ? formatDate(datePreference) : undefined,
        food: preferredFood || undefined,
        userId,
      };

      // Proceed to CCAvenue payment
      const orderId = generateOrderId();
      const paymentData: Record<string, any> = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: TRIAL_MEAL_AMOUNT,
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,
        billing_name: `${parentFirstName.trim()} ${parentLastName.trim()}`.substring(0, 50),
        billing_email: email.trim().substring(0, 50),
        billing_tel: mobileNumber.substring(0, 20),
        billing_address: `${doorNo.trim()}, ${areaCity.trim()}`.substring(0, 100),
        billing_city: areaCity.trim().substring(0, 50),
        billing_state: 'Tamil Nadu',
        billing_zip: pincode.trim().substring(0, 10),
        billing_country: 'India',
        merchant_param1: userId,
        merchant_param2: 'TRIAL_MEAL',
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
        paymentType: 'trialMeal',
        trialMealPayload,
      });
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    if (!validateStep2()) return;
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: parentFirstName.trim(),
        lastName: parentLastName.trim(),
        email: email.trim(),
        mobileNumber,
        altMobileNumber: altMobile || undefined,
        doorNo: doorNo.trim(),
        areaCity: areaCity.trim(),
        pincode: pincode.trim(),
        schoolName: selectedSchoolName,
        className: childClass,
        childName: childName.trim(),
        datePreference: datePreference ? formatDate(datePreference) : undefined,
        food: preferredFood || undefined,
        userId,
      };

      await RegistrationService.freeTrialEnquiry(payload);

      // Update AuthContext so FreeTrialCard hides immediately
      setUser((prev: any) => ({...prev, freeTrial: true}));
      // Refresh profile so profileData.user.freeTrial is also up to date
      refreshProfileData().catch(() => {});

      const transactionId = `TEST_TXN_${Date.now()}`;
      Alert.alert(
        'Trial Meal Submitted',
        `Your Trial Meal request has been submitted!\nTransaction ID: ${transactionId}\nStatus: Success`,
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('HomeScreen'),
          },
        ],
      );
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={setLoading} />
      <View style={styles.container}>
      <View style={styles.backRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step === 2) setStep(1);
              else navigation.goBack();
            }}>
            <SvgXml xml={HeaderBackIcon} />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
        </View>

        {step === 1 ? (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select School</Text>
            <Text style={styles.stepDesc}>
              Choose the school for your Trial Meal delivery.
            </Text>

            <PrimaryFieldLabel label="School" required />
            <PrimaryDropdown
              options={
                loadingSchools
                  ? [{label: 'Loading schools...', value: ''}]
                  : schools
              }
              placeholder="Select a school"
              selectedValue={selectedSchool}
              onValueChange={handleSchoolChange}
            />
            {errors.school ? (
              <Text style={styles.errorText}>{errors.school}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.requestSchoolCta}
              onPress={() => setShowRequestSchoolModal(true)}>
              <Text style={styles.requestSchoolCtaText}>Can’t find your school?</Text>
            </TouchableOpacity>

            <View style={styles.nextButtonContainer}>
              <PrimaryButton
                title="NEXT"
                onPress={() => {
                  if (!selectedSchool) {
                    setErrors({school: 'Please select a school'});
                    return;
                  }
                  setErrors({});
                  setStep(2);
                }}
                style={{width: '100%'}}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepTitle}>Trial Meal Details</Text>
            <Text style={styles.stepDesc}>
              Fill in the details to request your Trial Meal.
            </Text>

            {/* Parent First Name */}
            <PrimaryFieldLabel label="Parent First Name" required />
            <ThemeInputPrimary
              value={parentFirstName}
              onChangeText={(t: string) => {
                setParentFirstName(t);
                setErrors(prev => ({...prev, parentFirstName: ''}));
              }}
              placeholder="First Name"
              error={errors.parentFirstName}
            />

            {/* Parent Last Name */}
            <PrimaryFieldLabel label="Parent Last Name" required />
            <ThemeInputPrimary
              value={parentLastName}
              onChangeText={(t: string) => {
                setParentLastName(t);
                setErrors(prev => ({...prev, parentLastName: ''}));
              }}
              placeholder="Last Name"
              error={errors.parentLastName}
            />

            {/* Mobile (disabled) */}
            <PrimaryFieldLabel label="Mobile Number" required />
            <ThemeInputPrimary
              value={mobileNumber}
              placeholder="Mobile Number"
              editable={false}
              style={styles.disabledInput}
            />

            {/* Alternative Mobile */}
            <PrimaryFieldLabel label="Alternative Mobile Number" />
            <ThemeInputPrimary
              value={altMobile}
              onChangeText={(t: string) => {
                setAltMobile(t);
                setErrors(prev => ({...prev, altMobile: ''}));
              }}
              placeholder="Alternative Mobile"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.altMobile}
            />

            {/* Email */}
            <PrimaryFieldLabel label="Email ID" required />
            <ThemeInputPrimary
              value={email}
              onChangeText={(t: string) => {
                setEmail(t);
                setErrors(prev => ({...prev, email: ''}));
              }}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            {/* Child Name */}
            <PrimaryFieldLabel label="Child Name" required />
            <ThemeInputPrimary
              value={childName}
              onChangeText={(t: string) => {
                setChildName(t);
                setErrors(prev => ({...prev, childName: ''}));
              }}
              placeholder="Child's Full Name"
              error={errors.childName}
            />

            {/* Child Class */}
            <PrimaryFieldLabel label="Child Class" required />
            <PrimaryDropdown
              options={CLASS_OPTIONS}
              placeholder="Select Class"
              selectedValue={childClass}
              onValueChange={(v: string | number) => {
                setChildClass(String(v));
                setErrors(prev => ({...prev, childClass: ''}));
              }}
            />
            {errors.childClass ? (
              <Text style={styles.errorText}>{errors.childClass}</Text>
            ) : null}

            {/* Date Preference */}
            <PrimaryFieldLabel label="Date Preference" required />
            <TouchableOpacity
              style={[
                styles.dateButton,
                errors.datePreference ? {borderColor: Colors.red} : null,
              ]}
              onPress={() => setShowDatePicker(true)}>
              <Text
                style={[
                  styles.dateButtonText,
                  !datePreference && {color: Colors.bodyText},
                ]}>
                {datePreference ? formatDate(datePreference) : 'Select Date (min 2 days)'}
              </Text>
            </TouchableOpacity>
            {errors.datePreference ? (
              <Text style={styles.errorText}>{errors.datePreference}</Text>
            ) : null}
            {showDatePicker && (
              <DateTimePicker
                value={datePreference || getMinDate()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={getMinDate()}
                onChange={handleDateChange}
              />
            )}

            {/* Preferred Food */}
            <PrimaryFieldLabel label="Preferred Food" required />
            <PrimaryDropdown
              options={FOOD_OPTIONS}
              placeholder="Select Preferred Food"
              selectedValue={preferredFood}
              onValueChange={(v: string | number) => {
                setPreferredFood(String(v));
                setErrors(prev => ({...prev, preferredFood: ''}));
              }}
            />
            {errors.preferredFood ? (
              <Text style={styles.errorText}>{errors.preferredFood}</Text>
            ) : null}

            {/* Address */}
            <PrimaryFieldLabel label="Residential Address" required />
            <ThemeInputPrimary
              value={doorNo}
              onChangeText={(t: string) => {
                setDoorNo(t);
                setErrors(prev => ({...prev, doorNo: ''}));
              }}
              placeholder="Door No. / Building / Street"
              error={errors.doorNo}
            />
            <ThemeInputPrimary
              value={areaCity}
              onChangeText={(t: string) => {
                setAreaCity(t);
                setErrors(prev => ({...prev, areaCity: ''}));
              }}
              placeholder="Area / City"
              error={errors.areaCity}
            />
            <ThemeInputPrimary
              value={pincode}
              onChangeText={(t: string) => {
                setPincode(t);
                setErrors(prev => ({...prev, pincode: ''}));
              }}
              placeholder="Pincode"
              keyboardType="number-pad"
              maxLength={6}
              error={errors.pincode}
            />

            {/* Consent */}
            <View style={styles.consentRow}>
              <CheckBox
                value={consentChecked}
                onValueChange={v => {
                  setConsentChecked(v);
                  setErrors(prev => ({...prev, consent: ''}));
                }}
                tintColors={{true: Colors.primaryOrange, false: Colors.default}}
              />
              <Text style={styles.consentText}>
                I agree to the Terms & Conditions and consent to the use of my
                information for the Trial Meal request.
              </Text>
            </View>
            {errors.consent ? (
              <Text style={styles.errorText}>{errors.consent}</Text>
            ) : null}

            {/* Amount info */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Trial Meal Amount:</Text>
              <Text style={styles.amountValue}>₹{TRIAL_MEAL_AMOUNT}</Text>
            </View>

            {/* Submit / Payment buttons */}
            <PrimaryButton
              title="PAY ₹99 (CC AVENUE)"
              onPress={handleSubmitAndPay}
              style={styles.payButton}
            />

            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestPayment}>
              <Text style={styles.testButtonText}>TEST PAYMENT</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
      <Modal
        visible={showRequestSchoolModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRequestSchoolModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request Your School</Text>
            <PrimaryFieldLabel label="School Name" required />
            <ThemeInputPrimary
              value={requestSchoolName}
              onChangeText={setRequestSchoolName}
              placeholder="Enter school name"
            />
            <PrimaryFieldLabel label="Location" required />
            <ThemeInputPrimary
              value={requestLocation}
              onChangeText={setRequestLocation}
              placeholder="Enter location"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setShowRequestSchoolModal(false)}>
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handleRequestSchoolSubmit}>
                <Text style={styles.modalPrimaryButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemeGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  stepContainer: {
    flex: 1,
    paddingTop: hp('2%'),
  },
  scrollContent: {
    paddingBottom: hp('10%'),
  },
  stepTitle: {
    fontSize: wp('5.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginVertical: hp('1%'),
  },
  stepDesc: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.default,
    marginBottom: hp('2%'),
  },
  nextButtonContainer: {
    marginTop: hp('3%'),
  },
  requestSchoolCta: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  requestSchoolCtaText: {
    color: Colors.primaryOrange,
    fontSize: wp('3.6%'),
    fontFamily: Fonts.Urbanist.semiBold,
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 2,
    marginLeft: wp('2%'),
    marginBottom: hp('1%'),
  },
  disabledInput: {
    backgroundColor: Colors.disableState,
    color: Colors.bodyText,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: Colors.Storke,
    borderRadius: 8,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.8%'),
    backgroundColor: Colors.white,
    marginBottom: hp('1.5%'),
  },
  dateButtonText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.Urbanist.regular,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: hp('1.5%'),
  },
  consentText: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
    marginLeft: wp('2%'),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightRed,
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    marginVertical: hp('1.5%'),
  },
  amountLabel: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  amountValue: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  payButton: {
    width: '100%',
    marginTop: hp('1%'),
  },
  testButton: {
    marginTop: hp('2%'),
    alignSelf: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.white,
  },
  testButtonText: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
  },
  backRow: {
    paddingVertical: hp('2%'),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: wp('4%'),
    color: Colors.black,
    marginLeft: wp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: wp('6%'),
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp('5%'),
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1.5%'),
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp('1%'),
    gap: wp('3%'),
  },
  modalPrimaryButton: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: 8,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.2%'),
  },
  modalPrimaryButtonText: {
    color: Colors.white,
    fontFamily: Fonts.Urbanist.semiBold,
    fontSize: hp('1.8%'),
  },
  modalSecondaryButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primaryOrange,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.2%'),
  },
  modalSecondaryButtonText: {
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    fontSize: hp('1.8%'),
  },
});
