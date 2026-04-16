import { useFocusEffect } from '@react-navigation/native';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import OnboardingTip from 'components/AppTuturial/OnboardingTip';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import NoDataFound from 'components/Error/NoDataMessage';
import SectionTitle from 'components/Titles/SectionHeading';
import PrimaryButton from 'components/buttons/PrimaryButton';
import WhatsAppButton from 'components/buttons/WhatsAppButton';
import MyPlanSkeleton from 'components/skeletons/MyPlanSkeleton';
import { useAuth } from 'context/AuthContext';
import { useRegistration } from 'context/RegistrationContext';
import { useUserProfile } from 'context/UserDataContext';
import { useDate } from 'context/calenderContext';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Shake from 'react-native-shake';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import ToolTipSectionHeader from 'screens/Dashboard/Components/TooltipHeader';
import MenueCalendar from 'screens/MyPlan/Components/MenueCalender';
import { questionIcon } from 'styles/svg-icons';
import { formatDate } from 'utils/dateUtils';
import CalendarLegend from './Components/ColorsLegend';
import HolidayListCard from './Components/HolidayListCard';
import PlanCard from './Components/MyPlan';
import { useMenu } from 'context/MenuContext';

const MyPlanScreen: React.FC<{navigation: any}> = ({navigation}) => {
  //######### STATE VARIABLES  ##############################

  const screenWidth = wp('100%');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [legendVisible, setLegendVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  //######### GET HOLIDAYS API CALL ############################

  const {holidays} = useDate();
  const {userId} = useAuth();
  const {profileData, loading, refreshProfileData} = useUserProfile();
  const {fetchChildren, startDate, endDate} = useMenu();

  //######### SUBSCRIPTION REDIRECT ############################
  // MyPlanNavigator always starts at PlanCalendar so that getFocusedRouteNameFromRoute
  // works correctly and the tab bar can be hidden. Redirect here if the user should
  // be on the registration or renewal flow instead.

  const {
    currentStep,
    isSubscriptionExpired,
    subscriptionEndDate,
  } = useRegistration();
  const hasActiveSubscription = !!subscriptionEndDate && !isSubscriptionExpired;

  // Capture subscription state at mount time so the redirect only runs once.
  // By the time MyPlanScreen renders, MyPlanNavigator's loading guard ensures
  // all subscription data is already resolved.
  const shouldRedirect = useRef(
    !hasActiveSubscription &&
      (isSubscriptionExpired || (currentStep !== null && currentStep < 4)),
  );

  useEffect(() => {
    if (!shouldRedirect.current) return;
    if (isSubscriptionExpired) {
      navigation.replace('RenewSubscription');
    } else if (currentStep !== null && currentStep < 4) {
      navigation.replace('Registartion');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //######### HOOKS ############################################

  useFocusEffect(
    useCallback(() => {
      if (shouldRedirect.current) return;
      // Refresh user profile (plan card, payment status)
      refreshProfileData();
      // Also refresh MenuContext so startDate/endDate are current after payment
      if (userId) {
        fetchChildren({_id: userId});
      }
    }, [userId]),
  );

  // Return null on the initial render when a redirect is about to happen
  // so the user never sees a flash of PlanCalendar content.
  if (shouldRedirect.current) return null;

  function onViewFoodList(): void {
    navigation.navigate('FoodList');
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  const filteredHolidays = holidays.filter(holiday => {
    const date = new Date(holiday.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const handleMonthChange = (month: number, year: number) => {
    if (startDate && endDate) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      const subStart = new Date(startDate);
      const subEnd = new Date(endDate);
      subStart.setHours(0, 0, 0, 0);
      subEnd.setHours(0, 0, 0, 0);
      if (monthEnd < subStart || monthStart > subEnd) {
        return;
      }
    }
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) return;
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  }, [startDate]);

  //######### FORMAT SUBSCRIPTION PLAN FROM CONTEXT ###############

  const subscriptionPlan = profileData?.subscriptionPlan
    ? [
        {
          id: profileData.subscriptionPlan.planId,
          userName: profileData.parentDetails?.fatherFirstName ?? 'User',
          plan: profileData.subscriptionPlan.planId,
          amount: `₹${profileData.subscriptionPlan.price}`,
          status: profileData?.paymentStatus ? 'Paid' : 'Not Paid',
          expiry: formatDate(profileData.subscriptionPlan.endDate),
        },
      ]
    : [];

  // ############### SHACK TO VIEW SOME INFOS  ######################
  useEffect(() => {
    const subscription = Shake.addListener(() => {
      setLegendVisible(true);
    });
    Shake.addListener(() => {
      Vibration.vibrate(100);
      setLegendVisible(true);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeGradientBackground>
      {/* <LoadingModal loading={loading} setLoading={() => {}} /> */}
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={[{key: 'content'}]}
        renderItem={() => (
          <View style={styles.container}>
            <HeaderBackButton title="My Plan" />
            {loading ? (
              <MyPlanSkeleton />
            ) : subscriptionPlan.length > 0 ? (
              <>
                <FlatList
                  data={subscriptionPlan}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <PlanCard
                      userName={item.userName}
                      plan={item.plan}
                      amount={item.amount}
                      status={item.status}
                      expiry={item.expiry}
                    />
                  )}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  ref={flatListRef}
                  nestedScrollEnabled={true}
                />

                <View style={styles.pagination}>
                  {subscriptionPlan.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentIndex && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              </>
            ) : (
              <NoDataFound message="No active subscription found" />
            )}
            <ToolTipSectionHeader
              title="Select your Food Plan"
              tooltipText="Choose a plan to see your daily meals."
              icon={questionIcon}
              onPress={() => setLegendVisible(true)}
            />
            <MenueCalendar
              onDateChange={date =>
                navigation.navigate('MenuSelection', {selectedDate: date})
              }
              holidays={holidays}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onMonthChange={handleMonthChange}
            />
            <Modal
              transparent
              visible={legendVisible}
              animationType="fade"
              onRequestClose={() => setLegendVisible(false)}>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: Colors.black,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: wp('5%'),
                }}
                onPress={() => setLegendVisible(false)}>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    borderRadius: 12,
                    padding: wp('5%'),
                    width: '100%',
                  }}>
                  <Text style={styles.calendarGuidTittle}>
                    Calendar Color Guide
                  </Text>

                  <CalendarLegend
                    items={[
                      {color: [Colors.green, Colors.green], label: 'Plan Start'},
                      {color: [Colors.red, Colors.red], label: 'Plan End'},
                      {
                        color: [Colors.lightRed, Colors.lightRed],
                        label: 'Plan Ongoing',
                      },
                      {
                        color: [Colors.hoiday, Colors.hoiday],
                        label: 'Holiday / Weekend',
                      },
                      {
                        color: [Colors.green, Colors.green],
                        label: 'Meal Booked (Editable)',
                      },
                      {
                        color: [Colors.greeFadd, Colors.greeFadd],
                        label: 'Meal Booked (Locked)',
                      },
                      {
                        color: [Colors.transparent, Colors.transparent],
                        label: 'Available / No Color',
                      },
                    ]}
                  />
                </View>
              </Pressable>
            </Modal>
            <OnboardingTip storageKey="MY_PLAN_TIP_SEEN" />

            <SectionTitle>Holidays</SectionTitle>
            {filteredHolidays.length > 0 ? (
              <HolidayListCard holidays={filteredHolidays} />
            ) : (
              <NoDataFound message="No holidays found" />
            )}
            <View style={styles.foodListButton}>
              <PrimaryButton
                title="View food list"
                onPress={onViewFoodList}
                style={{
                  width: wp('90%'),
                }}
              />
            </View>
          </View>
        )}
        ListFooterComponent={<WhatsAppButton />}
      />
    </ThemeGradientBackground>
  );
};
export default MyPlanScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('10%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    padding: '3%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('1%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.default,
    marginHorizontal: wp('1%'),
  },
  activeDot: {
    backgroundColor: Colors.primaryOrange,
    width: wp('4%'),
    height: wp('1%'),
  },
  foodListButton: {
    marginVertical: wp('10%'),
  },
  calendarGuidTittle: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: hp('1.7%'),
    color: Colors.bodyText,
  },
});
