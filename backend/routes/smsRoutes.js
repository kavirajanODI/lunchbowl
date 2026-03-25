const express = require("express");
const router = express.Router();
const {
  sendSMSNotification,
  sendOTPSMS,
  sendSignupConfirmationSMS,
  sendPaymentConfirmationSMS,
  sendTrialFoodConfirmationSMS,
  sendTrialFoodFeedbackSMS,
  getSMSLogs
} = require("../controller/smsController");
const { isAuth, isAdmin } = require("../config/auth");

// Send generic SMS notification
router.post("/send", sendSMSNotification);

// Send OTP SMS
router.post("/send-otp", sendOTPSMS);

// Send signup confirmation SMS
router.post("/send-signup-confirmation", sendSignupConfirmationSMS);

// Send payment confirmation SMS
router.post("/send-payment-confirmation", sendPaymentConfirmationSMS);

// Send trial food confirmation SMS
router.post("/send-trial-food-confirmation", sendTrialFoodConfirmationSMS);

// Send trial food feedback SMS
router.post("/send-trial-food-feedback", sendTrialFoodFeedbackSMS);

// Get SMS logs (protected route)
router.get("/logs", isAuth, getSMSLogs);

// Admin route to get all SMS logs
router.get("/admin/logs", isAuth, isAdmin, getSMSLogs);

module.exports = router;