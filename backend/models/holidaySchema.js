const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index to ensure date uniqueness
holidaySchema.index({ date: 1 }, { unique: true });

// Pre-save hook to ensure date is stored in UTC
holidaySchema.pre('save', function(next) {
  if (this.isModified('date')) {
    // Convert date to UTC midnight to avoid timezone issues
    const date = new Date(this.date);
    this.date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  next();
});

module.exports = mongoose.model('Holiday', holidaySchema);