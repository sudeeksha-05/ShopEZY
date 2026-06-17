import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  LogIn,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Logo } from '../common/Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/products?category=Electronics', label: 'Electronics' },
    { href: '/products?category=Fashion', label: 'Fashion' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Mini-Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>📞 Support: 1800-BZR-EXPR</span>
            <span className="hidden sm:inline text-emerald-800">|</span>
            <span className="hidden sm:inline">🇮🇳 India</span>
          </div>
          <div className="text-center sm:text-right font-medium">
            🚚 Free shipping on orders over ₹500!
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <Logo size="md" variant="dark" />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.href ||
                    (link.href !== '/' && location.pathname.startsWith('/products'))
                      ? 'text-emerald-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || ''}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium">
                          {(user.full_name || user.email || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            <div className="space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
