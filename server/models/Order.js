const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: true });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: 'Order must contain at least one product',
    },
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: [true, 'Shipping address is required'],
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
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

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
