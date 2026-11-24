export type Language = 'en' | 'hi';

export type CategoryId =
  | 'fancy-lights'
  | 'chandeliers'
  | 'wall-lights'
  | 'home-decor'
  | 'wall-clocks'
  | 'gifts-more';

export type AppView =
  | 'home'
  | 'catalog'
  | 'product'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'contact'
  | 'admin';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface ProductColorOption {
  name: BilingualText;
  hex: string;
}

export interface Product {
  id: string;
  name: BilingualText;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  description: BilingualText;
  images: string[];
  sizes: string[];
  colors: ProductColorOption[];
  stock: number;
  featured: boolean;
  latest: boolean;
  sku: string;
}

export interface CartItem {
  key: string;
  productId: string;
  selectedSize: string;
  selectedColor: ProductColorOption;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: BilingualText;
  image: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  customerId?: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
  paymentMethod: 'COD';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
}

export interface ShopSettings {
  shopName: string;
  tagline: BilingualText;
  promoBanner: BilingualText;
  address: BilingualText;
  openingHours: BilingualText;
  phone: string;
  whatsapp: string;
  mapUrl: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
}
