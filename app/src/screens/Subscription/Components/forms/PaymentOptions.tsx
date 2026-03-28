import React, {useState} from 'react';
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
  generateOrderId,
} from '../../../../utils/paymentUtils';
import ccavenueConfig from '../../../../config/ccavenueConfig';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import httpAxiosClient from '../../../../config/httpclient';

export default function PaymentOptions({prevStep, navigation}: any) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {userId} = useAuth();

  const handlePayment = async () => {
    try {
      if (!userId) throw new Error('User ID not found. Please login again.');

      const response: any = await RegistrationService.getRegisterdUserData(
        userId,
      );

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
      setLoading(true);
      if (!userId) throw new Error('User ID not found. Please login again.');

      const orderId = generateOrderId();
      const transactionId = `TEST_TXN_${Date.now()}`;

      const response: any = await httpAxiosClient.post(
        '/ccavenue/local-success',
        {userId, orderId, transactionId},
      );

      const result = response?.data;
      if (result?.success) {
        Alert.alert(
          'Test Payment Successful',
          `Transaction ID: ${transactionId}`,
          [{text: 'OK', onPress: () => navigation.navigate('HomeScreen')}],
        );
      } else {
        Alert.alert(
          'Test Payment Failed',
          result?.message || 'Simulation failed',
        );
      }
    } catch (err: any) {
      console.error('Test payment error:', err);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Test payment failed, please try again',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
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

      <PrimaryButton
        title="TEST PAYMENT"
        onPress={handleTestPayment}
        disabled={loading}
        style={localStyles.testPaymentButton}
      />
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
  testPaymentButton: {
    marginTop: hp(2),
    backgroundColor: Colors.primaryOrange,
  },
});
