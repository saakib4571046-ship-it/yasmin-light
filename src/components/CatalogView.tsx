import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { CategoryId, Language, Product } from '../types';
import { CATEGORY_LABELS, UI_COPY } from '../data/translations';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Product[];
  lang: Language;
  onSetLang: (lang: Language) => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const CATEGORIES: (CategoryId | 'all')[] = [
  'all',
  'fancy-lights',
  'chandeliers',
  'wall-lights',
  'home-decor',
  'wall-clocks',
  'gifts-more',
];

export function CatalogView({
  products,
  lang,
  onSetLang,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onQuickAdd,
}: CatalogViewProps) {
  const t = UI_COPY[lang];
  const [collectionTab, setCollectionTab] = useState<'all' | 'featured' | 'latest' | 'instock'>('all');
  const [sortOrder, setSortOrder] = useState<'curated' | 'price-asc' | 'price-desc'>('curated');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (collectionTab === 'featured' && !p.featured) return false;
      if (collectionTab === 'latest' && !p.latest) return false;
      if (collectionTab === 'instock' && p.stock <= 0) return false;
      if (!normalizedQuery) return true;
      const catEn = CATEGORY_LABELS[p.category].en.toLowerCase();
      const catHi = CATEGORY_LABELS[p.category].hi.toLowerCase();
      return (
        p.name.en.toLowerCase().includes(normalizedQuery) ||
        p.name.hi.toLowerCase().includes(normalizedQuery) ||
        p.description.en.toLowerCase().includes(normalizedQuery) ||
        p.description.hi.toLowerCase().includes(normalizedQuery) ||
        catEn.includes(normalizedQuery) ||
        catHi.includes(normalizedQuery) ||
        p.sku.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Page Title & Language Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB] text-balance">
            {selectedCategory === 'all'
              ? t.catalog.title
              : CATEGORY_LABELS[selectedCategory][lang]}
          </h1>
          <p className="text-sm text-[#B5AEA2] mt-1.5">
            {selectedCategory === 'all'
              ? t.catalog.subtitle
              : lang === 'en'
              ? CATEGORY_LABELS[selectedCategory].subtitleEn
              : CATEGORY_LABELS[selectedCategory].subtitleHi}
          </p>
        </div>

        <div
          role="group"
          aria-label="Language Switcher"
          className="inline-flex items-center self-start p-1 rounded-lg bg-[#141418] border border-white/12 shrink-0"
        >
          <button
            type="button"
            onClick={() => onSetLang('en')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              lang === 'en'
                ? 'bg-[#D4AF37] text-[#0A0A0B]'
                : 'text-[#C8C1B4] hover:text-[#F5F2EB]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onSetLang('hi')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              lang === 'hi'
                ? 'bg-[#D4AF37] text-[#0A0A0B]'
                : 'text-[#C8C1B4] hover:text-[#F5F2EB]'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Category Filter Row */}
      <div className="py-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((catId) => {
          const active = selectedCategory === catId;
          const label =
            catId === 'all' ? t.home.allCategories : CATEGORY_LABELS[catId][lang];
          return (
            <button
              key={catId}
              type="button"
              onClick={() => onSelectCategory(catId)}
              className={`min-h-[42px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 border ${
                active
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0B] font-semibold'
                  : 'bg-[#131316] border-white/12 text-[#D0C9BD] hover:border-[#D4AF37]/50 hover:text-[#F5F2EB]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Search + Secondary Filter + Sort Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8">
        <div className="relative flex-1 max-w-md">
          <Search
            aria-hidden="true"
            className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.home.searchPlaceholder}
            aria-label={t.home.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-lg bg-[#131316] border border-white/12 text-sm text-[#F5F2EB] placeholder:text-[#8A8378] focus:outline-none focus:border-[#D4AF37]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label={t.home.clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#A8A196] hover:text-[#F5F2EB]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center p-1 rounded-lg bg-[#131316] border border-white/12">
            {(
              [
                { id: 'all', label: t.catalog.filterAll },
                { id: 'featured', label: t.catalog.filterFeatured },
                { id: 'latest', label: t.catalog.filterLatest },
                { id: 'instock', label: t.catalog.filterInStock },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCollectionTab(tab.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  collectionTab === tab.id
                    ? 'bg-[#252429] text-[#E6C76C]'
                    : 'text-[#B5AEA2] hover:text-[#F5F2EB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'curated' | 'price-asc' | 'price-desc')}
            aria-label="Sort products"
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#131316] border border-white/12 text-xs sm:text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="curated">{t.catalog.sortFeatured}</option>
            <option value="price-asc">{t.catalog.sortPriceAsc}</option>
            <option value="price-desc">{t.catalog.sortPriceDesc}</option>
          </select>

          <span className="font-mono-tabular text-xs text-[#9C958A] whitespace-nowrap">
            {filteredProducts.length} {t.catalog.itemsFound}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#131316] border border-white/10 rounded-xl p-12 text-center">
          <p className="text-base text-[#C8C1B4] mb-4">{t.home.noSearchMatches}</p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onSelectCategory('all');
              setCollectionTab('all');
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#0A0A0B] text-sm font-semibold hover:bg-[#E5C158] transition-colors"
          >
            {t.home.clearSearch}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      )}
    </section>
  );
}
