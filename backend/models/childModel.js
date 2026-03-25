const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the user/customer
    required: true
  },
  childFirstName: { type: String, required: true },
  childLastName: { type: String, required: true },
  dob: { type: Date, required: true },
  lunchTime: { type: String, required: true },
  school: { type: String, required: true },
  location: { type: String, required: true },
  childClass: { type: String, required: true },
  section: { type: String, required: true },
  allergies: { type: String, default: "" },
});

const Child = mongoose.model("Child", ChildSchema);
module.exports = Child;
