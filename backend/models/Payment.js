const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true
  },
  tracking_id: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  order_status: {
    type: String,
    enum: ['Success', 'Failure', 'Aborted', 'Invalid', 'Timeout'],
    required: true
  },
  payment_mode: String,
  card_name: String,
  status_code: String,
  status_message: String,
  bank_ref_no: String,
  billing_name: String,
  billing_email: String,
  payment_date: {
    type: Date,
    default: Date.now
  },
  paidFor: {
    type: String,
    default: null
  },
  // Include any other CCAvenue response fields you need
  merchant_param1: String,
  merchant_param2: String,
  merchant_param3: String,
  merchant_param4: String,
  merchant_param5: String
}, { _id: true });


const userPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One document per user
  },
  payments: [paymentTransactionSchema], // Array of all payments
  total_payments: {
    type: Number,
    default: 0
  },
  total_amount: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps and counters
userPaymentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  this.total_payments = this.payments.length;
  this.total_amount = this.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  next();
});

const UserPayment = mongoose.model('UserPayment', userPaymentSchema);

module.exports = UserPayment;