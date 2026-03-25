const { sendSMS } = require('../lib/sms-sender/smsService');
const SmsLog = require('../models/SmsLog');
const Customer = require('../models/Customer');

/**
 * Send trial food feedback SMS - can be called by admin after trial delivery
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendTrialFeedbackSMS = async (req, res) => {
  try {
    const { customerId, mobile, parentName, childName, feedbackLink } = req.body;

    if (!mobile || !parentName || !childName) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number, parent name, and child name are required'
      });
    }

    // Generate feedback link if not provided
    const defaultFeedbackLink = feedbackLink || 'https://lunchbowl.co.in/feedback';

    const smsResult = await sendSMS(mobile, 'TRIAL_FOOD_SMS', [parentName, childName, defaultFeedbackLink]);

    // Log SMS
    const smsLog = new SmsLog({
      mobile: mobile,
      messageType: 'TRIAL_FOOD_SMS',
      message: smsResult.message || '',
      templateId: smsResult.templateId || '',
      messageId: smsResult.messageId || '',
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error || undefined,
      customerId: customerId || undefined,
      variables: [parentName, childName, defaultFeedbackLink],
      sentAt: new Date()
    });

    await smsLog.save();

    res.status(200).json({
      success: true,
      message: 'Trial food feedback SMS sent successfully',
      smsLogId: smsLog._id
    });

  } catch (error) {
    console.error('Error sending trial feedback SMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send trial feedback SMS',
      error: error.message
    });
  }
};

/**
 * Get customers who had trial meals and can receive feedback SMS
 * @param {Object} req - Express request object  
 * @param {Object} res - Express response object
 */
const getTrialCustomers = async (req, res) => {
  try {
    const trialCustomers = await Customer.find({ 
      freeTrial: true 
    }).select('name email phone _id createdAt');

    res.status(200).json({
      success: true,
      customers: trialCustomers
    });

  } catch (error) {
    console.error('Error fetching trial customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trial customers',
      error: error.message
    });
  }
};

module.exports = {
  sendTrialFeedbackSMS,
  getTrialCustomers
};