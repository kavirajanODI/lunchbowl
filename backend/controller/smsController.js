const { sendSMS, validateMobile, formatMobile } = require('../lib/sms-sender/smsService');
const SmsLog = require('../models/SmsLog');
const Customer = require('../models/Customer');

/**
 * Send SMS and log the result
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendSMSNotification = async (req, res) => {
  try {
    const { mobile, messageType, variables, customerId, orderId } = req.body;

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

    // Log SMS in database
    const smsLog = new SmsLog({
      mobile: formattedMobile,
      messageType,
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      orderId: orderId || undefined,
      variables: variables || [],
      sentAt: new Date()
    });

    await smsLog.save();

    if (smsResult.success) {
      res.status(200).json({
        message: 'SMS sent successfully',
        smsLogId: smsLog._id,
        messageId: smsResult.messageId
      });
    } else {
      res.status(500).json({
        message: 'Failed to send SMS',
        error: smsResult.error,
        smsLogId: smsLog._id
      });
    }

  } catch (error) {
    console.error('Error in sendSMSNotification:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send OTP SMS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendOTPSMS = async (req, res) => {
  try {
    const { mobile, otp, customerId } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        message: 'Mobile number and OTP are required'
      });
    }

    const formattedMobile = formatMobile(mobile);
    const smsResult = await sendSMS(formattedMobile, 'OTP', [otp]);

    // Log SMS
    const smsLog = new SmsLog({
      mobile: formattedMobile,
      messageType: 'OTP',
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      variables: [otp],
      sentAt: new Date()
    });

    await smsLog.save();

    res.status(smsResult.success ? 200 : 500).json({
      message: smsResult.success ? 'OTP SMS sent successfully' : 'Failed to send OTP SMS',
      success: smsResult.success,
      smsLogId: smsLog._id,
      error: smsResult.error
    });

  } catch (error) {
    console.error('Error in sendOTPSMS:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send signup confirmation SMS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendSignupConfirmationSMS = async (req, res) => {
  try {
    const { mobile, customerName, customerId } = req.body;

    if (!mobile || !customerName) {
      return res.status(400).json({
        message: 'Mobile number and customer name are required'
      });
    }

    const formattedMobile = formatMobile(mobile);
    const smsResult = await sendSMS(formattedMobile, 'SIGNUP_CONFIRMATION', [customerName]);

    // Log SMS
    const smsLog = new SmsLog({
      mobile: formattedMobile,
      messageType: 'SIGNUP_CONFIRMATION',
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      variables: [customerName],
      sentAt: new Date()
    });

    await smsLog.save();

    res.status(smsResult.success ? 200 : 500).json({
      message: smsResult.success ? 'Signup confirmation SMS sent successfully' : 'Failed to send signup confirmation SMS',
      success: smsResult.success,
      smsLogId: smsLog._id,
      error: smsResult.error
    });

  } catch (error) {
    console.error('Error in sendSignupConfirmationSMS:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send payment confirmation SMS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendPaymentConfirmationSMS = async (req, res) => {
  try {
    const { mobile, amount, customerId, orderId } = req.body;

    if (!mobile || !amount) {
      return res.status(400).json({
        message: 'Mobile number and amount are required'
      });
    }

    const formattedMobile = formatMobile(mobile);
    const smsResult = await sendSMS(formattedMobile, 'PAYMENT_CONFIRMATION', [amount]);

    // Log SMS
    const smsLog = new SmsLog({
      mobile: formattedMobile,
      messageType: 'PAYMENT_CONFIRMATION',
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      orderId: orderId || undefined,
      variables: [amount],
      sentAt: new Date()
    });

    await smsLog.save();

    res.status(smsResult.success ? 200 : 500).json({
      message: smsResult.success ? 'Payment confirmation SMS sent successfully' : 'Failed to send payment confirmation SMS',
      success: smsResult.success,
      smsLogId: smsLog._id,
      error: smsResult.error
    });

  } catch (error) {
    console.error('Error in sendPaymentConfirmationSMS:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get SMS logs for a customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSMSLogs = async (req, res) => {
  try {
    const { customerId, page = 1, limit = 10 } = req.query;

    const query = customerId ? { customerId } : {};
    
    const smsLogs = await SmsLog.find(query)
      .populate('customerId', 'name email phone')
      .populate('orderId', 'orderNumber total')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SmsLog.countDocuments(query);

    res.status(200).json({
      smsLogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error in getSMSLogs:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send trial food confirmation SMS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendTrialFoodConfirmationSMS = async (req, res) => {
  try {
    const { mobile, childName, date, location, customerId } = req.body;

    if (!mobile || !childName || !date || !location) {
      return res.status(400).json({
        message: 'Mobile number, child name, date, and location are required'
      });
    }

    const formattedMobile = formatMobile(mobile);
    const smsResult = await sendSMS(formattedMobile, 'TRIAL_FOOD_CONFIRMATION', [childName, date, location]);

    // Log SMS
    const smsLog = new SmsLog({
      mobile: formattedMobile,
      messageType: 'TRIAL_FOOD_CONFIRMATION',
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      variables: [childName, date, location],
      sentAt: new Date()
    });

    await smsLog.save();

    res.status(smsResult.success ? 200 : 500).json({
      message: smsResult.success ? 'Trial food confirmation SMS sent successfully' : 'Failed to send trial food confirmation SMS',
      success: smsResult.success,
      smsLogId: smsLog._id,
      error: smsResult.error
    });

  } catch (error) {
    console.error('Error in sendTrialFoodConfirmationSMS:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send trial food feedback SMS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendTrialFoodFeedbackSMS = async (req, res) => {
  try {
    const { mobile, parentName, childName, feedbackLink, customerId } = req.body;

    if (!mobile || !parentName || !childName || !feedbackLink) {
      return res.status(400).json({
        message: 'Mobile number, parent name, child name, and feedback link are required'
      });
    }

    const formattedMobile = formatMobile(mobile);
    const smsResult = await sendSMS(formattedMobile, 'TRIAL_FOOD_SMS', [parentName, childName, feedbackLink]);

    // Log SMS
    const smsLog = new SmsLog({
      mobile: formattedMobile,
      messageType: 'TRIAL_FOOD_SMS',
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      variables: [parentName, childName, feedbackLink],
      sentAt: new Date()
    });

    await smsLog.save();

    res.status(smsResult.success ? 200 : 500).json({
      message: smsResult.success ? 'Trial food feedback SMS sent successfully' : 'Failed to send trial food feedback SMS',
      success: smsResult.success,
      smsLogId: smsLog._id,
      error: smsResult.error
    });

  } catch (error) {
    console.error('Error in sendTrialFoodFeedbackSMS:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  sendSMSNotification,
  sendOTPSMS,
  sendSignupConfirmationSMS,
  sendPaymentConfirmationSMS,
  sendTrialFoodConfirmationSMS,
  sendTrialFoodFeedbackSMS,
  getSMSLogs
};