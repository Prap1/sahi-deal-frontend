'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/auth';

interface Analytics {
  total_pages: number;
  published_pages: number;
  total_clicks: number;
  top_products: { name: string; total_clicks: number }[];
  top_pages: { keyword: string; slug: string }[];
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/v1/analytics/')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here's your platform overview.</p>
        </div>
        <Link
          href="/admin/keywords"
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Comparison
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-white/10 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Pages" value={data?.total_pages ?? 0} icon="📄" color="text-blue-400" />
          <StatCard title="Published" value={data?.published_pages ?? 0} icon="✅" color="text-green-400" />
          <StatCard title="Total Clicks" value={data?.total_clicks ?? 0} icon="🖱️" color="text-purple-400" />
        </div>
      )}

      {/* Two Column Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Top Pages */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🔥 Top Published Pages</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : data?.top_pages?.length ? (
            <ul className="space-y-3">
              {data.top_pages.map((page) => (
                <li key={page.slug} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-300 capitalize">{page.keyword}</span>
                  <Link
                    href={`/compare/${page.slug}`}
                    target="_blank"
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    View →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center py-6">No published pages yet.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🏆 Top Clicked Products</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : data?.top_products?.length ? (
            <ul className="space-y-3">
              {data.top_products.map((product, i) => (
                <li key={product.name} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-gray-500 w-5">#{i + 1}</span>
                  <span className="flex-1 text-sm text-gray-300">{product.name}</span>
                  <span className="text-sm font-bold text-purple-400">{product.total_clicks ?? 0} clicks</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center py-6">No click data yet.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/keywords', label: 'Manage Keywords', icon: '🔑', desc: 'Add new AI comparison keywords' },
          { href: '/admin/products', label: 'Manage Products', icon: '📦', desc: 'Add or edit product listings' },
          { href: '/admin/content', label: 'Edit Content', icon: '📝', desc: 'Update comparison page content' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-primary-500/30 transition-all group"
          >
            <span className="text-2xl">{action.icon}</span>
            <h3 className="text-sm font-bold text-white mt-3 group-hover:text-primary-400 transition-colors">{action.label}</h3>
            <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
