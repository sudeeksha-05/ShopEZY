import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { productsApi } from '../lib/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProductCard } from '../components/products/ProductCard';
import toast from 'react-hot-toast';

// Normalize product for backward compat
function normalizeProduct(p: any): Product {
  return {
    ...p,
    discount_price: p.discountPrice ?? p.discount_price ?? null,
    discountPrice: p.discountPrice ?? p.discount_price ?? null,
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

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await productsApi.getById(id);
        if (res.data) {
          const normalized = normalizeProduct(res.data);
          setProduct(normalized);

          // Fetch related products
          const catId = normalized.categoryId || normalized.category_id;
          if (catId) {
            const relatedRes = await productsApi.getAll({
              categoryId: catId,
              limit: '4',
              exclude: id,
            });
            if (relatedRes.data) {
              setRelatedProducts(relatedRes.data.map(normalizeProduct));
            }
          }
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
    setSelectedImage(0);
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    addToCart(product!.id, quantity);
  };

  const discount = product?.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" className="mt-12" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mt-12">Product not found</h1>
          <p className="text-gray-500 mt-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="mt-6 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-700">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/products?category=${encodeURIComponent(product.category.name)}`}
                className="hover:text-gray-700"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-emerald-600' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {product.stock === 0 && (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  Out of Stock
                </span>
              )}

              {discount > 0 && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {discount}% OFF
                </span>
              )}

              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
              )}

              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.ratings)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">{product.ratings}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{product.reviews_count || product.reviewsCount || 0} reviews</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.discount_price || product.price}
                </span>
                {product.discount_price && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{product.stock} available</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="p-3 bg-emerald-50 rounded-full w-fit mx-auto mb-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                  <p className="text-xs text-gray-500">Over ₹500</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-emerald-50 rounded-full w-fit mx-auto mb-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Safe</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-emerald-50 rounded-full w-fit mx-auto mb-2">
                    <RotateCcw className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
