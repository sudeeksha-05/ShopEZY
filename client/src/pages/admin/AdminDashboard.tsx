import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  user?: { full_name: string; email?: string } | null;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getStats();
        if (res.data) {
          setStats({
            totalUsers: res.data.totalUsers,
            totalProducts: res.data.totalProducts,
            totalOrders: res.data.totalOrders,
            totalRevenue: res.data.totalRevenue,
          });
          setRecentOrders(
            (res.data.recentOrders || []).map((o: any) => ({
              id: o.id,
              created_at: o.created_at || o.createdAt,
              total_amount: o.total_amount ?? o.totalAmount ?? 0,
              status: o.status,
              user: o.user,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12%',
      positive: true,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      change: '+5%',
      positive: true,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      change: '+18%',
      positive: true,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: IndianRupee,
      change: '+23%',
      positive: true,
      color: 'bg-indigo-500',
    },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                {card.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {card.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder - Integration required</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder - Integration required</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.user?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{order.total_amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
