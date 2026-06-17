import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import { User } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Search } from 'lucide-react';

// Normalize user fields
function normalizeUser(u: any): User {
  return {
    ...u,
    full_name: u.fullName || u.full_name,
    fullName: u.fullName || u.full_name,
    avatar_url: u.avatarUrl || u.avatar_url,
    avatarUrl: u.avatarUrl || u.avatar_url,
    created_at: u.createdAt || u.created_at,
    addresses: u.addresses || [],
  };
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      if (res.data) {
        setUsers(res.data.map(normalizeUser));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user =>
    (user.full_name || user.fullName)?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {(user.avatar_url || user.avatarUrl) ? (
                            <img
                              src={user.avatar_url || user.avatarUrl}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">
                                {getUserInitials(user.full_name || user.fullName)}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{user.full_name || user.fullName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at || user.createdAt || '').toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-medium text-gray-900 mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'customer').length}
            </p>
            <p className="text-sm text-gray-500">Customers</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'admin').length}
            </p>
            <p className="text-sm text-gray-500">Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
