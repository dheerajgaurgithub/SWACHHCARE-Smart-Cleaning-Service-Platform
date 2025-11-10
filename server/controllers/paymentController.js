import crypto from 'crypto';
import { promisify } from 'util';
import Booking from '../models/booking.js';
import Payment from '../models/payment.js';
import { Wallet, WalletTransaction } from '../models/wallet.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
import { sendEmail } from '../utils/email.js';

// Initialize Razorpay (or any other payment gateway)
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// @desc    Create a payment order
// @route   POST /api/v1/payments/create-order
// @access  Private
export const createPaymentOrder = catchAsync(async (req, res, next) => {
  const { bookingId, amount, currency = 'INR' } = req.body;
  
  // 1) Get the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  // 2) Verify the booking belongs to the user
  if (booking.customer._id.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to pay for this booking', 403));
  }
  
  // 3) Check if booking is already paid
  if (booking.payment.status === 'paid') {
    return next(new AppError('This booking is already paid for', 400));
  }
  
  // 4) Create a payment order
  // In a real implementation, this would create an order with Razorpay/Stripe
  // const order = await razorpay.orders.create({
  //   amount: amount * 100, // Convert to smallest currency unit (paise for INR)
  //   currency,
  //   receipt: `booking_${bookingId}`,
  //   payment_capture: 1 // Auto capture payment
  // });
  
  // For now, we'll simulate a successful order creation
  const order = {
    id: `order_${crypto.randomBytes(16).toString('hex')}`,
    entity: 'order',
    amount: amount * 100,
    amount_paid: 0,
    amount_due: amount * 100,
    currency,
    receipt: `booking_${bookingId}`,
    status: 'created',
    attempts: 0,
    created_at: Date.now()
  };
  
  // 5) Create a payment record
  const payment = await Payment.create({
    user: req.user.id,
    userModel: 'Customer',
    booking: bookingId,
    amount: amount,
    currency,
    paymentMethod: req.body.paymentMethod || 'card',
    paymentProvider: 'razorpay',
    status: 'created',
    paymentId: order.id,
    orderId: order.id,
    description: `Payment for booking #${bookingId}`,
    metadata: {
      bookingId: bookingId,
      service: booking.service.name,
      date: booking.date
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
      payment
    }
  });
});

// @desc    Verify payment and capture it
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = catchAsync(async (req, res, next) => {
  const { order_id, payment_id, signature } = req.body;
  
  // 1) Verify the payment signature
  // In a real implementation, you would verify the signature with Razorpay
  // const generatedSignature = crypto
  //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  //   .update(order_id + '|' + payment_id)
  //   .digest('hex');
  
  // if (generatedSignature !== signature) {
  //   return next(new AppError('Invalid payment signature', 400));
  // }
  
  // 2) Get the payment and booking
  const payment = await Payment.findOne({ orderId: order_id });
  if (!payment) {
    return next(new AppError('No payment found with that order ID', 404));
  }
  
  const booking = await Booking.findById(payment.booking);
  if (!booking) {
    return next(new AppError('No booking found for this payment', 404));
  }
  
  // 3) Update payment status
  payment.status = 'captured';
  payment.paymentId = payment_id;
  payment.capturedAt = Date.now();
  
  // 4) Update booking payment status
  booking.payment.status = 'paid';
  booking.payment.paymentDate = Date.now();
  booking.payment.transactionId = payment_id;
  
  // 5) Save both in a transaction
  const session = await Booking.startSession();
  await session.withTransaction(async () => {
    await payment.save({ session });
    await booking.save({ session });
  });
  
  // 6) Send payment confirmation email
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Payment Confirmation',
      template: 'paymentConfirmation',
      templateVars: {
        name: req.user.fullName,
        amount: payment.amount,
        bookingId: booking._id,
        service: booking.service.name,
        date: booking.date.toLocaleDateString(),
        time: booking.startTime,
        transactionId: payment_id
      }
    });
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// @desc    Add money to wallet
// @route   POST /api/v1/payments/wallet/topup
// @access  Private
export const addToWallet = catchAsync(async (req, res, next) => {
  const { amount, paymentMethod = 'card' } = req.body;
  
  if (amount <= 0) {
    return next(new AppError('Amount must be greater than zero', 400));
  }
  
  // 1) Get or create wallet
  const wallet = await Wallet.getOrCreateWallet(req.user.id, 'Customer');
  
  // 2) Create a payment order
  const orderId = `wallet_${crypto.randomBytes(16).toString('hex')}`;
  
  // 3) In a real implementation, you would create a payment intent with Razorpay/Stripe
  // and return the client secret for frontend confirmation
  
  // For now, we'll simulate a successful payment
  const paymentId = `pay_${crypto.randomBytes(16).toString('hex')}`;
  
  // 4) Add money to wallet
  const transaction = await wallet.addCredit(
    amount,
    'Wallet top up',
    paymentId,
    'Payment'
  );
  
  // 5) Create payment record
  const payment = await Payment.create({
    user: req.user.id,
    userModel: 'Customer',
    amount,
    currency: 'INR',
    paymentMethod,
    paymentProvider: 'razorpay',
    status: 'captured',
    paymentId,
    orderId,
    description: 'Wallet top up',
    metadata: {
      type: 'wallet_topup'
    },
    capturedAt: Date.now()
  });

  res.status(200).json({
    status: 'success',
    data: {
      wallet,
      transaction,
      payment
    }
  });
});

