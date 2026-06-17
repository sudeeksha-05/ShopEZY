const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order' });
    }

    // Create the order
    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'confirmed',
    });

    // Update product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    await CartItem.deleteMany({ userId: req.user.id });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getUserOrders, getOrder };
