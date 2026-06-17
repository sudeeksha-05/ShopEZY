import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import { Order } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Search, ChevronDown, Eye } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders();
      if (res.data) {
        setOrders(res.data);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
      toast.success('Order status updated');
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.user?.full_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{(order.shipping_address || order.shippingAddress)?.phone || ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.products?.length} items
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₹{(order.total_amount ?? order.totalAmount ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Update Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedOrder.id, status as Order['status'])}
                      className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.user?.full_name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">{(selectedOrder.shipping_address || selectedOrder.shippingAddress)?.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment</h3>
                  <p className="font-medium text-gray-900 capitalize">
                    {(selectedOrder.payment_method || selectedOrder.paymentMethod) === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedOrder.created_at || selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{(selectedOrder.shipping_address || selectedOrder.shippingAddress)?.name}</p>
                  <p className="text-sm text-gray-600">{(selectedOrder.shipping_address || selectedOrder.shippingAddress)?.address}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedOrder.shipping_address || selectedOrder.shippingAddress)?.city}, {(selectedOrder.shipping_address || selectedOrder.shippingAddress)?.state} - {(selectedOrder.shipping_address || selectedOrder.shippingAddress)?.pincode}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Products</h3>
                <div className="space-y-3">
                  {selectedOrder.products?.map((product: any, index: number) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                        {product.image && (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">₹{product.price?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{(selectedOrder.total_amount ?? selectedOrder.totalAmount ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
