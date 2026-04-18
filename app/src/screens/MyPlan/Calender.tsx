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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import InitialsScreen from 'screens/Subscription/Components/InitialScreen';
import { questionIcon, vabourCub } from 'styles/svg-icons';
import { formatDate } from 'utils/dateUtils';
import { classifySubscription, SubscriptionItem } from 'utils/subscriptionLogic';
import CalendarLegend from './Components/ColorsLegend';
import HolidayListCard from './Components/HolidayListCard';
import PlanCard from './Components/MyPlan';
import { useMenu } from 'context/MenuContext';

// Format a subscription date range as "DD MMM – DD MMM (STATUS)"
const formatSubTabLabel = (sub: SubscriptionItem): string => {
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const fmt = (d: string | undefined) => {
    if (!d) return '?';
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]}`;
  };
  const cls = classifySubscription(sub);
  const statusLabel =
    cls === 'active' ? 'ACTIVE' :
    cls === 'upcoming' ? 'UPCOMING' :
    (sub.status || '').toUpperCase();
  return `${fmt(sub.startDate)} - ${fmt(sub.endDate)} (${statusLabel})`;
};

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
  const {fetchChildren, startDate, endDate, allSubscriptions, selectedSubscriptionId, selectSubscription, menuLoading} = useMenu();

  //######### SUBSCRIPTION REDIRECT ############################
  // MyPlanNavigator always starts at PlanCalendar so that getFocusedRouteNameFromRoute
  // works correctly and the tab bar can be hidden. Redirect here if the user should
  // be on the registration or renewal flow instead.

  const {
    currentStep,
    isSubscriptionExpired,
  } = useRegistration();

  // Navigate to the renewal screen when the subscription is expired.
  // All other "no plan" cases are handled by rendering InitialsScreen directly below.
  useEffect(() => {
    if (isSubscriptionExpired) {
      navigation.replace('RenewSubscription');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscriptionExpired]);

  //######### HOOKS ############################################

  useFocusEffect(
    useCallback(() => {
      // Refresh user profile (plan card, payment status)
      refreshProfileData();
      // Also refresh MenuContext so startDate/endDate are current after payment
      if (userId) {
        fetchChildren({_id: userId});
      }
    }, [userId]),
  );

  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) return;
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  }, [startDate]);

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

  // Wait while navigating to renewal — avoids flashing calendar content.
  if (isSubscriptionExpired) return null;

  // Show "get started" screen directly when registration is incomplete or there
  // is no active/upcoming subscription (checked after MenuContext finishes loading).
  const incompleteRegistration = currentStep !== null && currentStep < 4;
  const noSubscription = !menuLoading && allSubscriptions.length === 0;
  if (incompleteRegistration || noSubscription) {
    return (
      <InitialsScreen
        navigation={navigation}
        vabourCub={vabourCub}
        onGetStarted={() => navigation.navigate('Registartion', {startForm: true})}
      />
    );
  }

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
            {(loading || menuLoading) ? (
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

            {/* Subscription tabs — one per active/upcoming subscription */}
            {allSubscriptions.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabBar}
                contentContainerStyle={styles.tabBarContent}>
                {allSubscriptions.map(sub => {
                  const subId = sub._id as string;
                  const isSelected = subId === selectedSubscriptionId;
                  return (
                    <TouchableOpacity
                      key={subId}
                      style={[styles.tabItem, isSelected && styles.tabItemActive]}
                      onPress={() => selectSubscription(subId)}
                      activeOpacity={0.75}>
                      <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                        {formatSubTabLabel(sub)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

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
  tabBar: {
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  tabItem: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3.5%'),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.white,
  },
  tabItemActive: {
    backgroundColor: Colors.primaryOrange,
  },
  tabText: {
    fontSize: hp('1.55%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
  },
  tabTextActive: {
    color: Colors.white,
  },
});
