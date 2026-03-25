const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  mealDate: { type: Date, required: true },
  mealName: { type: String, required: true },
  deleted: { type: Boolean, default: false }
});

const childMealEntrySchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, required: true },
  meals: { type: [mealSchema], default: [] }
}, { _id: false });

const planMealSchema = new mongoose.Schema({
  planId: { type: String, required: true },
  children: { type: [childMealEntrySchema], default: [] }
}, { _id: false });

const userMealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  plans: { type: [planMealSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('UserMeal', userMealSchema);
