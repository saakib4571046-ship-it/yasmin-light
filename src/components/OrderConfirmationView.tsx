import { CheckCircle2, PackageCheck, ArrowRight } from 'lucide-react';
import { Language, Order } from '../types';
import { ORDER_STATUS_LABELS, UI_COPY } from '../data/translations';
import { formatDate, formatINR } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface OrderConfirmationViewProps {
  order: Order;
  lang: Language;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export function OrderConfirmationView({
  order,
  lang,
  onTrackOrder,
  onContinueShopping,
}: OrderConfirmationViewProps) {
  const t = UI_COPY[lang];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="bg-[#131316] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-10 space-y-8">
        {/* Top Confirmation Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB]">
            {t.confirmation.title}
          </h1>
          <p className="text-sm sm:text-base text-[#C8C1B4] max-w-lg mx-auto">
            {t.confirmation.subtitle}
          </p>
        </div>

        {/* Key Order Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 rounded-xl bg-[#0E0E10] border border-white/10">
          <div>
            <p className="text-xs text-[#9C958A]">{t.confirmation.orderNumber}</p>
            <p className="font-mono-tabular text-lg font-semibold text-[#E6C76C] mt-0.5">
              {order.id}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9C958A]">{t.confirmation.paymentMethod}</p>
            <p className="text-sm font-medium text-[#F5F2EB] mt-1">
              {t.confirmation.codLabel} · {formatINR(order.total)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9C958A]">{t.tracking.placedOn}</p>
            <p className="text-sm font-medium text-[#F5F2EB] mt-1">
              {formatDate(order.createdAt, lang)} · {ORDER_STATUS_LABELS[order.status][lang]}
            </p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-1.5 border-t border-white/10 pt-5">
          <p className="text-xs font-semibold text-[#E6C76C]">
            {t.confirmation.deliveryTo}
          </p>
          <p className="text-sm font-medium text-[#F5F2EB]">
            {order.customerName} · <span className="font-mono-tabular">{order.phone}</span>
          </p>
          <p className="text-sm text-[#C8C1B4]">
            {order.address}, {order.city} – {order.pincode}
          </p>
          {order.notes && (
            <p className="text-xs text-[#9C958A]">{order.notes}</p>
          )}
        </div>

        {/* Items Summary */}
        <div className="space-y-3 border-t border-white/10 pt-5">
          <p className="text-xs font-semibold text-[#E6C76C]">
            {t.confirmation.itemsOrdered}
          </p>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="flex items-center gap-3.5 pb-3 border-b border-white/8 last:border-none last:pb-0"
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onTrackOrder(order.id)}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors"
          >
            <PackageCheck className="w-4 h-4" />
            <span>{t.confirmation.trackThisOrder}</span>
          </button>
          <button
            type="button"
            onClick={onContinueShopping}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg border border-white/20 hover:border-[#D4AF37]/60 text-[#F5F2EB] text-sm font-medium transition-colors"
          >
            <span>{t.confirmation.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
