import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useAuth} from 'context/AuthContext';
import {encryptRequest, generateOrderId} from 'utils/paymentUtils';
import ccavenueConfig from '../../../config/ccavenueConfig';
import FreeTrialModal from './FreeTrialModal';

const FREE_TRIAL_AMOUNT = 150;

const FreeTrialCard: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isLoggedIn, user, userId} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  function handleFreeTrialPress(): void {
    if (isLoggedIn && userId) {
      proceedToPayment();
    } else {
      setModalVisible(true);
    }
  }

  function proceedToPayment(): void {
    const orderId = generateOrderId();
    const paymentData: Record<string, any> = {
      merchant_id: ccavenueConfig.merchant_id,
      order_id: orderId,
      amount: FREE_TRIAL_AMOUNT,
      currency: ccavenueConfig.currency,
      redirect_url: ccavenueConfig.redirect_url,
      cancel_url: ccavenueConfig.cancel_url,
      language: ccavenueConfig.language,
      billing_name: (user?.fullname || 'Customer').substring(0, 50),
      billing_email: (user?.email || 'no-email@example.com').substring(0, 50),
      billing_tel: (user?.phone_number || '0000000000').substring(0, 20),
      billing_address: 'Free Trial',
      billing_city: 'Chennai',
      billing_state: 'Tamil Nadu',
      billing_zip: '600001',
      billing_country: 'India',
      merchant_param1: userId || '',
      merchant_param2: 'FREE_TRIAL',
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
  }

  return (
    <View style={styles.card}>
      <Text style={styles.desc}>
        Delicious and nutritious food that meets the dietary needs of growing
        children.
      </Text>
      <PrimaryButton
        title="Get Free trial"
        onPress={handleFreeTrialPress}
        style={{width: '100%'}}
      />
      <FreeTrialModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: wp('4%'),
    backgroundColor: Colors.lightRed,
    borderRadius: wp('3%'),
    borderRightWidth: wp('1%'),
    borderBottomWidth: wp('1%'),
    borderTopWidth: wp('0.1%'),
    borderLeftWidth: wp('0.1%'),
    borderColor: Colors.primaryOrange,
    width: '100%',
    alignSelf: 'center',
  },
  desc: {
    marginVertical: hp('1%'),
    fontSize: wp('4%'),
    color: Colors.default,
    marginBottom: hp('2%'),
    fontFamily: 'Urbanist-Regular',
  },
});

export default FreeTrialCard;
