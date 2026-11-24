import { useState } from 'react';
import {
  Check,
  LogOut,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  CategoryId,
  Language,
  Order,
  OrderStatus,
  Product,
  ShopSettings,
} from '../types';
import { ASSET_GALLERY } from '../data/initialData';
import {
  CATEGORY_LABELS,
  ORDER_STATUS_LABELS,
  UI_COPY,
} from '../data/translations';
import { formatDate, formatINR } from '../utils/format';
import { ResilientImage } from './ResilientImage';
import { AuthGateCard } from './AuthGateCard';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  shopSettings: ShopSettings;
  lang: Language;
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onAddProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdateShopSettings: (settings: ShopSettings) => Promise<void>;
  onResetDemoData: () => Promise<void>;
}

const ALL_CATEGORIES: CategoryId[] = [
  'fancy-lights',
  'chandeliers',
  'wall-lights',
  'home-decor',
  'wall-clocks',
  'gifts-more',
];

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Packed',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

interface ProductFormState {
  id?: string;
  sku: string;
  nameEn: string;
  nameHi: string;
  category: CategoryId;
  price: string;
  originalPrice: string;
  stock: string;
  sizes: string;
  colorEn: string;
  colorHi: string;
  colorHex: string;
  descriptionEn: string;
  descriptionHi: string;
  imageUrl: string;
  featured: boolean;
  latest: boolean;
}

function createEmptyForm(): ProductFormState {
  return {
    sku: `YL-${Math.floor(100 + Math.random() * 900)}`,
    nameEn: '',
    nameHi: '',
    category: 'fancy-lights',
    price: '3999',
    originalPrice: '',
    stock: '10',
    sizes: 'Standard',
    colorEn: 'Warm Gold',
    colorHi: 'वार्म गोल्ड',
    colorHex: '#D4AF37',
    descriptionEn: '',
    descriptionHi: '',
    imageUrl: ASSET_GALLERY[0].url,
    featured: true,
    latest: true,
  };
}

