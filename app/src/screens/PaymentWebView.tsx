import React, {useRef, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {RouteProp, useRoute} from '@react-navigation/native';
import AlertModal from 'components/Modal/AlertModal';
import {useAuth} from 'context/AuthContext';
import {useUserProfile} from 'context/UserDataContext';
import RegistrationService from 'services/RegistartionService/registartion';

type PaymentWebViewParams = {
  PaymentWebView: {
    encRequest: string;
    accessCode: string;
    paymentType?: string;
    trialMealPayload?: Record<string, any>;
  };
};

export default function PaymentWebView({navigation}: any) {
  const route = useRoute<RouteProp<PaymentWebViewParams, 'PaymentWebView'>>();
  const {encRequest, accessCode, paymentType, trialMealPayload} = route.params;
  const webviewRef = useRef<WebView>(null);
  const [holidaySuccess, setHolidaySuccess] = useState(false);
  const {setUser} = useAuth();
  const {refreshProfileData} = useUserProfile();

  const ccAvenueUrl =
    'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
  const formData = `encRequest=${encodeURIComponent(
    encRequest,
  )}&access_code=${encodeURIComponent(accessCode)}`;

  const handleSuccess = () => {
    if (paymentType === 'holiday') {
      setHolidaySuccess(true);
    } else if (paymentType === 'trialMeal') {
      // Submit enquiry (sends emails/SMS, sets freeTrial: true) only after confirmed payment
      if (trialMealPayload) {
        RegistrationService.freeTrialEnquiry(trialMealPayload as any).catch(
          err => console.warn('Trial enquiry post-payment error:', err),
        );
      }
      // Update AuthContext so FreeTrialCard hides on return to Dashboard
      setUser((prev: any) => ({...prev, freeTrial: true}));
      refreshProfileData().catch(() => {});
      navigation.replace('HomeScreen');
    } else {
      navigation.replace('PlanCalendar');
    }
  };

  const handleCancel = () => {
    // For all payment types, go back to PlanCalendar on cancel
    navigation.replace('PlanCalendar');
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webviewRef}
        source={{
          uri: ccAvenueUrl,
          method: 'POST',
          body: formData,
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loader} />
        )}
        onShouldStartLoadWithRequest={request => {
          // CCAvenue posts to redirect_url / cancel_url — intercept both
          if (request.url.includes('ccavenue/response')) {
            handleSuccess();
            return false;
          }
          if (
            request.url.includes('cancel') ||
            request.url.includes('subscriptionFailed') ||
            request.url.includes('payment/failed')
          ) {
            handleCancel();
            return false;
          }
          // Web-hosted success/failure pages from the backend redirect
          if (request.url.includes('lunchbowl.co.in/payment/success')) {
            handleSuccess();
            return false;
          }
          if (request.url.includes('lunchbowl.co.in/payment/failed')) {
            handleCancel();
            return false;
          }
          return true;
        }}
      />

      <AlertModal
        visible={holidaySuccess}
        type="success"
        message="Holiday meal successfully booked – Thank you!"
        onClose={() => {
          setHolidaySuccess(false);
          navigation.replace('PlanCalendar');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
});