// @desc    Get wallet balance
// @route   GET /api/v1/payments/wallet/balance
// @access  Private
export const getWalletBalance = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findOne({ 
    user: req.user.id,
    userModel: 'Customer'
  });
  
  const balance = wallet ? wallet.balance : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      balance: balance / 100, // Convert to rupees
      currency: 'INR'
    }
  });
});

// @desc    Get wallet transactions
// @route   GET /api/v1/payments/wallet/transactions
// @access  Private
export const getWalletTransactions = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findOne({ 
    user: req.user.id,
    userModel: 'Customer'
  });
  
  if (!wallet) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        transactions: []
      }
    });
  }
  
  const features = new APIFeatures(
    WalletTransaction.find({ 
      user: req.user.id,
      userModel: 'Customer'
    }),
    req.query
  )
    .filter()
    .sort('-createdAt')
    .limitFields()
    .paginate();
  
  const transactions = await features.query;
  
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

// @desc    Process refund
// @route   POST /api/v1/payments/refund
// @access  Private/Admin
export const processRefund = catchAsync(async (req, res, next) => {
  const { paymentId, amount, reason } = req.body;
  
  // 1) Get the payment
  const payment = await Payment.findOne({
    paymentId,
    status: 'captured'
  });
  
  if (!payment) {
    return next(new AppError('No captured payment found with that ID', 404));
  }
  
  // 2) Check if refund amount is valid
  const maxRefundAmount = payment.amount - (payment.amountRefunded || 0);
  
  if (amount > maxRefundAmount) {
    return next(
      new AppError(
        `Refund amount cannot exceed ${maxRefundAmount}`, 
        400
      )
    );
  }
  
  // 3) In a real implementation, you would process the refund with Razorpay/Stripe
  // const refund = await razorpay.payments.refund(paymentId, {
  //   amount: amount * 100,
  //   speed: 'normal',
  //   notes: {
  //     reason: reason || 'Customer request'
  //   }
  // });
  
  // For now, we'll simulate a successful refund
  const refundId = `rfnd_${crypto.randomBytes(16).toString('hex')}`;
  
  // 4) Update payment with refund details
  payment.refundStatus = 'processed';
  payment.refundedAmount = (payment.refundedAmount || 0) + amount;
  payment.refundId = refundId;
  payment.refundedAt = Date.now();
  
  if (payment.refundedAmount >= payment.amount) {
    payment.status = 'refunded';
  } else {
    payment.status = 'partially_refunded';
  }
  
  await payment.save();
  
  // 5) If this is a wallet payment, credit the amount back to the wallet
  if (payment.paymentMethod === 'wallet') {
    const wallet = await Wallet.getOrCreateWallet(payment.user, 'Customer');
    
    await wallet.addCredit(
      amount,
      `Refund for payment ${payment.paymentId}`,
      refundId,
      'Refund'
    );
  }
  
  // 6) Send refund confirmation email
  try {
    const user = await User.findById(payment.user);
    if (user && user.email) {
      await sendEmail({
        email: user.email,
        subject: 'Refund Processed',
        template: 'refundProcessed',
        templateVars: {
          name: user.fullName || 'Customer',
          amount: amount,
          currency: payment.currency,
          paymentId: payment.paymentId,
          refundId,
          reason: reason || 'Customer request'
        }
      });
    }
  } catch (err) {
    console.error('Error sending refund confirmation email:', err);
  }

  res.status(200).json({
    status: 'success',
    data: {
      refund: {
        id: refundId,
        paymentId: payment.paymentId,
        amount,
        currency: payment.currency,
        status: 'processed',
        createdAt: new Date()
      }
    }
  });
});

export default {
  createPaymentOrder,
  verifyPayment,
  addToWallet,
  getWalletBalance,
  getWalletTransactions,
  processRefund
};
