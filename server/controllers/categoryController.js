const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
const getAllCategories = async (req, res, next) => {
  try {
    const { limit } = req.query;
    let query = Category.find().sort({ name: 1 });
    if (limit) query = query.limit(parseInt(limit));

    const categories = await query;
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (admin)
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
