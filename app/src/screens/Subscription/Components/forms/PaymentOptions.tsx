import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RegistrationService from 'services/RegistartionService/registartion';
import {useAuth} from 'context/AuthContext';
import {
  encryptRequest,
  createPaymentRequest,
} from '../../../../utils/paymentUtils';
import ccavenueConfig from '../../../../config/ccavenueConfig';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

export default function PaymentOptions({
  prevStep,
  navigation,
  isRenewal,
  planPriceProp,
  numChildrenProp,
  applyWalletProp = false,
  walletUsedProp = 0,
  remainingWalletProp,
  finalPayableProp,
}: any) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const {userId} = useAuth();

  // Wallet values are now decided in step 2 and passed in as props.
  // For the initial registration flow these are all zero/false.
  const walletUsed: number = applyWalletProp ? (walletUsedProp ?? 0) : 0;
  const remainingWallet: number = remainingWalletProp ?? 0;
  // For initial registration, planPrice is still fetched from the API.
  const [planPrice, setPlanPrice] = useState<number>(planPriceProp ?? 0);
  const [numChildren, setNumChildren] = useState<number>(numChildrenProp ?? 1);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    try {
      const formRes: any = planPriceProp
        ? null
        : await RegistrationService.getRegisterdUserData(userId);

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

      // The backend routes by orderId prefix: R... → renewal, L... → new subscription.
      const orderId = isRenewal
        ? `RB${Date.now()}${Math.floor(Math.random() * 1000)}`
        : `LB${Date.now()}${Math.floor(Math.random() * 1000)}`;
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

      {/* Wallet Applied Summary (renewal only — toggle lives in step 2) */}
      {isRenewal && applyWalletProp && walletUsed > 0 && (
        <View style={localStyles.walletSection}>
          <View style={localStyles.breakdownRow}>
            <Text style={localStyles.breakdownLabel}>Plan Price</Text>
            <Text style={[localStyles.breakdownValue, localStyles.strikeText]}>
              ₹{planPrice.toFixed(2)}
            </Text>
          </View>
          <View style={localStyles.breakdownRow}>
            <Text style={localStyles.breakdownLabel}>Wallet Redeemed</Text>
            <Text style={[localStyles.breakdownValue, localStyles.greenText]}>
              −₹{walletUsed.toFixed(2)}
            </Text>
          </View>
          <View style={[localStyles.breakdownRow, localStyles.finalRow]}>
            <Text style={localStyles.finalLabel}>Final Payable</Text>
            <Text style={localStyles.finalValue}>
              ₹{(finalPayableProp ?? planPrice - walletUsed).toFixed(2)}
            </Text>
          </View>
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
