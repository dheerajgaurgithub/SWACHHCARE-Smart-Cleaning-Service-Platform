import Customer from '../models/customer.js';
import { signToken } from '../middleware/authMiddleware.js';
import { sendOTPEmail } from '../utils/gmailService.js';
import twilio from 'twilio';

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// SMS configuration (Twilio)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  console.warn('Twilio credentials not found. SMS functionality will be disabled.');
}

// @desc    Register a new customer
// @route   POST /api/customers/register
// @access  Public
export const registerCustomer = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  try {
    // Check if customer exists
    const customerExists = await Customer.findOne({ $or: [{ email }, { phone }] });

    if (customerExists) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create customer
    const customer = await Customer.create({
      fullName,
      email,
      phone,
      password,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Send OTP via Email using Gmail API
    try {
      await sendOTPEmail(email, otp);
    } catch (error) {
      console.error('Error sending email:', error);
      // Continue with registration even if email fails
    }

    // Send OTP via SMS if Twilio is configured
    if (twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `Your SwachhCare verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+${phone}`,
        });
      } catch (error) {
        console.error('Error sending SMS:', error);
        // Continue with registration even if SMS fails
      }
    }
    
    // In development, log the OTP to console
    if (process.env.NODE_ENV !== 'production') {
      console.log(`OTP for ${email}: ${otp}`);
    }

    // Set success message
    const message = 'Registration successful. Please check your email for the verification OTP.';

    res.status(201).json({
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/customers/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.otp !== otp || customer.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    customer.isVerified = true;
    customer.otp = undefined;
    customer.otpExpiry = undefined;
    await customer.save();

    // Generate token
    const token = signToken(customer._id);

    res.json({
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (customer && (await customer.matchPassword(password))) {
      if (!customer.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      const token = signToken(customer._id);

      res.json({
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).select('-password');
    
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private
export const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);

    if (customer) {
      customer.fullName = req.body.fullName || customer.fullName;
      customer.email = req.body.email || customer.email;
      customer.phone = req.body.phone || customer.phone;
      
      if (req.body.address) {
        customer.address = {
          ...customer.address,
          ...req.body.address
        };
      }

      if (req.body.houseSize) {
        customer.houseSize = req.body.houseSize;
      }

      const updatedCustomer = await customer.save();

      res.json({
        _id: updatedCustomer._id,
        fullName: updatedCustomer.fullName,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
        houseSize: updatedCustomer.houseSize,
      });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Book a service
// @route   POST /api/customers/book-service
// @access  Private
export const bookService = async (req, res) => {
  try {
    const { serviceType, date, address, paymentMethod } = req.body;

    const booking = {
      serviceType,
      date,
      status: 'pending',
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
      amount: calculateServiceAmount(serviceType), // Implement this function based on your pricing
    };

    const customer = await Customer.findById(req.user._id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // If paying with wallet, check balance
    if (paymentMethod === 'wallet' && customer.wallet.balance < booking.amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct from wallet if paying with wallet
    if (paymentMethod === 'wallet') {
      customer.wallet.balance -= booking.amount;
      customer.wallet.transactions.push({
        type: 'debit',
        amount: booking.amount,
        description: `Payment for ${serviceType} service`,
      });
    }

    customer.bookings.push(booking);
    await customer.save();

    // TODO: Notify admin about new booking
    // TODO: If payment method is not wallet, integrate with payment gateway

    res.status(201).json({
      message: 'Service booked successfully',
      booking: customer.bookings[customer.bookings.length - 1],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get customer bookings
// @route   GET /api/customers/bookings
// @access  Private
export const getCustomerBookings = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).select('bookings');
    res.json(customer.bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/customers/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    const booking = customer.bookings.id(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Refund to wallet if payment was made
    if (booking.paymentStatus === 'paid') {
      customer.wallet.balance += booking.amount;
      customer.wallet.transactions.push({
        type: 'credit',
        amount: booking.amount,
        description: `Refund for cancelled ${booking.serviceType} service`,
      });
    }

    booking.status = 'cancelled';
    await customer.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add money to wallet
// @route   POST /api/customers/wallet/add
// @access  Private
export const addToWallet = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const customer = await Customer.findById(req.user._id);

    // In a real app, you would integrate with a payment gateway here
    // For now, we'll just update the wallet balance
    customer.wallet.balance += amount;
    customer.wallet.transactions.push({
      type: 'credit',
      amount,
      description: `Added to wallet via ${paymentMethod}`,
    });

    await customer.save();

    res.json({
      message: 'Money added to wallet successfully',
      newBalance: customer.wallet.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get wallet transactions
// @route   GET /api/customers/wallet/transactions
// @access  Private
export const getWalletTransactions = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).select('wallet');
    res.json({
      balance: customer.wallet.balance,
      transactions: customer.wallet.transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate service amount
const calculateServiceAmount = (serviceType) => {
  // Replace with your actual pricing logic
  const prices = {
    'Cleaning': 499,
    'Laundry': 299,
    'Car Wash': 399,
  };
  return prices[serviceType] || 0;
};
