import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router
  .route('/')
  .get(serviceController.getAllServices);

router
  .route('/:id')
  .get(serviceController.getService);

// Protected routes (admin only)
router.use(protect, restrictTo('admin'));

router
  .route('/')
  .post(serviceController.createService);

router
  .route('/:id')
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

router
  .route('/stats')
  .get(serviceController.getServiceStats);

// Public route for location-based services
router
  .route('/within/:distance/center/:latlng/unit/:unit')
  .get(serviceController.getServicesWithin);

export default router;
