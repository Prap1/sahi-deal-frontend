'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/auth';

interface Product {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  rating: string;
  affiliate_links?: { platform: string; url: string; click_count: number }[];
}

const AFFILIATE_TAG_AMAZON = 'sahideal-21';
const AFFILIATE_TAG_FLIPKART = 'sahideal';

function convertToAffiliateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('amazon')) {
      parsed.searchParams.set('tag', AFFILIATE_TAG_AMAZON);
    } else if (parsed.hostname.includes('flipkart')) {
      parsed.searchParams.set('affid', AFFILIATE_TAG_FLIPKART);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', brand: '', image_url: '',
    rating: '4.0', amazon_url: '', flipkart_url: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await apiRequest('/api/v1/products/');
    if (res.ok) {
      const data = await res.json();
      setProducts(data.results ?? data);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiRequest('/api/v1/products/', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          image_url: form.image_url,
          rating: parseFloat(form.rating),
          affiliate_links_data: [
            ...(form.amazon_url ? [{ platform: 'AMAZON', url: convertToAffiliateUrl(form.amazon_url) }] : []),
            ...(form.flipkart_url ? [{ platform: 'FLIPKART', url: convertToAffiliateUrl(form.flipkart_url) }] : []),
          ],
        }),
      });
      if (res.ok) {
        setForm({ name: '', brand: '', image_url: '', rating: '4.0', amazon_url: '', flipkart_url: '' });
        setShowForm(false);
        fetchProducts();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">📦 Product Management</h1>
          <p className="text-gray-400 mt-1">Add and manage affiliate products.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-5">New Product</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Samsung Galaxy M14 5G" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Brand *</label>
                <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Samsung" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rating (out of 5)</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Amazon Link <span className="text-yellow-400 text-xs">(Auto-affiliate tagged)</span>
                </label>
                <input value={form.amazon_url} onChange={(e) => setForm({ ...form, amazon_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://amazon.in/dp/..." />
                {form.amazon_url && (
                  <p className="text-xs text-green-400 mt-1 truncate">→ {convertToAffiliateUrl(form.amazon_url)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Flipkart Link <span className="text-blue-400 text-xs">(Auto-affiliate tagged)</span>
                </label>
                <input value={form.flipkart_url} onChange={(e) => setForm({ ...form, flipkart_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://flipkart.com/..." />
                {form.flipkart_url && (
                  <p className="text-xs text-green-400 mt-1 truncate">→ {convertToAffiliateUrl(form.flipkart_url)}</p>
                )}
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
              {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : '💾 Save Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-white">All Products</h2>
          <span className="text-xs text-gray-500">{products.length} total</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-2xl mb-2">📭</p>
            <p>No products yet. Add one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/10">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                  <th className="px-5 py-3 font-medium">Amazon Clicks</th>
                  <th className="px-5 py-3 font-medium">Flipkart Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => {
                  const amazon = product.affiliate_links?.find((l) => l.platform === 'AMAZON');
                  const flipkart = product.affiliate_links?.find((l) => l.platform === 'FLIPKART');
                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image_url} alt={product.name} className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg">📦</div>
                          )}
                          <span className="text-white font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">{product.brand}</td>
                      <td className="px-5 py-4 text-yellow-400">★ {product.rating}</td>
                      <td className="px-5 py-4 text-orange-400">{amazon?.click_count ?? 0}</td>
                      <td className="px-5 py-4 text-blue-400">{flipkart?.click_count ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
