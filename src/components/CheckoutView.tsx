import { useState } from 'react';
import { Banknote, CheckCircle2, ArrowLeft, LogIn } from 'lucide-react';
import type { User } from 'firebase/auth';
import { CartItem, Language, Product, ShopSettings } from '../types';
import { UI_COPY } from '../data/translations';
import { formatINR, sanitizePhoneDigits } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface CheckoutViewProps {
  cart: CartItem[];
  products: Product[];
  shopSettings: ShopSettings;
  lang: Language;
  user: User | null;
  onSignIn: () => Promise<void>;
  onBackToCatalog: () => void;
  onPlaceOrder: (details: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes: string;
  }) => Promise<void>;
}

export function CheckoutView({
  cart,
  products,
  shopSettings,
  lang,
  user,
  onSignIn,
  onBackToCatalog,
  onPlaceOrder,
}: CheckoutViewProps) {
  const t = UI_COPY[lang];
  const [customerName, setCustomerName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
  const deliveryFee =
    subtotal === 0 || subtotal >= shopSettings.freeDeliveryThreshold
      ? 0
      : shopSettings.deliveryCharge;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया ऑर्डर कन्फर्म करने के लिए पहले Google से साइन इन करें।'
          : 'Please sign in with Google before confirming your order.'
      );
      return;
    }

    const digitsPhone = sanitizePhoneDigits(phone);
    const digitsPin = sanitizePhoneDigits(pincode);

    if (
      customerName.trim().length < 2 ||
      digitsPhone.length < 10 ||
      address.trim().length < 6 ||
      city.trim().length < 2 ||
      digitsPin.length !== 6
    ) {
      setErrorMsg(t.checkout.validationError);
      return;
    }

    setErrorMsg('');
    setSubmitting(true);
    try {
      await onPlaceOrder({
        customerName: customerName.trim(),
        phone: digitsPhone.slice(-10),
        address: address.trim(),
        city: city.trim(),
        pincode: digitsPin,
        notes: notes.trim(),
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : lang === 'hi'
          ? 'ऑर्डर सेव करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Could not place order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (enrichedItems.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-[#F5F2EB] mb-3">
          {t.cart.emptyTitle}
        </h1>
        <p className="text-sm text-[#B5AEA2] mb-6">{t.cart.emptyBody}</p>
        <button
          type="button"
          onClick={onBackToCatalog}
          className="min-h-[46px] px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors"
        >
          {t.checkout.backToCatalog}
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <button
        type="button"
        onClick={onBackToCatalog}
        className="inline-flex items-center gap-2 min-h-[44px] pr-4 text-sm font-medium text-[#C8C1B4] hover:text-[#E6C76C] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.checkout.backToCatalog}</span>
      </button>

      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB]">
          {t.checkout.title}
        </h1>
        <p className="text-sm text-[#B5AEA2] mt-1">{t.checkout.subtitle}</p>
      </div>

      {/* Google Sign-In prompt for permanent Firestore order saving */}
      <div className="mb-6 bg-[#131316] border border-[#D4AF37]/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#F5F2EB]">
            {user
              ? lang === 'hi'
                ? `साइन इन: ${user.email}`
                : `Signed in as ${user.email}`
              : lang === 'hi'
              ? 'स्थायी ऑर्डर सेव और ट्रैकिंग के लिए Google से साइन इन करें'
              : 'Sign in with Google to save & track your order permanently'}
          </p>
          <p className="text-xs text-[#A8A196] mt-0.5">
            {user
              ? lang === 'hi'
                ? 'आपका ऑर्डर सुरक्षित रूप से डेटाबेस में सेव होगा।'
                : 'Your COD order will be stored securely in your account.'
              : lang === 'hi'
              ? 'ऑर्डर कन्फर्म करने से पहले 1-क्लिक Google लॉगिन आवश्यक है।'
              : 'One-click Google sign-in is required before submitting your order.'}
          </p>
        </div>

        {!user && (
          <button
            type="button"
            onClick={() => void onSignIn()}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === 'hi' ? 'Google से साइन इन' : 'Sign in with Google'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Delivery Details + COD Payment */}
        <div className="lg:col-span-7 space-y-6 bg-[#131316] border border-white/10 rounded-2xl p-5 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.checkout.customerName} *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.checkout.phone} *
              </label>
              <input
                type="tel"
                required
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
              {t.checkout.address} *
            </label>
            <textarea
              required
              rows={3}
              maxLength={300}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.checkout.city} *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.checkout.pincode} *
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="226001"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
              {t.checkout.notes}
            </label>
            <input
              type="text"
              maxLength={250}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.checkout.notesPlaceholder}
              className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] placeholder:text-[#7E786E] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* COD Payment Option */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-[#E5DFD3] mb-3">
              {t.checkout.paymentTitle}
            </p>
            <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/50 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-[#E6C76C] shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-[#E6C76C]" />
                  <span className="text-sm font-semibold text-[#F5F2EB]">
                    {t.checkout.codTitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#D0C9BD] mt-1">
                  {t.checkout.codDesc}
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/40 text-xs sm:text-sm text-red-300"
            >
              {errorMsg}
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 bg-[#131316] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-semibold text-[#F5F2EB]">
            {t.checkout.orderSummary}
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {enrichedItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 pb-3 border-b border-white/8"
              >
                <div className="w-16 h-12 rounded-md overflow-hidden bg-[#0E0E10] shrink-0">
                  <ResilientImage
                    src={item.product.images[0]}
                    alt={item.product.name[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F5F2EB] truncate">
                    {item.product.name[lang]}
                  </p>
                  <p className="text-xs text-[#9C958A] truncate">
                    {item.selectedSize} · {item.selectedColor.name[lang]} · ×{item.quantity}
                  </p>
                </div>
                <span className="font-mono-tabular text-sm font-semibold text-[#F5F2EB] shrink-0">
                  {formatINR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm pt-1">
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
            <div className="flex justify-between text-base font-semibold text-[#F5F2EB] pt-3 border-t border-white/10">
              <span>{t.cart.total}</span>
              <span className="font-mono-tabular text-xl text-[#E6C76C]">
                {formatINR(total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting
              ? lang === 'hi'
                ? 'ऑर्डर सेव हो रहा है...'
                : 'Confirming Order...'
              : t.checkout.placeOrder}
          </button>
        </aside>
      </form>
    </section>
  );
}
