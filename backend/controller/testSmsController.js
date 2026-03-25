const { sendSMS, validateMobile, formatMobile } = require('../lib/sms-sender/smsService');

/**
 * Test SMS sending without database - for development/testing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const testSMSNotification = async (req, res) => {
  try {
    const { mobile, messageType, variables } = req.body;

    // Validate required fields
    if (!mobile || !messageType) {
      return res.status(400).json({
        message: 'Mobile number and message type are required'
      });
    }

    // Validate mobile number
    if (!validateMobile(mobile)) {
      return res.status(400).json({
        message: 'Invalid mobile number format'
      });
    }

    // Format mobile number
    const formattedMobile = formatMobile(mobile);

    // Send SMS
    const smsResult = await sendSMS(formattedMobile, messageType, variables || []);

    if (smsResult.success) {
      res.status(200).json({
        message: 'SMS sent successfully',
        result: smsResult
      });
    } else {
      res.status(500).json({
        message: 'Failed to send SMS',
        error: smsResult.error,
        result: smsResult
      });
    }

  } catch (error) {
    console.error('Error in testSMSNotification:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  testSMSNotification
};