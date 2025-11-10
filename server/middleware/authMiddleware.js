import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Customer from '../models/customer.js';
import Worker from '../models/worker.js';
import Admin from '../models/admin.js';
import AppError from '../utils/appError.js';

// Create a promisified version of jwt.verify
const verifyJWT = promisify(jwt.verify);

/**
 * Middleware to protect routes that require authentication
 */
// Helper function to get token from request
const getTokenFromRequest = (req) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  return token;
};

// Middleware to authenticate users (both customers and workers)
export const authMiddleware = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    const token = getTokenFromRequest(req);
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    const decoded = await verifyJWT(token, process.env.JWT_SECRET);
    
    // 3) Determine user type and fetch user
    let currentUser;
    switch (decoded.role) {
      case 'customer':
        currentUser = await Customer.findById(decoded.id).select('+passwordChangedAt');
        break;
      case 'worker':
        currentUser = await Worker.findById(decoded.id).select('+passwordChangedAt');
        // Check if worker is approved
        if (currentUser && !currentUser.isApproved) {
          return next(
            new AppError('Your account is pending approval from admin.', 403)
          );
        }
        break;
      case 'admin':
        currentUser = await Admin.findById(decoded.id).select('+passwordChangedAt');
        break;
      default:
        return next(new AppError('Invalid user role', 401));
    }

    // 4) Check if user exists
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('You recently changed password! Please log in again.', 401)
      );
    }

    // 6) Check if account is active
    if (currentUser.isActive === false) {
      return next(
        new AppError('Your account has been deactivated. Please contact support.', 401)
      );
    }

    // 6) Check if email is verified
    if (!currentUser.isEmailVerified) {
      return next(
        new AppError('Please verify your email address to continue.', 401)
      );
    }

    // 7) GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    req.user.role = decoded.role; // Add role to request
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param  {...String} roles - Roles that are allowed to access the route
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Middleware to check if user is logged in (for views)
 */
export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await verifyJWT(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await Customer.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

/**
 * Middleware to check if email is verified
 */
export const emailVerified = async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return next(
      new AppError('Please verify your email address to continue.', 403)
    );
  }
  next();
};

/**
 * Middleware to check if phone is verified
 */
export const phoneVerified = async (req, res, next) => {
  if (!req.user.isPhoneVerified) {
    return next(
      new AppError('Please verify your phone number to continue.', 403)
    );
  }
  next();
};

/**
 * Generate JWT token
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Create and send JWT token in cookie
 * @param {Object} user - User object
 * @param {Number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  // Send JWT in cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  user.passwordChangedAt = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  user.phoneVerificationOTP = undefined;
  user.phoneVerificationExpire = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
