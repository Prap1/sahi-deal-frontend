import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const runtime = 'edge';

// Define the interface based on the JSON structure
interface Product {
  name: string;
  brand: string;
  price_range: string;
  rating: string;
  image: string;
  amazon_link: string;
  flipkart_link: string;
  best_for: string;
  features: string[];
  pros: string[];
  cons: string[];
}

interface ComparisonData {
  slug: string;
  title: string;
  intro: string;
  products: Product[];
  comparison_table: {
    feature: string;
    values: string[];
  }[];
  best_choice: string;
  buying_guide: string;
  faqs: {
    q: string;
    a: string;
  }[];
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
}

// Mock Data
const mockData: ComparisonData = {
  "slug": "best-5g-phones-under-15000",
  "title": "Top 5 Best 5G Phones Under 15000 in India (2024) - Kise Kharidein?",
  "intro": "Kya aap ₹15000 ke budget mein ek naya 5G smartphone dhundh rahe hain? Aaj kal market mein Redmi, Realme, Moto aur Samsung jaise brands ke beech kaafi tough competition hai. Is article mein humne performance, camera quality, battery life aur 5G bands ke hisaab se India ke best 5G phones ko compare kiya hai, taaki aapka decision aasan ho sake.",
  "products": [
    {
      "name": "Moto G34 5G",
      "brand": "Motorola",
      "price_range": "₹10,999 - ₹11,999",
      "rating": "4.3/5",
      "image": "https://m.media-amazon.com/images/I/61S9aVnRZvL._SL1500_.jpg",
      "amazon_link": "https://amazon.in/dp/B0CT8R225V",
      "flipkart_link": "https://flipkart.com/search?q=moto+g34+5g",
      "best_for": "Best Performance & Clean UI",
      "features": [
        "Snapdragon 695 5G Processor",
        "120Hz Display",
        "50MP Main Camera",
        "Android 14 Ready"
      ],
      "pros": [
        "Clean Stock Android experience",
        "Gaming ke liye powerful processor",
        "Stereo speakers"
      ],
      "cons": [
        "Display HD+ resolution ke saath aati hai",
        "Charging thodi slow hai"
      ]
    },
    {
      "name": "Redmi 12 5G",
      "brand": "Xiaomi",
      "price_range": "₹11,999 - ₹13,499",
      "rating": "4.1/5",
      "image": "https://m.media-amazon.com/images/I/71tCOhEigtL._SL1500_.jpg",
      "amazon_link": "https://amazon.in/dp/B0C74P7N4P",
      "flipkart_link": "https://flipkart.com/search?q=redmi+12+5g",
      "best_for": "Premium Glass Design",
      "features": [
        "Snapdragon 4 Gen 2 Processor",
        "6.79-inch FHD+ 90Hz Display",
        "5000mAh Battery",
        "Premium Glass Back"
      ],
      "pros": [
        "Look aur feel kafi premium hai",
        "Badi aur sharp FHD+ display",
        "Battery backup bahut badhiya hai"
      ],
      "cons": [
        "MIUI mein bloatware apps aate hain",
        "Camera low light mein average hai"
      ]
    },
    {
      "name": "POCO M6 Pro 5G",
      "brand": "POCO",
      "price_range": "₹9,999 - ₹11,999",
      "rating": "4.2/5",
      "image": "https://m.media-amazon.com/images/I/51n20P8l53L._SL1500_.jpg",
      "amazon_link": "https://amazon.in/dp/B0CNX9DRBC",
      "flipkart_link": "https://flipkart.com/search?q=poco+m6+pro+5g",
      "best_for": "Best Budget 5G Phone",
      "features": [
        "Snapdragon 4 Gen 2",
        "6.79-inch FHD+ 90Hz",
        "5000mAh Battery with 18W Fast Charging",
        "IP53 Rating"
      ],
      "pros": [
        "Under 10k price mein best 5G option",
        "Gaming aur daily use mein smooth performance",
        "Solid battery life"
      ],
      "cons": [
        "Boxy design thoda heavy lagta hai",
        "Sirf 18W charging support milta hai"
      ]
    },
    {
      "name": "Samsung Galaxy M14 5G",
      "brand": "Samsung",
      "price_range": "₹12,490 - ₹13,990",
      "rating": "4.0/5",
      "image": "https://m.media-amazon.com/images/I/818VqDSKp3L._SL1500_.jpg",
      "amazon_link": "https://amazon.in/dp/B0BZCR6TNJ",
      "flipkart_link": "https://flipkart.com/search?q=samsung+galaxy+m14+5g",
      "best_for": "Best Battery Life & Brand Value",
      "features": [
        "Exynos 1330 5G Processor",
        "6000mAh Massive Battery",
        "50MP Triple Camera",
        "13 5G Bands Support"
      ],
      "pros": [
        "6000mAh battery aaram se 2 din chalti hai",
        "Samsung ka brand trust aur security updates",
        "True 5G support"
      ],
      "cons": [
        "Box mein charger nahi milta",
        "Design thoda outdated (waterdrop notch) hai"
      ]
    },
    {
      "name": "realme 11x 5G",
      "brand": "realme",
      "price_range": "₹13,999 - ₹14,999",
      "rating": "4.2/5",
      "image": "https://m.media-amazon.com/images/I/71IqjeJbU3L._SL1500_.jpg",
      "amazon_link": "https://amazon.in/dp/B0CFVKVTVM",
      "flipkart_link": "https://flipkart.com/search?q=realme+11x+5g",
      "best_for": "Fast Charging & Camera",
      "features": [
        "Dimensity 6100+ 5G Processor",
        "64MP AI Camera",
        "33W SUPERVOOC Fast Charging",
        "6.72-inch 120Hz FHD+ Display"
      ],
      "pros": [
        "33W fast charging bahut handy feature hai",
        "Camera daylight mein clear photos click karta hai",
        "120Hz display kaafi smooth hai"
      ],
      "cons": [
        "Pre-installed bloatware (faltu apps) aate hain",
        "Low light camera performance utni achi nahi hai"
      ]
    }
  ],
  "comparison_table": [
    {
      "feature": "Processor",
      "values": [
        "Snapdragon 695",
        "Snapdragon 4 Gen 2",
        "Snapdragon 4 Gen 2",
        "Exynos 1330",
        "Dimensity 6100+"
      ]
    },
    {
      "feature": "Display Type",
      "values": [
        "120Hz HD+",
        "90Hz FHD+",
        "90Hz FHD+",
        "90Hz FHD+",
        "120Hz FHD+"
      ]
    },
    {
      "feature": "Battery & Charging",
      "values": [
        "5000mAh + 18W",
        "5000mAh + 18W",
        "5000mAh + 18W",
        "6000mAh + 25W",
        "5000mAh + 33W"
      ]
    }
  ],
  "best_choice": "Moto G34 5G - Kyunki is price bracket mein Snapdragon 695 processor aur ad-free clean software experience ka combination isko ek behtareen all-rounder banata hai.",
  "buying_guide": "Naya 5G phone lene se pehle in baaton ka dhyan zaroor rakhein: 1. 5G Bands: Phone mein kam se kam 7-8 5G bands hone chahiye taaki Jio aur Airtel 5G seamlessly chal sake. 2. RAM & Storage: Aaj kal ke apps aur games ke liye minimum 6GB RAM aur 128GB storage hona zaroori hai. 3. Display: Koshish karein ki phone FHD+ resolution ke sath aaye, aur gaming karte hain toh kam se kam 90Hz refresh rate ho.",
  "faqs": [
    {
      "q": "Kya 15000 ke budget mein aane wale 5G phones gaming ke liye theek hain?",
      "a": "Haan, BGMI aur Call of Duty jaise games aap medium se high settings par aaram se khel sakte hain, khaas kar un phones mein jinme Snapdragon 4 Gen 2 ya Snapdragon 695 processors hain."
    },
    {
      "q": "Kis phone ki battery sabse zyada chalti hai is budget mein?",
      "a": "Is list mein Samsung Galaxy M14 5G ki 6000mAh battery sabse best backup deti hai, jo normal daily use mein aaram se 2 din tak chal sakti hai."
    },
    {
      "q": "Kya in budget 5G phones mein headphone jack milta hai?",
      "a": "Haan, is segment ke zyada tar smartphones mein abhi bhi 3.5mm headphone jack available hota hai."
    }
  ],
  "seo": {
    "meta_title": "Top 5 Best 5G Phones Under 15000 in India (2024)",
    "meta_description": "₹15000 ke budget mein best 5G phone dhundh rahe hain? Moto, Redmi, Poco aur Realme ke top smartphones ka detail comparison padhein aur apne liye sahi phone chune.",
    "keywords": [
      "best 5g phones under 15000",
      "5g mobile under 15000",
      "top 10 5g phones under 15000 in india",
      "best gaming phone under 15000",
      "best phones under 15k",
      "redmi 5g phone under 15k"
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In a real app, you would fetch SEO metadata for the slug
  return {
    title: mockData.seo.meta_title,
    description: mockData.seo.meta_description,
    keywords: mockData.seo.keywords.join(", "),
  }
}

export default async function ComparisonPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // Replace this with actual fetch call in production
  // const res = await fetch(`https://api.sahideal.com/api/v1/comparisons/${slug}`);
  // const data: ComparisonData = await res.json();
  const data = mockData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-8">
        <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-400 capitalize">{slug.replace(/-/g, ' ')}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6">
          {data.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-4xl leading-relaxed">
          {data.intro}
        </p>
      </div>

      {/* Editor's Choice Badge */}
      <div className="mb-12 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🏆</div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Our Top Recommendation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {data.best_choice}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-12 glass-panel overflow-hidden overflow-x-auto rounded-2xl">
        <h2 className="text-2xl font-bold p-6 border-b border-border">Quick Comparison</h2>
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-hover/50">
            <tr>
              <th scope="col" className="px-6 py-6 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                Models
              </th>
              {data.products.map((product, idx) => (
                <th key={idx} scope="col" className="px-6 py-6 text-center min-w-[200px]">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4 bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center justify-center">
                      <Image 
                        src={product.image || "https://placehold.co/150x150/png"} 
                        alt={product.name}
                        width={100}
                        height={100}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm font-bold text-foreground">{product.name}</span>
                    <span className="text-lg font-extrabold text-primary-600 mt-2">{product.price_range}</span>
                    <div className="flex items-center gap-1 mt-1 text-sm text-yellow-500">
                      ★ {product.rating}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {data.comparison_table.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-surface-hover/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground bg-surface-hover/30">
                  {row.feature}
                </td>
                {row.values.map((val, valIdx) => (
                  <td key={valIdx} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Detailed Reviews */}
      <div className="mt-20 space-y-12">
        <h2 className="text-3xl font-bold mb-8">In-Depth Analysis & Reviews</h2>
        {data.products.map((product, idx) => (
          <div key={idx} className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row gap-8 hover:shadow-lg transition-shadow">
            <div className="md:w-1/3 flex flex-col items-center justify-center bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
               <div className="relative w-full aspect-square max-w-[250px] mb-4">
                  <Image 
                    src={product.image || "https://placehold.co/400x400/png"} 
                    alt={product.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
               </div>
               <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-xs font-bold uppercase tracking-wider">
                 {product.best_for}
               </span>
            </div>
            <div className="md:w-2/3">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{product.name}</h3>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500 mr-3">By {product.brand}</span>
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-0.5 rounded text-xs font-bold flex items-center">
                      ★ {product.rating}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-extrabold text-primary-600">{product.price_range}</span>
                  <p className="text-xs text-gray-400 mt-1">Prices may vary</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-bold text-foreground mb-3">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 p-4 rounded-xl bg-surface-hover/30 border border-border">
                <div>
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {product.pros.map((pro, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-green-500 mr-2 font-bold">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {product.cons.map((con, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-red-500 mr-2 font-bold">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href={product.amazon_link} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#FF9900] hover:bg-[#FF9900]/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                  View on Amazon
                </a>
                <a href={product.flipkart_link} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#2874F0] hover:bg-[#2874F0]/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                  View on Flipkart
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buying Guide */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-6">Buying Guide</h2>
        <div className="glass-panel p-8 prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p>{data.buying_guide}</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-20 mb-10">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {data.faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
