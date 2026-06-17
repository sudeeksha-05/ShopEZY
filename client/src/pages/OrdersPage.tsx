import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { ordersApi } from '../lib/api';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusSteps = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

// Normalize order fields for backward compat
function normalizeOrder(o: any): Order {
  return {
    ...o,
    created_at: o.createdAt || o.created_at,
    updated_at: o.updatedAt || o.updated_at,
    total_amount: o.totalAmount ?? o.total_amount ?? 0,
    payment_method: o.paymentMethod || o.payment_method || 'cod',
    shipping_address: o.shippingAddress || o.shipping_address || {},
    user_id: o.userId || o.user_id,
  };
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await ordersApi.getAll();
        if (res.data) {
          setOrders(res.data.map(normalizeOrder));
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProgressPercentage = (status: Order['status']) => {
    if (status === 'cancelled') return 0;
    const index = statusSteps.indexOf(status);
    return ((index + 1) / statusSteps.length) * 100;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View Your Orders</h1>
          <p className="text-gray-500 mb-6">Sign in to track and manage your orders</p>
          <Link
            to="/login"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-medium text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.created_at || order.createdAt || '')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold text-gray-900">₹{(order.total_amount ?? order.totalAmount ?? 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="font-medium text-gray-900">
                        {(order.payment_method || order.paymentMethod) === 'cod' ? 'Cash on Delivery' : 'Online'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== 'cancelled' && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        {statusSteps.map((step, index) => (
                          <span
                            key={step}
                            className={statusSteps.indexOf(order.status) >= index ? 'text-emerald-600 font-medium' : ''}
                          >
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </span>
                        ))}
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${getProgressPercentage(order.status)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                          <p className="font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {(order.shipping_address || order.shippingAddress) && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm font-medium text-gray-500 mb-1">Shipping Address</p>
                      <p className="text-gray-900">{(order.shipping_address || order.shippingAddress)?.name}</p>
                      <p className="text-gray-600 text-sm">
                        {(order.shipping_address || order.shippingAddress)?.address}, {(order.shipping_address || order.shippingAddress)?.city}, {(order.shipping_address || order.shippingAddress)?.state} - {(order.shipping_address || order.shippingAddress)?.pincode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
