import express from 'express';
import {
  registerWorker,
  verifyWorkerOTP,
  loginWorker,
  getWorkerProfile,
  updateWorkerProfile,
  getAssignedTasks,
  updateTaskStatus,
  markAttendance,
  getAttendance,
  getEarnings,
  updateWorkerPassword,
  requestPasswordReset,
  resetPassword,
  uploadProfileImage,
  uploadDocuments,
  updateLocation,
  updateAvailability,
  getTaskDetails,
  getWorkerDashboardStats,
  submitTaskReport,
  getPaymentHistory
} from '../controllers/workerController.js';
import { authMiddleware, restrictTo } from '../middleware/authMiddleware.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// ======================
// AUTHENTICATION ROUTES
// ======================
router.post('/register', registerWorker);
router.post('/verify-otp', verifyWorkerOTP);
router.post('/login', loginWorker);
router.post('/forgot-password', requestPasswordReset);
router.patch('/reset-password/:token', resetPassword);

// ======================
// PROTECTED ROUTES (Require Authentication)
// ======================
router.use(authMiddleware);

// ======================
// PROFILE ROUTES
// ======================
router
  .route('/profile')
  .get(getWorkerProfile)
  .patch(updateWorkerProfile);

router.patch('/update-password', updateWorkerPassword);

// ======================
// TASK ROUTES
// ======================
router.get('/tasks', getAssignedTasks);
router.get('/tasks/:taskId', getTaskDetails);
router.patch('/tasks/:taskId/status', updateTaskStatus);
router.post('/tasks/:taskId/report', submitTaskReport);

// ======================
// ATTENDANCE ROUTES
// ======================
router
  .route('/attendance')
  .post(markAttendance)
  .get(getAttendance);

// ======================
// EARNINGS & PAYMENT ROUTES
// ======================
router.get('/earnings', getEarnings);
router.get('/payment-history', getPaymentHistory);

// ======================
// SETTINGS & PREFERENCES
// ======================
router.patch('/update-location', updateLocation);
router.patch('/update-availability', updateAvailability);

// ======================
// UPLOAD ROUTES
// ======================
router.post('/upload-profile', upload.single('profile'), uploadProfileImage);
router.post('/upload-documents', upload.array('documents', 5), uploadDocuments);

// ======================
// DASHBOARD
// ======================
router.get('/dashboard/stats', getWorkerDashboardStats);

export default router;
