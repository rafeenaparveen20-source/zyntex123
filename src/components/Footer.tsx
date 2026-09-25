import React from 'react';
import { LayoutDashboard, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#173c2d] text-[#e8eee7] pt-16 md:pt-20 pb-8 px-4 md:px-8 lg:px-14 border-t border-[#235440]">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-12 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div>
            <span className="font-playfair text-3xl md:text-4xl font-bold tracking-tight text-white block mb-4">
              Zyntex
            </span>
            <p className="text-[#bdcbbd] text-sm leading-relaxed max-w-[340px] mb-6">
              Room makeover products for spaces that feel personal, cozy, and completely yours. Curated for mindful living.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#aebcaf]">
              <span>Crafted with care</span>
              <span>•</span>
              <span>100% Satisfaction</span>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-[#bdcbbd]">
              <li>
                <button
                  onClick={() => scrollTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('mood')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Collections by Mood
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('look')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shop the Look
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Explore column */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#bdcbbd]">
              <li>
                <button
                  onClick={() => scrollTo('story')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Room Makeover Ideas
                </button>
              </li>
              <li>
                <span className="text-[#bdcbbd]/80">About Zyntex</span>
              </li>
              <li>
                <span className="text-[#bdcbbd]/80">Sustainability</span>
              </li>
              <li>
                <span className="text-[#bdcbbd]/80">Customer Reviews</span>
              </li>
            </ul>
          </div>

          {/* Help column */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Help & Operations
            </h4>
            <ul className="space-y-2.5 text-sm text-[#bdcbbd]">
              <li>
                <span className="text-[#bdcbbd]/80">Free Shipping & Returns</span>
              </li>
              <li>
                <span className="text-[#bdcbbd]/80">Care & Styling Guide</span>
              </li>
              <li>
                <span className="text-[#bdcbbd]/80">Track My Order</span>
              </li>
              <li>
                <span className="text-[#bdcbbd]/80">Contact Concierge</span>
              </li>
              {onOpenAdmin && (
                <li className="pt-2">
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 text-xs text-[#e5d8b8] hover:text-white font-bold bg-[#1e4838] px-3 py-1.5 rounded-full border border-[#2e624c] transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#aebcaf]">
          <div>© 2026 Zyntex. Make your space truly yours. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-white flex items-center gap-1 cursor-pointer font-medium"
              >
                <Lock className="w-3 h-3 text-[#8b6b4d]" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
