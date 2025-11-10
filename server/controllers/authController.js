import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import Customer from '../models/customer.js';
import sendEmail from '../utils/email.js';
import { sendSMS } from '../utils/sms.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

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

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  // 1) Check if user exists
  const existingUser = await Customer.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (existingUser) {
    return next(
      new AppError('User with this email or phone already exists', 400)
    );
  }

  // 2) Create new user
  const newUser = await Customer.create({
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
  });

  // 3) Generate email verification token
  const emailToken = newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  // 4) Send verification email
  const verificationURL = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${emailToken}`;
  const message = `Please verify your email by clicking on this link: \n${verificationURL}\nIf you didn't create an account, please ignore this email.`;

  try {
    await sendEmail({
      email: newUser.email,
      subject: 'Your email verification token (valid for 24 hours)',
      message,
    });

    // 5) Send phone verification OTP
    const phoneOTP = await newUser.createPhoneVerificationOTP();
    await newUser.save({ validateBeforeSave: false });

    await sendSMS({
      phone: newUser.phone,
      message: `Your verification code is: ${phoneOTP}. Valid for 10 minutes.`,
    });

    // 6) Send response
    createSendToken(newUser, 201, res);
  } catch (err) {
    newUser.emailVerificationToken = undefined;
    newUser.emailVerificationExpire = undefined;
    newUser.phoneVerificationOTP = undefined;
    newUser.phoneVerificationExpire = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the verification. Please try again later!'),
      500
    );
  }
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
export const verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Customer.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update user document
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await Customer.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Check if email is verified
  if (!user.isEmailVerified) {
    return next(
      new AppError('Please verify your email before logging in', 401)
    );
  }

  // 4) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await Customer.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
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
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// @desc    Reset password
// @route   PATCH /api/v1/auth/resetPassword/:token
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Customer.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// @desc    Update password
// @route   PATCH /api/v1/auth/updateMyPassword
// @access  Private
export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await Customer.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

// @desc    Update my profile
// @route   PATCH /api/v1/auth/updateMe
// @access  Private
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'fullName',
    'username',
    'dateOfBirth',
    'gender',
    'profilePicture'
  );

  // 3) Update user document
  const updatedUser = await Customer.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// @desc    Request email update
