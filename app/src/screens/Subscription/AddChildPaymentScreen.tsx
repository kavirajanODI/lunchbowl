import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import Typography from 'components/Text/Typography';
import {useAuth} from 'context/AuthContext';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import RegistrationService from 'services/RegistartionService/registartion';
import UserService from 'services/userService';
import {
  encryptRequest,
  generateOrderId,
} from 'utils/paymentUtils';
import ccavenueConfig from 'config/ccavenueConfig';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import styles from './Components/forms/Styles/styles';

const PER_DAY_COST = 200;

export default function AddChildPaymentScreen({route, navigation}: any) {
  const {userId} = useAuth();
  const {newChildren, subscriptionId, remainingDays, pricePerChild, totalAmount, subscriptionEndDate} =
    route.params || {};

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCcAvenuePayment = async () => {
    try {
      setLoading(true);
      const userResponse: any = await UserService.getRegisteredUSerData(userId!);
      if (!userResponse?.success) throw new Error('Failed to fetch user data');

      const {user, parentDetails} = userResponse.data || {};
      if (!user) throw new Error('User data missing');

      const orderId = generateOrderId();

      const paymentData: Record<string, any> = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: totalAmount,
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,
        billing_name: (user?.name || 'Customer').substring(0, 50),
        billing_email: (user?.email || 'no-email@example.com').substring(0, 50),
        billing_tel: (user?.phone || '0000000000').substring(0, 20),
        billing_address: (parentDetails?.address || 'Not Provided').substring(0, 100),
        billing_city: (parentDetails?.city || 'Chennai').substring(0, 50),
        billing_state: (parentDetails?.state || 'Tamil Nadu').substring(0, 50),
        billing_zip: (parentDetails?.pincode || '600001').substring(0, 10),
        billing_country: (parentDetails?.country || 'India').substring(0, 50),
        merchant_param1: userId,
        merchant_param2: 'ADD_CHILD',
        merchant_param3: orderId,
      };

      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');

      const encryptedData = encryptRequest(plainText, ccavenueConfig.working_key);

      navigation.navigate('WebViewScreen', {
        encRequest: encryptedData,
        accessCode: ccavenueConfig.access_code,
        endpoint: ccavenueConfig.endpoint,
      });
    } catch (err: any) {
      console.error('Add child payment error:', err);
      Alert.alert('Error', err?.message || 'Payment failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    try {
      if (!userId) throw new Error('User ID not found. Please login again.');
      if (!subscriptionId) throw new Error('Subscription ID not found.');

      setLoading(true);

      const orderId = generateOrderId();
      const transactionId = `TXN${Date.now()}`;

      const result: any = await RegistrationService.addChildLocalPayment({
        userId,
        childrenData: newChildren.map((c: any) => ({...c, isExisting: false})),
        paymentInfo: {
          orderId,
          transactionId,
          subscriptionId,
          paymentAmount: totalAmount,
        },
      });

      if (!result?.success) {
        throw new Error(result?.message || 'Add child payment failed');
      }

      Alert.alert(
        'Payment Successful',
        `Children added successfully!\nTransaction ID: ${transactionId}\n\nNote: New children will be activated from the next business day.`,
        [
          {
            text: 'Go to My Plan',
            onPress: () =>
              navigation.navigate('MyPlan', {screen: 'PlanCalendar'}),
          },
        ],
      );
    } catch (err: any) {
      console.error('Test payment error:', err);
      Alert.alert('Error', err?.message || 'Payment failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={() => {}} />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={() => navigation.goBack()} />

        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>Payment</Typography>
          <Typography style={styles.stepDescription}>
            Complete payment to add children to your plan.
          </Typography>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp('10%')}}>

          {/* Summary Card */}
          <View style={localStyles.summaryCard}>
            <Text style={localStyles.summaryTitle}>Order Summary</Text>

            {/* Plan details */}
            <View style={localStyles.planDetailRow}>
              <Text style={localStyles.planDetailLabel}>Remaining working days</Text>
              <Text style={localStyles.planDetailValue}>{remainingDays ?? 0} days</Text>
            </View>
            <View style={localStyles.planDetailRow}>
              <Text style={localStyles.planDetailLabel}>Rate per day</Text>
              <Text style={localStyles.planDetailValue}>₹{PER_DAY_COST}</Text>
            </View>
            {subscriptionEndDate && (
              <View style={localStyles.planDetailRow}>
                <Text style={localStyles.planDetailLabel}>Plan end date</Text>
                <Text style={localStyles.planDetailValue}>{subscriptionEndDate}</Text>
              </View>
            )}

            <View style={localStyles.divider} />

            {/* Per-child rows */}
            {(newChildren || []).map((child: any, index: number) => (
              <View key={index} style={localStyles.childRow}>
                <Text style={localStyles.childName}>
                  {child.childFirstName} {child.childLastName}
                </Text>
                <Text style={localStyles.childPrice}>
                  ₹{pricePerChild?.toLocaleString()}
                </Text>
              </View>
            ))}

            <View style={localStyles.divider} />

            <View style={localStyles.totalRow}>
              <Text style={localStyles.totalLabel}>Total Amount</Text>
              <Text style={localStyles.totalAmount}>
                ₹{totalAmount?.toLocaleString()}
              </Text>
            </View>

            <Text style={localStyles.noteText}>
              * New children will be activated from the next business day.
            </Text>
          </View>

          {/* Payment Method Selection */}
          <Text style={localStyles.sectionTitle}>Select Payment Method</Text>

          <TouchableOpacity
            style={[
              localStyles.paymentCard,
              selectedMethod === 'CC Avenue' && localStyles.selectedCard,
            ]}
            onPress={() => setSelectedMethod('CC Avenue')}>
            <Text style={localStyles.paymentCardText}>CC Avenue</Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={[styles.StickyButton, {marginTop: hp('3%')}]}>
            <SecondaryButton
              title="BACK"
              onPress={() => navigation.goBack()}
              style={{flex: 1}}
            />
            <PrimaryButton
              title="PAY NOW"
              onPress={() => {
                if (!selectedMethod) {
                  Alert.alert('Error', 'Please select a payment method');
                  return;
                }
                if (selectedMethod === 'CC Avenue') handleCcAvenuePayment();
              }}
              style={styles.btn}
            />
          </View>

          {/* Test Payment */}
          <View style={localStyles.testContainer}>
            <TouchableOpacity
              style={localStyles.testButton}
              onPress={handleTestPayment}>
              <Text style={localStyles.testButtonText}>TEST PAYMENT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ThemeGradientBackground>
  );
}

const localStyles = StyleSheet.create({
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2.5%'),
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  summaryTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1.5%'),
  },
  planDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.6%'),
  },
  planDetailLabel: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
  },
  planDetailValue: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  childName: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
  },
  childPrice: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightRed,
    marginVertical: hp('1%'),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  totalLabel: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  totalAmount: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  noteText: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    fontStyle: 'italic',
    marginTop: hp('0.5%'),
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  paymentCard: {
    padding: hp('2%'),
    marginBottom: hp('1.5%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightRed,
    backgroundColor: Colors.white,
  },
  selectedCard: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.bg,
  },
  paymentCardText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  testContainer: {
    marginTop: hp('2%'),
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
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
  },
});
