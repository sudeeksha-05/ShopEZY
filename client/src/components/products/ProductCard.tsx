import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-emerald-300 flex flex-col h-full"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden shrink-0">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded shadow-sm">
            -{discount}% OFF
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-gray-950 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {product.brand && (
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{product.brand}</p>
          )}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.ratings)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">({product.reviews_count || 0})</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-gray-950">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-xs shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 bg-gray-100 text-gray-400 font-bold rounded-lg flex items-center justify-center gap-2 text-xs cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
