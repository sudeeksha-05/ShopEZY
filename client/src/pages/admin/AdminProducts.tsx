import { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '../../lib/api';
import { Product, Category } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
} from 'lucide-react';

// Normalize product for backward compat
function normalizeProduct(p: any): Product {
  return {
    ...p,
    discount_price: p.discountPrice ?? p.discount_price ?? null,
    discountPrice: p.discountPrice ?? p.discount_price ?? null,
    reviews_count: p.reviewsCount ?? p.reviews_count ?? 0,
    is_active: p.isActive ?? p.is_active ?? true,
    isActive: p.isActive ?? p.is_active ?? true,
    category_id: p.categoryId ?? p.category_id,
    categoryId: p.categoryId ?? p.category_id,
    images: p.images || [],
    category: p.category ? {
      ...p.category,
      image_url: p.category.imageUrl || p.category.image_url,
    } : undefined,
  };
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    brand: '',
    images: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll();
      if (res.data) {
        setProducts(res.data.map(normalizeProduct));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      if (res.data) setCategories(res.data);
    } catch {
      // ignore
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        discount_price: (product.discount_price || product.discountPrice)?.toString() || '',
        category_id: product.category_id || product.categoryId || '',
        brand: product.brand || '',
        images: product.images.join('\n'),
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        discount_price: '',
        category_id: '',
        brand: '',
        images: '',
        stock: '0',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      discountPrice: formData.discount_price ? parseFloat(formData.discount_price) : null,
      categoryId: formData.category_id || null,
      brand: formData.brand || null,
      images: formData.images.split('\n').filter(url => url.trim()),
      stock: parseInt(formData.stock) || 0,
    };

    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData);
        toast.success('Product updated');
      } else {
        await productsApi.create(productData);
        toast.success('Product created');
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsApi.delete(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const toggleActive = async (product: Product) => {
    const isActive = product.is_active ?? product.isActive ?? true;
    try {
      await productsApi.update(product.id, { isActive: !isActive });
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, is_active: !isActive, isActive: !isActive } : p
        )
      );
      toast.success(isActive ? 'Product deactivated' : 'Product activated');
    } catch {
      toast.error('Failed to update product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          {product.brand && (
                            <p className="text-sm text-gray-500">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          ₹{product.discount_price || product.discountPrice || product.price}
                        </p>
                        {(product.discount_price || product.discountPrice) && (
                          <p className="text-gray-400 line-through">₹{product.price}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          (product.is_active ?? product.isActive)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {(product.is_active ?? product.isActive) ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={e => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images (one URL per line)</label>
                  <textarea
                    value={formData.images}
                    onChange={e => setFormData({ ...formData, images: e.target.value })}
                    rows={3}
                    placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
