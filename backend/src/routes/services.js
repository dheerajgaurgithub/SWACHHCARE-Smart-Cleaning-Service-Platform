const express = require('express');
const serviceController = require('../controllers/serviceController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getServiceCategories);
router.get('/featured', serviceController.getFeaturedServices);
router.get('/popular', serviceController.getPopularServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getService);

// Protected routes (require authentication)
router.use(authController.protect);

// Admin-only routes
router.use(authController.restrictTo('admin'));

router.post('/', serviceController.createService);
router
  .route('/:id')
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

router.patch('/:id/toggle-status', serviceController.toggleServiceStatus);
router.get('/stats/service-stats', serviceController.getServiceStats);

module.exports = router;
