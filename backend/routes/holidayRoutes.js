const express = require("express");
const router = express.Router();
const {
  addHoliday,
  getAllHolidays,
  updateHoliday,
  deleteHoliday
} = require("../controller/adminController");

// Add a holiday
router.post("/add-holiday", addHoliday);

// Get all holidays
router.get("/get-all-holidays", getAllHolidays);

// Update a holiday
router.put("/update-holiday/:id",  updateHoliday);

// Delete a holiday
router.delete("/delete-holiday/:id", deleteHoliday);

module.exports = router;