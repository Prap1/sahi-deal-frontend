import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-bold gradient-text">SahiDeal</span>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Your trusted AI-powered platform for unbiased product comparisons. Find the best deals across top e-commerce sites in India.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Categories</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/categories/mobiles" className="text-base text-gray-500 hover:text-primary-600">Smartphones</Link></li>
              <li><Link href="/categories/laptops" className="text-base text-gray-500 hover:text-primary-600">Laptops</Link></li>
              <li><Link href="/categories/audio" className="text-base text-gray-500 hover:text-primary-600">Headphones & Audio</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/about" className="text-base text-gray-500 hover:text-primary-600">About Us</Link></li>
              <li><Link href="/contact" className="text-base text-gray-500 hover:text-primary-600">Contact</Link></li>
              <li><Link href="/privacy" className="text-base text-gray-500 hover:text-primary-600">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Affiliate Disclosure</h3>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              SahiDeal is a participant in the Amazon Associates Program and Flipkart Affiliate Program. We may earn a commission for purchases made through our links at no extra cost to you.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} SahiDeal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
