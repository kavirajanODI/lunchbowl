import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import PrimaryFieldLabel from 'components/inputs/FieldLabel';
import PrimaryTextArea from 'components/inputs/TextArea';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import {useUserProfile} from 'context/UserDataContext';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import RegistrationService from 'services/RegistartionService/registartion';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';
import styles from 'screens/Subscription/Components/forms/Styles/styles';

export default function EditParentDetailsScreen({navigation}: any) {
  const {userId} = useAuth();
  const {profileData, refreshProfileData} = useUserProfile();
  const [loading, setLoading] = useState(false);

  const parent = profileData?.parentDetails;

  const [fatherFirstName, setFatherFirstName] = useState('');
  const [fatherLastName, setFatherLastName] = useState('');
  const [motherFirstName, setMotherFirstName] = useState('');
  const [motherLastName, setMotherLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (parent) {
      setFatherFirstName(parent.fatherFirstName || '');
      setFatherLastName(parent.fatherLastName || '');
      setMotherFirstName(parent.motherFirstName || '');
      setMotherLastName(parent.motherLastName || '');
      setMobile(parent.mobile || '');
      setEmail(parent.email || '');
      setAddress(parent.address || '');
      setPincode(parent.pincode || '');
      setCity(parent.city || '');
      setState(parent.state || '');
      setCountry(parent.country || '');
    }
  }, [parent]);

  const handleSave = async () => {
    if (
      !fatherFirstName.trim() ||
      !fatherLastName.trim() ||
      !motherFirstName.trim() ||
      !motherLastName.trim() ||
      !mobile.trim() ||
      !email.trim() ||
      !address.trim() ||
      !pincode.trim() ||
      !city.trim() ||
      !state.trim() ||
      !country.trim()
    ) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      Alert.alert('Validation', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      Alert.alert('Validation', 'Please enter a valid 6-digit pincode.');
      return;
    }

    try {
      setLoading(true);
      const result: any = await RegistrationService.updateParent({
        _id: userId,
        path: 'step-Form-ParentDetails',
        formData: {
          fatherFirstName: fatherFirstName.trim(),
          fatherLastName: fatherLastName.trim(),
          motherFirstName: motherFirstName.trim(),
          motherLastName: motherLastName.trim(),
          mobile: mobile.trim(),
          email: email.trim(),
          address: address.trim(),
          pincode: pincode.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
        },
      });

      if (result?.success) {
        await refreshProfileData();
        Alert.alert('Success', 'Parent details updated successfully.', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        Alert.alert('Error', result?.message || 'Failed to update details.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={() => {}} />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={() => navigation.goBack()} />
        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>Edit Parent</Typography>
          <Typography style={styles.stepDescription}>
            Update parent details below.
          </Typography>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp('15%')}}>
            <PrimaryFieldLabel label="Father's First Name" required />
            <ThemeInputPrimary
              value={fatherFirstName}
              onChangeText={setFatherFirstName}
              placeholder="Father's First Name"
            />

            <PrimaryFieldLabel label="Father's Last Name" required />
            <ThemeInputPrimary
              value={fatherLastName}
              onChangeText={setFatherLastName}
              placeholder="Father's Last Name"
            />

            <PrimaryFieldLabel label="Mother's First Name" required />
            <ThemeInputPrimary
              value={motherFirstName}
              onChangeText={setMotherFirstName}
              placeholder="Mother's First Name"
            />

            <PrimaryFieldLabel label="Mother's Last Name" required />
            <ThemeInputPrimary
              value={motherLastName}
              onChangeText={setMotherLastName}
              placeholder="Mother's Last Name"
            />

            <PrimaryFieldLabel label="Mobile Number" required />
            <ThemeInputPrimary
              value={mobile}
              onChangeText={setMobile}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
            />

            <PrimaryFieldLabel label="Email Address" required />
            <ThemeInputPrimary
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <PrimaryFieldLabel label="Pincode" required />
            <ThemeInputPrimary
              value={pincode}
              onChangeText={setPincode}
              placeholder="6-digit pincode"
              keyboardType="number-pad"
            />

            <PrimaryFieldLabel label="City" required />
            <ThemeInputPrimary
              value={city}
              onChangeText={setCity}
              placeholder="City"
            />

            <PrimaryFieldLabel label="State" required />
            <ThemeInputPrimary
              value={state}
              onChangeText={setState}
              placeholder="State"
            />

            <PrimaryFieldLabel label="Country" required />
            <ThemeInputPrimary
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
            />

            <PrimaryFieldLabel label="Residential Address" required />
            <PrimaryTextArea
              label=""
              value={address}
              onChangeText={setAddress}
              placeholder="Residential Address"
            />

            <View style={[styles.StickyButton, localStyles.saveRow]}>
              <PrimaryButton title="SAVE CHANGES" onPress={handleSave} style={styles.btn} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ThemeGradientBackground>
  );
}

const localStyles = StyleSheet.create({
  saveRow: {
    marginTop: hp('3%'),
  },
});
