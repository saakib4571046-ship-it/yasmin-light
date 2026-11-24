import { useState } from 'react';
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { Language, Product, ProductColorOption } from '../types';
import { CATEGORY_LABELS, UI_COPY } from '../data/translations';
import { formatINR } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface ProductDetailViewProps {
  product: Product;
  lang: Language;
  onBack: () => void;
  onAddToCart: (
    product: Product,
    size: string,
    color: ProductColorOption,
    quantity: number
  ) => void;
}

export function ProductDetailView({
  product,
  lang,
  onBack,
  onAddToCart,
}: ProductDetailViewProps) {
  const t = UI_COPY[lang];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? 'Standard');
  const [selectedColor, setSelectedColor] = useState<ProductColorOption>(
    product.colors[0] ?? { name: { en: 'Warm Gold', hi: 'वार्म गोल्ड' }, hex: '#D4AF37' }
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const inStock = product.stock > 0;
  const maxQty = Math.max(1, product.stock);
  const categoryLabel = CATEGORY_LABELS[product.category][lang];

  const handleAdd = () => {
    if (!inStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12">
      {/* Back Breadcrumb */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 min-h-[44px] pr-4 text-sm font-medium text-[#C8C1B4] hover:text-[#E6C76C] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.product.backToShop}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Sticky Gallery */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#131316] border border-white/10">
            <ResilientImage
              src={product.images[selectedImageIdx] ?? product.images[0]}
              alt={product.name[lang]}
              fallbackTitle={product.name[lang]}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-24 aspect-[4/3] rounded-lg overflow-hidden border transition-all shrink-0 ${
                    selectedImageIdx === idx
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ResilientImage
                    src={imgUrl}
                    alt={`${product.name[lang]} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-[#131316] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A8A196] mb-2">
              <span className="text-[#E6C76C] font-medium">{categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {t.product.sku}: {product.sku}
              </span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  !inStock
                    ? 'text-red-400 font-semibold'
                    : product.stock <= 3
                    ? 'text-amber-300 font-semibold'
                    : 'text-emerald-300 font-medium'
                }
              >
                {!inStock
                  ? t.product.outOfStock
                  : `${t.product.inStock} (${product.stock})`}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB] leading-tight text-balance">
              {product.name[lang]}
            </h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#E6C76C]">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono-tabular text-base text-[#8D867B] line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#D0C9BD] leading-relaxed border-t border-white/10 pt-5">
            {product.description[lang]}
          </p>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-[#E5DFD3]">
                {t.product.selectSize}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#E6C76C]'
                          : 'bg-[#0E0E10] border-white/12 text-[#C8C1B4] hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color / Finish Selector */}
          {product.colors.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-[#E5DFD3]">
                {t.product.selectColor}:{' '}
                <span className="text-[#E6C76C] font-medium">
                  {selectedColor.name[lang]}
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const active = selectedColor.name.en === color.name.en;
                  return (
                    <button
                      key={color.name.en}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#E6C76C]'
                          : 'bg-[#0E0E10] border-white/12 text-[#C8C1B4] hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-white/15 bg-[#0E0E10]">
                <button
                  type="button"
                  disabled={!inStock || quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-12 flex items-center justify-center text-[#E5DFD3] hover:text-[#E6C76C] disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono-tabular w-10 text-center text-sm font-semibold text-[#F5F2EB]">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={!inStock || quantity >= maxQty}
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  aria-label="Increase quantity"
                  className="w-11 h-12 flex items-center justify-center text-[#E5DFD3] hover:text-[#E6C76C] disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                onClick={handleAdd}
                className={`flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                  !inStock
                    ? 'bg-white/10 text-[#7A746B] cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-500 text-[#0A0A0B]'
                    : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B]'
                }`}
              >
                {justAdded && <Check className="w-4 h-4" />}
                <span>
                  {!inStock
                    ? t.product.outOfStock
                    : justAdded
                    ? t.product.added
                    : t.product.addToCart}
                </span>
              </button>
            </div>
          </div>

          {/* Trust & Delivery Highlights */}
          <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs sm:text-sm text-[#B5AEA2]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#E6C76C] shrink-0" />
              <span>{t.product.codAvailable}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#E6C76C] shrink-0" />
              <span>{t.product.safePackaging}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
