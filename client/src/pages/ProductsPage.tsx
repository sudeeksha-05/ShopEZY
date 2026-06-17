import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { productsApi, categoriesApi } from '../lib/api';
import { Product, Category, SortOption } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSpinner';

// Normalize product for backward compat
function normalizeProduct(p: any): Product {
  return {
    ...p,
    discount_price: p.discountPrice ?? p.discount_price ?? null,
    reviews_count: p.reviewsCount ?? p.reviews_count ?? 0,
    is_active: p.isActive ?? p.is_active ?? true,
    category_id: p.categoryId ?? p.category_id,
    images: p.images || [],
    category: p.category ? {
      ...p.category,
      image_url: p.category.imageUrl || p.category.image_url,
    } : undefined,
  };
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const dealsOnly = searchParams.get('deals') === 'true';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        if (res.data) setCategories(res.data);
      } catch {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (sortBy) params.sort = sortBy;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (dealsOnly) params.deals = 'true';

      try {
        const res = await productsApi.getAll(params);
        if (res.data) {
          setProducts(res.data.map(normalizeProduct));
        }
      } catch {
        setProducts([]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [search, category, sortBy, minPrice, maxPrice, dealsOnly]);

  const updateFilters = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFilterCount = [search, category, minPrice, maxPrice, dealsOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {category || 'All Products'}
            </h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={e => updateFilters('sort', e.target.value)}
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-white border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateFilters('category', null)}
                      className={`block w-full text-left text-sm ${
                        !category ? 'text-emerald-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilters('category', cat.name)}
                        className={`block w-full text-left text-sm ${
                          category === cat.name
                            ? 'text-emerald-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={e => updateFilters('minPrice', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={e => updateFilters('maxPrice', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dealsOnly}
                      onChange={e => updateFilters('deals', e.target.checked ? 'true' : null)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Only Deals</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            updateFilters('category', cat.name);
                            setShowFilters(false);
                          }}
                          className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${
                            category === cat.name
                              ? 'bg-emerald-50 text-emerald-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => updateFilters('minPrice', e.target.value || null)}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => updateFilters('maxPrice', e.target.value || null)}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-emerald-600 border border-emerald-600 rounded-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                    Search: {search}
                    <button onClick={() => updateFilters('search', null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                    {category}
                    <button onClick={() => updateFilters('category', null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {dealsOnly && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                    Deals Only
                    <button onClick={() => updateFilters('deals', null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
