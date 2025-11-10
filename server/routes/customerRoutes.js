import express from 'express';
import { 
  registerCustomer, 
  verifyOTP, 
  loginCustomer, 
  getCustomerProfile, 
  updateCustomerProfile, 
  bookService, 
  getCustomerBookings, 
  cancelBooking, 
  addToWallet, 
  getWalletTransactions 
} from '../controllers/customerController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerCustomer);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginCustomer);

// Protected routes (require authentication)
router.use(protect);

router.route('/profile')
  .get(getCustomerProfile)
  .put(updateCustomerProfile);

router.route('/book-service')
  .post(bookService);

router.route('/bookings')
  .get(getCustomerBookings);

router.route('/bookings/:id/cancel')
  .put(cancelBooking);

router.route('/wallet/add')
  .post(addToWallet);

router.route('/wallet/transactions')
  .get(getWalletTransactions);

export default router;
