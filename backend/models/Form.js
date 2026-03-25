const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  step: { type: Number, default: 1 },
  parentDetails: {
    fatherFirstName: { type: String, required: true },
    fatherLastName: { type: String, required: true },
    motherFirstName: { type: String, required: true },
    motherLastName: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    address: { type: String, required: true },
    pincode: { type: String, required: true, match: /^[0-9]{6}$/ },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
  },
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }],
  paymentStatus: { type: String, required: true },
  subscriptionCount: { type: Number, default: 0, required: true },
  // ⭐ NEW WALLET FIELD
  wallet: {
    points: { type: Number, default: 0 },
    history: [
      {
        date: { type: Date, default: Date.now },
        change: { type: Number },             // +200, -100 etc.
        reason: { type: String },             // "meal deleted"
        childName: { type: String },          // ⭐ NEW
        mealName: { type: String },           // ⭐ NEW
      }
    ]
  }
});

const Form = mongoose.model("Form", FormSchema);
module.exports = Form;
