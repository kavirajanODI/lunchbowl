const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  planId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  workingDays: { type: Number, required: true },
  price: { type: Number, required: true },
  orderId: { type: String },
  paymentAmount: { type: Number },
  paymentDate: { type: Date },
  paymentMethod: { type: String, default: "CCAvenue" },
  transactionId: { type: String },
  status: {
    type: String,
    enum: ["active", "upcoming", "deactivated", "pending_payment"], 
    default: "upcoming",
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
});


const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;
