import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import DateOfBirthInput from 'components/inputs/DateOfBirthInput';
import PrimaryFieldLabel from 'components/inputs/FieldLabel';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import PrimaryTextArea from 'components/inputs/TextArea';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import React, {useMemo} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from '../../Components/forms/Styles/styles';
import {SvgXml} from 'react-native-svg';
import {RemoveTrash, WhatAppIcon} from 'styles/svg-icons';

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
];

export default function ChildrenDetails({
  children,
  handleChildChange,
  addChild,
  removeChild,
  prevStep,
  nextStep,
  errors,
  schools,
  loadingSchools,
}: any) {
  const isFormValid = useMemo(() => {
    return children.every(
      (child: any) =>
        child.childFirstName?.trim() &&
        child.childLastName?.trim() &&
        child.dob?.trim() &&
        child.school?.trim() &&
        child.location?.trim() &&
        child.lunchTime?.trim() &&
        child.childClass?.trim() &&
        child.childSection?.trim(),
    );
  }, [children]);

  const schoolOptions = schools.map((s: any) => ({
    label: s.name,
    value: String(s._id),
    Locationlabel: s.location,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.childFormContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp('15%')}}>
          <View style={styles.addchildTab}>
            <Text style={styles.addchildTabText}>
              CHILDREN ({children.length})
            </Text>

            <TouchableOpacity
              onPress={addChild}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.addchildTabPlusButton]}>+</Text>
              <Text style={styles.addchildTabPlusButtonText}>
                Add Another Child
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hrLine} />

          {children.map((child: any, index: number) => (
            <View key={index} style={{marginBottom: hp('4%')}}>
              <View style={styles.TitleRow}>
                <PrimaryFieldLabel
                  label={`Child ${index + 1} First Name`}
                  required
                />

                {children.length > 1 && (
                  <View style={styles.removeButtonContainer}>
                    <TouchableOpacity
                      onPress={() => removeChild(index)}
                      style={styles.removeButtonRow}>
                      <SvgXml
                        xml={RemoveTrash}
                        width={wp('5%')}
                        height={wp('5%')}
                      />
                      <Text style={styles.removeButtonText}>
                        Remove {child.childName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

            <ThemeInputPrimary
                value={child.childFirstName}
                onChangeText={(val: string) => handleChildChange(index, 'childFirstName', val)}
                placeholder="Child's First Name"
                error={errors?.[index]?.childFirstName}
              />

              <PrimaryFieldLabel label={`Child ${index + 1} Last Name`} required />
              <ThemeInputPrimary
                value={child.childLastName}
                onChangeText={(val: string) => handleChildChange(index, 'childLastName', val)}
                placeholder="Child's Last Name"
                error={errors?.[index]?.childLastName}
              />

              <PrimaryFieldLabel label="Date of Birth" required />
              <DateOfBirthInput
                value={child.dob}
                onChange={(val: string) => handleChildChange(index, 'dob', val)}
                error={errors?.[index]?.dob}
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
                    const selectedSchool = schoolOptions.find(
                      (s: {value: string | number}) => s.value === val,
                    );

                    handleChildChange(index, 'school', String(val));
                    if (selectedSchool) {
                      handleChildChange(
                        index,
                        'location',
                        selectedSchool.Locationlabel,
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
                error={errors?.[index]?.location}
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
                    selectedValue={child.childSection}
                    onValueChange={(val: string | number) =>
                      handleChildChange(index, 'childSection', String(val))
                    }
                  />
                </View>
              </View>

              <PrimaryFieldLabel label="Does child have any allergies?" />
              <PrimaryTextArea
                label=""
                placeholder="Enter allergies if any"
                value={child.allergies}
                onChangeText={val => handleChildChange(index, 'allergies', val)}
                error={errors?.[index]?.allergies}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.SubmitButtonContainer}>
          <View style={styles.StickyButton}>
            <SecondaryButton
              title="BACK"
              onPress={prevStep}
              style={{
                width: wp('45%'),
              }}
            />
            <PrimaryButton
              title="NEXT"
              onPress={nextStep}
              disabled={!isFormValid}
              style={{
                width: wp('45%'),
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
