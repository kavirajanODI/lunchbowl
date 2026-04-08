const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { ccavenueResponse, holiydayPayment, getHolidayPaymentsByDate, addChildPaymentController, localPaymentSuccess, localAddChildPaymentController, localHolidayPaymentSuccess } = require("../controller/Payment");

// Rate limiter for test/local payment endpoints (10 requests per 15 min per IP)
const localPaymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many test payment requests, please try again later." },
});

router.post("/response", ccavenueResponse);

router.post("/response/holiydayPayment", holiydayPayment);

router.post("/response/addChildPayment", addChildPaymentController);

// New endpoint — POST with body { date, userId }
router.post("/holiday-payments", getHolidayPaymentsByDate);

router.post("/local-success", localPaymentSuccess);

router.post("/local-success/local-add-childPayment", localAddChildPaymentController);

// Test/local holiday payment (no CCAvenue gateway) — no rate limiter, same as /local-success
router.post("/local-holiday-success", localHolidayPaymentSuccess);

module.exports = router;
