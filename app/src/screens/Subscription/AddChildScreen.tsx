import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import DateOfBirthInput from 'components/inputs/DateOfBirthInput';
import PrimaryFieldLabel from 'components/inputs/FieldLabel';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import PrimaryTextArea from 'components/inputs/TextArea';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import Typography from 'components/Text/Typography';
import {useAuth} from 'context/AuthContext';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
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
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import RegistrationService from 'services/RegistartionService/registartion';
import UserService from 'services/userService';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {RemoveTrash} from 'styles/svg-icons';
import styles from './Components/forms/Styles/styles';

const MAX_CHILDREN = 3;
const PER_DAY_COST = 200;

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

const emptyChild = () => ({
  childFirstName: '',
  childLastName: '',
  dob: '',
  school: '',
  location: '',
  lunchTime: '',
  childClass: '',
  section: '',
  allergies: '',
  isExisting: false,
});

const validateChild = (child: any) =>
  child.childFirstName?.trim() &&
  child.childLastName?.trim() &&
  child.dob?.trim() &&
  child.school?.trim() &&
  child.location?.trim() &&
  child.lunchTime?.trim() &&
  child.childClass?.trim() &&
  child.section?.trim();

export default function AddChildScreen({navigation}: any) {
  const {userId} = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [existingChildren, setExistingChildren] = useState<any[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [newChildren, setNewChildren] = useState<any[]>([emptyChild()]);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSchools();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    try {
      setFetchLoading(true);
      const response: any = await UserService.getChildInformation(userId);
      const kids = response?.children || [];
      const subscription = response?.activeSubscription || null;
      setExistingChildren(kids);
      setActiveSubscription(subscription);
    } catch (err) {
      console.error('Error fetching children:', err);
    } finally {
      setFetchLoading(false);
    }
  };

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

  const schoolOptions = schools.map((s: any) => ({
    label: s.name,
    value: String(s._id),
    Locationlabel: s.location,
  }));

  const totalChildren = existingChildren.length + newChildren.length;
  const canAddMore = totalChildren < MAX_CHILDREN;

  const handleAddNewChild = () => {
    if (totalChildren >= MAX_CHILDREN) return;
    setNewChildren(prev => [...prev, emptyChild()]);
    setExpandedIndex(newChildren.length);
  };

  const handleRemoveNewChild = (index: number) => {
    if (newChildren.length <= 1) return;
    setNewChildren(prev => prev.filter((_, i) => i !== index));
    setExpandedIndex(prev => (prev >= index ? Math.max(0, prev - 1) : prev));
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    setNewChildren(prev => {
      const updated = [...prev];
      updated[index] = {...updated[index], [field]: value};
      return updated;
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(prev => (prev === index ? -1 : index));
  };

  const handleNext = async () => {
    // Validate all new children
    for (let i = 0; i < newChildren.length; i++) {
      if (!validateChild(newChildren[i])) {
        setExpandedIndex(i);
        Alert.alert('Validation Error', `Please fill in all required fields for Child ${i + 1}.`);
        return;
      }
    }

    if (!activeSubscription?._id) {
      Alert.alert('Error', 'No active subscription found. Please subscribe first.');
      return;
    }

    const workingDays = activeSubscription.workingDays || 22;
    const pricePerChild = workingDays * PER_DAY_COST;
    const totalAmount = newChildren.length * pricePerChild;

    navigation.navigate('AddChildPaymentScreen', {
      newChildren,
      subscriptionId: activeSubscription._id,
      workingDays,
      pricePerChild,
      totalAmount,
    });
  };

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={fetchLoading || loading} setLoading={() => {}} />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={() => navigation.goBack()} />

        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>Add Child</Typography>
          <Typography style={styles.stepDescription}>
            Add a new child to your existing plan.
          </Typography>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp('15%')}}>

            {/* Existing Children */}
            {existingChildren.length > 0 && (
              <View style={localStyles.section}>
                <Text style={localStyles.sectionTitle}>
                  Existing Children ({existingChildren.length}/{MAX_CHILDREN})
                </Text>
                {existingChildren.map((child: any) => (
                  <View key={child._id} style={localStyles.existingCard}>
                    <Text style={localStyles.existingName}>
                      {child.childFirstName} {child.childLastName}
                    </Text>
                    <Text style={localStyles.existingDetail}>
                      {child.school} • {child.childClass} {child.section}
                    </Text>
                    <Text style={localStyles.existingDetail}>
                      Lunch: {child.lunchTime}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* New Children */}
            <View style={styles.addchildTab}>
              <Text style={styles.addchildTabText}>
                NEW CHILDREN ({newChildren.length}/{MAX_CHILDREN - existingChildren.length})
              </Text>
              {canAddMore && (
                <TouchableOpacity
                  onPress={handleAddNewChild}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.addchildTabPlusButton}>+</Text>
                  <Text style={styles.addchildTabPlusButtonText}>
                    Add Another Child
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.hrLine} />

            {newChildren.map((child: any, index: number) => {
              const isExpanded = expandedIndex === index;
              const displayName =
                child.childFirstName?.trim()
                  ? `${child.childFirstName.trim()}${child.childLastName?.trim() ? ' ' + child.childLastName.trim() : ''}`
                  : `New Child ${index + 1}`;

              return (
                <View key={index} style={accordionStyles.card}>
                  <TouchableOpacity
                    onPress={() => toggleExpanded(index)}
                    activeOpacity={0.8}
                    style={accordionStyles.header}>
                    <Text style={accordionStyles.headerTitle}>{displayName}</Text>
                    <View style={accordionStyles.headerRight}>
                      {newChildren.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveNewChild(index)}
                          style={accordionStyles.removeBtn}
                          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                          <SvgXml
                            xml={RemoveTrash}
                            width={wp('4.5%')}
                            height={wp('4.5%')}
                          />
                        </TouchableOpacity>
                      )}
                      <Text style={accordionStyles.chevron}>
                        {isExpanded ? '▲' : '▼'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={accordionStyles.body}>
                      <PrimaryFieldLabel
                        label={`First Name`}
                        required
                      />
                      <ThemeInputPrimary
                        value={child.childFirstName}
                        onChangeText={(val: string) =>
                          handleChildChange(index, 'childFirstName', val)
                        }
                        placeholder="Child's First Name"
                      />

                      <PrimaryFieldLabel label="Last Name" required />
                      <ThemeInputPrimary
                        value={child.childLastName}
                        onChangeText={(val: string) =>
                          handleChildChange(index, 'childLastName', val)
                        }
                        placeholder="Child's Last Name"
                      />

                      <PrimaryFieldLabel label="Date of Birth" required />
                      <DateOfBirthInput
                        value={child.dob}
                        onChange={(val: string) =>
                          handleChildChange(index, 'dob', val)
                        }
                      />

                      <PrimaryFieldLabel label="School" required />
                      {loadingSchools ? (
                        <Text>Loading schools...</Text>
                      ) : (
                        <PrimaryDropdown
                          options={schoolOptions}
                          placeholder="Select School"
                          selectedValue={String(child.school)}
                          onValueChange={(val: string | number) => {
                            const selected = schoolOptions.find(
                              (s: {value: string | number}) => s.value === val,
                            );
                            handleChildChange(index, 'school', String(val));
                            if (selected) {
                              handleChildChange(
                                index,
                                'location',
                                selected.Locationlabel,
                              );
                            }
                          }}
                        />
                      )}

                      <PrimaryFieldLabel label="Location" required />
                      <ThemeInputPrimary
                        value={child.location}
                        onChangeText={(val: string) =>
                          handleChildChange(index, 'location', val)
                        }
                        placeholder="Location"
                        editable={false}
                      />

                      <PrimaryFieldLabel label="Lunch Time" required />
                      <PrimaryDropdown
                        options={lunchTimes}
                        placeholder="Select Lunch Time"
                        selectedValue={child.lunchTime}
                        onValueChange={val =>
                          handleChildChange(index, 'lunchTime', String(val))
                        }
                      />

                      <View style={styles.flexLabel}>
                        <View style={{flex: 1}}>
                          <PrimaryFieldLabel label="Class" required />
                          <PrimaryDropdown
                            options={classOptions}
                            placeholder="Select Class"
                            selectedValue={child.childClass}
                            onValueChange={(val: string | number) =>
                              handleChildChange(index, 'childClass', String(val))
                            }
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <PrimaryFieldLabel label="Section" required />
                          <PrimaryDropdown
                            options={sectionOptions}
                            placeholder="Select Section"
                            selectedValue={child.section}
                            onValueChange={(val: string | number) =>
                              handleChildChange(index, 'section', String(val))
                            }
                          />
                        </View>
                      </View>

                      <PrimaryFieldLabel label="Allergies (optional)" />
                      <PrimaryTextArea
                        label=""
                        placeholder="Enter allergies if any"
                        value={child.allergies}
                        onChangeText={val =>
                          handleChildChange(index, 'allergies', val)
                        }
                      />
                    </View>
                  )}
                </View>
              );
            })}

            {/* Buttons */}
            <View style={[styles.StickyButton, {marginTop: hp('2%')}]}>
              <SecondaryButton
                title="BACK"
                onPress={() => navigation.goBack()}
                style={{flex: 1}}
              />
              <PrimaryButton
                title="NEXT"
                onPress={handleNext}
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
  section: {
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  existingCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: Colors.lightRed,
    elevation: 1,
  },
  existingName: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('0.5%'),
  },
  existingDetail: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
  },
});

const accordionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    marginBottom: hp('1.5%'),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('4%'),
    backgroundColor: Colors.bg,
  },
  headerTitle: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeBtn: {
    padding: 4,
  },
  chevron: {
    fontSize: hp('1.8%'),
    color: Colors.bodyText,
  },
  body: {
    padding: wp('4%'),
  },
});
