import Admin from "../models/Admin.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createSendToken } from '../middleware/authMiddleware.js';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if admin exists && password is correct
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/admin/me
// @access  Private/Admin
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        admin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin password
// @route   PATCH /api/admin/update-password
// @access  Private/Admin
export const updatePassword = async (req, res, next) => {
  try {
    // 1) Get admin from collection
    const admin = await Admin.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await admin.correctPassword(req.body.currentPassword, admin.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    admin.password = req.body.newPassword;
    admin.passwordConfirm = req.body.newPasswordConfirm;
    await admin.save();

    // 4) Log admin in, send JWT
    createSendToken(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin (for super admin only)
// @route   POST /api/admin/create-admin
// @access  Private/SuperAdmin
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      passwordConfirm
    });

    // Remove password from output
    newAdmin.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        admin: newAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};
