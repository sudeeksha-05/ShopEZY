const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

module.exports = router;
