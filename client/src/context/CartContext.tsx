import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem, CartState } from '../types';
import { cartApi } from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext<CartState | undefined>(undefined);

// Normalize product fields for backward compatibility
function normalizeCartItems(items: any[]): CartItem[] {
  return items.map((item) => ({
    id: item.id || item._id,
    user_id: item.user_id || item.userId,
    product_id: item.product_id || item.productId,
    product: {
      ...item.product,
      id: item.product?.id || item.product?._id,
      discount_price: item.product?.discountPrice ?? item.product?.discount_price ?? null,
      discountPrice: item.product?.discountPrice ?? item.product?.discount_price ?? null,
      reviews_count: item.product?.reviewsCount ?? item.product?.reviews_count ?? 0,
      reviewsCount: item.product?.reviewsCount ?? item.product?.reviews_count ?? 0,
      is_active: item.product?.isActive ?? item.product?.is_active ?? true,
      images: item.product?.images || [],
      category: item.product?.category ? {
        ...item.product.category,
        id: item.product.category.id || item.product.category._id,
        image_url: item.product.category.imageUrl || item.product.category.image_url,
      } : undefined,
    },
    quantity: item.quantity,
    created_at: item.created_at || item.createdAt,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await cartApi.get();
      if (res.data) {
        setItems(normalizeCartItems(res.data));
      }
    } catch {
      // Silently fail on cart fetch
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const res = await cartApi.add(productId, quantity);
      if (res.data) {
        setItems(normalizeCartItems(res.data));
      }
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  }, [user]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      await cartApi.remove(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await cartApi.updateQuantity(itemId, quantity);
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch {
      toast.error('Failed to update quantity');
    }
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      await cartApi.clear();
      setItems([]);
    } catch {
      // Silently fail
    }
  }, [user]);

  const getCartTotal = useCallback(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.product.discount_price || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const originalTotal = items.reduce((sum, item) =>
      sum + item.product.price * item.quantity, 0
    );

    const discount = originalTotal - subtotal;
    const total = subtotal;

    return { subtotal, discount, total };
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
