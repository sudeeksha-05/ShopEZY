const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    default: null,
    min: [0, 'Discount price cannot be negative'],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  brand: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: {
    virtuals: true,
  },
});

// Virtual for populated category
productSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for performance
productSchema.index({ categoryId: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
