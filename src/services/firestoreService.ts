import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SHOP_SETTINGS,
} from '../data/initialData';
import { CartItem, Order, OrderStatus, Product, ShopSettings } from '../types';

function clampStr(value: string, maxLen: number, fallback = ''): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

function sanitizeId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  return cleaned || `id-${Date.now()}`;
}

function serializeProduct(product: Product) {
  const payload: Record<string, unknown> = {
    id: sanitizeId(product.id),
    sku: clampStr(product.sku, 40, 'YL-001'),
    name: {
      en: clampStr(product.name.en, 160, 'Lighting Fixture'),
      hi: clampStr(product.name.hi, 160, product.name.en || 'लाइटिंग उत्पाद'),
    },
    category: product.category,
    price: Math.max(1, Math.min(10000000, Math.round(product.price))),
    description: {
      en: clampStr(product.description.en, 2000, 'Handpicked lighting and home decor.'),
      hi: clampStr(
        product.description.hi,
        2000,
        product.description.en || 'प्रीमियम लाइटिंग और होम डेकोर।'
      ),
    },
    images: (product.images.length ? product.images : ['/src/assets/images/prod_crystal_chandelier_1795536116962.jpg'])
      .slice(0, 6)
      .map((u) => clampStr(u, 500)),
    sizes: (product.sizes.length ? product.sizes : ['Standard'])
      .slice(0, 10)
      .map((s) => clampStr(s, 80, 'Standard')),
    colors: (product.colors.length
      ? product.colors
      : [{ name: { en: 'Warm Gold', hi: 'वार्म गोल्ड' }, hex: '#D4AF37' }]
    ).slice(0, 10),
    stock: Math.max(0, Math.min(100000, Math.floor(product.stock))),
    featured: Boolean(product.featured),
    latest: Boolean(product.latest),
    updatedAt: serverTimestamp(),
  };

  if (product.originalPrice && product.originalPrice >= Number(payload.price)) {
    payload.originalPrice = Math.min(10000000, Math.round(product.originalPrice));
  }

  return payload;
}

function serializeShopSettings(settings: ShopSettings) {
  return {
    shopName: clampStr(settings.shopName, 120, 'Yasmin Lights & Home Decor'),
    tagline: {
      en: clampStr(settings.tagline.en, 200, 'Light Your Home, Beautify Your Life.'),
      hi: clampStr(settings.tagline.hi, 200, 'अपने घर को रोशन करें, अपने जीवन को सुंदर बनाएं।'),
    },
    promoBanner: {
      en: clampStr(settings.promoBanner.en, 250, 'Cash on Delivery available'),
      hi: clampStr(settings.promoBanner.hi, 250, 'कैश ऑन डिलीवरी उपलब्ध'),
    },
    address: {
      en: clampStr(settings.address.en, 400, 'Showroom Address'),
      hi: clampStr(settings.address.hi, 400, 'शोरूम का पता'),
    },
    openingHours: {
      en: clampStr(settings.openingHours.en, 200, '10:30 AM – 9:00 PM'),
      hi: clampStr(settings.openingHours.hi, 200, 'सुबह 10:30 – रात 9:00 बजे'),
    },
    phone: clampStr(settings.phone, 30, '+91 98765 43210'),
    whatsapp: clampStr(settings.whatsapp, 30, '+91 98765 43210'),
    mapUrl: clampStr(settings.mapUrl, 500, 'https://maps.google.com'),
    deliveryCharge: Math.max(0, Math.min(50000, Math.round(settings.deliveryCharge))),
    freeDeliveryThreshold: Math.max(
      0,
      Math.min(500000, Math.round(settings.freeDeliveryThreshold))
    ),
    updatedAt: serverTimestamp(),
  };
}

function parseTimestampToIso(val: unknown): string {
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

export async function checkIsAdminUser(uid: string, email?: string | null): Promise<boolean> {
  if (email && email.toLowerCase() === 'saakib4571046@gmail.com') {
    return true;
  }
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists();
  } catch {
    return false;
  }
}

