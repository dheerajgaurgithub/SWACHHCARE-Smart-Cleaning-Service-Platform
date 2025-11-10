import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client = null;

// Initialize Twilio client only if credentials are available
if (accountSid && authToken && fromPhone) {
  try {
    client = twilio(accountSid, authToken);
    console.log('Twilio SMS service initialized successfully');
  } catch (error) {
    console.error('Error initializing Twilio client:', error.message);
  }
} else {
  console.warn('Twilio credentials not found. SMS functionality will be disabled.');
}

/**
 * Send SMS using Twilio
 * @param {Object} options - Options for sending SMS
 * @param {string} options.phone - Recipient's phone number (with country code, e.g., +1234567890)
 * @param {string} options.message - Message to be sent
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
export const sendSMS = async ({ phone, message }) => {
  if (!client) {
    console.warn('SMS not sent - Twilio client not initialized');
    return {
      success: false,
      message: 'SMS service is not available',
      data: null
    };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: phone,
    });
    
    return {
      success: true,
      message: 'SMS sent successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

/**
 * Send OTP via SMS
 * @param {Object} options - Options for sending OTP
 * @param {string} options.phone - Recipient's phone number
 * @param {string} options.otp - OTP to be sent
 * @param {number} [options.expiryMinutes=10] - OTP expiry time in minutes
 * @returns {Promise<Object>} - Result of the OTP sending operation
 */
export const sendOTP = async ({ phone, otp, expiryMinutes = 10 }) => {
  const message = `Your SwachhCare verification code is: ${otp}. Valid for ${expiryMinutes} minutes.`;
  
  return sendSMS({
    phone,
    message,
  });
};

/**
 * Send booking confirmation via SMS
 * @param {Object} options - Options for sending booking confirmation
 * @param {string} options.phone - Recipient's phone number
 * @param {string} options.bookingId - Booking reference ID
 * @param {string} options.serviceType - Type of service booked
 * @param {string} options.dateTime - Date and time of the booking
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
export const sendBookingConfirmation = async ({
  phone,
  bookingId,
  serviceType,
  dateTime,
}) => {
  const message = `Your ${serviceType} service is confirmed! Booking ID: ${bookingId}. Scheduled for: ${dateTime}. Thank you for choosing SwachhCare!`;
  
  return sendSMS({
    phone,
    message,
  });
};

/**
 * Send status update via SMS
 * @param {Object} options - Options for sending status update
 * @param {string} options.phone - Recipient's phone number
 * @param {string} options.bookingId - Booking reference ID
 * @param {string} options.status - New status of the booking
 * @param {string} [options.additionalInfo] - Additional information about the status update
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
export const sendStatusUpdate = async ({
  phone,
  bookingId,
  status,
  additionalInfo = '',
}) => {
  const message = `Update for booking ${bookingId}: Status changed to ${status}. ${additionalInfo}`;
  
  return sendSMS({
    phone,
    message,
  });
};

export default {
  sendSMS,
  sendOTP,
  sendBookingConfirmation,
  sendStatusUpdate,
};
