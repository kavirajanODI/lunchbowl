const express = require('express');
const router = express.Router();
const { getAppSettings } = require('../controller/appSettingsController');

// GET /api/app-config
// Returns runtime-configurable business logic values read from environment variables.
router.get('/', getAppSettings);

module.exports = router;
