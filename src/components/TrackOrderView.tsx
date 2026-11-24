import { useState } from 'react';
import { Check, Package, Search, Truck, XCircle } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Language, Order, OrderStatus } from '../types';
import { ORDER_STATUS_LABELS, UI_COPY } from '../data/translations';
import { formatDate, formatINR, sanitizePhoneDigits } from '../utils/format';
import { ResilientImage } from './ResilientImage';
import { AuthGateCard } from './AuthGateCard';

interface TrackOrderViewProps {
  orders: Order[];
  lang: Language;
  user: User | null;
  onSignIn: () => Promise<void>;
  initialQuery?: string;
}

const PROGRESS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Packed',
  'Out for Delivery',
  'Delivered',
];

export function TrackOrderView({
  orders,
  lang,
  user,
  onSignIn,
  initialQuery = '',
}: TrackOrderViewProps) {
  const t = UI_COPY[lang];
  const [query, setQuery] = useState(initialQuery);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialQuery || (orders[0]?.id ?? '')
  );

  if (!user) {
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <AuthGateCard
          lang={lang}
          title={t.tracking.title}
          subtitle={
            lang === 'hi'
              ? 'अपने सेव किए गए ऑर्डर्स की लाइव स्थिति देखने के लिए Google से साइन इन करें।'
              : 'Sign in with Google to view your saved orders and real-time delivery status.'
          }
          onSignIn={() => void onSignIn()}
        />
      </section>
    );
  }

  const normalized = query.trim().toLowerCase();
  const matchedOrders = normalized
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(normalized) ||
          sanitizePhoneDigits(o.phone).includes(sanitizePhoneDigits(normalized))
      )
    : orders;

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) ?? matchedOrders[0] ?? null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedOrders.length > 0) {
      setSelectedOrderId(matchedOrders[0].id);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB]">
          {t.tracking.title}
        </h1>
        <p className="text-sm text-[#B5AEA2] mt-1.5">{t.tracking.subtitle}</p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl"
      >
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.tracking.searchPlaceholder}
            aria-label={t.tracking.searchPlaceholder}
            className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-lg bg-[#131316] border border-white/15 text-sm text-[#F5F2EB] placeholder:text-[#8A8378] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <button
          type="submit"
          className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors whitespace-nowrap"
        >
          {t.tracking.searchButton}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent / Matching Orders List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold text-[#E6C76C]">
            {t.tracking.recentOrders} ({matchedOrders.length})
          </h2>

          {matchedOrders.length === 0 ? (
            <div className="p-5 rounded-xl bg-[#131316] border border-white/10 text-sm text-[#B5AEA2]">
              {t.tracking.noOrderFound}
            </div>
          ) : (
            matchedOrders.map((o) => {
              const isSelected = activeOrder?.id === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-[#1A1814] border-[#D4AF37]'
                      : 'bg-[#131316] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tabular text-sm font-semibold text-[#E6C76C]">
                      {o.id}
                    </span>
                    <span className="text-xs font-medium text-[#D0C9BD]">
                      {ORDER_STATUS_LABELS[o.status][lang]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#F5F2EB] mt-1 truncate">
                    {o.customerName}
                  </p>
                  <p className="text-xs text-[#9C958A] mt-0.5 font-mono-tabular">
                    {formatDate(o.createdAt, lang)} · {formatINR(o.total)}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Active Order Status Timeline & Details */}
        <div className="lg:col-span-8">
          {!activeOrder ? (
            <div className="p-10 rounded-2xl bg-[#131316] border border-white/10 text-center text-[#B5AEA2]">
              {t.tracking.noOrderFound}
            </div>
          ) : (
            <div className="bg-[#131316] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-7">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <p className="text-xs text-[#9C958A]">{t.confirmation.orderNumber}</p>
                  <h2 className="font-mono-tabular text-2xl font-semibold text-[#E6C76C]">
                    {activeOrder.id}
                  </h2>
                  <p className="text-xs text-[#B5AEA2] mt-1">
                    {t.tracking.placedOn} {formatDate(activeOrder.createdAt, lang)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-[#9C958A]">{t.tracking.orderTotal}</p>
                  <p className="font-mono-tabular text-xl font-semibold text-[#F5F2EB]">
                    {formatINR(activeOrder.total)}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <p className="text-xs font-semibold text-[#E6C76C] mb-4">
                  {t.tracking.statusTimeline}
                </p>

                {activeOrder.status === 'Cancelled' ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">
                      {ORDER_STATUS_LABELS.Cancelled[lang]}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {PROGRESS_STEPS.map((step, index) => {
                      const currentIdx = PROGRESS_STEPS.indexOf(activeOrder.status);
                      const completed = index <= currentIdx;
                      const isCurrent = index === currentIdx;
                      return (
                        <div
                          key={step}
                          className={`p-3.5 rounded-xl border transition-colors ${
                            isCurrent
                              ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                              : completed
                              ? 'bg-[#19191D] border-[#D4AF37]/35'
                              : 'bg-[#0E0E10] border-white/8 opacity-55'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                completed
                                  ? 'bg-[#D4AF37] text-[#0A0A0B]'
                                  : 'bg-white/10 text-[#9C958A]'
                              }`}
                            >
                              {completed ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : index === 3 ? (
                                <Truck className="w-3.5 h-3.5" />
                              ) : (
                                <Package className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className="font-mono-tabular text-[11px] text-[#9C958A]">
                              0{index + 1}
                            </span>
                          </div>
                          <p
                            className={`text-xs font-semibold leading-snug ${
                              completed ? 'text-[#F5F2EB]' : 'text-[#8D867B]'
                            }`}
                          >
                            {ORDER_STATUS_LABELS[step][lang]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-[#E6C76C] mb-1">
                  {t.tracking.deliveryAddress}
                </p>
                <p className="text-sm font-medium text-[#F5F2EB]">
                  {activeOrder.customerName} ·{' '}
                  <span className="font-mono-tabular">{activeOrder.phone}</span>
                </p>
                <p className="text-sm text-[#C8C1B4]">
                  {activeOrder.address}, {activeOrder.city} – {activeOrder.pincode}
                </p>
              </div>

              {/* Ordered Items */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-16 h-12 rounded-md overflow-hidden bg-[#0E0E10] shrink-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.name[lang]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5F2EB] truncate">
                        {item.name[lang]}
                      </p>
                      <p className="text-xs text-[#9C958A]">
                        {item.selectedSize} · {item.selectedColor} · ×{item.quantity}
                      </p>
                    </div>
                    <span className="font-mono-tabular text-sm font-semibold text-[#F5F2EB]">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
