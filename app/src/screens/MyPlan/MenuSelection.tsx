import {BlurView} from '@react-native-community/blur';
import CheckBox from '@react-native-community/checkbox';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import OfflineNotice from 'components/Error/OfflineNotice';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import AlertModal from 'components/Modal/AlertModal';
import SectionTitle from 'components/Titles/SectionHeading';
import {useAuth} from 'context/AuthContext';
import {useDate} from 'context/calenderContext';
import {useMenu} from 'context/MenuContext';
import {useUserProfile} from 'context/UserDataContext';
import React, {useEffect, useMemo, useState} from 'react';
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
import {SvgXml} from 'react-native-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import MenuService from 'services/MyPlansApi/MenuService';
import HolidayService from 'services/MyPlansApi/HolidayService';
import {BackIcon, ForwardIcon, questionIcon} from 'styles/svg-icons';
import {utcToLocal} from 'utils/localTime';
import {isWithin48Hours, validateMenuDate} from 'utils/MenuValidation';
import {createHolidayPaymentRequest, encryptRequest} from 'utils/paymentUtils';
import {Colors} from '../../assets/styles/colors';
import ccavenueConfig from '../../config/ccavenueConfig';
import menues from '../../services/MenueService/Data/menus.json';
import dietitianData from '../../services/MenueService/Data/dietitian_meal_plan.json';

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

const dietitianPlan1Meals = dietitianData.meal_plan.map(d => d.meal);
// Plan 2 uses the first-meal-of-each-day from menus.json reversed to give users
// a nutritionally different second option from the same pool of recipes.
const dietitianPlan2Meals = menues.meal_plan
  .filter(d => d.meals && d.meals.length > 0)
  .map(d => d.meals[0])
  .reverse();

const mealPlans: Record<string, {name: string; meals: string[]}> = {
  '1': {name: 'Meal Plan 1', meals: dietitianPlan1Meals},
  '2': {name: 'Meal Plan 2', meals: dietitianPlan2Meals},
};

// ################### WORKING DAYS HELPER #########################

