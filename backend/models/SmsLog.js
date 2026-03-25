const mongoose = require("mongoose");

const smsLogSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
      enum: ['OTP', 'SIGNUP_CONFIRMATION', 'PAYMENT_CONFIRMATION', 'SUBSCRIPTION_RENEWAL', 'TRIAL_FOOD_CONFIRMATION', 'TRIAL_FOOD_SMS']
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    templateId: {
      type: String,
      required: false,
      default: ''
    },
    messageId: {
      type: String,
      required: false, // SMS provider response ID
    },
    status: {
      type: String,
      required: true,
      enum: ['sent', 'failed', 'pending'],
      default: 'pending'
    },
    error: {
      type: String,
      required: false,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    variables: {
      type: [String],
      required: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
smsLogSchema.index({ mobile: 1, messageType: 1, createdAt: -1 });
smsLogSchema.index({ customerId: 1, createdAt: -1 });
smsLogSchema.index({ status: 1, createdAt: -1 });

const SmsLog = mongoose.model("SmsLog", smsLogSchema);

module.exports = SmsLog;