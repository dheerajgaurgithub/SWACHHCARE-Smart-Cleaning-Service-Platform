import express from 'express';
import {
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  getAllWorkers,
  updateWorkerStatus,
  getWorkerDetails,
  getDashboardStats,
  getEarningsReport,
  getWorkerPerformance,
  processPayments,
  getPaymentHistory,
  getSystemSettings,
  updateSystemSettings
} from '../controllers/adminController.js';
import { authMiddleware, restrictTo } from '../middleware/authMiddleware.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware);
router.use(restrictTo('admin'));

// ======================
// WORKER MANAGEMENT ROUTES
// ======================
router.get('/workers/pending', getPendingWorkers);
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorkerDetails);
router.patch('/workers/:id/approve', approveWorker);
router.patch('/workers/:id/reject', rejectWorker);
router.patch('/workers/:id/status', updateWorkerStatus);

// ======================
// DASHBOARD & REPORTS
// ======================
router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/earnings', getEarningsReport);
router.get('/reports/worker-performance', getWorkerPerformance);

// ======================
// PAYMENT MANAGEMENT
// ======================
router.post('/payments/process', processPayments);
router.get('/payments/history', getPaymentHistory);

// ======================
// SYSTEM SETTINGS
// ======================
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);

export default router;
