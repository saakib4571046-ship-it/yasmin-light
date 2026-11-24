import { ArrowRight, Search, X, MapPin } from 'lucide-react';
import { CategoryId, Language, Product, ShopSettings } from '../types';
import { CATEGORY_IMAGES, HERO_IMAGE } from '../data/initialData';
import { CATEGORY_LABELS, UI_COPY } from '../data/translations';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface HomeViewProps {
  products: Product[];
  shopSettings: ShopSettings;
  lang: Language;
  onSetLang: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  promoDismissed: boolean;
  onDismissPromo: () => void;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenCatalog: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenContact: () => void;
}

const ORDERED_CATEGORIES: CategoryId[] = [
  'fancy-lights',
  'chandeliers',
  'wall-lights',
  'home-decor',
  'wall-clocks',
  'gifts-more',
];

export function HomeView({
  products,
  shopSettings,
  lang,
  onSetLang,
  searchQuery,
  onSearchChange,
  promoDismissed,
  onDismissPromo,
  onSelectCategory,
  onOpenCatalog,
  onSelectProduct,
  onQuickAdd,
  onOpenContact,
}: HomeViewProps) {
  const t = UI_COPY[lang];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const searchResults = isSearching
    ? products.filter((p) => {
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
    : [];

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const latestProducts = products.filter((p) => p.latest).slice(0, 3);

  return (
    <div>
      {/* Slim Dismissible Promotional Strip (<= 38px) */}
      {!promoDismissed && (
        <div className="bg-[#161410] border-b border-[#D4AF37]/25 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#E6C76C] font-medium truncate">
              {shopSettings.promoBanner[lang]}
            </p>
            <button
              type="button"
              onClick={onDismissPromo}
              aria-label="Dismiss banner"
              className="text-[#A8A196] hover:text-[#F5F2EB] p-1 rounded transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Search & Language Utility Toolbar */}
      <section className="border-b border-white/10 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xl">
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
              className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-lg bg-[#141418] border border-white/12 text-sm text-[#F5F2EB] placeholder:text-[#8A8378] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label={t.home.clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#A8A196] hover:text-[#F5F2EB] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div
              role="group"
              aria-label="Language Switcher"
              className="inline-flex items-center p-1 rounded-lg bg-[#141418] border border-white/12"
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
        </div>
      </section>

      {/* Live Search Results Mode */}
      {isSearching ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB]">
              “{searchQuery}” · {searchResults.length} {t.catalog.itemsFound}
            </h1>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-white/15 text-sm font-medium text-[#E6C76C] hover:border-[#D4AF37] transition-colors"
            >
              {t.home.clearSearch}
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-[#131316] border border-white/10 rounded-xl p-10 text-center">
              <p className="text-base text-[#C8C1B4] mb-4">{t.home.noSearchMatches}</p>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#0A0A0B] text-sm font-semibold hover:bg-[#E5C158] transition-colors"
              >
                {t.home.clearSearch}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
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
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Editorial Column */}
                <div className="lg:col-span-5 flex flex-col justify-center py-2 lg:py-6">
                  <p className="text-xs sm:text-sm font-medium text-[#E6C76C] tracking-wide mb-3">
                    {t.hero.eyebrow}
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-[#F5F2EB] leading-[1.08] tracking-tight text-balance mb-4">
                    {shopSettings.tagline[lang]}
                  </h1>
                  <p className="text-sm sm:text-base text-[#C8C1B4] leading-relaxed max-w-lg mb-7">
                    {t.home.showroomBody}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onOpenCatalog}
                      className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      <span>{t.hero.ctaPrimary}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onOpenContact}
                      className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-lg border border-white/20 hover:border-[#D4AF37]/60 text-[#F5F2EB] hover:text-[#E6C76C] text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      <MapPin className="w-4 h-4 text-[#E6C76C]" />
                      <span>{t.hero.ctaSecondary}</span>
                    </button>
                  </div>
                </div>

                {/* Right Showroom Visual */}
                <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-[#D4AF37]/25 bg-[#121214] aspect-[16/9] lg:aspect-auto lg:min-h-[400px]">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt={shopSettings.shopName}
                    fallbackTitle={shopSettings.shopName}
                    className="w-full h-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/85 via-[#0A0A0B]/20 to-transparent"
                  />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="font-display text-xl sm:text-2xl font-semibold text-[#F5F2EB]">
                        {shopSettings.shopName}
                      </p>
                      <p className="text-xs sm:text-sm text-[#E6C76C]">
                        {shopSettings.openingHours[lang]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Categories */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-b border-white/10">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB] text-balance">
                  {t.home.popularCategories}
                </h2>
                <p className="text-sm text-[#B5AEA2] mt-1">
                  {t.home.categoriesSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenCatalog}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm font-medium text-[#E6C76C] hover:text-[#F3DA88] transition-colors whitespace-nowrap"
              >
                <span>{t.home.viewAll}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {ORDERED_CATEGORIES.map((catId) => {
                const label = CATEGORY_LABELS[catId];
                const count = products.filter((p) => p.category === catId).length;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => onSelectCategory(catId)}
                    className="group text-left bg-[#131316] border border-white/10 hover:border-[#D4AF37]/60 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C76C]"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#0E0E10]">
                      <ResilientImage
                        src={CATEGORY_IMAGES[catId]}
                        alt={label[lang]}
                        fallbackTitle={label[lang]}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-sm font-semibold text-[#F5F2EB] group-hover:text-[#E6C76C] transition-colors truncate">
                        {label[lang]}
                      </h3>
                      <p className="text-xs text-[#9C958A] mt-0.5 font-mono-tabular">
                        {count} {t.catalog.itemsFound}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Featured Collection */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-b border-white/10">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB] text-balance">
                  {t.home.featuredProducts}
                </h2>
                <p className="text-sm text-[#B5AEA2] mt-1">
                  {t.home.featuredSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenCatalog}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm font-medium text-[#E6C76C] hover:text-[#F3DA88] transition-colors whitespace-nowrap"
              >
                <span>{t.home.viewAll}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </section>

          {/* Latest Arrivals */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB] text-balance">
                  {t.home.latestArrivals}
                </h2>
                <p className="text-sm text-[#B5AEA2] mt-1">
                  {t.home.latestSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenCatalog}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm font-medium text-[#E6C76C] hover:text-[#F3DA88] transition-colors whitespace-nowrap"
              >
                <span>{t.home.viewAll}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