const getWorkingDays = (
  from: Date,
  to: Date,
  holidays: {date: string}[],
): string[] => {
  const days: string[] = [];
  const cur = new Date(from);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cur <= end) {
    const dow = cur.getDay();
    const iso = cur.toISOString().split('T')[0];
    if (dow !== 0 && dow !== 6 && !holidays.some(h => h.date === iso)) {
      days.push(iso);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
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

  // ################### STATES #########################

  const [selectedTab, setSelectedTab] = useState<'custom' | 'dietitian'>(
    'custom',
  );
  const [loading, setLoading] = useState(false);
  const {childrenData, planId, endDate, startDate} = useMenu();
  const {userId} = useAuth();
  const {profileData} = useUserProfile();
  const [applySameDish, setApplySameDish] = useState(false);
  const [saveForUpcoming, setSaveForUpcoming] = useState(false);

  const [selectedDate, setSelectedDate] = useState(passedDate);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  // savedMeals: planId → dateKey (YYYY-MM-DD) → childId → mealName
  const [savedMeals, setSavedMeals] = useState<
    Record<string, Record<string, Record<string, string>>>
  >({});
  // Per-child dietitian plan selection: childId → planKey '1' or '2'
  const [childPlanSelections, setChildPlanSelections] = useState<
    Record<string, string>
  >({});
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  // Plan shown in the View Plan popup
  const [viewPlanItem, setViewPlanItem] = useState<{
    name: string;
    meals: string[];
  } | null>(null);
  const [showTip, setShowTip] = useState(false);

  //################ ERROR HANDLING #######################

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
    setChildPlanSelections({});
  }, [selectedTab]);

  const {holidays} = useDate();

  // Fetch all saved meals once (or whenever userId/planId become available)
  useEffect(() => {
    if (!userId || !planId) return;
    MenuService.getSavedMeals(userId, planId).then(res => {
      if (res?.success && res.data) {
        // data: { planId: { "YYYY-MM-DD": { childId: { mealName } } } }
        const planData: Record<string, Record<string, string>> =
          res.data[planId] || {};
        // Flatten to dateKey → childId → mealName
        const flat: Record<string, Record<string, string>> = {};
        Object.keys(planData).forEach(dateKey => {
          flat[dateKey] = {};
          Object.keys(planData[dateKey]).forEach(childId => {
            flat[dateKey][childId] = planData[dateKey][childId]?.mealName || '';
          });
        });
        setSavedMeals(flat);
      }
    });
  }, [userId, planId]);

  // When selectedDate changes: pre-populate dropdowns from savedMeals
  useEffect(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;
    const mealsForDate = savedMeals[dateKey] || {};
    const dishes = childrenData.map(child => mealsForDate[child.id] || '');
    setSelectedDishes(dishes);
    setApplySameDish(false);
    setSaveForUpcoming(false);
  }, [selectedDate, savedMeals, childrenData]);

  // ############ DYNAMIC holiday/weekend check from live selectedDate ############
  const isSunday = useMemo(() => selectedDate.getDay() === 0, [selectedDate]);

  const isCurrentDateWeekend = useMemo(() => {
    const dow = selectedDate.getDay();
    return dow === 0 || dow === 6;
  }, [selectedDate]);

  const isCurrentDateHoliday = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${d}`;
    return holidays.some(h => h.date === iso);
  }, [selectedDate, holidays]);

  // Sunday → show "Sunday - LunchBowl Holiday" banner only, no PAY/SAVE buttons
  // Saturday or calendar holiday → show holiday PAY flow
  // Regular working day → show normal SAVE flow
  const isHoliday = !isSunday && (isCurrentDateHoliday || isCurrentDateWeekend);

  // 48-hr lock: date is within 48 hours from now (past or imminent)
  const isLocked = useMemo(
    () => isWithin48Hours(selectedDate),
    [selectedDate],
  );

  // ₹200 per child for holiday meals
  const holidayFeePerChild = 200;
  const holidayTotalFee = holidayFeePerChild * childrenData.length;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'long',
    });

  const formatMonth = (date: Date) =>
    date.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});

  // Clamp navigation to subscription bounds
  const subscriptionStart = useMemo(
    () => (startDate ? new Date(startDate) : null),
    [startDate],
  );
  const subscriptionEnd = useMemo(
    () => (endDate ? new Date(endDate) : null),
    [endDate],
  );

  const onPrevDate = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    prev.setHours(0, 0, 0, 0);
    if (subscriptionStart) {
      const start = new Date(subscriptionStart);
      start.setHours(0, 0, 0, 0);
      if (prev < start) return;
    }
    setSelectedDate(prev);
  };
  const onNextDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    if (subscriptionEnd) {
      const end = new Date(subscriptionEnd);
      end.setHours(0, 0, 0, 0);
      if (next > end) return;
    }
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

  // ################### SAVE LOGIC ###################################

  const SaveMenue = async () => {
    setLoading(true);
    try {
      // 48-hour edit lock check
      if (isWithin48Hours(selectedDate)) {
        Alert.alert(
          'Locked',
          'Meal can be changed only before 48 hours of the meal date.',
        );
        setLoading(false);
        return;
      }

      const errorMsg = validateMenuDate(selectedDate, holidays);
      if (errorMsg) {
        Alert.alert('Not Allowed', errorMsg);
        setLoading(false);
        return;
      }

      let childrenPayload: any;

      switch (selectedTab) {
        // ############# CUSTOM PLAN #############
        case 'custom': {
          let datesToSave: string[];

          if (saveForUpcoming && endDate) {
            // Save same meal for all working days from selectedDate to subscription end
            datesToSave = getWorkingDays(
              selectedDate,
              new Date(endDate),
              holidays,
            );
          } else {
            datesToSave = [selectedDate.toISOString().split('T')[0]];
          }

          childrenPayload = {
            _id: userId,
            path: 'save-meals',
            data: {
              userId,
              planId,
              children: childrenData.map((child, childIndex) => ({
                childId: child.id,
                meals: datesToSave.map(date => ({
                  mealDate: new Date(date).toISOString(),
                  mealName: selectedDishes[childIndex] || '',
                })),
              })),
            },
          };
          break;
        }

        // ############# DIETITIAN PLAN #############
        case 'dietitian': {
          const hasSelections = childrenData.every(
            c => !!childPlanSelections[c.id],
          );
          if (!hasSelections) {
            Alert.alert(
              'Error',
              'Please select a Dietitian plan for every child before saving',
            );
            setLoading(false);
            return;
          }

          // Generate working days within the selected month that fall in the subscription range
          const monthStart = new Date(
            selectedMonth.getFullYear(),
            selectedMonth.getMonth(),
            1,
          );
          const monthEnd = new Date(
            selectedMonth.getFullYear(),
            selectedMonth.getMonth() + 1,
            0,
          );
          const subEnd = endDate ? new Date(endDate) : monthEnd;
          const rangeEnd = monthEnd < subEnd ? monthEnd : subEnd;

          const workingDays = getWorkingDays(monthStart, rangeEnd, holidays);

          if (workingDays.length === 0) {
            Alert.alert(
              'No working days',
              'There are no working days to save in the selected month.',
            );
            setLoading(false);
            return;
          }

          childrenPayload = {
            _id: userId,
            path: 'save-meals',
            data: {
              userId,
              planId,
              children: childrenData.map(child => {
                const planKey = childPlanSelections[child.id] || '1';
                const planMeals = mealPlans[planKey].meals;
                return {
                  childId: child.id,
                  // Cycle through plan meals for each working day.
                  // If working days > plan length, meals repeat from the beginning.
                  meals: workingDays.map((date, i) => ({
                    mealDate: new Date(date).toISOString(),
                    mealName: planMeals[i % planMeals.length],
                  })),
                };
              }),
            },
          };
          break;
        }

        default: {
          Alert.alert('Error', 'Invalid plan type selected');
          setLoading(false);
          return;
        }
      }

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

      // Validate that each child has a meal selected before payment
      const missingMeals = childrenData.filter(
        (_, i) => !selectedDishes[i],
      );
      if (missingMeals.length > 0) {
        Alert.alert(
          'Select Meals',
          `Please select a meal for: ${missingMeals.map(c => c.name).join(', ')}`,
        );
        return;
      }

      // Build structured children payload for the holiday payment backend
      const childrenPayload = childrenData.map((child, i) => ({
        childId: child.id,
        mealName: selectedDishes[i],
      }));

      const paymentData = createHolidayPaymentRequest(
        ccavenueConfig,
        selectedDate,
        childrenPayload,
        userId,
        planId,
        profileData?.parentDetails,
      );

      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v as string | number)}`)
        .join('&');

      const encryptedData = encryptRequest(
        plainText,
        ccavenueConfig.working_key,
      );

      navigation.navigate('WebViewScreen', {
        encRequest: encryptedData,
        accessCode: ccavenueConfig.access_code,
        endpoint: ccavenueConfig.endpoint,
        paymentType: 'holiday',
      });
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'Payment failed, please try again');
    }
  };

  const handleTestHolidayPayment = async () => {
    try {
      if (!userId) throw new Error('User ID not found. Please login again.');

      const missingMeals = childrenData.filter((_, i) => !selectedDishes[i]);
      if (missingMeals.length > 0) {
        Alert.alert(
          'Select Meals',
          `Please select a meal for: ${missingMeals.map(c => c.name).join(', ')}`,
        );
        return;
      }

      const orderId = `LB-HOLIDAY-TEST-${Date.now()}`;
      const transactionId = `TEST_HOLIDAY_TXN_${Date.now()}`;
      const mealDateStr = selectedDate.toISOString().split('T')[0];

      const childrenPayload = childrenData.map((child, i) => ({
        childId: child.id,
        mealName: selectedDishes[i],
      }));

      const result: any = await HolidayService.localHolidayPaymentSuccess({
        userId,
        orderId,
        transactionId,
        childrenData: childrenPayload,
        selectedDate: mealDateStr,
        planId,
      });

      if (!result?.success) {
        throw new Error(result?.message || 'Test holiday payment failed');
      }

      Alert.alert(
        'Test Payment Successful',
        `Holiday meal booked!\nTransaction ID: ${transactionId}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('PlanCalendar'),
          },
        ],
      );
    } catch (err: any) {
      console.error('Test holiday payment error:', err);
      Alert.alert('Error', err?.message || 'Test holiday payment failed');
    }
  };

  // ################### RENDER ###############################

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

          <OfflineNotice />

          {/* Date / Month Selector */}
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

          {/* Sunday banner – no payment/save flow */}
          {selectedTab === 'custom' && isSunday && (
            <View style={styles.sundayBanner}>
              <Text style={styles.sundayBannerTitle}>
                🗓 Sunday – LunchBowl Holiday
              </Text>
              <Text style={styles.sundayBannerNote}>
                Meals are not available on Sundays. Enjoy your rest day!
              </Text>
            </View>
          )}

          {/* Holiday fee banner (custom plan only, non-Sunday) */}
          {selectedTab === 'custom' && isHoliday && (
            <View style={styles.holidayFeeBanner}>
              <Text style={styles.holidayFeeTitle}>
                🏖 Holiday Meal Booking
              </Text>
              <Text style={styles.holidayFeeDetail}>
                ₹{holidayFeePerChild} × {childrenData.length}{' '}
                {childrenData.length === 1 ? 'child' : 'children'} ={' '}
                <Text style={styles.holidayFeeTotal}>₹{holidayTotalFee}</Text>
              </Text>
              <Text style={styles.holidayFeeNote}>
                Select a meal for each child and tap PAY to confirm.
              </Text>
            </View>
          )}

          {/* 48-hr lock notice */}
          {selectedTab === 'custom' && !isSunday && isLocked && (
            <Text style={styles.lockedText}>
              🔒 This date is locked for edits (within 48 hours).
            </Text>
          )}

          {!isHoliday && !isSunday && (
            <Text style={styles.noteText}>
              Note: Choose your child's meals for the selected{' '}
              {selectedTab === 'custom' ? 'date' : 'month'}.
            </Text>
          )}

          {/* Section Header – hide on Sundays */}
          {!isSunday && (
            <View style={styles.menuHeader}>
              <SectionTitle>Select your Child's Menu</SectionTitle>
              <Tooltip
                isVisible={showTip}
                content={
                  <Text style={{color: Colors.black, fontSize: wp('3.5%')}}>
                    {selectedTab === 'custom'
                      ? 'Pick a meal for each child. Check "Apply Same" to use one meal for all.'
                      : 'Select a Dietitian meal plan for each child independently.'}
                  </Text>
                }
                placement="bottom"
                onClose={() => setShowTip(false)}>
                <TouchableOpacity onPress={() => setShowTip(true)}>
                  <SvgXml xml={questionIcon} width={20} height={20} />
                </TouchableOpacity>
              </Tooltip>
            </View>
          )}

          {/* Menu card – hide on Sundays */}
          {!isSunday && (
            <View style={styles.menuSelection}>
              {selectedTab === 'custom' ? (
                // ---------- Custom Plan ----------
                <ScrollView
                  style={styles.formContainer}
                  keyboardShouldPersistTaps="handled">
                  {childrenData.map((child, index) => (
                    <View key={child.id} style={styles.childForm}>
                      <Text style={styles.childName}>{child.name}</Text>
                      {isLocked ? (
                        // Read-only: show saved meal name when locked
                        <View style={styles.lockedMealBox}>
                          <Text style={styles.lockedMealText}>
                            {selectedDishes[index]
                              ? selectedDishes[index]
                              : 'No meal saved for this date'}
                          </Text>
                        </View>
                      ) : (
                        <PrimaryDropdown
                          options={mealOptions}
                          placeholder="Select your Child's Dish"
                          selectedValue={selectedDishes[index] || ''}
                          onValueChange={handleDishSelect(index)}
                        />
                      )}
                      {!isLocked && index === 0 && childrenData.length > 1 && (
                        <View style={styles.checkboxContainer}>
                          <CheckBox
                            value={applySameDish}
                            onValueChange={v => setApplySameDish(v)}
                            tintColors={{
                              true: Colors.primaryOrange,
                              false: Colors.default,
                            }}
                          />
                          <Text style={styles.checkboxLabel}>
                            Apply the Same dish for{' '}
                            {childrenData
                              .slice(1)
                              .map(c => c.name)
                              .join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                // ---------- Dietitian Plan (per-child) ----------
                <View style={{marginTop: hp('1%')}}>
                  {childrenData.map(child => (
                    <View key={child.id} style={styles.childDietSection}>
                      <Text style={styles.childName}>{child.name}</Text>
                      {Object.entries(mealPlans).map(([key, plan]) => {
                        const isSelected =
                          (childPlanSelections[child.id] ?? '') === key;
                        return (
                          <TouchableOpacity
                            key={key}
                            style={[
                              styles.planCard,
                              isSelected && styles.selectedPlanCard,
                            ]}
                            onPress={() =>
                              setChildPlanSelections(prev => ({
                                ...prev,
                                [child.id]: key,
                              }))
                            }>
                            <View style={styles.planHeader}>
                              <View style={styles.planInfo}>
                                <View
                                  style={[
                                    styles.radioOuter,
                                    isSelected && styles.radioOuterSelected,
                                  ]}>
                                  {isSelected && (
                                    <View style={styles.radioInner} />
                                  )}
                                </View>
                                <Text
                                  style={[
                                    styles.planTitle,
                                    isSelected && {color: Colors.primaryOrange},
                                  ]}>
                                  {plan.name}
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => setViewPlanItem(plan)}>
                                <Text style={styles.viewPlanText}>VIEW PLAN</Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Save for Upcoming Months – custom plan on non-holiday, non-locked, non-Sunday dates only */}
          {selectedTab === 'custom' && !isHoliday && !isSunday && !isLocked && (
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={saveForUpcoming}
                onValueChange={v => setSaveForUpcoming(v)}
                tintColors={{
                  true: Colors.primaryOrange,
                  false: Colors.default,
                }}
              />
              <Text style={styles.checkboxLabel}>
                Save Selected Menus for Upcoming Months
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky footer buttons */}
      <View style={styles.stickyButtonsContainer}>
        {isHoliday && selectedTab === 'custom' && (
          <Text style={styles.holidayWarningText}>
            ₹{holidayFeePerChild}/child × {childrenData.length} ={' '}
            ₹{holidayTotalFee} — Additional holiday charges apply.
          </Text>
        )}
        <View style={styles.stickyButtonsRow}>
          <SecondaryButton
            title="CANCEL"
            onPress={() => navigation.goBack()}
            style={{width: isSunday ? wp('91%') : wp('43%')}}
          />

          {/* Sundays: no action button */}
          {!isSunday && (
            <>
              {/* Locked dates: no save/pay */}
              {isLocked ? null : !isHoliday || selectedTab === 'dietitian' ? (
                <PrimaryButton
                  title={loading ? 'Saving...' : 'SAVE'}
                  onPress={SaveMenue}
                  disabled={loading}
                  style={{width: wp('43%')}}
                />
              ) : (
                <PrimaryButton
                  title={`PAY ₹${holidayTotalFee}`}
                  onPress={handlePayNow}
                  style={{width: wp('43%')}}
                />
              )}
            </>
          )}
        </View>

        {/* Test / local payment button for holidays (dev mode) */}
        {isHoliday && selectedTab === 'custom' && !isLocked && (
          <View style={styles.testButtonContainer}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestHolidayPayment}>
              <Text style={styles.testButtonText}>TEST HOLIDAY PAYMENT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <AlertModal
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      {/* VIEW PLAN bottom sheet */}
      <Modal
        visible={!!viewPlanItem}
        transparent
        animationType="slide"
        onRequestClose={() => setViewPlanItem(null)}>
        <BlurView
          style={styles.modalOverlay}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.5)">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{viewPlanItem?.name}</Text>
              <ScrollView>
                {viewPlanItem?.meals.map((meal: string, idx: number) => (
                  <Text key={idx} style={styles.mealText}>
                    • {meal}
                  </Text>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setViewPlanItem(null)}>
                <Text style={styles.closeModalText}>CLOSE</Text>
              </TouchableOpacity>
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
  dateText: {
    fontSize: wp('4.5%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  noteText: {
    fontSize: wp('3%'),
    color: Colors.bodyText,
    marginBottom: hp('1%'),
    marginLeft: wp('1%'),
  },
  // Holiday fee banner
  holidayFeeBanner: {
    backgroundColor: Colors.hoiday,
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
  },
  holidayFeeTitle: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
    marginBottom: hp('0.5%'),
  },
  holidayFeeDetail: {
    fontSize: wp('3.8%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.regular,
  },
  holidayFeeTotal: {
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  holidayFeeNote: {
    fontSize: wp('3%'),
    color: Colors.bodyText,
    marginTop: hp('0.5%'),
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  formContainer: {
    flexGrow: 1,
    marginBottom: hp('2%'),
  },
  childForm: {
    marginBottom: hp('3%'),
  },
  childDietSection: {
    marginBottom: hp('2%'),
  },
  childName: {
    fontSize: wp('4.6%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
    marginBottom: hp('1%'),
    textTransform: 'capitalize',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  checkboxLabel: {
    fontSize: wp('3.5%'),
    color: Colors.black,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: wp('2%'),
  },
  stickyButtonsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%'),
    borderTopColor: Colors.lightRed,
  },
  stickyButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: wp('4%'),
  },
  testButtonContainer: {
    marginTop: hp('1.5%'),
    alignItems: 'center',
  },
  testButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.white,
  },
  testButtonText: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
  },
  holidayWarningText: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.red,
    marginBottom: hp('1.5%'),
  },
  // Sunday banner
  sundayBanner: {
    backgroundColor: Colors.lightRed,
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    alignItems: 'center',
  },
  sundayBannerTitle: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
    marginBottom: hp('0.5%'),
  },
  sundayBannerNote: {
    fontSize: wp('3.2%'),
    color: Colors.bodyText,
    textAlign: 'center',
  },
  // 48-hr lock
  lockedText: {
    fontSize: wp('3.2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.bodyText,
    marginBottom: hp('1%'),
    marginLeft: wp('1%'),
  },
  lockedMealBox: {
    borderWidth: 1,
    borderColor: Colors.Storke,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: Colors.lightRed,
  },
  lockedMealText: {
    fontSize: wp('3.8%'),
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
  },
  // Dietitian plan cards
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    padding: wp('4%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: Colors.Storke,
    elevation: 1,
  },
  selectedPlanCard: {
    borderColor: Colors.primaryOrange,
    borderWidth: 2,
    backgroundColor: Colors.lightRed,
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
  planTitle: {
    fontWeight: '700',
    fontSize: wp('4%'),
    color: Colors.bodyText,
  },
  radioOuter: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    borderColor: Colors.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.5%'),
  },
  radioOuterSelected: {
    borderColor: Colors.primaryOrange,
  },
  radioInner: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.5%'),
    backgroundColor: Colors.primaryOrange,
  },
  viewPlanText: {
    fontSize: wp('3.5%'),
    color: Colors.primaryOrange,
    textDecorationLine: 'underline',
    fontFamily: Fonts.Urbanist.semiBold,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  mealText: {
    fontSize: wp('3.8%'),
    color: Colors.black,
    marginBottom: hp('0.5%'),
  },
  closeModalBtn: {
    marginTop: hp('2%'),
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
  },
  closeModalText: {
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
    fontSize: wp('3.8%'),
  },
});
