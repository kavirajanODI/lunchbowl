const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema(
  {
    primaryDishTitle: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    Idescription: { type: String, required: true }, // new field for additional description
    image: { type: String, required: true }, // main image
    dishImage2: { type: String }, // second image, optional
    cuisine: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },

    nutritionValues: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0 && v[0].trim() !== ""; // At least one mandatory nutrition value
        },
        message: "At least one nutrition value is required",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dish", DishSchema);
