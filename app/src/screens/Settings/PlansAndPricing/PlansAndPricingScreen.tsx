import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import React from 'react';
import {
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

const PLANS_TITLE =
  'Wholesome Food Choices Supporting Active Kids with Energy and Strength';

const PLANS = [
  {
    duration: '1 Month',
    price: 4400,
    working_days: 22,
    meals: 22,
    price_per_meal: 200,
    discount: null,
    features: [
      'Pre-planned, dietician-approved 30-day meal plan',
      'Add a sibling & save (5% off)',
      'Diet & allergy-friendly choices',
      'Flexible menu choices',
      'Multi-child subscription options',
    ],
  },
  {
    duration: '3 Months',
    original_price: 13200,
    price: 12540,
    working_days: 66,
    meals: 66,
    price_per_meal: 200,
    discount: '5%',
    features: [
      'Pre-planned, dietician-approved 30-day meal plan (renewed monthly)',
      'Already includes 5% savings',
      'Add a sibling & save even more (extra 5%)',
      'Diet & allergy-friendly choices',
      'Multi-child subscription options',
    ],
  },
  {
    duration: '6 Months',
    original_price: 26400,
    price: 23760,
    working_days: 132,
    meals: 132,
    price_per_meal: 200,
    discount: '10%',
    features: [
      'Pre-planned, dietician-approved 30-day meal plan (renewed monthly)',
      'Already includes 10% savings',
      'Add a sibling & save even more (extra 5%)',
      'Diet & allergy-friendly choices',
      'Multi-child subscription options',
    ],
  },
];

const PlansAndPricingScreen = ({navigation}: any) => {
  return (
    <ThemeGradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <HeaderBackButton title="Plans & Pricing" />

        <Text style={styles.pageTitle}>{PLANS_TITLE}</Text>

        {PLANS.map((plan, index) => (
          <View key={index} style={styles.planCard}>
            {/* Header row */}
            <View style={styles.planHeader}>
              <Text style={styles.durationText}>{plan.duration}</Text>
              {plan.discount ? (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{plan.discount} OFF</Text>
                </View>
              ) : null}
            </View>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{plan.price.toLocaleString('en-IN')}</Text>
              {plan.original_price ? (
                <Text style={styles.originalPrice}>
                  ₹{plan.original_price.toLocaleString('en-IN')}
                </Text>
              ) : null}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{plan.working_days}</Text>
                <Text style={styles.statLabel}>Working Days</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{plan.meals}</Text>
                <Text style={styles.statLabel}>Meals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹{plan.price_per_meal}</Text>
                <Text style={styles.statLabel}>Per Meal</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Features */}
            {plan.features.map((feature, fIdx) => (
              <View key={fIdx} style={styles.featureRow}>
                <Text style={styles.featureBullet}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            {/* CTA */}
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('MyPlan', {screen: 'Registartion'})}>
              <Text style={styles.ctaText}>GET STARTED</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  pageTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('2.5%'),
    lineHeight: hp('3.2%'),
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2.5%'),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  durationText: {
    fontSize: hp('2.4%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  discountBadge: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  discountText: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.white,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: hp('2%'),
    gap: wp('2%'),
  },
  price: {
    fontSize: hp('3.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  originalPrice: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    textDecorationLine: 'line-through',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    marginBottom: hp('2%'),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: hp('4%'),
    backgroundColor: Colors.lines,
  },
  statValue: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  statLabel: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.Storke,
    marginBottom: hp('1.5%'),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('0.8%'),
  },
  featureBullet: {
    fontSize: hp('1.8%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
    marginRight: wp('2%'),
    marginTop: 1,
  },
  featureText: {
    flex: 1,
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    lineHeight: hp('2.6%'),
  },
  ctaButton: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  ctaText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.white,
    letterSpacing: 1,
  },
});

export default PlansAndPricingScreen;
