
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import PrimaryFieldLabel from 'components/inputs/FieldLabel';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import PrimaryButton from 'components/buttons/PrimaryButton';
import styles from '../../Components/forms/Styles/styles';
import PrimaryTextArea from 'components/inputs/TextArea';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProfile } from 'context/UserDataContext';

export default function ParentDetails({
  fatherFirstName,
  setFatherFirstName,
  fatherLastName,
  setFatherLastName,
  motherFirstName,
  setMotherFirstName,
  motherLastName,
  setMotherLastName,
  mobileNumber,
  setMobileNumber,
  email,
  setEmail,
  address,
  setAddress,
  pincode,
  setPincode,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  submitRegistration,
  errors,

  showEmail = true,
  showPhone = true,
  showCountry = true,
}: any) {


  const [loading, setLoading] = useState(true);

  const isFormValid = useMemo(() => {
    const isValidPincode = /^[0-9]{6}$/.test(pincode?.trim() || '');
    return (
      fatherFirstName?.trim() &&
      fatherLastName?.trim() &&
      motherFirstName?.trim() &&
      motherLastName?.trim() &&
      mobileNumber?.trim() &&
      email?.trim() &&
      address?.trim() &&
      isValidPincode &&
      city?.trim() &&
      state?.trim() &&
      country?.trim()
    );
  }, [
    fatherFirstName,
    fatherLastName,
    motherFirstName,
    motherLastName,
    mobileNumber,
    email,
    address,
    pincode,
    city,
    state,
    country,
  ]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          const phone = parsedUser?.phone_number?.toString().trim() || '';
          const mail = parsedUser?.email?.toString().trim() || '';

          if (phone) setMobileNumber(phone);
          if (mail) setEmail(mail);

          console.log('User phone loaded:', parsedUser);
          console.log('User email loaded:', mail);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    getUserData();
  }, [setMobileNumber, setEmail]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.parentFormContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp('50%')}}>
          {/* Father’s Name */}
          <PrimaryFieldLabel label="Father’s First Name" required />
          <ThemeInputPrimary
            value={fatherFirstName}
            onChangeText={setFatherFirstName}
            placeholder="Father's First Name"
            error={errors?.fatherFirstName}
          />

          <PrimaryFieldLabel label="Father’s Last Name" required />
          <ThemeInputPrimary
            value={fatherLastName}
            onChangeText={setFatherLastName}
            placeholder="Father's Last Name"
            error={errors?.fatherLastName}
          />

          {/* Mother’s Name */}
          <PrimaryFieldLabel label="Mother’s First Name" required />
          <ThemeInputPrimary
            value={motherFirstName}
            onChangeText={setMotherFirstName}
            placeholder="Mother's First Name"
            error={errors?.motherFirstName}
          />

          <PrimaryFieldLabel label="Mother’s Last Name" required />
          <ThemeInputPrimary
            value={motherLastName}
            onChangeText={setMotherLastName}
            placeholder="Mother's Last Name"
            error={errors?.motherLastName}
          />

          {/* Contact Info */}

          {showPhone && (
            <>
              <PrimaryFieldLabel label="Mobile Number" required />
              <ThemeInputPrimary
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                error={errors?.mobileNumber}
              />
            </>
          )}

          {showEmail && (
            <>
              <PrimaryFieldLabel label="Email Address" required />
              <ThemeInputPrimary
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors?.email}
              />
            </>
          )}

          {/* Address Details */}
          <PrimaryFieldLabel label="Pincode" required />
          <ThemeInputPrimary
            value={pincode}
            onChangeText={setPincode}
            placeholder="Pincode"
            keyboardType="number-pad"
            error={
              pincode && !/^[0-9]{6}$/.test(pincode)
                ? 'Please enter a valid 6-digit pincode'
                : errors?.pincode
            }
          />

          <PrimaryFieldLabel label="City" required />
          <ThemeInputPrimary
            value={city}
            onChangeText={setCity}
            placeholder="City"
            error={errors?.city}
          />

          <PrimaryFieldLabel label="State" required />
          <ThemeInputPrimary
            value={state}
            onChangeText={setState}
            placeholder="State"
            error={errors?.state}
          />

          {showCountry && (
            <>
              <PrimaryFieldLabel label="Country" required />
              <ThemeInputPrimary
                value={country}
                onChangeText={setCountry}
                placeholder="Country"
                error={errors?.country}
              />
            </>
          )}

          <PrimaryFieldLabel label="Residential Address" required />
          <PrimaryTextArea
            value={address}
            onChangeText={setAddress}
            placeholder="Residential Address"
            error={errors?.address}
            multiline
            numberOfLines={4}
          />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.parentSubmitButtonContainer}>
          <PrimaryButton
            title="Next"
            onPress={submitRegistration}
            disabled={!isFormValid}
            style={{
              width: wp('90%'),
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

//####################################### OLD VERIONS #####################################################
// import React, {useMemo} from 'react';
// import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
// import PrimaryFieldLabel from 'components/inputs/FieldLabel';
// import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
// import PrimaryButton from 'components/buttons/PrimaryButton';
// import styles from '../../Components/forms/Styles/styles';
// import PrimaryTextArea from 'components/inputs/TextArea';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// export default function ParentDetails({
//   fatherFullName,
//   setFatherFullName,
//   motherFullName,
//   setMotherFullName,
//   mobileNumber,
//   setMobileNumber,
//   address,
//   setAddress,
//   submitRegistration,
//   errors,
// }: any) {
//   const isFormValid = useMemo(() => {
//     return (
//       fatherFullName?.trim() &&
//       motherFullName?.trim() &&
//       mobileNumber?.trim() &&
//       address?.trim()
//     );
//   }, [fatherFullName, motherFullName, mobileNumber, address]);
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <View style={styles.parentFormContainer}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{paddingBottom: hp('15%')}}>
//           <PrimaryFieldLabel label="Father’s Full Name" required />
//           <ThemeInputPrimary
//             value={fatherFullName}
//             onChangeText={setFatherFullName}
//             placeholder="Father's Full Name"
//             error={errors?.fatherFullName}
//           />

//           <PrimaryFieldLabel label="Mother’s Full Name" required />
//           <ThemeInputPrimary
//             value={motherFullName}
//             onChangeText={setMotherFullName}
//             placeholder="Mother's Full Name"
//             error={errors?.motherFullName}
//           />

//           <PrimaryFieldLabel label="Mobile Number" required />
//           <ThemeInputPrimary
//             value={mobileNumber}
//             onChangeText={setMobileNumber}
//             placeholder="Mobile Number"
//             error={errors?.mobileNumber}
//           />

//           <PrimaryFieldLabel label="Residential Address" required />
//           <PrimaryTextArea
//             value={address}
//             onChangeText={setAddress}
//             placeholder="Residential Address"
//             error={errors?.address}
//             multiline
//             numberOfLines={4}
//           />
//         </ScrollView>
//         <View style={styles.SubmitButtonContainer}>
//           <PrimaryButton
//             title="Next"
//             onPress={submitRegistration}
//             disabled={!isFormValid}
//             style={{
//               width: wp('90%'),
//             }}
//           />
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