export function subscribeProducts(
  onData: (products: Product[], isEmpty: boolean) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Product[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: data.id || d.id,
          sku: data.sku || d.id,
          name: data.name || { en: 'Product', hi: 'उत्पाद' },
          category: data.category || 'fancy-lights',
          price: Number(data.price) || 0,
          originalPrice:
            data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
          description: data.description || { en: '', hi: '' },
          images: Array.isArray(data.images) ? data.images : [],
          sizes: Array.isArray(data.sizes) ? data.sizes : ['Standard'],
          colors: Array.isArray(data.colors) ? data.colors : [],
          stock: Number(data.stock) || 0,
          featured: Boolean(data.featured),
          latest: Boolean(data.latest),
        };
      });
      onData(items, snapshot.empty);
    },
    (error) => {
      if (onError && error instanceof Error) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeShopSettings(
  onData: (settings: ShopSettings | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'settings/shop';
  return onSnapshot(
    doc(db, 'settings', 'shop'),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        shopName: d.shopName,
        tagline: d.tagline,
        promoBanner: d.promoBanner,
        address: d.address,
        openingHours: d.openingHours,
        phone: d.phone,
        whatsapp: d.whatsapp,
        mapUrl: d.mapUrl,
        deliveryCharge: Number(d.deliveryCharge) || 0,
        freeDeliveryThreshold: Number(d.freeDeliveryThreshold) || 0,
      });
    },
    (error) => {
      if (onError && error instanceof Error) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeOrders(
  customerUid: string,
  isAdminUser: boolean,
  onData: (orders: Order[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'orders';
  const q = isAdminUser
    ? collection(db, path)
    : query(collection(db, path), where('customerId', '==', customerUid));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Order[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: data.id || d.id,
          customerId: data.customerId,
          createdAt: parseTimestampToIso(data.createdAt),
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          notes: data.notes,
          paymentMethod: 'COD',
          items: Array.isArray(data.items) ? data.items : [],
          subtotal: Number(data.subtotal) || 0,
          deliveryFee: Number(data.deliveryFee) || 0,
          total: Number(data.total) || 0,
          status: data.status || 'Pending',
        };
      });
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      onData(list);
    },
    (error) => {
      if (onError && error instanceof Error) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function seedDatabaseIfEmpty(adminUid: string): Promise<void> {
  try {
    const prodSnap = await getDocs(collection(db, 'products'));
    const settingsSnap = await getDoc(doc(db, 'settings', 'shop'));
    const ordersSnap = await getDocs(collection(db, 'orders'));

    if (!prodSnap.empty && settingsSnap.exists()) {
      return;
    }

    const batch = writeBatch(db);

    if (prodSnap.empty) {
      for (const prod of INITIAL_PRODUCTS) {
        batch.set(doc(db, 'products', prod.id), serializeProduct(prod));
      }
    }

    if (!settingsSnap.exists()) {
      batch.set(doc(db, 'settings', 'shop'), serializeShopSettings(INITIAL_SHOP_SETTINGS));
    }

    if (ordersSnap.empty) {
      for (const order of INITIAL_ORDERS) {
        batch.set(doc(db, 'orders', order.id), {
          id: order.id,
          customerId: adminUid,
          customerName: clampStr(order.customerName, 100),
          phone: clampStr(order.phone, 20),
          address: clampStr(order.address, 300),
          city: clampStr(order.city, 80),
          pincode: clampStr(order.pincode, 10),
          ...(order.notes ? { notes: clampStr(order.notes, 250) } : {}),
          paymentMethod: 'COD',
          items: order.items.slice(0, 30),
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          status: order.status,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const id = sanitizeId(product.id);
  const path = `products/${id}`;
  try {
    await setDoc(doc(db, 'products', id), serializeProduct({ ...product, id }));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveShopSettingsToFirestore(settings: ShopSettings): Promise<void> {
  const path = 'settings/shop';
  try {
    await setDoc(doc(db, 'settings', 'shop'), serializeShopSettings(settings));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createOrderInFirestore(
  order: Order,
  customerUid: string,
  cartItems: CartItem[],
  products: Product[]
): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const batch = writeBatch(db);

    const orderPayload: Record<string, unknown> = {
      id: sanitizeId(order.id),
      customerId: customerUid,
      customerName: clampStr(order.customerName, 100),
      phone: clampStr(order.phone, 20),
      address: clampStr(order.address, 300),
      city: clampStr(order.city, 80),
      pincode: clampStr(order.pincode, 10),
      paymentMethod: 'COD',
      items: order.items.slice(0, 30),
      subtotal: Math.max(1, Math.round(order.subtotal)),
      deliveryFee: Math.max(0, Math.round(order.deliveryFee)),
      total: Math.max(1, Math.round(order.total)),
      status: 'Pending',
      createdAt: serverTimestamp(),
    };
    if (order.notes && order.notes.trim()) {
      orderPayload.notes = clampStr(order.notes, 250);
    }

    batch.set(doc(db, 'orders', order.id), orderPayload);

    // Decrement stock for ordered products that exist in Firestore
    const qtyByProduct = new Map<string, number>();
    for (const c of cartItems) {
      qtyByProduct.set(c.productId, (qtyByProduct.get(c.productId) ?? 0) + c.quantity);
    }

    for (const [productId, orderedQty] of qtyByProduct.entries()) {
      const prod = products.find((p) => p.id === productId);
      if (!prod || orderedQty <= 0) continue;
      const prodRef = doc(db, 'products', productId);
      const prodSnap = await getDoc(prodRef);
      if (!prodSnap.exists()) continue;
      const currentRemoteStock = Number(prodSnap.data().stock ?? prod.stock);
      const nextStock = Math.max(0, currentRemoteStock - orderedQty);
      if (nextStock < currentRemoteStock) {
        batch.update(prodRef, {
          stock: nextStock,
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function resetDemoDataInFirestore(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const prod of INITIAL_PRODUCTS) {
      batch.set(doc(db, 'products', prod.id), serializeProduct(prod));
    }
    batch.set(doc(db, 'settings', 'shop'), serializeShopSettings(INITIAL_SHOP_SETTINGS));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'reset');
  }
}
