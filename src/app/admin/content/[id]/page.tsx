'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/auth';

type Tab = 'content' | 'products' | 'seo';

interface AiContent {
  title?: string;
  intro?: string;
  buying_guide?: string;
  products?: {
    name: string; brand: string; price_range: string;
    rating: string; image: string; best_for: string;
    amazon_link: string; flipkart_link: string;
    pros: string[]; cons: string[];
  }[];
  faqs?: { q: string; a: string }[];
}

interface PageData {
  id: string;
  keyword: string;
  slug: string;
  status: string;
  meta_title: string;
  meta_description: string;
  ai_generated_content: AiContent | null;
}

export default function ContentEditorPage() {
  const { id: slug } = useParams<{ id: string }>();

  const [page, setPage] = useState<PageData | null>(null);
  const [content, setContent] = useState<AiContent>({});
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [tab, setTab] = useState<Tab>('content');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    apiRequest(`/api/v1/comparisons/${slug}/`)
      .then((r) => r.json())
      .then((data: PageData) => {
        setPage(data);
        setContent(data.ai_generated_content || {});
        setMetaTitle(data.meta_title || '');
        setMetaDesc(data.meta_description || '');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await apiRequest(`/api/v1/comparisons/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        ai_generated_content: content,
        meta_title: metaTitle,
        meta_description: metaDesc,
        status: 'DRAFT',
      }),
    });
    setSaving(false);
    if (res.ok) showMsg('✅ Draft saved successfully!', 'success');
    else showMsg('❌ Failed to save draft.', 'error');
  };

  const handlePublish = async () => {
    setPublishing(true);
    const res = await apiRequest(`/api/v1/comparisons/${slug}/publish/`, {
      method: 'POST',
      body: JSON.stringify({ meta_title: metaTitle, meta_description: metaDesc }),
    });
    setPublishing(false);
    if (res.ok) {
      showMsg('🚀 Page published successfully!', 'success');
      setPage((p) => p ? { ...p, status: 'PUBLISHED' } : p);
    } else {
      showMsg('❌ Failed to publish.', 'error');
    }
  };

  const updateProduct = (idx: number, key: string, val: string | string[]) => {
    setContent((c) => {
      const products = [...(c.products ?? [])];
      (products[idx] as Record<string, unknown>)[key] = val;
      return { ...c, products };
    });
  };

  const removeProduct = (idx: number) => {
    setContent((c) => ({ ...c, products: (c.products ?? []).filter((_, i) => i !== idx) }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!page) return (
    <div className="text-center py-24 text-gray-500">
      <p>Page not found.</p>
      <Link href="/admin/content" className="text-primary-400 mt-2 inline-block">← Back</Link>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
        <div>
          <Link href="/admin/content" className="text-xs text-gray-500 hover:text-gray-300 mb-2 inline-flex items-center gap-1">
            ← Back to Content
          </Link>
          <h1 className="text-2xl font-extrabold text-white capitalize">{page.keyword}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
              page.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>{page.status.replace('_', ' ')}</span>
            <Link href={`/compare/${page.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-white">
              View Live →
            </Link>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveDraft} disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/20 hover:bg-white/10 text-gray-300 transition-all flex items-center gap-2 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '💾'}
            Save Draft
          </button>
          <button onClick={handlePublish} disabled={publishing}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition-all flex items-center gap-2 disabled:opacity-60">
            {publishing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🚀'}
            Publish
          </button>
        </div>
      </div>

      {/* Toast */}
      {msg.text && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm ${
          msg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400'
          : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>{msg.text}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
        {(['content', 'products', 'seo'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-t-xl text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Content */}
      {tab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Page Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={content.title ?? ''} onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Intro</label>
                <textarea rows={4} value={content.intro ?? ''} onChange={(e) => setContent({ ...content, intro: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Buying Guide</label>
                <textarea rows={5} value={content.buying_guide ?? ''} onChange={(e) => setContent({ ...content, buying_guide: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y" />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">FAQs</h2>
            <div className="space-y-4">
              {(content.faqs ?? []).map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                  <input value={faq.q} onChange={(e) => {
                    const faqs = [...(content.faqs ?? [])]; faqs[i] = { ...faqs[i], q: e.target.value };
                    setContent({ ...content, faqs });
                  }} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm text-white focus:outline-none" placeholder="Question..." />
                  <textarea value={faq.a} onChange={(e) => {
                    const faqs = [...(content.faqs ?? [])]; faqs[i] = { ...faqs[i], a: e.target.value };
                    setContent({ ...content, faqs });
                  }} rows={2} className="w-full bg-transparent text-sm text-gray-300 focus:outline-none resize-none" placeholder="Answer..." />
                </div>
              ))}
              <button onClick={() => setContent({ ...content, faqs: [...(content.faqs ?? []), { q: '', a: '' }] })}
                className="text-sm text-primary-400 hover:text-primary-300">+ Add FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Products */}
      {tab === 'products' && (
        <div className="space-y-4">
          {(content.products ?? []).map((product, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Product #{idx + 1}</h3>
                <button onClick={() => removeProduct(idx)} className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg">Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['name', 'brand', 'price_range', 'rating', 'image', 'best_for', 'amazon_link', 'flipkart_link'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-500 mb-1 capitalize">{field.replace('_', ' ')}</label>
                    <input value={(product as Record<string, unknown>)[field] as string ?? ''} onChange={(e) => updateProduct(idx, field, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Pros (one per line)</label>
                  <textarea rows={4} value={(product.pros ?? []).join('\n')} onChange={(e) => updateProduct(idx, 'pros', e.target.value.split('\n'))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Cons (one per line)</label>
                  <textarea rows={4} value={(product.cons ?? []).join('\n')} onChange={(e) => updateProduct(idx, 'cons', e.target.value.split('\n'))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setContent({ ...content, products: [...(content.products ?? []), { name: '', brand: '', price_range: '', rating: '', image: '', best_for: '', amazon_link: '', flipkart_link: '', pros: [], cons: [] }] })}
            className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-gray-400 hover:text-white hover:border-white/40 transition-all text-sm">
            + Add Product
          </button>
        </div>
      )}

      {/* Tab: SEO */}
      {tab === 'seo' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white mb-2">SEO Settings</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Meta Title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Meta title (50–60 chars recommended)" />
            <p className="text-xs text-gray-500 mt-1">{metaTitle.length} / 60 chars</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
            <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Meta description (150–160 chars recommended)" />
            <p className="text-xs text-gray-500 mt-1">{metaDesc.length} / 160 chars</p>
          </div>
          {/* Preview */}
          <div className="bg-white rounded-xl p-4 text-left">
            <p className="text-blue-600 text-lg font-medium truncate">{metaTitle || 'Page Title'}</p>
            <p className="text-green-700 text-sm">sahideal.com/compare/{page.slug}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{metaDesc || 'Meta description will appear here...'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
