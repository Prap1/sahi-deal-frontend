'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/auth';
import Link from 'next/link';

interface ComparisonPage {
  id: string;
  keyword: string;
  slug: string;
  status: string;
}

export default function ContentListPage() {
  const [pages, setPages] = useState<ComparisonPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/v1/comparisons/')
      .then((r) => r.json())
      .then((d) => setPages(d.results ?? d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">📝 Content Pages</h1>
        <p className="text-gray-400 mt-1">Select a page to edit its content, SEO, and publish it.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : pages.length === 0 ? (
        <div className="py-24 text-center text-gray-500">
          <p className="text-3xl mb-3">📭</p>
          <p>No pages yet. Go to Keywords to generate one.</p>
          <Link href="/admin/keywords" className="mt-4 inline-block text-primary-400 hover:text-primary-300 text-sm">→ Go to Keywords</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/8 transition-all">
              <div>
                <h3 className="font-semibold text-white capitalize">{page.keyword}</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">/compare/{page.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                  page.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : page.status === 'AI_PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {page.status.replace('_', ' ')}
                </span>
                <Link href={`/admin/content/${page.slug}`}
                  className="text-sm text-primary-400 hover:text-primary-300 bg-primary-500/10 px-4 py-2 rounded-xl transition-colors">
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