export function AdminView({
  products,
  orders,
  shopSettings,
  lang,
  user,
  isAdmin,
  authReady,
  onSignIn,
  onSignOut,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateShopSettings,
  onResetDemoData,
}: AdminViewProps) {
  const t = UI_COPY[lang];
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [editingForm, setEditingForm] = useState<ProductFormState | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [settingsDraft, setSettingsDraft] = useState<ShopSettings>(shopSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!authReady) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-[#B5AEA2]">
        {lang === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying session...'}
      </section>
    );
  }

  if (!user) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <AuthGateCard
          lang={lang}
          title={t.admin.title}
          subtitle={
            lang === 'hi'
              ? 'प्रोडक्ट्स, कीमतें, स्टॉक और ऑर्डर स्थायी रूप से प्रबंधित करने के लिए स्टोर एडमिन Google अकाउंट से साइन इन करें।'
              : 'Sign in with the store owner Google account to manage products, pricing, orders, and shop settings in Firestore.'
          }
          onSignIn={() => void onSignIn()}
        />
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <AuthGateCard
          lang={lang}
          isUnauthorizedAdmin
          signedInEmail={user.email}
          title={lang === 'hi' ? 'एडमिन अनुमति आवश्यक है' : 'Store Admin Access Required'}
          subtitle={
            lang === 'hi'
              ? 'यह अकाउंट स्टोर एडमिन के रूप में पंजीकृत नहीं है। कृपया स्टोर मालिक के Google अकाउंट से साइन इन करें।'
              : 'This Google account does not have store admin permissions. Please sign in with the store owner account.'
          }
          onSignIn={() => void onSignIn()}
          onSignOut={() => void onSignOut()}
        />
      </section>
    );
  }

  const openEditProduct = (product: Product) => {
    setEditingForm({
      id: product.id,
      sku: product.sku,
      nameEn: product.name.en,
      nameHi: product.name.hi,
      category: product.category,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: String(product.stock),
      sizes: product.sizes.join(', '),
      colorEn: product.colors[0]?.name.en ?? 'Warm Gold',
      colorHi: product.colors[0]?.name.hi ?? 'वार्म गोल्ड',
      colorHex: product.colors[0]?.hex ?? '#D4AF37',
      descriptionEn: product.description.en,
      descriptionHi: product.description.hi,
      imageUrl: product.images[0] ?? ASSET_GALLERY[0].url,
      featured: product.featured,
      latest: product.latest,
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;
    setSaving(true);
    try {
      const priceNum = Math.max(1, Number(editingForm.price) || 0);
      const origNum = Number(editingForm.originalPrice);
      const stockNum = Math.max(0, Math.floor(Number(editingForm.stock) || 0));
      const parsedSizes = editingForm.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const existing = editingForm.id
        ? products.find((p) => p.id === editingForm.id)
        : undefined;

      const nextProduct: Product = {
        id: editingForm.id ?? `prod-${Date.now()}`,
        sku: editingForm.sku.trim() || `YL-${Date.now().toString().slice(-4)}`,
        name: {
          en: editingForm.nameEn.trim() || 'Untitled Product',
          hi: editingForm.nameHi.trim() || editingForm.nameEn.trim() || 'उत्पाद',
        },
        category: editingForm.category,
        price: priceNum,
        originalPrice: origNum > priceNum ? origNum : undefined,
        description: {
          en: editingForm.descriptionEn.trim() || 'Handpicked luxury lighting and decor piece.',
          hi:
            editingForm.descriptionHi.trim() ||
            editingForm.descriptionEn.trim() ||
            'प्रीमियम लाइटिंग और होम डेकोर उत्पाद।',
        },
        images: [editingForm.imageUrl.trim() || ASSET_GALLERY[0].url],
        sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
        colors: existing?.colors.length
          ? [
              {
                name: {
                  en: editingForm.colorEn.trim() || 'Warm Gold',
                  hi: editingForm.colorHi.trim() || 'वार्म गोल्ड',
                },
                hex: editingForm.colorHex || '#D4AF37',
              },
              ...existing.colors.slice(1),
            ]
          : [
              {
                name: {
                  en: editingForm.colorEn.trim() || 'Warm Gold',
                  hi: editingForm.colorHi.trim() || 'वार्म गोल्ड',
                },
                hex: editingForm.colorHex || '#D4AF37',
              },
            ],
        stock: stockNum,
        featured: editingForm.featured,
        latest: editingForm.latest,
      };

      if (editingForm.id) {
        await onUpdateProduct(nextProduct);
      } else {
        await onAddProduct(nextProduct);
      }
      setEditingForm(null);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStock = (product: Product, delta: number) => {
    void onUpdateProduct({
      ...product,
      stock: Math.max(0, product.stock + delta),
    });
  };

  const handleQuickPrice = (product: Product, rawValue: string) => {
    const parsed = Number(rawValue);
    if (!Number.isNaN(parsed) && parsed > 0) {
      void onUpdateProduct({
        ...product,
        price: Math.floor(parsed),
      });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateShopSettings(settingsDraft);
      setSettingsSaved(true);
      window.setTimeout(() => setSettingsSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders =
    orderStatusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Admin Session Bar */}
      <div className="mb-6 px-4 py-3 rounded-xl bg-[#131316] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[#C8C1B4]">
          {lang === 'hi' ? 'एडमिन लॉगिन:' : 'Signed in Admin:'}{' '}
          <span className="font-mono-tabular text-[#E6C76C] font-medium">
            {user.email}
          </span>
        </span>
        <button
          type="button"
          onClick={() => void onSignOut()}
          className="inline-flex items-center gap-1.5 text-[#D0C9BD] hover:text-[#E6C76C] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'साइन आउट' : 'Sign Out'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB]">
            {t.admin.title}
          </h1>
          <p className="text-sm text-[#B5AEA2] mt-1">{t.admin.subtitle}</p>
        </div>

        {/* Admin Segmented Tabs */}
        <div
          role="tablist"
          className="inline-flex items-center p-1 rounded-lg bg-[#131316] border border-white/12 self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'products'}
            onClick={() => setActiveTab('products')}
            className={`min-h-[40px] px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#D4AF37] text-[#0A0A0B]'
                : 'text-[#C8C1B4] hover:text-[#F5F2EB]'
            }`}
          >
            {t.admin.tabProducts} ({products.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            className={`min-h-[40px] px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-[#0A0A0B]'
                : 'text-[#C8C1B4] hover:text-[#F5F2EB]'
            }`}
          >
            {t.admin.tabOrders} ({orders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => {
              setSettingsDraft(shopSettings);
              setActiveTab('settings');
            }}
            className={`min-h-[40px] px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#D4AF37] text-[#0A0A0B]'
                : 'text-[#C8C1B4] hover:text-[#F5F2EB]'
            }`}
          >
            {t.admin.tabSettings}
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditingForm(createEmptyForm())}
              className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.admin.addProduct}</span>
            </button>
          </div>

          {editingForm && (
            <form
              onSubmit={handleSaveProduct}
              className="bg-[#151519] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="font-display text-2xl font-semibold text-[#F5F2EB]">
                  {editingForm.id ? t.admin.editProduct : t.admin.addProduct}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingForm(null)}
                  className="p-2 text-[#A8A196] hover:text-[#F5F2EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.productNameEn} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={editingForm.nameEn}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, nameEn: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.productNameHi}
                  </label>
                  <input
                    type="text"
                    maxLength={160}
                    value={editingForm.nameHi}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, nameHi: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.category}
                  </label>
                  <select
                    value={editingForm.category}
                    onChange={(e) =>
                      setEditingForm({
                        ...editingForm,
                        category: e.target.value as CategoryId,
                      })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c][lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.product.sku}
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={editingForm.sku}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, sku: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.price} *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingForm.price}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, price: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.originalPrice}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingForm.originalPrice}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, originalPrice: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.stock} *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingForm.stock}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, stock: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.sizes}
                  </label>
                  <input
                    type="text"
                    value={editingForm.sizes}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, sizes: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    Finish / Colour (English)
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    value={editingForm.colorEn}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, colorEn: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.imageSelect}
                  </label>
                  <select
                    value={editingForm.imageUrl}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, imageUrl: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {ASSET_GALLERY.map((asset) => (
                      <option key={asset.url} value={asset.url}>
                        {asset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.descriptionEn}
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={editingForm.descriptionEn}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, descriptionEn: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                    {t.admin.descriptionHi}
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={editingForm.descriptionHi}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, descriptionHi: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-[#F5F2EB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingForm.featured}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span>{t.admin.featuredFlag}</span>
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-[#F5F2EB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingForm.latest}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, latest: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span>{t.admin.latestFlag}</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {t.admin.saveProduct}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingForm(null)}
                  className="min-h-[46px] px-5 py-2.5 rounded-lg border border-white/15 text-sm font-medium text-[#C8C1B4] hover:text-[#F5F2EB] transition-colors"
                >
                  {t.admin.cancel}
                </button>
              </div>
            </form>
          )}

          {/* Inventory List */}
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#131316] border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#0E0E10] shrink-0">
                    <ResilientImage
                      src={product.images[0]}
                      alt={product.name[lang]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#9C958A]">
                      <span className="text-[#E6C76C]">
                        {CATEGORY_LABELS[product.category][lang]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{product.sku}</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-[#F5F2EB] truncate">
                      {product.name[lang]}
                    </p>
                  </div>
                </div>

                {/* Inline Price, Stock & Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 bg-[#0E0E10] border border-white/12 rounded-lg px-2.5 py-1">
                    <span className="text-xs text-[#9C958A]">₹</span>
                    <input
                      type="number"
                      min={1}
                      aria-label={`Price for ${product.name[lang]}`}
                      value={product.price}
                      onChange={(e) => handleQuickPrice(product, e.target.value)}
                      className="w-20 bg-transparent text-sm font-mono-tabular text-[#F5F2EB] focus:outline-none"
                    />
                  </div>

                  <div className="inline-flex items-center rounded-lg border border-white/12 bg-[#0E0E10]">
                    <button
                      type="button"
                      onClick={() => handleQuickStock(product, -1)}
                      aria-label="Decrease stock"
                      className="w-9 h-10 flex items-center justify-center text-[#C8C1B4] hover:text-[#E6C76C]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono-tabular w-12 text-center text-xs font-semibold text-[#F5F2EB]">
                      {product.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickStock(product, 1)}
                      aria-label="Increase stock"
                      className="w-9 h-10 flex items-center justify-center text-[#C8C1B4] hover:text-[#E6C76C]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditProduct(product)}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-white/15 text-xs font-medium text-[#F5F2EB] hover:border-[#D4AF37] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#E6C76C]" />
                    <span>{t.admin.editProduct}</span>
                  </button>

                  {confirmDeleteId === product.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          void onDeleteProduct(product.id);
                          setConfirmDeleteId(null);
                        }}
                        className="min-h-[40px] px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                      >
                        {t.admin.confirmDelete}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="min-h-[40px] px-2.5 py-2 rounded-lg border border-white/15 text-xs text-[#C8C1B4]"
                      >
                        {t.admin.cancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(product.id)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg border border-red-500/30 text-xs font-medium text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.admin.deleteProduct}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#C8C1B4]">
              {t.admin.ordersCount}:{' '}
              <span className="font-mono-tabular font-semibold text-[#E6C76C]">
                {filteredOrders.length}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOrderStatusFilter('all')}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  orderStatusFilter === 'all'
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0B] font-semibold'
                    : 'bg-[#131316] border-white/12 text-[#C8C1B4]'
                }`}
              >
                {t.home.allCategories}
              </button>
              {ALL_STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0B] font-semibold'
                      : 'bg-[#131316] border-white/12 text-[#C8C1B4]'
                  }`}
                >
                  {ORDER_STATUS_LABELS[st][lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#131316] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tabular text-lg font-semibold text-[#E6C76C]">
                        {order.id}
                      </span>
                      <span className="text-xs text-[#9C958A] font-mono-tabular">
                        {formatDate(order.createdAt, lang)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#F5F2EB] mt-1">
                      {order.customerName} ·{' '}
                      <span className="font-mono-tabular">{order.phone}</span>
                    </p>
                    <p className="text-xs text-[#B5AEA2] mt-0.5">
                      {order.address}, {order.city} – {order.pincode}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <span className="font-mono-tabular text-base font-semibold text-[#F5F2EB]">
                      {formatINR(order.total)} (COD)
                    </span>
                    <select
                      aria-label={`${t.admin.updateStatus} ${order.id}`}
                      value={order.status}
                      onChange={(e) =>
                        void onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="min-h-[42px] px-3 py-1.5 rounded-lg bg-[#0E0E10] border border-[#D4AF37]/50 text-xs sm:text-sm font-medium text-[#E6C76C] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {ORDER_STATUS_LABELS[st][lang]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order.id}-${idx}`}
                      className="flex items-center gap-2.5 bg-[#0E0E10] border border-white/8 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-[#F5F2EB]">
                        {item.name[lang]}
                      </span>
                      <span className="text-[#9C958A]">
                        ({item.selectedSize}) ×{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHOP SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-[#131316] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 max-w-4xl"
        >
          {settingsSaved && (
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/35 text-sm text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{t.admin.settingsSaved}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.shopNameLabel}
              </label>
              <input
                type="text"
                maxLength={120}
                value={settingsDraft.shopName}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, shopName: e.target.value })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.taglineEnLabel}
              </label>
              <input
                type="text"
                maxLength={200}
                value={settingsDraft.tagline.en}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    tagline: { ...settingsDraft.tagline, en: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.taglineHiLabel}
              </label>
              <input
                type="text"
                maxLength={200}
                value={settingsDraft.tagline.hi}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    tagline: { ...settingsDraft.tagline, hi: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.promoEnLabel}
              </label>
              <input
                type="text"
                maxLength={250}
                value={settingsDraft.promoBanner.en}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    promoBanner: { ...settingsDraft.promoBanner, en: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.promoHiLabel}
              </label>
              <input
                type="text"
                maxLength={250}
                value={settingsDraft.promoBanner.hi}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    promoBanner: { ...settingsDraft.promoBanner, hi: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.addressLabel} (English)
              </label>
              <textarea
                rows={2}
                maxLength={400}
                value={settingsDraft.address.en}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    address: { ...settingsDraft.address, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.addressLabel} (हिन्दी)
              </label>
              <textarea
                rows={2}
                maxLength={400}
                value={settingsDraft.address.hi}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    address: { ...settingsDraft.address, hi: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.hoursLabel} (English)
              </label>
              <input
                type="text"
                maxLength={200}
                value={settingsDraft.openingHours.en}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    openingHours: { ...settingsDraft.openingHours, en: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.hoursLabel} (हिन्दी)
              </label>
              <input
                type="text"
                maxLength={200}
                value={settingsDraft.openingHours.hi}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    openingHours: { ...settingsDraft.openingHours, hi: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.phoneLabel}
              </label>
              <input
                type="text"
                maxLength={30}
                value={settingsDraft.phone}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, phone: e.target.value })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.whatsappLabel}
              </label>
              <input
                type="text"
                maxLength={30}
                value={settingsDraft.whatsapp}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, whatsapp: e.target.value })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.deliveryChargeLabel}
              </label>
              <input
                type="number"
                min={0}
                value={settingsDraft.deliveryCharge}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    deliveryCharge: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.admin.freeThresholdLabel}
              </label>
              <input
                type="number"
                min={0}
                value={settingsDraft.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    freeDeliveryThreshold: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                Google Maps URL
              </label>
              <input
                type="url"
                maxLength={500}
                value={settingsDraft.mapUrl}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, mapUrl: e.target.value })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {t.admin.saveSettings}
            </button>

            {confirmReset ? (
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void onResetDemoData();
                    setConfirmReset(false);
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                >
                  {t.admin.confirmDelete}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-[42px] px-3 py-2 rounded-lg border border-white/15 text-xs text-[#C8C1B4]"
                >
                  {t.admin.cancel}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg border border-white/15 text-xs font-medium text-[#C8C1B4] hover:text-[#F5F2EB] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.admin.resetDemo}</span>
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
