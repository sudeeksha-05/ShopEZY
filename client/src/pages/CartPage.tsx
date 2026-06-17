import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export function CartPage() {
  const { items, loading, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { subtotal, discount, total } = getCartTotal();

  const handleQuantityChange = (itemId: string, newQuantity: number, productStock: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > productStock) {
      toast.error('Not enough stock');
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is waiting</h1>
          <p className="text-gray-500 mb-6">Sign in to view and manage your cart</p>
          <Link
            to="/login"
            state={{ from: { pathname: '/cart' } }}
            className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Cart</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                >
                  <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product_id}`}
                      className="font-medium text-gray-900 hover:text-emerald-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.brand && (
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product.stock)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-center min-w-[3rem]">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product.stock)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ₹{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                    </div>
                    {item.product.discount_price && (
                      <div className="text-sm text-gray-400 line-through">
                        ₹{item.product.price * item.quantity}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{total >= 500 ? 'Free' : '₹50.00'}</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{(total + (total >= 500 ? 0 : 50)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/products"
                  className="block text-center mt-4 text-emerald-600 hover:text-emerald-700 text-sm"
                >
                  Continue Shopping
                </Link>

                {total < 500 && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
                    Add ₹{(500 - total).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
