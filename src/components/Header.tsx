import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { AppView, Language } from '../types';
import { UI_COPY } from '../data/translations';

interface HeaderProps {
  shopName: string;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  cartCount: number;
  onOpenCart: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export function Header({
  shopName,
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  lang,
  onToggleLang,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_COPY[lang];

  const navItems: { view: AppView; label: string }[] = [
    { view: 'home', label: t.nav.home },
    { view: 'catalog', label: t.nav.catalog },
    { view: 'track-order', label: t.nav.trackOrder },
    { view: 'contact', label: t.nav.contact },
    { view: 'admin', label: t.nav.admin },
  ];

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-wide text-[#F5F2EB] hover:text-[#E6C76C] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C76C] rounded"
        >
          {shopName}
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8"
        >
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C76C] rounded ${
                  isActive
                    ? 'text-[#E6C76C]'
                    : 'text-[#D0C9BD] hover:text-[#F5F2EB]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#D4AF37]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action (Bag) + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`${t.nav.bag} (${cartCount})`}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EB]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>{t.nav.bag}</span>
            <span className="font-mono-tabular text-xs font-bold bg-[#0A0A0B]/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/15 bg-[#131316] text-[#F5F2EB] hover:border-[#E6C76C]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C76C]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#121214] px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`w-full flex items-center justify-between min-h-[44px] px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#D4AF37]/15 text-[#E6C76C]'
                    : 'text-[#E5DFD3] hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between px-3">
            <span className="text-xs text-[#A8A196]">
              {lang === 'en' ? 'Language / भाषा' : 'भाषा / Language'}
            </span>
            <button
              type="button"
              onClick={onToggleLang}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg border border-[#E6C76C]/40 text-xs font-semibold text-[#E6C76C] hover:bg-[#D4AF37]/10 transition-colors"
            >
              {lang === 'en' ? 'हिन्दी में देखें' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
