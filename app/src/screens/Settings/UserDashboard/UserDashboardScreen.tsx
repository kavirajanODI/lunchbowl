import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import NoDataFound from 'components/Error/NoDataMessage';
import {useAuth} from 'context/AuthContext';
import {useUserProfile} from 'context/UserDataContext';
import {Edit} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {
  RefreshControl,
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
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import {useFocusEffect} from '@react-navigation/native';

const PLAN_LABELS: Record<string, string> = {
  '1': '1 Month',
  '3': '3 Months',
  '6': '6 Months',
};

const UserDashboardScreen = ({navigation}: any) => {
  const {user} = useAuth();
  const {profileData, loading, refreshProfileData} = useUserProfile();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProfileData();
    setRefreshing(false);
  }, [refreshProfileData]);

  useFocusEffect(
    useCallback(() => {
      refreshProfileData();
    }, [refreshProfileData]),
  );

  const displayName =
    user?.fullname ||
    (profileData?.parentDetails?.fatherFirstName
      ? `${profileData.parentDetails.fatherFirstName} ${profileData.parentDetails.fatherLastName}`
      : 'User');

  const activeSub = profileData?.subscriptionPlan ?? null;
  const upcomingSub = profileData?.upcomingSubscription ?? null;
  const children: any[] = (profileData as any)?.children ?? [];
  const parent = profileData?.parentDetails ?? null;

  const daysToExpiry = activeSub?.endDate
    ? Math.ceil(
        (new Date(activeSub.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const canRenew = daysToExpiry !== null && daysToExpiry <= 10;
  const canAddChild = children.length < 3 && !!activeSub;

  const expiryDate = activeSub?.endDate
    ? new Date(activeSub.endDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const planLabel = activeSub?.planId ? PLAN_LABELS[activeSub.planId] ?? `Plan ${activeSub.planId}` : null;

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading && !refreshing} setLoading={() => {}} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryOrange]}
          />
        }>
        <HeaderBackButton title="Dashboard" />

        {/* Greeting */}
        <Text style={styles.greeting}>Hello, {displayName} 👋</Text>

        {/* Parent Details Card */}
        {parent && (
          <View style={styles.parentCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>Parent Details</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditParentDetailsScreen')}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Edit size={18} color={Colors.primaryOrange} />
              </TouchableOpacity>
            </View>
            <Text style={styles.parentName}>
              {parent.fatherFirstName} {parent.fatherLastName}
              {parent.motherFirstName
                ? `  &  ${parent.motherFirstName} ${parent.motherLastName}`
                : ''}
            </Text>
            {!!parent.mobile && (
              <Text style={styles.parentDetail}>📞 {parent.mobile}</Text>
            )}
            {!!parent.email && (
              <Text style={styles.parentDetail}>✉️ {parent.email}</Text>
            )}
            {!!parent.address && (
              <Text style={styles.parentDetail}>
                📍 {parent.address}
                {parent.city ? `, ${parent.city}` : ''}
                {parent.state ? `, ${parent.state}` : ''}
                {parent.pincode ? ` - ${parent.pincode}` : ''}
              </Text>
            )}
          </View>
        )}

        {/* Plan Expiry Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Current Plan</Text>
              <Text style={styles.cardValue}>{planLabel ?? '—'}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Expiry Date</Text>
              <Text style={styles.cardValue}>{expiryDate ?? '—'}</Text>
            </View>
          </View>
          {daysToExpiry !== null && daysToExpiry <= 10 && (
            <Text style={styles.expiryWarning}>
              ⚠️ Expires in {daysToExpiry} day{daysToExpiry !== 1 ? 's' : ''}
            </Text>
          )}
          {upcomingSub ? (
            <View style={styles.renewedBadge}>
              <Text style={styles.renewedBadgeText}>✅ Renewed — Next plan starts {new Date(upcomingSub.startDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.renewButton, !canRenew && styles.renewButtonDisabled]}
              disabled={!canRenew}
              onPress={() => navigation.navigate('MyPlan', {screen: 'RenewSubscription'})}>
              <Text style={[styles.renewButtonText, !canRenew && styles.renewButtonTextDisabled]}>
                RENEW{!canRenew && daysToExpiry !== null ? ` (${daysToExpiry}d left)` : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add Child Button */}
        {canAddChild && (
          <TouchableOpacity
            style={styles.addChildButton}
            onPress={() => navigation.navigate('AddChildScreen')}>
            <Text style={styles.addChildButtonText}>+ ADD CHILD</Text>
          </TouchableOpacity>
        )}

        {/* Active Children Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active Children</Text>
          <Text style={styles.summaryCount}>{children.length}</Text>
        </View>

        {/* Children List */}
        <Text style={styles.sectionTitle}>Children</Text>
        {children.length > 0 ? (
          children.map((child: any) => {
            const startDate = activeSub?.startDate
              ? new Date(activeSub.startDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '—';
            const endDate = activeSub?.endDate
              ? new Date(activeSub.endDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '—';

            return (
              <View key={child._id} style={styles.childCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.childName}>
                    {child.childFirstName} {child.childLastName}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EditChildDetailsScreen', {child})
                    }
                    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                    <Edit size={18} color={Colors.primaryOrange} />
                  </TouchableOpacity>
                </View>
                <View style={styles.childRow}>
                  <Text style={styles.childLabel}>Plan Duration</Text>
                  <Text style={styles.childValue}>
                    {startDate} – {endDate}
                  </Text>
                </View>
                {!!child.school && (
                  <View style={styles.childRow}>
                    <Text style={styles.childLabel}>School</Text>
                    <Text style={styles.childValue}>{child.school}</Text>
                  </View>
                )}
                {!!child.childClass && (
                  <View style={styles.childRow}>
                    <Text style={styles.childLabel}>Class</Text>
                    <Text style={styles.childValue}>
                      {child.childClass}
                      {child.section ? ` – ${child.section}` : ''}
                    </Text>
                  </View>
                )}
                {!!child.lunchTime && (
                  <View style={styles.childRow}>
                    <Text style={styles.childLabel}>Lunch Time</Text>
                    <Text style={styles.childValue}>{child.lunchTime}</Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          !loading && <NoDataFound message="No children found" />
        )}
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  greeting: {
    fontSize: hp('3%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('2.5%'),
  },
  parentCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  parentName: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('0.8%'),
  },
  parentDetail: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    marginBottom: hp('0.4%'),
  },
  card: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: hp('1.6%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.medium,
    opacity: 0.85,
  },
  cardValue: {
    fontSize: hp('2.2%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
    marginTop: 4,
  },
  renewButton: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
  },
  renewButtonDisabled: {
    backgroundColor: Colors.lightRed,
    opacity: 0.6,
  },
  renewButtonText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  renewButtonTextDisabled: {
    color: Colors.bodyText,
  },
  renewedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    alignItems: 'center',
  },
  renewedBadgeText: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.white,
  },
  expiryWarning: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.white,
    marginBottom: hp('1%'),
    opacity: 0.9,
  },
  addChildButton: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  addChildButtonText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.white,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  summaryLabel: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.bodyText,
  },
  summaryCount: {
    fontSize: hp('3%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1.5%'),
  },
  childCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  childName: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    flex: 1,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.6%'),
  },
  childLabel: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    flex: 1,
  },
  childValue: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
    flex: 2,
    textAlign: 'right',
  },
});

export default UserDashboardScreen;
