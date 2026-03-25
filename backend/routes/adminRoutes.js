const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  // sendSchoolEnquiryMail,
  talkNutrition,
  freeTrialEnquiry,
  getInTouch,
  contactUs,
  schoolServiceEnquiry,
} = require("../controller/adminController");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");
const { sendTrialFeedbackSMS, getTrialCustomers } = require("../utils/trialSmsUtils");

//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post("/login", loginAdmin);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

// router.post("/school-enquiry", sendSchoolEnquiryMail);

router.post("/talk-nutrition", talkNutrition);

router.post("/free-trial-enquiry", freeTrialEnquiry);

router.post("/get-in-touch", getInTouch);

router.post("/contact-us", contactUs);

router.post("/get-school-enquiry", schoolServiceEnquiry);


// SMS utilities for trial customers
router.post("/send-trial-feedback-sms", sendTrialFeedbackSMS);
router.get("/trial-customers", getTrialCustomers);

//add a staff
router.post("/add", addStaff);

//get all staff
router.get("/", getAllStaff);

//get a staff
router.post("/:id", getStaffById);

//update a staff
router.put("/:id", updateStaff);

//update staf status
router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteStaff);



module.exports = router;
