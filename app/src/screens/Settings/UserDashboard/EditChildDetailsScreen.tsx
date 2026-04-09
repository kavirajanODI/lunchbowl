import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import DateOfBirthInput from 'components/inputs/DateOfBirthInput';
import PrimaryFieldLabel from 'components/inputs/FieldLabel';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import PrimaryTextArea from 'components/inputs/TextArea';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import Typography from 'components/Text/Typography';
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
import styles from 'screens/Subscription/Components/forms/Styles/styles';

const classOptions = [
  {label: 'LKG', value: 'LKG'},
  {label: 'UKG', value: 'UKG'},
  {label: '1st Grade', value: '1'},
  {label: '2nd Grade', value: '2'},
  {label: '3rd Grade', value: '3'},
  {label: '4th Grade', value: '4'},
  {label: '5th Grade', value: '5'},
  {label: '6th Grade', value: '6'},
  {label: '7th Grade', value: '7'},
  {label: '8th Grade', value: '8'},
  {label: '9th Grade', value: '9'},
  {label: '10th Grade', value: '10'},
  {label: '11th Grade', value: '11'},
  {label: '12th Grade', value: '12'},
];

const lunchTimes = [
  {label: '10:00 AM - 10:30 AM', value: '10:00-10:30'},
  {label: '11:00 AM - 11:30 AM', value: '11:00-11:30'},
  {label: '12:00 PM - 12:30 PM', value: '12:00-12:30'},
  {label: '01:00 PM - 01:30 PM', value: '13:00-13:30'},
];

const sectionOptions = [
  {label: 'A', value: 'A'},
  {label: 'B', value: 'B'},
  {label: 'C', value: 'C'},
  {label: 'D', value: 'D'},
  {label: 'E', value: 'E'},
  {label: 'F', value: 'F'},
  {label: 'G', value: 'G'},
  {label: 'H', value: 'H'},
];

export default function EditChildDetailsScreen({route, navigation}: any) {
  const {userId} = useAuth();
  const {refreshProfileData} = useUserProfile();
  const {child} = route.params || {};

  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);

  const [childFirstName, setChildFirstName] = useState('');
  const [childLastName, setChildLastName] = useState('');
  const [dob, setDob] = useState('');
  const [school, setSchool] = useState('');
  const [location, setLocation] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [childClass, setChildClass] = useState('');
  const [section, setSection] = useState('');
  const [allergies, setAllergies] = useState('');

  useEffect(() => {
    if (child) {
      setChildFirstName(child.childFirstName || '');
      setChildLastName(child.childLastName || '');
      setDob(child.dob ? child.dob.split('T')[0] : '');
      setSchool(child.school || '');
      setLocation(child.location || '');
      setLunchTime(child.lunchTime || '');
      setChildClass(child.childClass || '');
      setSection(child.section || '');
      setAllergies(child.allergies || '');
    }
  }, [child]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const response: any = await RegistrationService.getAllSchools();
        if (response?.success && Array.isArray(response.data)) {
          setSchools(response.data);
        }
      } catch (err) {
        console.error('Error fetching schools:', err);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  const schoolOptions = schools.map((s: any) => ({
    label: s.name,
    value: s.name,
    Locationlabel: s.location,
  }));

  const handleSave = async () => {
    if (
      !childFirstName.trim() ||
      !childLastName.trim() ||
      !dob.trim() ||
      !school.trim() ||
      !location.trim() ||
      !lunchTime.trim() ||
      !childClass.trim() ||
      !section.trim()
    ) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const childPayload: any = {
        childFirstName: childFirstName.trim(),
        childLastName: childLastName.trim(),
        dob,
        school: school.trim(),
        location: location.trim(),
        lunchTime,
        childClass,
        section,
        allergies: allergies.trim(),
      };
      if (child?._id) {
        childPayload._id = child._id;
      }

      const result: any = await RegistrationService.updateChildren({
        _id: userId,
        path: 'step-Form-ChildDetails',
        formData: [childPayload],
      });

      if (result?.success) {
        await refreshProfileData();
        Alert.alert('Success', 'Child details updated successfully.', [
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
      <LoadingModal loading={loading || loadingSchools} setLoading={() => {}} />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={() => navigation.goBack()} />
        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>Edit Child</Typography>
          <Typography style={styles.stepDescription}>
            Update child details below.
          </Typography>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp('15%')}}>
            <PrimaryFieldLabel label="First Name" required />
            <ThemeInputPrimary
              value={childFirstName}
              onChangeText={setChildFirstName}
              placeholder="Child's First Name"
            />

            <PrimaryFieldLabel label="Last Name" required />
            <ThemeInputPrimary
              value={childLastName}
              onChangeText={setChildLastName}
              placeholder="Child's Last Name"
            />

            <PrimaryFieldLabel label="Date of Birth" required />
            <DateOfBirthInput value={dob} onChange={setDob} />

            <PrimaryFieldLabel label="School" required />
            {loadingSchools ? (
              <Text style={localStyles.loadingText}>Loading schools...</Text>
            ) : (
              <PrimaryDropdown
                options={schoolOptions}
                placeholder="Select School"
                selectedValue={school}
                onValueChange={(val: string | number) => {
                  const selected = schoolOptions.find(
                    (s: {value: string | number}) => s.value === val,
                  );
                  setSchool(String(val));
                  if (selected) {
                    setLocation(selected.Locationlabel);
                  }
                }}
              />
            )}

            <PrimaryFieldLabel label="Location" required />
            <ThemeInputPrimary
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
              editable={false}
            />

            <PrimaryFieldLabel label="Lunch Time" required />
            <PrimaryDropdown
              options={lunchTimes}
              placeholder="Select Lunch Time"
              selectedValue={lunchTime}
              onValueChange={val => setLunchTime(String(val))}
            />

            <View style={styles.flexLabel}>
              <View style={{flex: 1}}>
                <PrimaryFieldLabel label="Class" required />
                <PrimaryDropdown
                  options={classOptions}
                  placeholder="Select Class"
                  selectedValue={childClass}
                  onValueChange={(val: string | number) =>
                    setChildClass(String(val))
                  }
                />
              </View>
              <View style={{flex: 1}}>
                <PrimaryFieldLabel label="Section" required />
                <PrimaryDropdown
                  options={sectionOptions}
                  placeholder="Select Section"
                  selectedValue={section}
                  onValueChange={(val: string | number) =>
                    setSection(String(val))
                  }
                />
              </View>
            </View>

            <PrimaryFieldLabel label="Allergies (optional)" />
            <PrimaryTextArea
              label=""
              placeholder="Enter allergies if any"
              value={allergies}
              onChangeText={setAllergies}
            />

            <View style={[styles.StickyButton, localStyles.saveRow]}>
              <PrimaryButton
                title="SAVE CHANGES"
                onPress={handleSave}
                style={styles.btn}
              />
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
  loadingText: {
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
    fontSize: hp('1.8%'),
    marginBottom: hp('1%'),
  },
});
