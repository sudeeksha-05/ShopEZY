import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../lib/api';
import { Address } from '../types';
import toast from 'react-hot-toast';

export function CheckoutPage() {
  const { items, getCartTotal } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState<Omit<Address, 'id'>>({
    name: user?.fullName || user?.full_name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { subtotal, discount, total } = getCartTotal();
  const shippingCost = total >= 500 ? 0 : 50;
  const grandTotal = total + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      const value = shippingAddress[field as keyof typeof shippingAddress];
      if (!value || (typeof value === 'string' && !value.trim())) {
        toast.error(`Please fill in ${field.replace('_', ' ')}`);
        return false;
      }
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderProducts = items.map(item => ({
        productId: item.product_id || item.product.id,
        name: item.product.name,
        image: item.product.images[0] || '',
        price: item.product.discount_price || item.product.discountPrice || item.product.price,
        quantity: item.quantity,
      }));

      const res = await ordersApi.create({
        products: orderProducts,
        totalAmount: grandTotal,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      });

      if (res.data) {
        // Save address to profile if first address
        if (!user.addresses || user.addresses.length === 0) {
          await updateProfile({
            addresses: [{ ...shippingAddress, isDefault: true }] as any,
            phone: shippingAddress.phone,
          } as any);
        }

        setOrderId(res.data.id);
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-semibold text-gray-900">{orderId}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="10-digit number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    required
                    placeholder="6-digit code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    maxLength={6}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50' : ' hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <Banknote className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive the order</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors opacity-50 ${
                    paymentMethod === 'online' ? 'border-emerald-600 bg-emerald-50' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-4 h-4 text-emerald-600"
                    disabled
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Coming Soon</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order • ₹${grandTotal.toFixed(2)}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
