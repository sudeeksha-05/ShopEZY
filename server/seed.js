const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin configuration (banners)
    await Admin.create({
      bannerImages: [
        'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/60639/gift-heart-box-valentine-60639.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ]
    });
    console.log('🖼️  Admin config (banners) created');

    // Create admin user
    const admin = await User.create({
      fullName: 'ShopEEZZ Admin',
      email: 'admin@shopeezz.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });
    console.log('👤 Admin user created: admin@shopeezz.com / admin123');

    // Create regular user
    await User.create({
      fullName: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'user1234',
      role: 'customer',
      phone: '9876543211',
    });
    console.log('👤 Test user created: rahul@example.com / user1234');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        imageUrl: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Fashion',
        imageUrl: 'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Home & Kitchen',
        imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Books',
        imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        name: 'Sports',
        imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ]);
    console.log(`📁 ${categories.length} categories created`);

    const getCategoryId = (name) => categories.find((c) => c.name === name)._id;

    // Create products with shifted prices (~10%) and renamed brands/names
    const products = await Product.insertMany([
      // Electronics
      {
        name: 'StudioWave Wireless Bluetooth Headphones',
        description: 'High-fidelity noise-cancelling wireless headphones with 35-hour battery life. Featuring deep bass, crystal-clear treble, and comfortable over-ear cushions for extended listening sessions.',
        price: 5999,
        discountPrice: 4499,
        categoryId: getCategoryId('Electronics'),
        brand: 'SonicWave',
        images: [
          'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 40,
        ratings: 4.6,
        reviewsCount: 156,
      },
      {
        name: 'Horizon Smart Fitness Tracker',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor, sleep tracking, and waterproof design. Compatible with iOS and Android.',
        price: 12999,
        discountPrice: 10999,
        categoryId: getCategoryId('Electronics'),
        brand: 'HorizonBand',
        images: [
          'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 30,
        ratings: 4.4,
        reviewsCount: 92,
      },
      {
        name: 'EchoBeat Outdoor Bluetooth Speaker',
        description: 'Waterproof portable speaker with 360-degree sound, 24-hour battery life, and built-in microphone for hands-free calls.',
        price: 3499,
        discountPrice: null,
        categoryId: getCategoryId('Electronics'),
        brand: 'EchoBeat',
        images: [
          'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 75,
        ratings: 4.2,
        reviewsCount: 48,
      },
      {
        name: 'VoltMax USB-C Wall Charger 65W',
        description: 'Universal fast-charging USB-C laptop charger compatible with most laptops and devices. GaN technology for compact size.',
        price: 2199,
        discountPrice: 1799,
        categoryId: getCategoryId('Electronics'),
        brand: 'VoltMax',
        images: [
          'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 110,
        ratings: 4.7,
        reviewsCount: 184,
      },
      // Fashion
      {
        name: 'MetroWear Classic Leather Jacket',
        description: 'Genuine leather motorcycle jacket with quilted lining. Timeless design that pairs perfectly with any casual outfit.',
        price: 8999,
        discountPrice: 7199,
        categoryId: getCategoryId('Fashion'),
        brand: 'MetroWear',
        images: [
          'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 20,
        ratings: 4.8,
        reviewsCount: 54,
      },
      {
        name: 'SwiftPace Breathable Running Sneakers',
        description: 'Lightweight breathable running shoes with air cushion technology. Perfect for jogging, gym workouts, and daily wear.',
        price: 5499,
        discountPrice: 3999,
        categoryId: getCategoryId('Fashion'),
        brand: 'SwiftPace',
        images: [
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 50,
        ratings: 4.3,
        reviewsCount: 132,
      },
      {
        name: 'OptiStyle Designer Sunglasses UV400',
        description: 'Polarized UV400 sunglasses with anti-glare coating. Lightweight titanium frame for all-day comfort.',
        price: 2999,
        discountPrice: null,
        categoryId: getCategoryId('Fashion'),
        brand: 'OptiStyle',
        images: [
          'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 40,
        ratings: 4.1,
        reviewsCount: 31,
      },
      // Home & Kitchen
      {
        name: 'CafePro Stainless Steel Coffee Maker',
        description: 'Programmable 12-cup coffee maker with thermal carafe, auto-shutoff, and built-in grinder. Brew the perfect cup every morning.',
        price: 3999,
        discountPrice: 3199,
        categoryId: getCategoryId('Home & Kitchen'),
        brand: 'CafePro',
        images: [
          'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 35,
        ratings: 4.4,
        reviewsCount: 81,
      },
      {
        name: 'KitchenRoyal Non-Stick Cookware Set (10 Pcs)',
        description: 'Complete non-stick cookware set including frying pans, saucepans, and stockpot. Dishwasher safe with heat-resistant handles.',
        price: 6299,
        discountPrice: 4999,
        categoryId: getCategoryId('Home & Kitchen'),
        brand: 'KitchenRoyal',
        images: [
          'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 25,
        ratings: 4.5,
        reviewsCount: 62,
      },
      {
        name: 'GlowTech Smart LED Desk Lamp',
        description: 'Adjustable LED desk lamp with wireless charging base, 5 brightness levels, 3 color temperatures, and USB port.',
        price: 2699,
        discountPrice: null,
        categoryId: getCategoryId('Home & Kitchen'),
        brand: 'GlowTech',
        images: [
          'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 60,
        ratings: 4.2,
        reviewsCount: 36,
      },
      // Books
      {
        name: 'JavaScript: The Definitive Guide (8th Edition)',
        description: 'Comprehensive reference for JavaScript programmers. Covers ES6+, async/await, classes, modules, and modern development patterns.',
        price: 1299,
        discountPrice: 1099,
        categoryId: getCategoryId('Books'),
        brand: 'CodeCraft',
        images: [
          'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 90,
        ratings: 4.9,
        reviewsCount: 220,
      },
      {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'A classic book on writing clean, maintainable, and efficient code. Essential reading for every software developer.',
        price: 1099,
        discountPrice: null,
        categoryId: getCategoryId('Books'),
        brand: 'EduPress',
        images: [
          'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 80,
        ratings: 4.8,
        reviewsCount: 284,
      },
      // Sports
      {
        name: 'PranaFit Eco-Friendly Yoga Mat 6mm',
        description: 'Extra thick non-slip yoga mat with carrying strap. Perfect for yoga, pilates, and floor exercises. Eco-friendly material.',
        price: 899,
        discountPrice: 699,
        categoryId: getCategoryId('Sports'),
        brand: 'PranaFit',
        images: [
          'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 70,
        ratings: 4.5,
        reviewsCount: 88,
      },
      {
        name: 'SteelFit Adjustable Dumbbell Set 50lb',
        description: 'Space-saving adjustable dumbbell set from 5 to 50 lbs. Quick-change weight system with ergonomic handle.',
        price: 10999,
        discountPrice: 8999,
        categoryId: getCategoryId('Sports'),
        brand: 'SteelFit',
        images: [
          'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 15,
        ratings: 4.7,
        reviewsCount: 58,
      },
      {
        name: 'ElasticFit Premium Resistance Bands Set (5 Pack)',
        description: 'Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and carrying bag. Perfect for home workouts.',
        price: 799,
        discountPrice: null,
        categoryId: getCategoryId('Sports'),
        brand: 'ElasticFit',
        images: [
          'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        stock: 85,
        ratings: 4.3,
        reviewsCount: 47,
      },
    ]);
    console.log(`📦 ${products.length} products created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin login: admin@shopeezz.com / admin123');
    console.log('User login:  rahul@example.com / user1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
