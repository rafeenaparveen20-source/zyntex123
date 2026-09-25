/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodCollections } from './components/MoodCollections';
import { ProductCatalog } from './components/ProductCatalog';
import { ShopTheLook } from './components/ShopTheLook';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { WhyZyntex } from './components/WhyZyntex';
import { QuoteSection } from './components/QuoteSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminBanner } from './components/AdminBanner';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MustChangePasswordModal } from './components/admin/MustChangePasswordModal';
import { Toast } from './components/Toast';
import { useAdminAuth } from './context/AdminAuthContext';
import { PRODUCTS } from './data/mockData';
import { INITIAL_ORDERS } from './data/mockOrders';
import { Product, CartItem, ToastMessage, Order, OrderStatus } from './types';

export default function App() {
  const { isAuthenticated, mustChangePassword, user } = useAdminAuth();
  const [currentView, setCurrentView] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zyntex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zyntex_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state initialized with persisted or default mock orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('zyntex_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Admin banner & orders modal states
  const [isAdminBannerVisible, setIsAdminBannerVisible] = useState(true);
  const [adminBannerHeight, setAdminBannerHeight] = useState(0);
  const [isAdminOrdersModalOpen, setIsAdminOrdersModalOpen] = useState(false);
  const [adminOrdersInitialSearch, setAdminOrdersInitialSearch] = useState('');

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zyntex_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('zyntex_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('zyntex_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync with URL Hash for Admin Route Navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#dashboard') {
        if (isAuthenticated) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (hash === '#login') {
        if (isAuthenticated) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (hash === '#store' || hash === '') {
        setCurrentView('store');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAuthenticated]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'favorite' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Orders operations (Protected for admin access)
  const handleOpenOrdersModal = (initialOrderNumber?: string) => {
    if (!isAuthenticated) {
      showToast('Admin authentication required to access order management', 'info');
      setCurrentView('admin-login');
      window.location.hash = 'login';
      return;
    }
    setAdminOrdersInitialSearch(initialOrderNumber || '');
    setIsAdminOrdersModalOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Order status updated to ${newStatus.toUpperCase()}`, 'info');
  };

  const handleUpdateTracking = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, trackingNumber } : ord))
    );
    showToast(`Tracking saved: ${trackingNumber}`, 'success');
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast('Order removed from registry', 'info');
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order ${newOrder.orderNumber} created & logged in Admin Banner! ✦`, 'success');
  };

  const handleGenerateTestOrder = () => {
    const sampleNames = [
      { name: 'Kavya Nair', city: 'Kochi', phone: '+91 98451 90212', address: 'Riverside Villa 12, Panampilly Nagar' },
      { name: 'Sameer Sen', city: 'Kolkata', phone: '+91 97120 44510', address: 'Flat 5A, Salt Lake Sector 2' },
      { name: 'Dia Choudhary', city: 'Pune', phone: '+91 99341 87201', address: 'Koregaon Park Road 5' },
    ];
    const client = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const p1 = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const p2 = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `#ZYX-${randomSuffix}`;

    const items = [
      {
        id: p1.id,
        name: p1.name,
        price: p1.price,
        quantity: 1,
        image: p1.image,
        category: p1.category,
      },
    ];

    if (p1.id !== p2.id) {
      items.push({
        id: p2.id,
        name: p2.name,
        price: p2.price,
        quantity: 1,
        image: p2.image,
        category: p2.category,
      });
    }

    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const discount = subtotal > 3000 ? 300 : 0;
    const total = subtotal - discount;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: client.name,
        email: `${client.name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: client.phone,
        address: client.address,
        city: client.city,
        postalCode: '560001',
      },
      items,
      itemCount: items.reduce((acc, it) => acc + it.quantity, 0),
      subtotal,
      discount,
      shipping: 0,
      total,
      paymentMethod: Math.random() > 0.4 ? 'upi' : 'card',
      status: 'processing',
      notes: 'Demo test order generated for order number sequence verification',
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Generated Order ${orderNumber} (₹${total.toLocaleString('en-IN')}) in Admin Banner ✦`, 'success');
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${product.name} added to bag ✦`, 'success');
  };

  const handleAddBundleToCart = (bundleProducts: Product[]) => {
    setCartItems((prev) => {
      let updated = [...prev];
      bundleProducts.forEach((prod) => {
        const index = updated.findIndex((i) => i.product.id === prod.id);
        if (index > -1) {
          updated[index] = { ...updated[index], quantity: updated[index].quantity + 1 };
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      });
      return updated;
    });
    showToast('Cozy Bedroom look added to your bag ✦', 'info');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from bag', 'info');
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`${product.name} removed from wishlist`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('Added to wishlist ♡', 'favorite');
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleMoveToBag = (product: Product) => {
    handleAddToCart(product, 1);
    handleRemoveFromWishlist(product.id);
  };

  // Navigation scroll triggers
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSelectMood = (moodId: string) => {
    if (moodId === 'all') {
      setSelectedMood(null);
    } else {
      setSelectedMood(moodId);
      scrollToSection('shop');
      showToast(`Showing pieces for ${moodId.replace('-', ' ')} mood ✦`, 'info');
    }
  };

  const handleNewsletterSubscribe = (email: string) => {
    showToast(`Welcome to Zyntex! ✦ Check ${email} for code ZYNTEX10`, 'success');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const totalCartAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // View 1: Admin Login Page
  if (currentView === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#f7f3ea] text-[#20251f]">
        <AdminLoginPage
          onSuccessRedirect={() => {
            setCurrentView('admin-dashboard');
            window.location.hash = 'admin';
            showToast('Authentication verified! Welcome to Zyntex Admin Portal ✦', 'success');
          }}
          onBackToStore={() => {
            setCurrentView('store');
            window.location.hash = '';
          }}
        />
        {isAuthenticated && mustChangePassword && (
          <MustChangePasswordModal
            onSuccess={() => {
              showToast('Permanent password saved! Welcome to Zyntex Admin.', 'success');
            }}
          />
        )}
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // View 2: Admin Dashboard (Protected - Redirects to login if unauthenticated)
  if (currentView === 'admin-dashboard') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#f7f3ea] text-[#20251f]">
          <AdminLoginPage
            onSuccessRedirect={() => {
              setCurrentView('admin-dashboard');
              window.location.hash = 'admin';
              showToast('Authentication verified! Welcome to Zyntex Admin Portal ✦', 'success');
            }}
            onBackToStore={() => {
              setCurrentView('store');
              window.location.hash = '';
            }}
          />
          <Toast toasts={toasts} onDismiss={dismissToast} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f7f3ea] text-[#20251f]">
        <AdminDashboard
          orders={orders}
          products={PRODUCTS}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateTracking={handleUpdateTracking}
          onDeleteOrder={handleDeleteOrder}
          onAddOrder={handleAddOrder}
          onGenerateTestOrder={handleGenerateTestOrder}
          onBackToStore={() => {
            setCurrentView('store');
            window.location.hash = '';
          }}
          onShowToast={(msg, type) => showToast(msg, type || 'info')}
        />
        {mustChangePassword && (
          <MustChangePasswordModal
            onSuccess={() => {
              showToast('Permanent password saved! Welcome to Zyntex Admin.', 'success');
            }}
          />
        )}
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#20251f] flex flex-col selection:bg-[#173c2d] selection:text-white">
      {/* Top Admin Banner & Order Numbers Monitor */}
      <AdminBanner
        orders={orders}
        onOpenOrdersModal={handleOpenOrdersModal}
        onGenerateTestOrder={handleGenerateTestOrder}
        isVisible={isAdminBannerVisible}
        onToggleVisible={() => setIsAdminBannerVisible(!isAdminBannerVisible)}
        onHeightChange={setAdminBannerHeight}
        isAuthenticated={isAuthenticated}
        adminEmail={user?.email}
        onOpenAdminDashboard={() => {
          setCurrentView('admin-dashboard');
          window.location.hash = 'admin';
        }}
        onOpenAdminLogin={() => {
          setCurrentView('admin-login');
          window.location.hash = 'login';
        }}
      />

      {/* Floating Pill Header Navigation */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        ordersCount={orders.length}
        isAdminBannerVisible={isAdminBannerVisible}
        bannerHeight={isAdminBannerVisible ? adminBannerHeight : 0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOrdersManager={() => handleOpenOrdersModal()}
        isAuthenticated={isAuthenticated}
        onOpenAdmin={() => {
          if (isAuthenticated) {
            setCurrentView('admin-dashboard');
            window.location.hash = 'admin';
          } else {
            setCurrentView('admin-login');
            window.location.hash = 'login';
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 transition-all duration-300">
        {/* Hero Section */}
        <Hero
          onExploreShop={() => scrollToSection('shop')}
          onExploreMood={() => scrollToSection('mood')}
          isAdminBannerVisible={isAdminBannerVisible}
        />

        {/* Mood Collections (Shop by mood) */}
        <MoodCollections
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
        />

        {/* Products Catalog (Most-loved picks) */}
        <ProductCatalog
          products={PRODUCTS}
          wishlistIds={wishlistIds}
          selectedMood={selectedMood}
          onAddToCart={(product) => handleAddToCart(product, 1)}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(product) => setQuickViewProduct(product)}
          onClearMoodFilter={() => setSelectedMood(null)}
        />

        {/* Shop the Look (One room. One mood.) */}
        <ShopTheLook
          products={PRODUCTS}
          onAddToCart={(product) => handleAddToCart(product, 1)}
          onAddBundleToCart={handleAddBundleToCart}
        />

        {/* Before & After Transformation */}
        <BeforeAfterSection />

        {/* Why Zyntex Benefits Grid */}
        <WhyZyntex />

        {/* Inspiring Editorial Quote */}
        <QuoteSection />

        {/* Newsletter Signup */}
        <Newsletter onSubscribe={handleNewsletterSubscribe} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToBag={handleMoveToBag}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        onAddToCart={(product) => handleAddToCart(product, 1)}
      />

      {/* Quick View Product Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal with Dynamic Order Generation */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        totalAmount={totalCartAmount}
        onOrderSuccess={(newOrder) => {
          setCartItems([]);
          handleAddOrder(newOrder);
          showToast(`Order ${newOrder.orderNumber} confirmed & logged in Admin Banner! ✦`, 'success');
        }}
        onOpenOrderInAdmin={(orderNumber) => handleOpenOrdersModal(orderNumber)}
      />

      {/* Admin Order Numbers & Logistics Manager Modal */}
      <AdminOrdersModal
        isOpen={isAdminOrdersModalOpen}
        onClose={() => setIsAdminOrdersModalOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateTracking={handleUpdateTracking}
        onDeleteOrder={handleDeleteOrder}
        onAddOrder={handleAddOrder}
        availableProducts={PRODUCTS}
        initialSearchQuery={adminOrdersInitialSearch}
      />

      {/* Mandatory first-login password change barrier */}
      {isAuthenticated && mustChangePassword && (
        <MustChangePasswordModal
          onSuccess={() => {
            showToast('Permanent password saved! Welcome to Zyntex Admin.', 'success');
          }}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
