const Product = require('../models/Product');

// @desc    Get all products (with filtering, sorting, search)
// @route   GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      categoryId,
      sort,
      minPrice,
      maxPrice,
      deals,
      limit,
      page = 1,
      exclude,
    } = req.query;

    const filter = { isActive: true };

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category ID
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Deals only (has discount)
    if (deals === 'true') {
      filter.discountPrice = { $ne: null };
    }

    // Exclude specific product
    if (exclude) {
      filter._id = { $ne: exclude };
    }

    // Build sort
    let sortObj = { createdAt: -1 }; // default: newest
    switch (sort) {
      case 'price-low':
        sortObj = { price: 1 };
        break;
      case 'price-high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { ratings: -1 };
        break;
      case 'discount':
        sortObj = { discountPrice: -1 };
        break;
    }

    let query = Product.find(filter)
      .populate('category')
      .sort(sortObj);

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    // After executing find, if category name filter is provided, do a post-filter
    let products = await query;

    // Filter by category name (from URL param)
    if (category && !categoryId) {
      products = products.filter(
        (p) => p.category && p.category.name === category
      );
    }

    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    const populated = await Product.findById(product._id).populate('category');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (soft delete — admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct };
