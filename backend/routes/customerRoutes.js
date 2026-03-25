const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  registerCustomer,
  verifyPhoneNumber,
  signUpWithProvider,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addAllCustomers,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  sendOtp,
  verifyOtp,
  stepFormRegister,
  getMenuCalendarDate,
  saveMealPlans,
  getSavedMeals,
  stepCheck,
  accountDetails,
  verifyCCAvenuePayment,
  handleCCAvenueResponse,
  getFormData, // Add this new controller method
  getPaidHolidays,
  getAllChildrenForUser,
  localPaymentSuccess,
  localAddChildPaymentController,
  getPaymentsForUser,
  deleteMeal,
} = require("../controller/customerController");
const {
  passwordVerificationLimit,
  emailVerificationLimit,
  phoneVerificationLimit,
} = require("../lib/email-sender/sender");

// Import CCAvenue routes
const ccavenueRoutes = require("./ccavenue");
router.use("/ccavenue", ccavenueRoutes);

//verify email
router.post("/verify-email", emailVerificationLimit, verifyEmailAddress);

//verify phone number
router.post("/verify-phone", phoneVerificationLimit, verifyPhoneNumber);

// shipping address send to array
router.post("/shipping/address/:id", addShippingAddress);

// get all shipping address
router.get("/shipping/address/:id", getShippingAddress);

// shipping address update
router.put("/shipping/address/:userId/:shippingId", updateShippingAddress);

// shipping address delete
router.delete("/shipping/address/:userId/:shippingId", deleteShippingAddress);

//register a user
router.post("/register/:token", registerCustomer);

//login a user
router.post("/login", loginCustomer);

//register or login with google and fb
router.post("/signup/oauth", signUpWithOauthProvider);

//register or login with google and fb
router.post("/signup/:token", signUpWithProvider);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//change password
router.post("/change-password", changePassword);

//add all users
router.post("/add/all", addAllCustomers);

//get all user
router.get("/", getAllCustomers);

//get a user
router.get("/:id", getCustomerById);

// Get form data by user ID
router.get("/form/:userId", getFormData);

//update a user
router.put("/:id", updateCustomer);

//delete a user
router.delete("/:id", deleteCustomer);

//send OTP
router.post("/sendOtp", sendOtp);

//verify Otp
router.post("/verifyOtp", verifyOtp);

//step-Form ParentDetails
router.post("/stepForm-Register", stepFormRegister);

router.post("/get-Menu-Calendar", getMenuCalendarDate);

router.post("/save-Menu-Calendar", saveMealPlans);

// Add to your routes
router.post("/get-saved-meals", getSavedMeals);

router.post("/Step-Check", stepCheck);

router.post("/account-details", accountDetails);

// CCAvenue Payment Verification
router.post("/payment/verify", verifyCCAvenuePayment);

// CCAvenue Response Handler
router.post("/payment/response", handleCCAvenueResponse);

router.post("/get-paid-holidays", getPaidHolidays);

router.post("/get-all-children", getAllChildrenForUser);

router.post("/local-success", localPaymentSuccess);

router.post("/local-success/local-add-childPayment", localAddChildPaymentController);

router.post("/get-payments", getPaymentsForUser);

router.post("/delete-meal", deleteMeal);




module.exports = router;