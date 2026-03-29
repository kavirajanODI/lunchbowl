import React, {useRef, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {RouteProp, useRoute} from '@react-navigation/native';
import AlertModal from 'components/Modal/AlertModal';

type PaymentWebViewParams = {
  PaymentWebView: {
    encRequest: string;
    accessCode: string;
    paymentType?: string;
  };
};

export default function PaymentWebView({navigation}: any) {
  const route = useRoute<RouteProp<PaymentWebViewParams, 'PaymentWebView'>>();
  const {encRequest, accessCode, paymentType} = route.params;
  const webviewRef = useRef<WebView>(null);
  const [holidaySuccess, setHolidaySuccess] = useState(false);

  const ccAvenueUrl =
    'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
  const formData = `encRequest=${encodeURIComponent(
    encRequest,
  )}&access_code=${encodeURIComponent(accessCode)}`;

  const handleSuccess = () => {
    if (paymentType === 'holiday') {
      setHolidaySuccess(true);
    } else {
      navigation.replace('PlanCalendar');
    }
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
          if (request.url.includes('ccavenue/response')) {
            handleSuccess();
            return false;
          }
          if (
            request.url.includes('cancel') ||
            request.url.includes('subscriptionFailed')
          ) {
            navigation.replace('Registartion');
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

