import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  AppView,
  CartItem,
  CategoryId,
  Language,
  Order,
  OrderStatus,
  Product,
  ProductColorOption,
  ShopSettings,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SHOP_SETTINGS,
} from './data/initialData';
import { auth, signInWithGoogle, signOutUser } from './firebase';
import {
  checkIsAdminUser,
  createOrderInFirestore,
  deleteProductFromFirestore,
  resetDemoDataInFirestore,
  saveProductToFirestore,
  saveShopSettingsToFirestore,
  seedDatabaseIfEmpty,
  subscribeOrders,
  subscribeProducts,
  subscribeShopSettings,
  updateOrderStatusInFirestore,
} from './services/firestoreService';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { TrackOrderView } from './components/TrackOrderView';
import { ContactView } from './components/ContactView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  lang: 'yasmin_lang_v1',
  cart: 'yasmin_cart_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() =>
    readStorage<Language>(STORAGE_KEYS.lang, 'en')
  );
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.cart, [])
  );
  const [shopSettings, setShopSettings] = useState<ShopSettings>(INITIAL_SHOP_SETTINGS);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackInitialQuery, setTrackInitialQuery] = useState('');

  // Persist language & shopping bag locally
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(lang));
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const adminFlag = await checkIsAdminUser(nextUser.uid, nextUser.email);
        setIsAdmin(adminFlag);
        if (adminFlag) {
          await seedDatabaseIfEmpty(nextUser.uid);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Firestore real-time catalog & storefront settings
  useEffect(() => {
    const unsubProducts = subscribeProducts((items, isEmpty) => {
      if (!isEmpty) {
        setProducts(items);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    });

    const unsubSettings = subscribeShopSettings((remoteSettings) => {
      if (remoteSettings) {
        setShopSettings(remoteSettings);
      }
    });

    return () => {
      unsubProducts();
      unsubSettings();
    };
  }, []);

  // Firestore real-time orders (only attached when auth is ready & user is signed in)
  useEffect(() => {
    if (!authReady || !user) {
      setOrders([]);
      return;
    }

    const unsubOrders = subscribeOrders(user.uid, isAdmin, (remoteOrders) => {
      setOrders(remoteOrders);
    });

    return () => unsubOrders();
  }, [authReady, user, isAdmin]);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategory = (cat: CategoryId) => {
    setSelectedCategory(cat);
    navigateTo('catalog');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    navigateTo('product');
  };

  const handleAddToCart = (
    product: Product,
    size: string,
    color: ProductColorOption,
    quantity: number
  ) => {
    if (product.stock <= 0) return;
    const itemKey = `${product.id}__${size}__${color.name.en}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.key === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.key === itemKey
            ? { ...i, quantity: Math.min(product.stock, i.quantity + quantity) }
            : i
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          productId: product.id,
          selectedSize: size,
          selectedColor: color,
          quantity: Math.min(product.stock, quantity),
        },
      ];
    });
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0] ?? 'Standard';
    const defaultColor =
      product.colors[0] ?? {
        name: { en: 'Warm Gold', hi: 'वार्म गोल्ड' },
        hex: '#D4AF37',
      };
    handleAddToCart(product, defaultSize, defaultColor, 1);
  };

  const handleUpdateCartQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.key !== key) return item;
          const product = products.find((p) => p.id === item.productId);
          const maxStock = product ? product.stock : 99;
          const nextQty = Math.min(maxStock, item.quantity + delta);
          return nextQty <= 0 ? null : { ...item, quantity: nextQty };
        })
        .filter((x): x is CartItem => x !== null)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handlePlaceOrder = async (details: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes: string;
  }) => {
    if (!user) return;

    const orderItems = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor.name[lang],
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (orderItems.length === 0) return;

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee =
      subtotal >= shopSettings.freeDeliveryThreshold
        ? 0
        : shopSettings.deliveryCharge;
    const total = subtotal + deliveryFee;

    const nextOrderNumber = `YL-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: nextOrderNumber,
      customerId: user.uid,
      createdAt: new Date().toISOString(),
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      city: details.city,
      pincode: details.pincode,
      notes: details.notes || undefined,
      paymentMethod: 'COD',
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'Pending',
    };

    await createOrderInFirestore(newOrder, user.uid, cart, products);

    setCart([]);
    setConfirmedOrder(newOrder);
    navigateTo('order-confirmation');
  };

  const handleAddProduct = async (product: Product) => {
    await saveProductToFirestore(product);
  };

  const handleUpdateProduct = async (updated: Product) => {
    await saveProductToFirestore(updated);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProductFromFirestore(productId);
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatusInFirestore(orderId, status);
  };

  const handleUpdateShopSettings = async (settings: ShopSettings) => {
    await saveShopSettingsToFirestore(settings);
  };

  const handleResetDemoData = async () => {
    await resetDemoDataInFirestore();
    setCart([]);
  };

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0] ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#F5F2EB]">
      <Header
        shopName={shopSettings.shopName}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'catalog') setSelectedCategory('all');
          navigateTo(view);
        }}
        cartCount={totalBagCount}
        onOpenCart={() => setCartOpen(true)}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            shopSettings={shopSettings}
            lang={lang}
            onSetLang={setLang}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            promoDismissed={promoDismissed}
            onDismissPromo={() => setPromoDismissed(true)}
            onSelectCategory={handleOpenCategory}
            onOpenCatalog={() => {
              setSelectedCategory('all');
              navigateTo('catalog');
            }}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onOpenContact={() => navigateTo('contact')}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogView
            products={products}
            lang={lang}
            onSetLang={setLang}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {currentView === 'product' && activeProduct && (
          <ProductDetailView
            key={activeProduct.id}
            product={activeProduct}
            lang={lang}
            onBack={() => navigateTo('catalog')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            products={products}
            shopSettings={shopSettings}
            lang={lang}
            user={user}
            onSignIn={signInWithGoogle}
            onBackToCatalog={() => navigateTo('catalog')}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {currentView === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationView
            order={confirmedOrder}
            lang={lang}
            onTrackOrder={(orderId) => {
              setTrackInitialQuery(orderId);
              navigateTo('track-order');
            }}
            onContinueShopping={() => navigateTo('catalog')}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderView
            key={trackInitialQuery}
            orders={orders}
            lang={lang}
            user={user}
            onSignIn={signInWithGoogle}
            initialQuery={trackInitialQuery}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            shopSettings={shopSettings}
            lang={lang}
            isAdmin={isAdmin}
            onUpdateShopSettings={handleUpdateShopSettings}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            products={products}
            orders={orders}
            shopSettings={shopSettings}
            lang={lang}
            user={user}
            isAdmin={isAdmin}
            authReady={authReady}
            onSignIn={signInWithGoogle}
            onSignOut={signOutUser}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateShopSettings={handleUpdateShopSettings}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      <Footer
        shopSettings={shopSettings}
        lang={lang}
        onNavigate={(view) => {
          if (view === 'catalog') setSelectedCategory('all');
          navigateTo(view);
        }}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        shopSettings={shopSettings}
        lang={lang}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartOpen(false);
          navigateTo('checkout');
        }}
        onBrowseCatalog={() => {
          setSelectedCategory('all');
          navigateTo('catalog');
        }}
      />
    </div>
  );
}
