import CryptoJS from 'crypto-js';

export const encryptRequest = (plainText: string, workingKey: string) => {
  const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(workingKey));
  const key = CryptoJS.enc.Hex.parse(md5Hash.toString(CryptoJS.enc.Hex));
  const iv = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    key,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  return encrypted.ciphertext.toString();
};

export const generateOrderId = () => `LB${Date.now()}${Math.floor(Math.random() * 1000)}`;
export const createPaymentRequest = (userId: string, user: any, parentDetails: any, subscriptionPlan: any, ccavenueConfig: any) => {
  const orderId = generateOrderId();
  return {
    merchant_id: ccavenueConfig.merchant_id,
    order_id: orderId,
    amount: 1, // subscriptionPlan.price.toFixed(2)
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
    merchant_param2: subscriptionPlan.planId || "predefined",
    merchant_param3: orderId,
  };
};


export const createFreeTrialPaymentRequest = (
  userId: string,
  user: any,
  ccavenueConfigParam: any,
) => {
  const orderId = generateOrderId();
  return {
    merchant_id: ccavenueConfigParam.merchant_id,
    order_id: orderId,
    amount: 150,
    currency: ccavenueConfigParam.currency,
    redirect_url: ccavenueConfigParam.redirect_url,
    cancel_url: ccavenueConfigParam.cancel_url,
    language: ccavenueConfigParam.language,
    billing_name: (user?.fullname || 'Customer').substring(0, 50),
    billing_email: (user?.email || 'no-email@example.com').substring(0, 50),
    billing_tel: (user?.phone_number || '0000000000').substring(0, 20),
    billing_address: 'Free Trial',
    billing_city: 'Chennai',
    billing_state: 'Tamil Nadu',
    billing_zip: '600001',
    billing_country: 'India',
    merchant_param1: userId,
    merchant_param2: 'FREE_TRIAL',
    merchant_param3: orderId,
  };
};

export const createHolidayPaymentRequest = (ccavenueConfig: any , selectedDate:any ,childrenData:any,userId:any) => {

 const orderId = `LB-HOLIDAY-${Date.now()}`;
  return {
     merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: 1, 
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,
        billing_name: "Holiday Meal",
        billing_email: "no-email@lunchbowl.in",
        billing_tel: "0000000000",
        billing_address: "Holiday Meal Booking",
        billing_city: "Chennai",
        billing_state: "TN",
        billing_zip: "600001",
        billing_country: "India",
        merchant_param1: userId, 
        merchant_param2: selectedDate,
        merchant_param3: JSON.stringify(childrenData),
        merchant_param4: "HOLIDAY_PAYMENT",
  };
};



