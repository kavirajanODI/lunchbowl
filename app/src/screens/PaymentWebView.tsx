import React, {useRef} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {RouteProp, useRoute} from '@react-navigation/native';

type PaymentWebViewParams = {
  PaymentWebView: {
    encRequest: string;
    accessCode: string;
  };
};

export default function PaymentWebView({navigation}: any) {
  const route = useRoute<RouteProp<PaymentWebViewParams, 'PaymentWebView'>>();
  const {encRequest, accessCode} = route.params;
  const webviewRef = useRef<WebView>(null);
  const ccAvenueUrl =
    'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
  const formData = `encRequest=${encodeURIComponent(
    encRequest,
  )}&access_code=${encodeURIComponent(accessCode)}`;
  console.log('body data', formData);

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
            console.log('✅ Payment completed.');
            navigation.replace('PlanCalendar');
            return false;
          }

          if (
            request.url.includes('cancel') ||
            request.url.includes('subscriptionFailed')
          ) {
            console.log('❌ Payment cancelled.');
            navigation.replace('Registartion');
            return false;
          }

          return true;
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
