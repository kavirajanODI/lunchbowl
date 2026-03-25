import { BlurView } from '@react-native-community/blur';
import CheckBox from '@react-native-community/checkbox';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import OfflineNotice from 'components/Error/OfflineNotice';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import AlertModal from 'components/Modal/AlertModal';
import SectionTitle from 'components/Titles/SectionHeading';
import { useAuth } from 'context/AuthContext';
import { useDate } from 'context/calenderContext';
import { useMenu } from 'context/MenuContext';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
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
import { SvgXml } from 'react-native-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import MenuService from 'services/MyPlansApi/MenuService';
import { BackIcon, ForwardIcon, questionIcon } from 'styles/svg-icons';
import { utcToLocal } from 'utils/localTime';
import { validateMenuDate } from 'utils/MenuValidation';
import { createHolidayPaymentRequest, encryptRequest } from 'utils/paymentUtils';
import { Colors } from '../../assets/styles/colors';
import ccavenueConfig from '../../config/ccavenueConfig';
import menues from '../../services/MenueService/Data/menus.json';

// ################### HELPER DROPDOWN #############################

type DropdownOption = {
  label: string;
  value: string | number;
};

const allMeals = menues.meal_plan.flatMap(day => day.meals);
const mealOptions: DropdownOption[] = allMeals.map(meal => ({
  label: meal,
  value: meal,
}));

// ################### MEAL PLANS (Dietitian) #######################

const mealPlans = {
  1: {
    name: 'Meal Plan 1',
    meals: allMeals,
  },
  // 2: {
  //   name: 'Meal Plan 2',
  //   meals: [...allMeals].reverse(),
  // },
};

// ################### MAIN SCREEN ##################################

const MenuSelectionScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const passedDate = route?.params?.selectedDate
    ? utcToLocal(route.params.selectedDate)
    : new Date();

  // ################### STATES CALL HOOCKS #########################

  const [selectedTab, setSelectedTab] = useState<'custom' | 'dietitian'>(
    'custom',
  );

  const [loading, setLoading] = useState(false);
  const {childrenData} = useMenu();
  const {userId} = useAuth();
  const [applySameDish, setApplySameDish] = useState(false);

  const [selectedDate, setSelectedDate] = useState(passedDate);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDietitianPlan, setSelectedDietitianPlan] = useState<any>(null);
  const [showTip, setShowTip] = useState(false);

  //################################# ERROR HANDLING #######################

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success',
  );
  const [alertMessage, setAlertMessage] = useState('');

  // ################### HANDLE DISH SELECTION #######################

  const handleDishSelect = (childIndex: number) => (dish: string | number) => {
    const dishStr = String(dish);
    setSelectedDishes(prev => {
      let updated = [...prev];
      updated[childIndex] = dishStr;
      if (applySameDish) updated = childrenData.map(() => dishStr);
      return updated;
    });
  };

  useEffect(() => {
    setSelectedDishes([]);
  }, [selectedTab]);

  const {holidays} = useDate();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };
  const onPrevDate = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };
  const onNextDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };
  const onPrevMonth = () => {
    const prev = new Date(selectedMonth);
    prev.setMonth(prev.getMonth() - 1);
    setSelectedMonth(prev);
  };
  const onNextMonth = () => {
    const next = new Date(selectedMonth);
    next.setMonth(next.getMonth() + 1);
    setSelectedMonth(next);
  };

  //################ DATE IF MATCHE SHOW PAY BUTTON ####################

  const selectedDateStr = new Date(route.params.selectedDate)
    .toISOString()
    .split('T')[0];
  const isHolidayFromApi = holidays.some(
    holiday => holiday.date === selectedDateStr,
  );
  const dayOfWeek = new Date(route.params.selectedDate).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = isHolidayFromApi || isWeekend;

  // ################### HANDLE API CALL ###################################
  useEffect(() => {
    console.log('📅 Selected Date => ', selectedDate.toISOString());
  }, [selectedDate]);

  const SaveMenue = async () => {
    setLoading(true);
    try {
      // BASE VALIDATION   ####################

      const errorMsg = validateMenuDate(selectedDate, holidays);
      if (errorMsg) {
        Alert.alert('Not Allowed Permission Denied', errorMsg);
        setLoading(false);
        return;
      }

      let childrenPayload;

      switch (selectedTab) {
        // ######################## CUSTOM PLAN #############################
        case 'custom': {
          childrenPayload = {
            _id: userId,
            path: 'save-meals',
            data: {
              userId,
              children: childrenData.map((child, childIndex) => ({
                childId: child.id,
                meals: [
                  {
                    mealDate: selectedDate.toISOString(),
                    mealName: selectedDishes[childIndex] || '',
                  },
                ],
              })),
            },
          };
          break;
        }

        // ######################## DIETITIAN PLAN #########################
        case 'dietitian': {
          if (!selectedDietitianPlan) {
            Alert.alert(
              'Error',
              'Please select a Dietitian plan before saving',
            );
            setLoading(false);
            return;
          }
          childrenPayload = {
            _id: '6899c82df8872394d8f40ba3',
            path: 'save-meals',
            data: {
              userId,
              children: childrenData.map(child => ({
                childId: child.id,
                meals: selectedDietitianPlan.meals.map((meal: string) => ({
                  mealDate: selectedMonth.toISOString(),
                  mealName: meal,
                })),
              })),
            },
          };
          break;
        }

        // ######################## DEFAULT (UNKNOWN TAB) ###################
        default: {
          Alert.alert('Error', 'Invalid plan type selected');
          setLoading(false);
          return;
        }
      }

      console.log(
        'sendeddata for console >>> ',
        JSON.stringify(childrenPayload, null, 2),
      );

      const response = await MenuService.saveMenuSelection(childrenPayload);

      if (response?.success) {
        setAlertType('success');
        setAlertMessage(response.message || 'Menu saved successfully!');
      } else {
        setAlertType('error');
        setAlertMessage(response?.error || 'Failed to save menu');
      }
      setAlertVisible(true);
    } catch (error) {
      console.error('🔥 Save menu error:', error);
      Alert.alert('Error', 'Something went wrong while saving the menu');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    try {
      if (!userId) throw new Error('User ID not found. Please login again.');

      const paymentData = createHolidayPaymentRequest(
        ccavenueConfig,
        selectedDate,
        childrenData,
        userId,
      );

      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');

      const encryptedData = encryptRequest(
        plainText,
        ccavenueConfig.working_key,
      );

      navigation.navigate('WebViewScreen', {
        encRequest: encryptedData,
        accessCode: ccavenueConfig.access_code,
        endpoint: ccavenueConfig.endpoint,
      });

      Alert.alert(
        'Payment Ready',
        `Encrypted: ${encryptedData.substring(0, 20)}...`,
      );
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'Payment failed, please try again');
    }
  };

  return (
    <ThemeGradientBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <HeaderBackButton title="Back" />
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'custom' && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab('custom')}>
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === 'custom' && styles.activeTabText,
                ]}>
                Custom Plan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'dietitian' && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab('dietitian')}>
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === 'dietitian' && styles.activeTabText,
                ]}>
                Dietitian Plan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Selector */}
          <OfflineNotice />

          {selectedTab === 'custom' ? (
            <View style={styles.dateSelector}>
              <TouchableOpacity onPress={onPrevDate}>
                <SvgXml xml={BackIcon} />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              <TouchableOpacity onPress={onNextDate}>
                <SvgXml xml={ForwardIcon} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dateSelector}>
              <TouchableOpacity onPress={onPrevMonth}>
                <SvgXml xml={BackIcon} />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatMonth(selectedMonth)}</Text>
              <TouchableOpacity onPress={onNextMonth}>
                <SvgXml xml={ForwardIcon} />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.noteText}>
            Note: Choose your child’s meals by selecting their name.
          </Text>

          {/* Child Menu Selection or Meal Plans */}
          <View style={styles.menuHeader}>
            <SectionTitle>
              {selectedTab === 'custom'
                ? 'Select your Child’s Menu'
                : 'Available Dietitian Plans'}
            </SectionTitle>

            <Tooltip
              isVisible={showTip}
              content={
                <Text style={{color: Colors.black, fontSize: wp('3.5%')}}>
                  {selectedTab === 'custom'
                    ? 'Pick meals for each child by name.'
                    : 'Choose a dietitian plan and apply to all children.'}
                </Text>
              }
              placement="bottom"
              onClose={() => setShowTip(false)}>
              <TouchableOpacity onPress={() => setShowTip(true)}>
                <SvgXml xml={questionIcon} width={20} height={20} />
              </TouchableOpacity>
            </Tooltip>
          </View>
          <View style={styles.menuSelection}>
            {selectedTab === 'custom' ? (
              // ---------------- Custom Plan ----------------
              <ScrollView
                style={styles.formContainer}
                keyboardShouldPersistTaps="handled">
                {childrenData.map((child, index) => (
                  <View key={child.id} style={styles.childForm}>
                    <Text style={styles.childName}>{child.name}</Text>

                    <PrimaryDropdown
                      options={mealOptions}
                      placeholder={`Select ${child.name}'s Dish`}
                      selectedValue={selectedDishes[index] || ''}
                      onValueChange={handleDishSelect(index)}
                    />
                    {index === 0 && (
                      <View style={styles.checkboxContainer}>
                        <CheckBox
                          value={applySameDish}
                          onValueChange={newValue => setApplySameDish(newValue)}
                          tintColors={{
                            true: Colors.primaryOrange,
                            false: Colors.default,
                          }}
                        />
                        <Text style={styles.checkboxLabel}>
                          Apply the Same dish for all children
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              //  ####################### DITRATION PLAN ##########################

              <View style={{marginTop: 10}}>
                {Object.entries(mealPlans).map(([key, plan]) => {
                  const isSelected = selectedDietitianPlan?.name === plan.name;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.planCard,
                        isSelected && styles.selectedPlanCard,
                      ]}
                      onPress={() => setSelectedDietitianPlan(plan)}>
                      <View style={styles.planHeader}>
                        {/* Left side - radio + title */}
                        <View style={styles.planInfo}>
                          <View
                            style={[
                              styles.radioOuter,
                              isSelected && styles.radioOuterSelected,
                            ]}>
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <Text
                            style={[
                              styles.planTitle,
                              isSelected && {color: Colors.primaryOrange},
                            ]}>
                            {plan.name}
                          </Text>
                        </View>

                        {/* Right side - button */}
                        <TouchableOpacity
                          style={[
                            styles.viewMoreBtn,
                            isSelected && styles.viewMoreBtnSelected,
                          ]}
                          onPress={() => setSelectedPlan(plan)}>
                          <Text
                            style={[
                              styles.viewMoreText,
                              isSelected && styles.viewMoreTextSelected,
                            ]}>
                            View More
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Buttons for Custom & Dietitian */}
      {(selectedTab === 'custom' || selectedTab === 'dietitian') && (
        <View style={styles.stickyButtonsContainer}>
          {isHoliday && (
            <Text style={styles.holidayWarningText}>
              This date is a holiday. Additional charges may apply.
            </Text>
          )}
          <View style={styles.stickyButtonsRow}>
            <SecondaryButton
              title="CANCEL"
              onPress={() => navigation.goBack()}
              style={{
                width: wp('43%'),
              }}
            />

            {!isHoliday && (
              <PrimaryButton
                title={loading ? 'Saving...' : 'SAVE'}
                onPress={SaveMenue}
                disabled={loading}
                style={{
                  width: wp('43%'),
                }}
              />
            )}

            {isHoliday && (
              <PrimaryButton
                title="Pay Now"
                onPress={handlePayNow}
                style={{
                  width: wp('43%'),
                }}
              />
            )}
          </View>
        </View>
      )}
      <AlertModal
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      {/* Bottom Sheet for Dietitian Plan */}

      <Modal
        visible={!!selectedPlan}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPlan(null)}>
        <BlurView
          style={styles.modalOverlay}
          blurType="light"
          blurAmount={10} 
          reducedTransparencyFallbackColor="rgba(0,0,0,0.5)" 
        >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedPlan?.name}</Text>
            <ScrollView>
              {selectedPlan?.meals.map((meal: string, idx: number) => (
                <Text key={idx} style={styles.mealText}>
                  • {meal}
                </Text>
              ))}
            </ScrollView>

            <PrimaryButton
              title={loading ? 'Saving...' : 'SAVE'}
              onPress={() => setSelectedPlan(null)}
              disabled={loading}
              style={{
                width: wp('90%'),
              }}
            />
          </View>
        </View>
        </BlurView>
      </Modal>
    </ThemeGradientBackground>
  );
};

export default MenuSelectionScreen;

// ################### STYLES #############################

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp('20%'),
    padding: wp('5%'),
  },
  list: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    marginTop: hp('0.5%'),
    maxHeight: hp('25%'),
  },
  item: {
    padding: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
  },
  itemText: {
    color: Colors.bodyText,
    fontSize: wp('3.8%'),
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  backText: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    marginBottom: hp('3%'),
    padding: wp('1%'),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.primaryOrange,
  },
  tabButtonText: {
    fontSize: wp('3.5%'),
    color: Colors.default,
    fontFamily: Fonts.Urbanist.regular,
  },
  activeTabText: {
    color: Colors.white,
  },
  selectedPlanCard: {
    borderColor: Colors.primaryOrange,
    borderWidth: 2,
  },

  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },

  viewMoreBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewMoreBtnSelected: {
    backgroundColor: Colors.white,
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.primaryOrange,
    textDecorationLine: 'underline',

    fontFamily: Fonts.Urbanist.semiBold,
  },
  viewMoreTextSelected: {
    color: Colors.primaryOrange,
    textDecorationLine: 'underline',
  },

  radioOuter: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    borderColor: Colors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.5%'),
  },

  radioOuterSelected: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.white,
  },

  radioInner: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.5%'),
    backgroundColor: Colors.primaryOrange,
  },

  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightRed,
    borderRadius: wp('3%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('1%'),
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
  },

  arrowText: {
    fontSize: wp('6%'),
    color: Colors.primaryOrange,
    fontWeight: '700',
  },
  dateText: {
    fontSize: wp('4.5%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  noteText: {
    fontSize: wp('3%'),
    color: Colors.default,
    marginLeft: 10,
  },
  menuSelection: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),

    shadowColor: Colors.bodyText,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.0,
    shadowRadius: 1,
    elevation: 0.5,
  },

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formContainer: {
    flexGrow: 1,
    marginBottom: hp('2%'),
  },
  childForm: {
    marginBottom: hp('3%'),
  },
  childName: {
    fontSize: wp('4.6%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
    marginBottom: hp('1%'),
    textTransform: 'capitalize',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1%'),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  checkbox: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('1%'),
    borderWidth: 1,
    borderColor: Colors.lightRed,
    marginRight: wp('3%'),
  },
  checkedBox: {
    backgroundColor: Colors.primaryOrange,
    borderColor: Colors.primaryOrange,
  },
  checkboxLabel: {
    fontSize: wp('3.5%'),
    color: Colors.black,
  },
  stickyButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: wp('4%'),
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  cancelText: {
    color: Colors.bodyText,
    fontWeight: '700',
    fontSize: wp('3.5%'),
  },
  stickyButtonsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%'),
    borderTopColor: Colors.lightRed,
  },
  holidayWarningText: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Urbanist.semiBold,
    marginVertical: hp('2%'),
  },

  // ---------------- Dietitian Plans ----------------
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  planTitle: {
    fontWeight: '700',
    fontSize: wp('4%'),
    marginBottom: hp('1%'),
    color: Colors.primaryOrange,
  },
  mealRow: {marginBottom: hp('1.5%')},
  mealText: {
    fontSize: wp('3.8%'),
    color: Colors.black,
    marginBottom: hp('0.5%'),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: wp('5%'),
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginBottom: hp('1.5%'),
    color: Colors.primaryOrange,
  },
  closeBtn: {
    color: Colors.primaryOrange,
    fontWeight: '700',
    marginTop: hp('2%'),
    textAlign: 'center',
    fontSize: wp('3.8%'),
  },
});
