const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createOrder, verifyPayment, processRefund, getPaymentDetails } = require('../services/razorpayService');

/**
 * @desc    Create a new payment order
 * @route   POST /api/v1/payments/create-order
 * @access  Private
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { amount, currency = 'INR', notes = {} } = req.body;

  if (!amount) {
    return next(new AppError('Amount is required', 400));
  }

  const order = await createOrder(amount, currency, {
    ...notes,
    userId: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

/**
 * @desc    Verify payment and update order status
 * @route   POST /api/v1/payments/verify
 * @access  Private
 */
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { orderId, paymentId, signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    return next(new AppError('Missing required payment details', 400));
  }

  const isValid = verifyPayment(orderId, paymentId, signature);

  if (!isValid) {
    return next(new AppError('Invalid payment signature', 400));
  }

  // TODO: Update your order status in the database here
  // Example: await Order.updateStatus(orderId, 'paid');

  res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    data: {
      orderId,
      paymentId,
    },
  });
});

/**
 * @desc    Process a refund
 * @route   POST /api/v1/payments/refund
 * @access  Private/Admin
 */
exports.processRefund = catchAsync(async (req, res, next) => {
  const { paymentId, amount, speed = 'normal' } = req.body;

  if (!paymentId || !amount) {
    return next(new AppError('Payment ID and amount are required', 400));
  }

  const refund = await processRefund(paymentId, amount, speed);

  // TODO: Update your order status in the database here
  // Example: await Order.updateStatus(orderId, 'refunded');

  res.status(200).json({
    status: 'success',
    data: {
      refund,
    },
  });
});

/**
 * @desc    Get payment details
 * @route   GET /api/v1/payments/:paymentId
 * @access  Private
 */
exports.getPaymentDetails = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return next(new AppError('Payment ID is required', 400));
  }

  const payment = await getPaymentDetails(paymentId);

  res.status(200).json({
    status: 'success',
    data: {
      payment,
    },
  });
});

/**
 * @desc    Handle Razorpay webhook
 * @route   POST /api/v1/payments/webhook
 * @access  Public (Razorpay will call this endpoint)
 */
exports.handleWebhook = catchAsync(async (req, res, next) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Verify webhook signature
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== signature) {
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  const { event, payload } = req.body;

  // Handle different webhook events
  switch (event) {
    case 'payment.captured':
      // TODO: Handle successful payment
      // Example: await Order.updateStatus(payload.payment.entity.order_id, 'paid');
      break;
    case 'payment.failed':
      // TODO: Handle failed payment
      // Example: await Order.updateStatus(payload.payment.entity.order_id, 'failed');
      break;
    case 'refund.processed':
      // TODO: Handle refund
      // Example: await Order.updateStatus(payload.refund.entity.payment_id, 'refunded');
      break;
    default:
      console.log(`Unhandled event: ${event}`);
  }

  res.status(200).json({ status: 'success' });
});
