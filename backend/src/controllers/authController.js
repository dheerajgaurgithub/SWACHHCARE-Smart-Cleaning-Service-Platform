const User = require('../models/User');
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const { promisify } = require('util');

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate JWT Token
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or phone already exists',
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      verified: false,
    });

    // Handle referral if exists
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
        // Add referral bonus (e.g., 10% of first booking up to ₹200)
        referrer.referralBonus = (referrer.referralBonus || 0) + 200;
        await referrer.save({ validateBeforeSave: false });
      }
    }

    // Generate OTP
    const otp = newUser.getOtp();
    await newUser.save({ validateBeforeSave: false });

    // Send OTP via email
    const message = `Your OTP for SwachhCare registration is ${otp}. Valid for 10 minutes.`;
    await sendEmail({
      email: newUser.email,
      subject: 'Verify your SwachhCare account',
      message,
    });

    // Send response
    res.status(201).json({
      status: 'success',
      message: 'OTP sent to your email. Please verify your account.',
      userId: newUser._id,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    // 1) Get user based on the token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // 2) Check if OTP matches and not expired
    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP',
      });
    }

    // 3) If everything is ok, mark user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    
    // Generate referral code if not exists
    if (!user.referralCode) {
      user.referralCode = `${user.name.substring(0, 3)}${Math.floor(1000 + Math.random() * 9000)}`.toUpperCase();
    }
    
    await user.save({ validateBeforeSave: false });

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // 3) Check if user is verified
    if (!user.verified) {
      // Resend OTP if not verified
      const otp = user.getOtp();
      await user.save({ validateBeforeSave: false });

      await sendEmail({
        email: user.email,
        subject: 'Verify your SwachhCare account',
        message: `Your OTP for SwachhCare verification is ${otp}. Valid for 10 minutes.`,
      });

      return res.status(401).json({
        status: 'error',
        message: 'Please verify your account. OTP sent to your email.',
        userId: user._id,
      });
    }

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Google OAuth
exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update last login
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
      
      return createSendToken(user, 200, res);
    }

    // Create new user if doesn't exist
    const password = email + process.env.JWT_SECRET; // Temporary password
    user = await User.create({
      name,
      email,
      password,
      avatar: picture,
      verified: true,
      googleId: ticket.getUserId(),
    });

    createSendToken(user, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with that email address.',
      });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!',
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired',
      });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.matchPassword(req.body.currentPassword, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is wrong.',
      });
    }

    // 3) If so, update password
    user.password = req.body.newPassword;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Protect routes - middleware
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password! Please log in again.',
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in! Please log in to get access.',
    });
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'worker']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Send email helper
const sendEmail = async (options) => {
  // 1) Define the email options
  const mailOptions = {
    from: `SwachhCare <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html
  };

  // 2) Create a transport and send email
  await transporter.sendMail(mailOptions);
};
