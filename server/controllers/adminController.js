import Worker from '../models/worker.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

// @desc    Get all pending worker applications
// @route   GET /api/admin/workers/pending
// @access  Private/Admin
export const getPendingWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find({ 
      isApproved: false,
      status: { $ne: 'rejected' }
    }).select('-password -otp');

    res.status(200).json({
      status: 'success',
      results: workers.length,
      data: {
        workers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve worker application
// @route   PATCH /api/admin/workers/:id/approve
// @access  Private/Admin
export const approveWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { 
        isApproved: true,
        status: 'active',
        approvedAt: Date.now(),
        approvedBy: req.user.id
      },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return next(new AppError('No worker found with that ID', 404));
    }

    // Send approval email
    try {
      const email = new Email({
        email: worker.email,
        name: worker.fullName
      });
      
      await email.send(
        'workerApproval',
        'Your Worker Application Has Been Approved!',
        {
          name: worker.fullName,
          message: 'We are pleased to inform you that your worker application has been approved.\n\nYou can now log in to your account and start accepting jobs.'
        }
      );
    } catch (err) {
      console.error('Error sending approval email:', err);
      // Don't send error to client, just log it
    }

    res.status(200).json({
      status: 'success',
      message: 'Worker approved successfully',
      data: {
        worker
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject worker application
// @route   PATCH /api/admin/workers/:id/reject
// @access  Private/Admin
export const rejectWorker = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return next(new AppError('Please provide a reason for rejection', 400));
    }

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { 
        isApproved: false,
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: Date.now(),
        rejectedBy: req.user.id
      },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return next(new AppError('No worker found with that ID', 404));
    }

    // Send rejection email
    try {
      const email = new Email({
        email: worker.email,
        name: worker.fullName
      });
      
      await email.send(
        'workerRejection',
        'Update on Your Worker Application',
        {
          name: worker.fullName,
          reason: reason,
          message: 'We regret to inform you that your worker application has been rejected.\n\nIf you believe this is a mistake, please contact our support team.'
        }
      );
    } catch (err) {
      console.error('Error sending rejection email:', err);
      // Don't send error to client, just log it
    }

    res.status(200).json({
      status: 'success',
      message: 'Worker application rejected',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workers
// @route   GET /api/admin/workers
// @access  Private/Admin
export const getAllWorkers = async (req, res, next) => {
  try {
    const { status, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    
    // Execute query
    const workers = await Worker.find(query)
      .select('-password -otp')
      .sort(sort || '-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Get total count for pagination
    const total = await Worker.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: workers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        workers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker status (active/inactive/suspended)
// @route   PATCH /api/admin/workers/:id/status
// @access  Private/Admin
export const updateWorkerStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }
    
    if (status === 'suspended' && !reason) {
      return next(new AppError('Please provide a reason for suspension', 400));
    }

    const updateData = { status };
    if (status === 'suspended') {
      updateData.suspensionReason = reason;
      updateData.suspendedAt = Date.now();
      updateData.suspendedBy = req.user.id;
    }

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!worker) {
      return next(new AppError('No worker found with that ID', 404));
    }

    // Send status update email
    try {
      let message = `Dear ${worker.fullName},\n\nYour account status has been updated to: ${status}.`;
      
      if (status === 'suspended' && reason) {
        message += `\n\nReason: ${reason}`;
      }
      
      message += '\n\nIf you have any questions, please contact our support team.';

      const email = new Email({
        email: worker.email,
        name: worker.fullName
      });
      
      await email.send(
        'accountStatusUpdate',
        `Account Status Update: ${status}`,
        {
          name: worker.fullName,
          status: status,
          message: message
        }
      );
    } catch (err) {
      console.error('Error sending status update email:', err);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      status: 'success',
      message: `Worker status updated to ${status}`,
      data: {
        worker
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker details
// @route   GET /api/admin/workers/:id
// @access  Private/Admin
export const getWorkerDetails = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .select('-password -otp -passwordResetToken -passwordResetExpires');

    if (!worker) {
      return next(new AppError('No worker found with that ID', 404));
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

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const activeWorkers = await Worker.countDocuments({ status: 'active' });
    const pendingWorkers = await Worker.countDocuments({ status: 'pending' });
    const suspendedWorkers = await Worker.countDocuments({ status: 'suspended' });

    // You can add more statistics as needed
    const stats = {
      totalWorkers,
      activeWorkers,
      pendingWorkers,
      suspendedWorkers,
      // Add more stats here
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get earnings report
// @route   GET /api/admin/reports/earnings
// @access  Private/Admin
export const getEarningsReport = async (req, res, next) => {
  try {
    // Implement your earnings report logic here
    // This is a placeholder - adjust according to your payment/earnings model
    const earningsReport = {
      totalEarnings: 0,
      thisMonth: 0,
      lastMonth: 0,
      byService: []
    };

    res.status(200).json({
      status: 'success',
      data: {
        report: earningsReport
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker performance metrics
// @route   GET /api/admin/reports/worker-performance
// @access  Private/Admin
export const getWorkerPerformance = async (req, res, next) => {
  try {
    // Implement worker performance metrics
    // This is a placeholder - adjust according to your performance metrics
    const performanceMetrics = [];

    res.status(200).json({
      status: 'success',
      results: performanceMetrics.length,
      data: {
        performance: performanceMetrics
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payments
// @route   POST /api/admin/payments/process
// @access  Private/Admin
export const processPayments = async (req, res, next) => {
  try {
    // Implement payment processing logic
    // This is a placeholder - implement according to your payment processor
    res.status(200).json({
      status: 'success',
      message: 'Payments processed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/admin/payments/history
// @access  Private/Admin
export const getPaymentHistory = async (req, res, next) => {
  try {
    // Implement payment history retrieval
    // This is a placeholder - adjust according to your payment model
    const paymentHistory = [];

    res.status(200).json({
      status: 'success',
      results: paymentHistory.length,
      data: {
        payments: paymentHistory
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res, next) => {
  try {
    // Implement system settings retrieval
    // This is a placeholder - adjust according to your settings model
    const settings = {
      appName: 'SWACHHCARE',
      currency: 'INR',
      // Add more settings as needed
    };

    res.status(200).json({
      status: 'success',
      data: {
        settings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PATCH /api/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res, next) => {
  try {
    // Implement settings update logic
    // This is a placeholder - implement according to your settings model
    const updatedSettings = req.body;

    res.status(200).json({
      status: 'success',
      data: {
        settings: updatedSettings
      }
    });
  } catch (error) {
    next(error);
  }
};
