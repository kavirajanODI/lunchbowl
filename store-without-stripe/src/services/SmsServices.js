import requests from "./httpServices";

const SmsServices = {
  // Send OTP SMS
  sendOTP: async (mobile, otp, customerId) => {
    return requests.post("/sms/send-otp", {
      mobile,
      otp,
      customerId
    });
  },

  // Send signup confirmation SMS
  sendSignupConfirmation: async (mobile, customerName, customerId) => {
    return requests.post("/sms/send-signup-confirmation", {
      mobile,
      customerName,
      customerId
    });
  },

  // Send payment confirmation SMS
  sendPaymentConfirmation: async (mobile, amount, customerId, orderId) => {
    return requests.post("/sms/send-payment-confirmation", {
      mobile,
      amount,
      customerId,
      orderId
    });
  },

  // Send trial food confirmation SMS
  sendTrialFoodConfirmation: async (mobile, childName, date, location, customerId) => {
    return requests.post("/sms/send-trial-food-confirmation", {
      mobile,
      childName,
      date,
      location,
      customerId
    });
  },

  // Send trial food feedback SMS
  sendTrialFoodFeedback: async (mobile, parentName, childName, feedbackLink, customerId) => {
    return requests.post("/sms/send-trial-food-feedback", {
      mobile,
      parentName,
      childName,
      feedbackLink,
      customerId
    });
  },

  // Send generic SMS notification
  sendSMSNotification: async (mobile, messageType, variables, customerId, orderId) => {
    return requests.post("/sms/send", {
      mobile,
      messageType,
      variables,
      customerId,
      orderId
    });
  },

  // Get SMS logs (requires authentication)
  getSMSLogs: async (customerId, page = 1, limit = 10) => {
    return requests.get(`/sms/logs?customerId=${customerId}&page=${page}&limit=${limit}`);
  }
};

export default SmsServices;