// @route   POST /api/v1/auth/updateEmail
// @access  Private
export const requestEmailUpdate = catchAsync(async (req, res, next) => {
  const { newEmail } = req.body;

  // 1) Check if email is already taken
  if (await Customer.findOne({ email: newEmail })) {
    return next(new AppError('This email is already in use', 400));
  }

  // 2) Generate token and set new email
  const user = await Customer.findById(req.user.id);
  const token = user.createEmailChangeToken(newEmail);
  await user.save({ validateBeforeSave: false });

  // 3) Send verification email to new email
  const verificationURL = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email-update/${token}`;
  const message = `Please confirm your new email by clicking on this link: \n${verificationURL}\nIf you didn't request this change, please contact support.`;

  try {
    await sendEmail({
      email: newEmail,
      subject: 'Confirm your new email address',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent to new email address',
    });
  } catch (err) {
    user.emailChangeToken = undefined;
    user.emailChangeExpire = undefined;
    user.newEmail = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// @desc    Confirm email update
// @route   GET /api/v1/auth/confirm-email-update/:token
// @access  Public
export const confirmEmailUpdate = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Customer.findOne({
    emailChangeToken: hashedToken,
    emailChangeExpire: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, update the email
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update email and clear the token
  user.email = user.newEmail;
  user.newEmail = undefined;
  user.emailChangeToken = undefined;
  user.emailChangeExpire = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// @desc    Request phone number update
// @route   POST /api/v1/auth/request-phone-update
// @access  Private
export const requestPhoneUpdate = catchAsync(async (req, res, next) => {
  const { newPhone } = req.body;

  // 1) Check if phone is already taken
  if (await Customer.findOne({ phone: newPhone })) {
    return next(new AppError('This phone number is already in use', 400));
  }

  // 2) Generate OTP and set new phone
  const user = await Customer.findById(req.user.id);
  const otp = await user.createPhoneChangeOTP(newPhone);
  await user.save({ validateBeforeSave: false });

  // 3) Send OTP to new phone
  try {
    await sendSMS({
      phone: newPhone,
      message: `Your verification code is: ${otp}. Valid for 10 minutes.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent to new phone number',
    });
  } catch (err) {
    user.phoneChangeOTP = undefined;
    user.phoneChangeExpire = undefined;
    user.newPhone = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the SMS. Try again later!'),
      500
    );
  }
});

// @desc    Confirm phone update
// @route   POST /api/v1/auth/confirm-phone-update
// @access  Private
export const confirmPhoneUpdate = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  // 1) Get user and check if OTP is valid
  const user = await Customer.findById(req.user.id);
  
  if (!user.newPhone || !user.phoneChangeOTP || !user.phoneChangeExpire) {
    return next(new AppError('No pending phone update request', 400));
  }

  if (user.phoneChangeExpire < Date.now()) {
    user.phoneChangeOTP = undefined;
    user.phoneChangeExpire = undefined;
    user.newPhone = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new AppError('OTP has expired. Please request a new one.', 400));
  }

  // 2) Verify OTP
  const isOTPValid = await user.correctOTP(otp, user.phoneChangeOTP);
  
  if (!isOTPValid) {
    return next(new AppError('Invalid OTP', 400));
  }

  // 3) Update phone and clear the OTP
  user.phone = user.newPhone;
  user.isPhoneVerified = true;
  user.phoneChangeOTP = undefined;
  user.phoneChangeExpire = undefined;
  user.newPhone = undefined;
  
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Phone number updated successfully',
    data: {
      user,
    },
  });
});

// @desc    Verify phone with OTP
// @route   POST /api/v1/auth/verify-phone
// @access  Private
export const verifyPhone = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  const user = await Customer.findById(req.user.id);

  // 1) Check if OTP exists and not expired
  if (!user.phoneVerificationOTP || !user.phoneVerificationExpire) {
    return next(new AppError('No pending verification request', 400));
  }

  if (user.phoneVerificationExpire < Date.now()) {
    user.phoneVerificationOTP = undefined;
    user.phoneVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new AppError('OTP has expired. Please request a new one.', 400));
  }

  // 2) Verify OTP
  const isOTPValid = await user.correctOTP(otp, user.phoneVerificationOTP);
  
  if (!isOTPValid) {
    return next(new AppError('Invalid OTP', 400));
  }

  // 3) Update user
  user.isPhoneVerified = true;
  user.phoneVerificationOTP = undefined;
  user.phoneVerificationExpire = undefined;
  
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Phone number verified successfully',
    data: {
      user,
    },
  });
});

// @desc    Resend phone verification OTP
// @route   POST /api/v1/auth/resend-phone-verification
// @access  Private
export const resendPhoneVerification = catchAsync(async (req, res, next) => {
  const user = await Customer.findById(req.user.id);

  if (user.isPhoneVerified) {
    return next(new AppError('Phone number is already verified', 400));
  }

  // Generate new OTP
  const otp = await user.createPhoneVerificationOTP();
  await user.save({ validateBeforeSave: false });

  // Send OTP
  try {
    await sendSMS({
      phone: user.phone,
      message: `Your verification code is: ${otp}. Valid for 10 minutes.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent successfully',
    });
  } catch (err) {
    user.phoneVerificationOTP = undefined;
    user.phoneVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the SMS. Try again later!'),
      500
    );
  }
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const user = await Customer.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// @desc    Delete my account
// @route   DELETE /api/v1/auth/deleteMe
// @access  Private
export const deleteMe = catchAsync(async (req, res, next) => {
  await Customer.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @desc    Google OAuth callback
// @route   GET /api/v1/auth/google/callback
// @access  Public
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/google/failure',
    session: false,
  })(req, res, next);
};

// @desc    Google OAuth success handler
// @route   GET /api/v1/auth/google/success
// @access  Private
export const googleAuthSuccess = catchAsync(async (req, res, next) => {
  // This function is called after successful Google OAuth authentication
  // The user is already authenticated by Passport and attached to req.user
  
  // Generate JWT token
  const token = signToken(req.user._id);
  
  // Set cookie
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  req.user.password = undefined;

  // Send response
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: req.user,
    },
  });
});

// @desc    Google OAuth failure handler
// @route   GET /api/v1/auth/google/failure
// @access  Public
export const googleAuthFailure = (req, res) => {
  res.status(401).json({
    status: 'error',
    message: 'Failed to authenticate with Google',
  });
};
