import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Percent, Truck, Shield, Headphones, Award } from 'lucide-react';
import { productsApi, categoriesApi, adminApi } from '../lib/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSpinner';

// Normalize product for backward compat
function normalizeProduct(p: any): Product {
  return {
    ...p,
    discount_price: p.discountPrice ?? p.discount_price ?? null,
    reviews_count: p.reviewsCount ?? p.reviews_count ?? 0,
    is_active: p.isActive ?? p.is_active ?? true,
    category_id: p.categoryId ?? p.category_id,
    images: p.images || [],
    category: p.category ? {
      ...p.category,
      image_url: p.category.imageUrl || p.category.image_url,
    } : undefined,
  };
}

const defaultHeroImages = [
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/60639/gift-heart-box-valentine-60639.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>(defaultHeroImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, featuredRes, dealsRes, configRes] = await Promise.all([
          categoriesApi.getAll({ limit: '5' }),
          productsApi.getAll({ sort: 'rating', limit: '8' }),
          productsApi.getAll({ deals: 'true', limit: '8' }),
          adminApi.getConfig().catch(() => ({ data: null })),
        ]);

        if (categoriesRes.data) {
          setCategories(categoriesRes.data.map((c: any) => ({
            ...c,
            image_url: c.imageUrl || c.image_url,
          })));
        }
        if (featuredRes.data) setFeaturedProducts(featuredRes.data.map(normalizeProduct));
        if (dealsRes.data) setDealsProducts(dealsRes.data.map(normalizeProduct));
        if (configRes && configRes.data && configRes.data.bannerImages) {
          setHeroImages(configRes.data.bannerImages);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹500' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: Headphones, title: '24/7 Support', desc: 'We are here to help' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-teal-900 to-gray-950 text-white overflow-hidden py-16 md:py-24">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-500/30">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Top Rated E-Commerce Platform
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black mb-4 leading-tight tracking-tight">
              Elevate Your Shopping <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                Experience Daily
              </span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Discover premium electronics, fashion, and home appliances with fast delivery, easy returns, and secure local payments across India.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
              >
                Shop the Catalog
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?deals=true"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 text-sm"
              >
                Explore Flash Deals
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-black text-emerald-400">15k+</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-0.5">Active Buyers</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">200+</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-0.5">Top Brands</p>
              </div>
              <div>
                <p className="text-2xl font-black text-teal-400">4.8★</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-0.5">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase (Card Slider) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm">
              {/* Decorative background glow */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 opacity-20 blur-xl"></div>
              
              {/* Product Showcase Card */}
              <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-800 mb-6 group">
                  <img
                    src={heroImages[0]}
                    alt="Featured Product Showcase"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 right-3 bg-amber-500 text-gray-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Hot Pick
                  </span>
                </div>
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">New Arrival</span>
                  <h3 className="text-xl font-bold text-white mt-1">StudioWave Headphones</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    Experience deep bass and crystal-clear vocals with 35-hour battery life.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-white">₹4,499</span>
                    <Link
                      to="/products"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Browse Categories</h2>
              <p className="text-gray-500 text-sm mt-1">Explore our curated collections</p>
            </div>
            <Link
              to="/products"
              className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 text-sm"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center shrink-0 group text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 group-hover:border-amber-500 transition-colors p-1 bg-white shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    {(category.image_url || category.imageUrl) && (
                      <img
                        src={category.image_url || category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
                <span className="mt-3 text-xs font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="relative rounded-2xl overflow-hidden bg-emerald-900 text-white p-8 flex flex-col justify-between h-64 shadow-md group">
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Promo Electronics"
                className="w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Limited Offer</span>
              <h3 className="text-2xl font-black mt-2">Next-Gen Electronics</h3>
              <p className="text-emerald-100 text-sm mt-1 max-w-xs">Upgrade your workspace with premium accessories up to 20% off.</p>
            </div>
            <div className="relative pt-4">
              <Link
                to="/products?category=Electronics"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Shop Electronics
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 text-white p-8 flex flex-col justify-between h-64 shadow-md group">
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Promo Fashion"
                className="w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Exclusive Styles</span>
              <h3 className="text-2xl font-black mt-2">Urban Fashion Trends</h3>
              <p className="text-gray-300 text-sm mt-1 max-w-xs">Look sharp and feel comfortable. Explore the summer collections.</p>
            </div>
            <div className="relative pt-4">
              <Link
                to="/products?category=Fashion"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Shop Fashion
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (Moved Up) */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending Now</h2>
                <p className="text-gray-500 text-sm mt-1">Most loved by our community</p>
              </div>
            </div>
            <Link
              to="/products?sort=rating"
              className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 text-sm"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Hot Deals (Moved Down) */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Percent className="w-8 h-8 text-amber-500" />
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Flash Deals</h2>
                <p className="text-gray-500 text-sm mt-1">Grab them before they are gone</p>
              </div>
            </div>
            <Link
              to="/products?deals=true"
              className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1 text-sm"
            >
              View All Deals
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : dealsProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Features Bar (Moved Down) */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(feature => (
              <div key={feature.title} className="flex items-center gap-4 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="p-3 bg-emerald-50 rounded-lg shrink-0">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Get updates on new arrivals, exclusive deals, and special offers
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
