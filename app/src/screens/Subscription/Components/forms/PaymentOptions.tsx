import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert, Switch} from 'react-native';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RegistrationService from 'services/RegistartionService/registartion';
import PaymentService from 'services/PaymentService/paymentService';
import {useAuth} from 'context/AuthContext';
import {
  encryptRequest,
  createPaymentRequest,
} from '../../../../utils/paymentUtils';
import ccavenueConfig from '../../../../config/ccavenueConfig';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {calculateWalletRedemption} from 'utils/subscriptionLogic';

export default function PaymentOptions({prevStep, navigation, isRenewal, planPriceProp, numChildrenProp}: any) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const {userId} = useAuth();

  // Wallet state
  const [walletPoints, setWalletPoints] = useState<number>(0);
  const [applyWallet, setApplyWallet] = useState<boolean>(false);
  // For renewal, planPrice is passed as a prop from the parent (the newly selected
  // plan price). For initial registration, it is fetched from the API.
  const [planPrice, setPlanPrice] = useState<number>(planPriceProp ?? 0);
  const [numChildren, setNumChildren] = useState<number>(numChildrenProp ?? 1);

  // Derived wallet calculation
  const {maxRedeemable, redeemedPoints: walletUsed, remainingWalletPoints: remainingWallet, finalAmount: finalPayable} =
    calculateWalletRedemption({
      totalPrice: planPrice,
      walletPoints,
      applyWallet,
      maxPercent: 0.8,
    });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    try {
      const [walletRes, formRes]: [any, any] = await Promise.all([
        PaymentService.getWallet(userId),
        // Skip the registration data fetch when the plan price has been
        // passed in from the parent (renewal case) to avoid overwriting
        // the correct renewal price with stale data.
        planPriceProp ? Promise.resolve(null) : RegistrationService.getRegisterdUserData(userId),
      ]);

      if (walletRes?.success) {
        setWalletPoints(walletRes?.data?.wallet?.points ?? 0);
      }

      if (formRes?.success) {
        const plan = formRes?.data?.subscriptionPlan;
        if (plan?.price) setPlanPrice(Number(plan.price));
        const children = formRes?.data?.children;
        if (Array.isArray(children)) setNumChildren(children.length || 1);
      }
    } catch (err) {
      console.error('Error fetching payment data:', err);
    }
  };

  const handlePayment = async () => {
    try {
      if (!userId) throw new Error('User ID not found. Please login again.');

      const response: any = await RegistrationService.getRegisterdUserData(userId);

      if (!response?.success)
        throw new Error(response?.message || 'Failed to fetch form data');

      const {subscriptionPlan, user, parentDetails} = response.data || {};
      if (!subscriptionPlan || !user)
        throw new Error('Required data missing in response');

      const paymentData = createPaymentRequest(
        userId,
        user,
        parentDetails,
        subscriptionPlan,
        ccavenueConfig,
        walletUsed,
        remainingWallet,
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
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'Payment failed, please try again');
    }
  };

  const handleTestPayment = async () => {
    try {
      if (!userId) throw new Error('User ID not found. Please login again.');

      const orderId = `LB${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const transactionId = `TEST_TXN_${Date.now()}`;

      let result: any;
      if (isRenewal) {
        result = await RegistrationService.renewalLocalPaymentSuccess({
          userId,
          orderId,
          transactionId,
          walletUsed,
          remainingWallet,
        });
      } else {
        result = await RegistrationService.localPaymentSuccess({
          userId,
          orderId,
          transactionId,
        });
      }

      if (!result?.success) {
        throw new Error(result?.message || 'Test payment failed');
      }

      // Navigate to the Thank You screen (same screen used by the CC Avenue flow)
      // so the user can see confirmation before going to My Plan.
      navigation.replace('PaymentSuccess');
    } catch (err: any) {
      console.error('Test payment error:', err);
      Alert.alert('Error', err?.message || 'Test payment failed, please try again');
    }
  };

  return (
    <View>
      {/* Payment Method Selection */}
      <View style={localStyles.cardContainer}>
        <TouchableOpacity
          style={[
            localStyles.card,
            selectedMethod === 'CC Avenue' && localStyles.selectedCard,
          ]}
          onPress={() => setSelectedMethod('CC Avenue')}>
          <Text style={localStyles.cardText}>CC Avenue</Text>
        </TouchableOpacity>
      </View>

      {/* Wallet Redemption (renewal only, when wallet > 0) */}
      {isRenewal && walletPoints > 0 && planPrice > 0 && (
        <View style={localStyles.walletSection}>
          <View style={localStyles.walletToggleRow}>
            <View style={localStyles.walletToggleLeft}>
              <Text style={localStyles.walletToggleLabel}>Apply Wallet Points</Text>
              <Text style={localStyles.walletPointsAvail}>
                {walletPoints} points available
              </Text>
            </View>
            <Switch
              value={applyWallet}
              onValueChange={setApplyWallet}
              trackColor={{false: Colors.Storke, true: Colors.primaryOrange}}
              thumbColor={Colors.white}
            />
          </View>

          {applyWallet && (
            <View style={localStyles.breakdownTable}>
              <View style={localStyles.breakdownRow}>
                <Text style={localStyles.breakdownLabel}>No. of Children</Text>
                <Text style={localStyles.breakdownValue}>{numChildren}</Text>
              </View>
              <View style={localStyles.breakdownRow}>
                <Text style={localStyles.breakdownLabel}>Plan Price</Text>
                <Text style={[localStyles.breakdownValue, localStyles.strikeText]}>
                  ₹{planPrice.toFixed(2)}
                </Text>
              </View>
              <View style={localStyles.breakdownRow}>
                <Text style={localStyles.breakdownLabel}>Redeemed Points</Text>
                <Text style={[localStyles.breakdownValue, localStyles.greenText]}>
                  −₹{walletUsed.toFixed(2)}
                </Text>
              </View>
              <View style={[localStyles.breakdownRow, localStyles.finalRow]}>
                <Text style={localStyles.finalLabel}>Final Payable</Text>
                <Text style={localStyles.finalValue}>₹{finalPayable.toFixed(2)}</Text>
              </View>
              {walletPoints > maxRedeemable && (
                <Text style={localStyles.walletNote}>
                  ⓘ Only 80% of the plan price can be redeemed. Remaining{' '}
                  {remainingWallet} points stay in wallet.
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      <View style={localStyles.buttonRow}>
        <PrimaryButton
          title="BACK"
          onPress={prevStep}
          style={{flex: 1, marginRight: wp(2)}}
        />
        <PrimaryButton
          title="DONE"
          onPress={() => {
            if (!selectedMethod) {
              Alert.alert('Error', 'Please select a payment method');
              return;
            }
            if (selectedMethod === 'CC Avenue') handlePayment();
          }}
          style={{flex: 1}}
        />
      </View>

      <View style={localStyles.testButtonContainer}>
        <TouchableOpacity
          style={localStyles.testButton}
          onPress={handleTestPayment}>
          <Text style={localStyles.testButtonText}>TEST PAYMENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  cardContainer: {marginVertical: hp(2)},
  card: {
    padding: hp(2),
    marginBottom: hp(1.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightRed,
    backgroundColor: Colors.white,
  },
  selectedCard: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.bg,
  },
  cardText: {
    fontSize: hp(2),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  walletSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.lightRed,
  },
  walletToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletToggleLeft: {
    flex: 1,
  },
  walletToggleLabel: {
    fontSize: hp(2),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  walletPointsAvail: {
    fontSize: hp(1.6),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.primaryOrange,
    marginTop: 2,
  },
  breakdownTable: {
    marginTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: Colors.Storke,
    paddingTop: hp(1.5),
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  breakdownLabel: {
    fontSize: hp(1.8),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
  },
  breakdownValue: {
    fontSize: hp(1.8),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  strikeText: {
    textDecorationLine: 'line-through',
    color: Colors.bodyText,
  },
  greenText: {
    color: Colors.green,
  },
  finalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.Storke,
    paddingTop: hp(1),
    marginTop: hp(0.5),
  },
  finalLabel: {
    fontSize: hp(2),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  finalValue: {
    fontSize: hp(2),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  walletNote: {
    fontSize: hp(1.5),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    fontStyle: 'italic',
    marginTop: hp(0.5),
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
  testButtonContainer: {
    marginTop: hp(2),
    alignItems: 'center',
  },
  testButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.white,
  },
  testButtonText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
  },
});
