const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.find({ userId: req.user.id })
      .populate({
        path: 'productId',
        populate: { path: 'category' },
      });

    // Transform to match frontend expected shape
    const cartItems = items.map((item) => ({
      id: item._id,
      user_id: item.userId,
      product_id: item.productId._id,
      product: item.productId,
      quantity: item.quantity,
      created_at: item.createdAt,
    }));

    res.json({ success: true, data: cartItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is active
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      userId: req.user.id,
      productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        userId: req.user.id,
        productId,
        quantity,
      });
    }

    // Return updated cart
    const items = await CartItem.find({ userId: req.user.id })
      .populate({
        path: 'productId',
        populate: { path: 'category' },
      });

    const cartItems = items.map((item) => ({
      id: item._id,
      user_id: item.userId,
      product_id: item.productId._id,
      product: item.productId,
      quantity: item.quantity,
      created_at: item.createdAt,
    }));

    res.status(201).json({ success: true, data: cartItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      // Remove item if quantity is 0
      await CartItem.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });
    } else {
      await CartItem.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { quantity },
        { new: true }
      );
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
const removeCartItem = async (req, res, next) => {
  try {
    const item = await CartItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
