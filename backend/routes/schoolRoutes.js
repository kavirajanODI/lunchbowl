const express = require("express");
const router = express.Router();
const {
  addSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} = require("../controller/adminController");

// Add a school
router.post("/add-school", addSchool);

// Get all schools
router.get("/get-all-schools", getAllSchools);

// Get a single school by ID
router.get("/get-school/:id", getSchoolById);

// Update a school
router.put("/update-school/:id", updateSchool);

// Delete a school
router.delete("/delete-school/:id", deleteSchool);

module.exports = router;