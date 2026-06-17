const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAdminConfig,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route to get landing banners / categories config
router.get('/config', getAdminConfig);

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
