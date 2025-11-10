import Worker from '../models/worker.js';
import { signToken } from '../middleware/authMiddleware.js';
import AppError from '../utils/appError.js';
import { sendOTPEmail } from '../utils/gmailService.js';
import crypto from 'crypto';

// @desc    Register a new worker
// @route   POST /api/workers/register
// @access  Public
export const registerWorker = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, skills, gender, dob } = req.body;

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingWorker) {
      return next(new AppError('Worker with this email or phone already exists', 400));
    }

    // Create new worker
    const worker = await Worker.create({
      fullName,
      email,
      phone,
      password,
      skills,
      gender,
      dob,
      isApproved: false, // Admin approval required
      status: 'inactive'
    });

    // Generate and save OTP
    const otp = worker.createOTP();
    await worker.save({ validateBeforeSave: false });

    // Send OTP via email
    try {
      await sendOTPEmail({
        email: worker.email,
        subject: 'Verify Your Email - SwachhCare Worker',
        otp
      });
    } catch (err) {
      console.error('Error sending OTP email:', err);
      return next(new AppError('There was an error sending the OTP. Please try again later.', 500));
    }

    // Create token
    const token = signToken(worker._id);

    res.status(201).json({
      status: 'success',
      message: 'Worker registered successfully. Please verify your email.',
      token,
      data: {
        worker: {
          id: worker._id,
          fullName: worker.fullName,
          email: worker.email,
          phone: worker.phone,
          isApproved: worker.isApproved,
          status: worker.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify worker OTP
// @route   POST /api/workers/verify-otp
// @access  Private
export const verifyWorkerOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const worker = await Worker.findById(req.user.id);

    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Check if OTP is valid
    if (!worker.verifyOTP(otp)) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    // Update worker status
    worker.isEmailVerified = true;
    worker.otp = undefined;
    await worker.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. Waiting for admin approval.',
      data: {
        worker: {
          id: worker._id,
          email: worker.email,
          isEmailVerified: worker.isEmailVerified,
          isApproved: worker.isApproved
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login worker
// @route   POST /api/workers/login
// @access  Public
export const loginWorker = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if worker exists && password is correct
    const worker = await Worker.findOne({ email }).select('+password');

    if (!worker || !(await worker.correctPassword(password, worker.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if worker is approved
    if (!worker.isApproved) {
      return next(new AppError('Your account is pending approval from admin', 403));
    }

    // 4) Check if worker is active
    if (worker.status !== 'active') {
      return next(new AppError('Your account is not active. Please contact support.', 403));
    }

    // 5) If everything ok, send token to client
    const token = signToken(worker._id);

    // 6) Update last login
    worker.lastLogin = Date.now();
    await worker.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        worker: {
          id: worker._id,
          fullName: worker.fullName,
          email: worker.email,
          phone: worker.phone,
          isApproved: worker.isApproved,
          status: worker.status,
          profilePic: worker.profilePic,
          skills: worker.skills
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker profile
// @route   GET /api/workers/me
// @access  Private
export const getWorkerProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id)
      .select('-password -otp -__v');

    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        worker
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker profile
// @route   PATCH /api/workers/me
// @access  Private
export const updateWorkerProfile = async (req, res, next) => {
  try {
    const { fullName, phone, gender, dob, address, skills } = req.body;
    
    // 1) Get worker
    const worker = await Worker.findById(req.user.id);
    
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }
    
    // 2) Update fields
    if (fullName) worker.fullName = fullName;
    if (phone) worker.phone = phone;
    if (gender) worker.gender = gender;
    if (dob) worker.dob = dob;
    if (address) worker.address = { ...worker.address, ...address };
    if (skills) worker.skills = skills;
    
    // 3) Save updated worker
    const updatedWorker = await worker.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        worker: updatedWorker
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned tasks
// @route   GET /api/workers/tasks
// @access  Private
export const getAssignedTasks = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id)
      .select('assignedTasks')
      .populate('assignedTasks.customerId', 'fullName email phone');
    
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      results: worker.assignedTasks.length,
      data: {
        tasks: worker.assignedTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/workers/tasks/:taskId
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const { taskId } = req.params;
    
    // 1) Find worker and task
    const worker = await Worker.findOne({
      _id: req.user.id,
      'assignedTasks._id': taskId
    });
    
    if (!worker) {
      return next(new AppError('Task not found', 404));
    }
    
    // 2) Update task status
    const task = worker.assignedTasks.id(taskId);
    task.status = status;
    if (notes) task.notes = notes;
    
    // 3) If task is completed, update completion time
    if (status === 'completed') {
      task.completedAt = Date.now();
    }
    
    await worker.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Task status updated successfully',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark attendance
// @route   POST /api/workers/attendance
// @access  Private
export const markAttendance = async (req, res, next) => {
  try {
    const { checkIn, checkOut, status, notes } = req.body;
    
    // 1) Find worker
    const worker = await Worker.findById(req.user.id);
    
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }
    
    // 2) Check if attendance already marked for today
    const today = new Date().toISOString().split('T')[0];
    const existingAttendance = worker.attendance.find(
      a => a.date.toISOString().split('T')[0] === today
    );
    
    if (existingAttendance) {
      // Update existing attendance
      if (checkIn) existingAttendance.checkIn = checkIn;
      if (checkOut) existingAttendance.checkOut = checkOut;
      if (status) existingAttendance.status = status;
      if (notes) existingAttendance.notes = notes;
    } else {
      // Add new attendance
      worker.attendance.push({
        date: new Date(),
        checkIn,
        checkOut,
        status: status || 'present',
        notes
      });
    }
    
    await worker.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Attendance marked successfully',
      data: {
        attendance: existingAttendance || worker.attendance[worker.attendance.length - 1]
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance
// @route   GET /api/workers/attendance
// @access  Private


// @desc    Request password reset
// @route   POST /api/workers/forgot-password
// @access  Public
export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1) Get worker based on POSTed email
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return next(new AppError('No worker found with that email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = worker.createPasswordResetToken();
    await worker.save({ validateBeforeSave: false });

    // 3) Send it to worker's email
    try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/workers/reset-password/${resetToken}`;
      
      // In a real app, you would send an email with the reset URL
      // For now, we'll just log it to the console
      console.log(`Password reset token: ${resetToken}\nReset URL: ${resetURL}`);

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
        // In production, don't send the token in the response
        // This is just for development/testing
        token: resetToken
      });
    } catch (err) {
      worker.passwordResetToken = undefined;
      worker.passwordResetExpires = undefined;
      await worker.save({ validateBeforeSave: false });

      return next(
        new AppError('There was an error sending the email. Try again later!', 500)
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PATCH /api/workers/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // 1) Get worker based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const worker = await Worker.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is worker, set the new password
    if (!worker) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    // 3) Update changedPasswordAt property for the worker
    worker.password = req.body.password;
    worker.passwordResetToken = undefined;
    worker.passwordResetExpires = undefined;
    worker.passwordChangedAt = Date.now();
    await worker.save();

    // 4) Log the worker in, send JWT
    const token = signToken(worker._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        worker: {
          id: worker._id,
          fullName: worker.fullName,
          email: worker.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password (for logged-in workers)
// @route   PATCH /api/workers/update-password
// @access  Private
export const updateWorkerPassword = async (req, res, next) => {
  try {
    // 1) Get worker from collection
    const worker = await Worker.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await worker.correctPassword(req.body.currentPassword))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    worker.password = req.body.newPassword;
    worker.passwordConfirm = req.body.newPasswordConfirm;
    await worker.save();

    // 4) Log worker in, send JWT
    const token = signToken(worker._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        worker: {
          id: worker._id,
          fullName: worker.fullName,
          email: worker.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile image
// @route   POST /api/workers/upload-profile
// @access  Private
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image file', 400));
    }

    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Update profile picture URL (assuming the file is uploaded to a CDN or cloud storage)
    // In a real app, you would upload to S3, Cloudinary, etc.
    worker.profilePic = req.file.path;
    await worker.save();

    res.status(200).json({
      status: 'success',
      data: {
        profilePic: worker.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload documents
// @route   POST /api/workers/upload-documents
// @access  Private
export const uploadDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('Please upload at least one document', 400));
    }

    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Add new documents to the worker's documents array
    const newDocuments = req.files.map(file => ({
      name: file.originalname,
      url: file.path,
      type: 'document',
      uploadedAt: Date.now()
    }));

    worker.documents.push(...newDocuments);
    await worker.save();

    res.status(200).json({
      status: 'success',
      data: {
        documents: worker.documents
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker location
// @route   PATCH /api/workers/update-location
// @access  Private
export const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (!latitude || !longitude) {
      return next(new AppError('Please provide latitude and longitude', 400));
    }

    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Update location
    worker.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      address: address || worker.location?.address
    };

    await worker.save();

    res.status(200).json({
      status: 'success',
      data: {
        location: worker.location
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker availability
// @route   PATCH /api/workers/update-availability
// @access  Private
export const updateAvailability = async (req, res, next) => {
  try {
    const { isAvailable, availableFrom, availableTo } = req.body;

    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Update availability
    if (typeof isAvailable !== 'undefined') {
      worker.isAvailable = isAvailable;
    }
    
    if (availableFrom) {
      worker.availableFrom = availableFrom;
    }
    
    if (availableTo) {
      worker.availableTo = availableTo;
    }

    await worker.save();

    res.status(200).json({
      status: 'success',
      data: {
        isAvailable: worker.isAvailable,
        availableFrom: worker.availableFrom,
        availableTo: worker.availableTo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit task report
// @route   POST /api/workers/tasks/:taskId/report
// @access  Private
export const submitTaskReport = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { report, completedAt } = req.body;

    if (!report) {
      return next(new AppError('Please provide a task report', 400));
    }

    // Find the worker and the specific task
    const worker = await Worker.findOne({
      _id: req.user.id,
      'assignedTasks._id': taskId
    });

    if (!worker) {
      return next(new AppError('Task not found or not assigned to this worker', 404));
    }

    // Update task with report and completion time
    const task = worker.assignedTasks.id(taskId);
    task.report = report;
    task.completedAt = completedAt || Date.now();
    task.status = 'completed';

    await worker.save();

    res.status(200).json({
      status: 'success',
      data: {
        task: {
          id: task._id,
          status: task.status,
          completedAt: task.completedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // 1) Find worker
    const worker = await Worker.findById(req.user.id).select('attendance');
    
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }
    
    // 2) Filter attendance by date range if provided
    let attendance = worker.attendance;
    
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      attendance = attendance.filter(a => {
        const date = new Date(a.date);
        return date >= start && date <= end;
      });
    }
    
    // 3) Sort by date (newest first)
    attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.status(200).json({
      status: 'success',
      results: attendance.length,
      data: {
        attendance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get earnings
// @route   GET /api/workers/earnings
// @access  Private
export const getEarnings = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id).select('earnings');
    
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        earnings: worker.earnings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/workers/payment-history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id)
      .select('paymentHistory')
      .populate('paymentHistory.task', 'taskId serviceType amount status');
    
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Sort payments by date (newest first)
    const sortedPayments = worker.paymentHistory.sort(
      (a, b) => b.paymentDate - a.paymentDate
    );

    res.status(200).json({
      status: 'success',
      results: sortedPayments.length,
      data: {
        payments: sortedPayments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker dashboard statistics
// @route   GET /api/workers/dashboard
// @access  Private
export const getWorkerDashboardStats = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id)
      .select('assignedTasks attendance earnings rating')
      .populate({
        path: 'assignedTasks',
        select: 'status scheduledDate customerId serviceType',
        options: { sort: { scheduledDate: -1 }, limit: 5 },
        populate: {
          path: 'customerId',
          select: 'fullName profilePic'
        }
      });

    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Calculate task statistics
    const totalTasks = worker.assignedTasks.length;
    const completedTasks = worker.assignedTasks.filter(
      task => task.status === 'completed'
    ).length;
    const pendingTasks = worker.assignedTasks.filter(
      task => task.status === 'pending' || task.status === 'in-progress'
    ).length;
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // Calculate monthly earnings
    const currentMonth = new Date().getMonth();
    const monthlyEarnings = worker.earnings
      .filter(earning => new Date(earning.date).getMonth() === currentMonth)
      .reduce((sum, earning) => sum + earning.amount, 0);

    // Get recent attendance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAttendance = worker.attendance
      .filter(a => a.date >= sevenDaysAgo)
      .sort((a, b) => b.date - a.date)
      .slice(0, 7);

    // Prepare response
    const dashboardStats = {
      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        monthlyEarnings,
        averageRating: worker.rating?.average || 0,
        totalRatings: worker.rating?.count || 0
      },
      recentTasks: worker.assignedTasks,
      recentAttendance,
      upcomingSchedule: worker.assignedTasks
        .filter(task => new Date(task.scheduledDate) > new Date())
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, 3)
    };

    res.status(200).json({
      status: 'success',
      data: dashboardStats
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get task details
// @route   GET /api/workers/tasks/:taskId
// @access  Private
export const getTaskDetails = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    // Find the worker and the specific task
    const worker = await Worker.findOne(
      { 
        _id: req.user.id,
        'tasks.task': taskId 
      },
      { 'tasks.$': 1 }
    )
    .populate('tasks.task', [
      'taskId',
      'serviceType',
      'status',
      'scheduledDate',
      'duration',
      'location',
      'specialInstructions',
      'customer',
      'amount',
      'paymentStatus'
    ])
    .populate('tasks.task.customer', 'name email phone');

    if (!worker || !worker.tasks || worker.tasks.length === 0) {
      return next(new AppError('Task not found or not assigned to this worker', 404));
    }

    const taskDetails = worker.tasks[0].task;
    
    // Add additional task-specific data if needed
    const responseData = {
      ...taskDetails.toObject(),
      assignedDate: worker.tasks[0].assignedDate,
      status: worker.tasks[0].status
    };

    res.status(200).json({
      status: 'success',
      data: {
        task: responseData
      }
    });
  } catch (error) {
    next(error);
  }
};
