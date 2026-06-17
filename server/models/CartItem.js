const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity must be at least 1'],
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

// Ensure one cart item per product per user
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });
cartItemSchema.index({ userId: 1 });

module.exports = mongoose.model('CartItem', cartItemSchema);
