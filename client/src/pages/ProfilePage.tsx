import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Camera, Loader2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      fullName: fullName,
      phone,
    } as any);

    setLoading(false);

    if (result.error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }
  };

  const displayName = user.fullName || user.full_name || 'User';
  const displayAvatar = user.avatarUrl || user.avatar_url;
  const displayDate = user.createdAt || user.created_at || new Date().toISOString();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-emerald-100">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(displayDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
