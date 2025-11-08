const Razorpay = require('razorpay');
const crypto = require('crypto');
const AppError = require('../utils/appError');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a new Razorpay order
 * @param {Number} amount - Amount in smallest currency unit (e.g., paise for INR)
 * @param {String} currency - Currency code (default: 'INR')
 * @param {Object} notes - Additional notes for the order
 * @returns {Promise<Object>} Razorpay order object
 */
const createOrder = async (amount, currency = 'INR', notes = {}) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new AppError('Failed to create payment order', 500);
  }
};

/**
 * Verify Razorpay payment signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 * @returns {Boolean} True if signature is valid
 */
const verifyPayment = (orderId, paymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

/**
 * Process a refund
 * @param {String} paymentId - Razorpay payment ID
 * @param {Number} amount - Amount to refund (in smallest currency unit)
 * @param {String} speed - Refund speed (normal or opt)
 * @returns {Promise<Object>} Refund details
 */
const processRefund = async (paymentId, amount, speed = 'normal') => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      speed,
    });

    return refund;
  } catch (error) {
    console.error('Refund processing error:', error);
    throw new AppError('Failed to process refund', 500);
  }
};

/**
 * Get payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new AppError('Failed to fetch payment details', 500);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  processRefund,
  getPaymentDetails,
};
