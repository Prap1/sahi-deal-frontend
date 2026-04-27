import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ComparisonPage {
  keyword: string;
  slug: string;
  status: string;
}

async function getPublishedPages(): Promise<ComparisonPage[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/comparisons/`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    if (!res.ok) return [];
    const data = await res.json();
    const pages: ComparisonPage[] = data.results ?? data;
    return pages.filter((p) => p.status === 'PUBLISHED');
  } catch {
    return [];
  }
}

const categoryEmoji: Record<string, string> = {
  phone: '📱', mobile: '📱', laptop: '💻', audio: '🎧',
  earbuds: '🎧', camera: '📷', watch: '⌚', tv: '📺',
  default: '🛒',
};

function getEmoji(keyword: string): string {
  const lower = keyword.toLowerCase();
  for (const [key, emoji] of Object.entries(categoryEmoji)) {
    if (lower.includes(key)) return emoji;
  }
  return categoryEmoji.default;
}

export default async function Home() {
  const pages = await getPublishedPages();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center w-full max-w-4xl mt-12 mb-20 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Find the Best Deals in India <span className="gradient-text">🇮🇳</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Compare top products from Amazon &amp; Flipkart and find the best price instantly.
        </p>
        
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass-panel rounded-full flex items-center p-2">
            <input 
              type="text" 
              placeholder="E.g. Best Phone Under 20000" 
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-6 py-3 text-lg text-foreground"
            />
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5">
              Search
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <span className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400">
            🛒 Compare prices from Amazon &amp; Flipkart
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 font-semibold">
            💰 Save up to 30% on best deals
          </span>
        </div>
      </div>

      {/* Trending Comparisons */}
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Trending Comparisons</h2>
          <Link href="/categories" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
            View all categories &rarr;
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-medium">No comparisons published yet.</p>
            <p className="text-sm mt-2">Go to the Admin panel and publish your first comparison page!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((item) => (
              <Link href={`/compare/${item.slug}`} key={item.slug} className="group cursor-pointer">
                <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary-500/30 transform hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-800 dark:to-dark-900 relative flex items-center justify-center">
                    <span className="text-6xl opacity-60">{getEmoji(item.keyword)}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="mt-2 text-xl font-bold group-hover:text-primary-600 transition-colors line-clamp-2 capitalize">
                      {item.keyword}
                    </h3>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-primary-500/10 text-primary-400 rounded-full">
                        Published
                      </span>
                      <span className="mx-2">•</span>
                      <span>View comparison →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
