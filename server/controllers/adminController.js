const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.find(),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Recent orders with user info
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email');

    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      created_at: order.createdAt,
      total_amount: order.totalAmount,
      status: order.status,
      user: order.userId
        ? { full_name: order.userId.fullName, email: order.userId.email }
        : null,
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders: formattedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { limit } = req.query;
    let query = Order.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    if (limit) query = query.limit(parseInt(limit));

    const orders = await query;

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      user_id: order.userId?._id,
      products: order.products,
      total_amount: order.totalAmount,
      shipping_address: order.shippingAddress,
      payment_method: order.paymentMethod,
      status: order.status,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      user: order.userId
        ? { full_name: order.userId.fullName, email: order.userId.email }
        : null,
    }));

    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const Admin = require('../models/Admin');

// @desc    Get admin config (public)
// @route   GET /api/admin/config
const getAdminConfig = async (req, res, next) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = {
        bannerImages: [
          'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/60639/gift-heart-box-valentine-60639.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=1200'
        ]
      };
    }
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllUsers, getAllOrders, updateOrderStatus, getAdminConfig };
