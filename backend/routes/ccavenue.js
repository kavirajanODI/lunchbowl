const express = require("express");
const router = express.Router();
const { ccavenueResponse, holiydayPayment, getHolidayPaymentsByDate, addChildPaymentController, localPaymentSuccess, localAddChildPaymentController } = require("../controller/Payment");

router.post("/response", ccavenueResponse);

router.post("/response/holiydayPayment", holiydayPayment);

router.post("/response/addChildPayment", addChildPaymentController);

// New endpoint — POST with body { date, userId }
router.post("/holiday-payments", getHolidayPaymentsByDate);

router.post("/local-success", localPaymentSuccess);

router.post("/local-success/local-add-childPayment", localAddChildPaymentController);

module.exports = router;
