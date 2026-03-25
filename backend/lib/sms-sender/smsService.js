const axios = require('axios');
require("dotenv").config();
// SMS Templates with DLT Template IDs
const SMS_TEMPLATES = {
  OTP: {
    templateId: '1607100000000356197',
    template: 'Your Lunch Bowl OTP is {#var#}. It is valid for 10 minutes. Do not share this with anyone.\n\nEarth Tech Concepts Pvt Ltd'
  },
  SIGNUP_CONFIRMATION: {
    templateId: '1607100000000356198',
    template: 'Welcome to Lunch Bowl! Your account {#var#} has been successfully created. Start planning healthy meals for your child today.\nTeam Lunch Bowl, Earth Tech Concepts Pvt Ltd.'
  },
  PAYMENT_CONFIRMATION: {
    templateId: '1607100000000356199',
    template: 'Payment of Rs.{#var#} received successfully for Lunch Bowl. Thank you! Your subscription is now active.\nEarth Tech Concepts Pvt Ltd'
  },
  SUBSCRIPTION_RENEWAL: {
    templateId: '1607100000000356200',
    template: 'Hi {#var#}, your Lunch Bowl subscription is due for renewal on {#var#}. Renew now to ensure uninterrupted meal service for your child.\nTeam Lunch Bowl, Earth Tech Concepts Pvt Ltd'
  },
  TRIAL_FOOD_CONFIRMATION: {
    templateId: '1607100000000356202',
    template: 'Trial meal confirmed for {#var#} on {#var#} at {#var#}. We hope your child enjoys their healthy lunch!\nLunch Bowl Team, Earth Tech Concepts Pvt Ltd'
  },
  TRIAL_FOOD_SMS: {
    templateId: '1607100000000356203',
    template: 'Hi {#var#}, we hope {#var#} enjoyed their Lunch Bowl trial meal today! We\'d love to hear your feedback: {#var#}\nTeam Lunch Bowl, Earth Tech Concepts Pvt Ltd'
  }
};

/**
 * Send SMS using smsintegra.com API
 * @param {string} mobile - Mobile number to send SMS to
 * @param {string} messageType - Type of message (OTP, SIGNUP_CONFIRMATION, etc.)
 * @param {Array} variables - Array of variables to replace in template
 * @returns {Object} - Response object with success status and details
 */
const sendSMS = async (mobile, messageType, variables = []) => {
  try {
    const template = SMS_TEMPLATES[messageType];
    if (!template) {
      throw new Error(`Invalid message type: ${messageType}`);
    }

    // Replace variables in template
    let message = template.template;
    variables.forEach((variable, index) => {
      message = message.replace('{#var#}', variable);
    });

    // Prepare API parameters
    const params = new URLSearchParams({
      uid: process.env.SMS_UID,
      pwd: process.env.SMS_PWD,
      mobile: mobile,
      msg: message,
      sid: process.env.SMS_SID,
      type: '0', // 0 for text message
      dtTimeNow: new Date().toISOString(),
      entityid: process.env.SMS_ENTITY_ID,
      tempid: template.templateId
    });

    const apiUrl = `${process.env.SMS_API_URL}?${params.toString()}`;
    
    console.log('Sending SMS to:', mobile, 'Type:', messageType);
    console.log('Message:', message);

    // Make API call
    const response = await axios.get(apiUrl);
    
    console.log('SMS API Response:', response.data);

    return {
      success: true,
      messageId: response.data,
      mobile: mobile,
      messageType: messageType,
      message: message,
      templateId: template.templateId,
      sentAt: new Date()
    };

  } catch (error) {
    console.error('Error sending SMS:', error.message);
    
    // Get template safely for error response
    const template = SMS_TEMPLATES[messageType];
    let fallbackMessage = 'SMS failed to send';
    let fallbackTemplateId = 'unknown';
    
    if (template) {
      fallbackTemplateId = template.templateId;
      try {
        fallbackMessage = template.template;
        variables.forEach((variable, index) => {
          fallbackMessage = fallbackMessage.replace('{#var#}', variable);
        });
      } catch (msgError) {
        fallbackMessage = `SMS ${messageType} failed to send`;
      }
    }
    
    return {
      success: false,
      error: error.message,
      mobile: mobile,
      messageType: messageType,
      message: fallbackMessage,
      templateId: fallbackTemplateId,
      sentAt: new Date()
    };
  }
};

/**
 * Validate mobile number format
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateMobile = (mobile) => {
  // Remove all non-digit characters
  const cleanMobile = mobile.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number (10 digits starting with 6-9)
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  return indianMobileRegex.test(cleanMobile);
};

/**
 * Format mobile number to include country code if needed
 * @param {string} mobile - Mobile number to format
 * @returns {string} - Formatted mobile number
 */
const formatMobile = (mobile) => {
  // Remove all non-digit characters
  const cleanMobile = mobile.replace(/\D/g, '');
  
  // If it's a 10-digit Indian number, add country code
  if (cleanMobile.length === 10 && /^[6-9]/.test(cleanMobile)) {
    return `91${cleanMobile}`;
  }
  
  // If it already has country code (12 digits starting with 91)
  if (cleanMobile.length === 12 && cleanMobile.startsWith('91')) {
    return cleanMobile;
  }
  
  // Return as-is for other formats
  return cleanMobile;
};

module.exports = {
  sendSMS,
  validateMobile,
  formatMobile,
  SMS_TEMPLATES
};