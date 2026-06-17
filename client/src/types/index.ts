export interface User {
  id: string;
  email?: string;
  fullName?: string;
  full_name?: string; // alias for backward compat
  phone?: string;
  avatarUrl?: string;
  avatar_url?: string; // alias for backward compat
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt?: string;
  created_at?: string; // alias for backward compat
}

export interface Address {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  image_url?: string; // alias for backward compat
  createdAt?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  discount_price?: number | null; // alias for backward compat
  categoryId?: string;
  category_id?: string; // alias for backward compat
  category?: Category;
  brand?: string;
  images: string[];
  stock: number;
  ratings: number;
  reviewsCount?: number;
  reviews_count?: number; // alias for backward compat
  isActive?: boolean;
  is_active?: boolean; // alias for backward compat
  createdAt?: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  quantity: number;
  created_at: string;
}

export interface OrderProduct {
  productId?: string;
  product_id?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  user_id?: string;
  products: OrderProduct[];
  totalAmount?: number;
  total_amount?: number;
  shippingAddress?: Address;
  shipping_address?: Address;
  paymentMethod?: 'cod' | 'online';
  payment_method?: 'cod' | 'online';
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => { subtotal: number; discount: number; total: number };
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'discount';
