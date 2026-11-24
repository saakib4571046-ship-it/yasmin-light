import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, Language, Product, ShopSettings } from '../types';
import { UI_COPY } from '../data/translations';
import { formatINR } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  shopSettings: ShopSettings;
  lang: Language;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
  onBrowseCatalog: () => void;
}

export function CartDrawer({
  open,
  onClose,
  cart,
  products,
  shopSettings,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBrowseCatalog,
}: CartDrawerProps) {
  const t = UI_COPY[lang];

  if (!open) return null;

  const enrichedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is CartItem & { product: Product } => x !== null);

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const qualifiesFreeDelivery =
    subtotal >= shopSettings.freeDeliveryThreshold || subtotal === 0;
  const deliveryFee = qualifiesFreeDelivery ? 0 : shopSettings.deliveryCharge;
  const total = subtotal + deliveryFee;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.cart.title}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#111114] border-l border-white/12 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E6C76C]" />
            <h2 className="font-display text-2xl font-semibold text-[#F5F2EB]">
              {t.cart.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#C8C1B4] hover:text-[#F5F2EB] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {enrichedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C76C] mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-[#F5F2EB] mb-1.5">
                {t.cart.emptyTitle}
              </p>
              <p className="text-sm text-[#A8A196] mb-6 max-w-xs">
                {t.cart.emptyBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseCatalog();
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors"
              >
                {t.cart.browseCollection}
              </button>
            </div>
          ) : (
            enrichedItems.map((item) => (
              <div
                key={item.key}
                className="flex gap-3.5 p-3.5 rounded-xl bg-[#16161A] border border-white/8"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#0E0E10] shrink-0">
                  <ResilientImage
                    src={item.product.images[0]}
                    alt={item.product.name[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#F5F2EB] line-clamp-1">
                    {item.product.name[lang]}
                  </h3>
                  <p className="text-xs text-[#A8A196] mt-0.5 truncate">
                    {item.selectedSize} · {item.selectedColor.name[lang]}
                  </p>
                  <p className="font-mono-tabular text-sm font-semibold text-[#E6C76C] mt-1">
                    {formatINR(item.product.price * item.quantity)}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="inline-flex items-center rounded-md border border-white/12 bg-[#0E0E10]">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.key, -1)}
                        aria-label="Decrease quantity"
                        className="w-9 h-9 flex items-center justify-center text-[#E5DFD3] hover:text-[#E6C76C]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-tabular w-7 text-center text-xs font-semibold text-[#F5F2EB]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.key, 1)}
                        disabled={item.quantity >= item.product.stock}
                        aria-label="Increase quantity"
                        className="w-9 h-9 flex items-center justify-center text-[#E5DFD3] hover:text-[#E6C76C] disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.key)}
                      aria-label={t.cart.remove}
                      className="min-h-[36px] px-2 text-xs text-[#A8A196] hover:text-red-400 inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.cart.remove}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {enrichedItems.length > 0 && (
          <div className="px-5 py-4 border-t border-white/10 bg-[#0E0E11] space-y-3">
            <p className="text-xs text-[#A8A196]">
              {t.cart.freeShippingNote}{' '}
              <span className="font-mono-tabular text-[#E6C76C]">
                {formatINR(shopSettings.freeDeliveryThreshold)}
              </span>
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#C8C1B4]">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono-tabular">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#C8C1B4]">
                <span>{t.cart.delivery}</span>
                <span className="font-mono-tabular text-[#E6C76C]">
                  {deliveryFee === 0 ? t.cart.free : formatINR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#F5F2EB] pt-2 border-t border-white/10">
                <span>{t.cart.total}</span>
                <span className="font-mono-tabular text-[#E6C76C]">{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors"
            >
              {t.cart.proceedCheckout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
