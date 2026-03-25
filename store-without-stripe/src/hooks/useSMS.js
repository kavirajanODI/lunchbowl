import { useState } from "react";
import { toast } from "react-toastify";
import SmsServices from "../services/SmsServices";

const useSMS = () => {
  const [isSending, setIsSending] = useState(false);
  const [smsError, setSmsError] = useState(null);

  // Generic SMS sending function
  const sendSMS = async (smsType, params) => {
    setIsSending(true);
    setSmsError(null);

    try {
      let result;
      
      switch (smsType) {
        case 'OTP':
          result = await SmsServices.sendOTP(params.mobile, params.otp, params.customerId);
          break;
        case 'SIGNUP_CONFIRMATION':
          result = await SmsServices.sendSignupConfirmation(params.mobile, params.customerName, params.customerId);
          break;
        case 'PAYMENT_CONFIRMATION':
          result = await SmsServices.sendPaymentConfirmation(params.mobile, params.amount, params.customerId, params.orderId);
          break;
        case 'TRIAL_FOOD_CONFIRMATION':
          result = await SmsServices.sendTrialFoodConfirmation(params.mobile, params.childName, params.date, params.location, params.customerId);
          break;
        case 'TRIAL_FOOD_FEEDBACK':
          result = await SmsServices.sendTrialFoodFeedback(params.mobile, params.parentName, params.childName, params.feedbackLink, params.customerId);
          break;
        default:
          throw new Error(`Unsupported SMS type: ${smsType}`);
      }

      if (result?.success !== false) {
        toast.success("SMS sent successfully!");
        return result;
      } else {
        throw new Error(result?.message || "Failed to send SMS");
      }
    } catch (error) {
      console.error(`Error sending ${smsType} SMS:`, error);
      setSmsError(error.message);
      toast.error(error.message || "Failed to send SMS");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  // Convenience functions for specific SMS types
  const sendOTPSMS = (mobile, otp, customerId) => 
    sendSMS('OTP', { mobile, otp, customerId });

  const sendSignupConfirmationSMS = (mobile, customerName, customerId) => 
    sendSMS('SIGNUP_CONFIRMATION', { mobile, customerName, customerId });

  const sendPaymentConfirmationSMS = (mobile, amount, customerId, orderId) => 
    sendSMS('PAYMENT_CONFIRMATION', { mobile, amount, customerId, orderId });

  const sendTrialFoodConfirmationSMS = (mobile, childName, date, location, customerId) => 
    sendSMS('TRIAL_FOOD_CONFIRMATION', { mobile, childName, date, location, customerId });

  const sendTrialFoodFeedbackSMS = (mobile, parentName, childName, feedbackLink, customerId) => 
    sendSMS('TRIAL_FOOD_FEEDBACK', { mobile, parentName, childName, feedbackLink, customerId });

  return {
    isSending,
    smsError,
    sendSMS,
    sendOTPSMS,
    sendSignupConfirmationSMS,
    sendPaymentConfirmationSMS,
    sendTrialFoodConfirmationSMS,
    sendTrialFoodFeedbackSMS
  };
};

export default useSMS;