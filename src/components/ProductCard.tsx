import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Language, Product } from '../types';
import { CATEGORY_LABELS, UI_COPY } from '../data/translations';
import { formatINR } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({ product, lang, onSelect, onQuickAdd }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const t = UI_COPY[lang];
  const categoryLabel = CATEGORY_LABELS[product.category]?.[lang] ?? product.category;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    onQuickAdd(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={product.name[lang]}
      className="group flex flex-col bg-[#131316] border border-white/10 hover:border-[#D4AF37]/50 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C76C]"
    >
      {/* 4:3 Studio Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0E0E10]">
        <ResilientImage
          src={product.images[0]}
          alt={product.name[lang]}
          fallbackTitle={product.name[lang]}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Unboxed metadata row (zero pills) */}
        <div className="flex items-center gap-2 text-xs text-[#A8A196] mb-1.5">
          <span className="text-[#E6C76C] font-medium truncate">{categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span
            className={
              !inStock
                ? 'text-red-400 font-medium'
                : lowStock
                ? 'text-amber-300 font-medium'
                : 'text-[#B5AEA2]'
            }
          >
            {!inStock
              ? t.product.outOfStock
              : lowStock
              ? `${t.product.lowStock} (${product.stock})`
              : t.product.inStock}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-semibold text-[#F5F2EB] leading-snug line-clamp-2 mb-3 group-hover:text-[#E6C76C] transition-colors">
          {product.name[lang]}
        </h3>

        {/* Price + Action Baseline */}
        <div className="mt-auto pt-3 border-t border-white/8 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-tabular text-lg font-semibold text-[#F5F2EB]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-mono-tabular text-xs text-[#8D867B] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!inStock}
            onClick={handleQuickAdd}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C76C] ${
              !inStock
                ? 'bg-white/5 text-[#6F6A61] cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>{t.product.added}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 shrink-0" />
                <span>{t.product.quickAdd}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
