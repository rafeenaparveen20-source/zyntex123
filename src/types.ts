export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  mood: string;
  description: string;
  inStock: boolean;
  material?: string;
  dimensions?: string;
  features?: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MoodCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  productId: string;
  title: string;
  price: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'favorite';
}

export type OrderStatus = 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string; // Internal ID
  orderNumber: string; // e.g. "#ZYX-98421"
  createdAt: string; // ISO date string
  customer: CustomerDetails;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}
