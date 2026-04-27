'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/auth';

interface ComparisonPage {
  id: string;
  keyword: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'AI_PROCESSING';
  created_at: string;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PUBLISHED: 'bg-green-500/10 text-green-400 border-green-500/20',
  AI_PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function KeywordsPage() {
  const [keyword, setKeyword] = useState('');
  const [slug, setSlug] = useState('');
  const [pages, setPages] = useState<ComparisonPage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateSlug = (kw: string) =>
    kw.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    setSlug(generateSlug(val));
  };

  const fetchPages = async () => {
    const res = await apiRequest('/api/v1/comparisons/');
    if (res.ok) {
      const data = await res.json();
      setPages(data.results ?? data);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPages(); }, []);

  // Poll for AI_PROCESSING pages
  useEffect(() => {
    const processing = pages.some((p) => p.status === 'AI_PROCESSING');
    if (!processing) return;
    const interval = setInterval(fetchPages, 5000);
    return () => clearInterval(interval);
  }, [pages]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setError('');
    setSuccess('');
    setGenerating(true);
    try {
      const res = await apiRequest('/api/v1/comparisons/generate/', {
        method: 'POST',
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setSuccess(`✅ AI generation started for "${keyword}". Status will update automatically.`);
        setKeyword('');
        setSlug('');
        fetchPages();
      }
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this page?')) return;
    await apiRequest(`/api/v1/comparisons/${slug}/`, { method: 'DELETE' });
    fetchPages();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">🔑 Keyword Management</h1>
        <p className="text-gray-400 mt-1">Add a keyword to trigger AI content generation.</p>
      </div>

      {/* Add Keyword Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Add New Keyword</h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. best phone under 20000"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Auto-Generated Slug</label>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                placeholder="best-phone-under-20000"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
          {success && <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>}

          <button
            type="submit"
            disabled={generating}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><span>🤖</span> Generate AI Content</>
            )}
          </button>
        </form>
      </div>

      {/* Pages Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-white">All Comparison Pages</h2>
          <span className="text-xs text-gray-500">{pages.length} total</span>
        </div>
        {pages.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-2xl mb-2">📭</p>
            <p>No pages yet. Add a keyword to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/10">
                  <th className="px-5 py-3 font-medium">Keyword</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{page.keyword}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{page.slug}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[page.status]}`}>
                        {page.status === 'AI_PROCESSING' && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5 animate-pulse" />
                        )}
                        {page.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/content/${page.slug}`}
                          className="text-xs text-primary-400 hover:text-primary-300 bg-primary-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/compare/${page.slug}`}
                          target="_blank"
                          className="text-xs text-gray-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(page.slug)}
                          className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
