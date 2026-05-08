const express = require("express");
const { requestSchool } = require("../controller/schoolRequestController");

const router = express.Router();

router.post("/request-school", requestSchool);

module.exports = router;
