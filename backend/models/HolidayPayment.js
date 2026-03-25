const mongoose = require("mongoose");

const holidayPaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    childId: { type: String, required: true }, // string ID from frontend
    mealDate: { type: String, required: true }, // YYYY-MM-DD
    mealName: { type: String, required: true },
    amount: { type: Number, default: 199 },
    paymentStatus: { type: String, enum: ["Paid", "Failed"], default: "Paid" },
    transactionDetails: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.models.HolidayPayment || mongoose.model("HolidayPayment", holidayPaymentSchema);
