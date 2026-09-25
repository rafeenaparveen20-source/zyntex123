import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ClipboardList, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  ordersCount?: number;
  onOpenOrdersManager?: () => void;
  isAdminBannerVisible?: boolean;
  bannerHeight?: number;
  onOpenAdmin?: () => void;
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  ordersCount = 0,
  onOpenOrdersManager,
  isAdminBannerVisible = false,
  bannerHeight = 0,
  onOpenAdmin,
  isAuthenticated = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // When scrolled down, float neatly near top (16px).
  // When at top of page, clear the admin banner completely.
  const topOffset = isScrolled
    ? 16
    : isAdminBannerVisible && bannerHeight > 0
    ? bannerHeight + 14
    : 16;

  return (
    <header
      style={{ top: `${topOffset}px` }}
      className="fixed z-40 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[1180px] transition-[top] duration-300 ease-out"
    >
      <nav
        id="main-navigation"
        className="flex items-center justify-between px-5 md:px-7 py-3 md:py-3.5 bg-white/85 backdrop-blur-xl border border-white/90 rounded-full shadow-[0_10px_35px_rgba(23,60,45,0.09)] transition-all duration-300"
      >
        {/* Brand Logo */}
        <a
          href="#"
          className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-[#173c2d] hover:opacity-90 transition-opacity"
        >
          Zyntex
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-[#20251f]">
          <a
            href="#shop"
            onClick={(e) => scrollToSection(e, 'shop')}
            className="hover:text-[#8b6b4d] transition-colors relative py-1"
          >
            Shop
          </a>
          <a
            href="#mood"
            onClick={(e) => scrollToSection(e, 'mood')}
            className="hover:text-[#8b6b4d] transition-colors relative py-1"
          >
            Collections
          </a>
          <a
            href="#look"
            onClick={(e) => scrollToSection(e, 'look')}
            className="hover:text-[#8b6b4d] transition-colors relative py-1"
          >
            Shop the Look
          </a>
          <a
            href="#story"
            onClick={(e) => scrollToSection(e, 'story')}
            className="hover:text-[#8b6b4d] transition-colors relative py-1"
          >
            Our Story
          </a>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Admin Portal button */}
          {(onOpenAdmin || onOpenOrdersManager) && (
            <button
              id="nav-orders-button"
              onClick={onOpenAdmin || onOpenOrdersManager}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#20251f] hover:bg-[#eee9df] hover:text-[#173c2d] transition-colors"
              title={isAuthenticated ? "Store Admin Dashboard" : "Admin Login Portal"}
              aria-label="Admin Portal"
            >
              <ClipboardList className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#173c2d]" />
              {ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#173c2d] text-[#e5d8b8] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {ordersCount}
                </span>
              )}
            </button>
          )}

          {/* Search Button */}
          <button
            id="nav-search-button"
            onClick={onOpenSearch}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#20251f] hover:bg-[#eee9df] hover:text-[#173c2d] transition-colors"
            title="Search products and decor"
            aria-label="Search"
          >
            <Search className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </button>

          {/* Wishlist Button */}
          <button
            id="nav-wishlist-button"
            onClick={onOpenWishlist}
            className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#20251f] hover:bg-[#eee9df] hover:text-[#173c2d] transition-colors"
            title="Your Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 md:w-4.5 md:h-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8b6b4d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button
            id="nav-cart-button"
            onClick={onOpenCart}
            className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#20251f] hover:bg-[#eee9df] hover:text-[#173c2d] transition-colors"
            title="Your Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 md:w-4.5 md:h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#173c2d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#20251f] hover:bg-[#eee9df]"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl flex flex-col gap-4 text-center animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#shop"
            onClick={(e) => scrollToSection(e, 'shop')}
            className="py-2 text-[#20251f] hover:text-[#173c2d] font-medium border-b border-[#eee9df]"
          >
            Shop
          </a>
          <a
            href="#mood"
            onClick={(e) => scrollToSection(e, 'mood')}
            className="py-2 text-[#20251f] hover:text-[#173c2d] font-medium border-b border-[#eee9df]"
          >
            Collections
          </a>
          <a
            href="#look"
            onClick={(e) => scrollToSection(e, 'look')}
            className="py-2 text-[#20251f] hover:text-[#173c2d] font-medium border-b border-[#eee9df]"
          >
            Shop the Look
          </a>
          <a
            href="#story"
            onClick={(e) => scrollToSection(e, 'story')}
            className="py-2 text-[#20251f] hover:text-[#173c2d] font-medium border-b border-[#eee9df]"
          >
            Our Story
          </a>
          {(onOpenAdmin || onOpenOrdersManager) && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdmin) onOpenAdmin();
                else if (onOpenOrdersManager) onOpenOrdersManager();
              }}
              className="py-2 text-[#173c2d] font-bold flex items-center justify-center gap-2 hover:bg-[#f6f2e9] rounded-xl"
            >
              <ClipboardList className="w-4 h-4" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'} ({ordersCount})</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

