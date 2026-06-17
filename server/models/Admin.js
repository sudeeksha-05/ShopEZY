const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  bannerImages: {
    type: [String],
    required: true,
    default: [
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/60639/gift-heart-box-valentine-60639.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ]
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Admin', adminSchema);
