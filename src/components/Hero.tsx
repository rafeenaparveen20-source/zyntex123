import React from 'react';
import { ArrowUpRight, Sparkles, LayoutDashboard } from 'lucide-react';

interface HeroProps {
  onExploreShop: () => void;
  onExploreMood: () => void;
  isAdminBannerVisible?: boolean;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreShop, 
  onExploreMood, 
  isAdminBannerVisible = false,
  onOpenAdmin,
}) => {
  return (
    <section className={`relative min-h-[90vh] flex flex-col justify-center ${isAdminBannerVisible ? 'pt-40 sm:pt-48 md:pt-52 lg:pt-48' : 'pt-28 sm:pt-36 md:pt-40'} pb-16 px-4 md:px-8 lg:px-14 overflow-hidden transition-all duration-300`}>
      {/* Background Soft Glow / Organic Shapes */}
      <div className="absolute -right-32 top-20 w-[420px] h-[420px] rounded-full bg-[#dfe7d8] blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute -left-20 bottom-10 w-[360px] h-[360px] rounded-full bg-[#faedd8] blur-3xl opacity-40 pointer-events-none" />

      {/* Main Grid Container */}
      <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        {/* Left Column: Typography and CTAs */}
        <div className="z-10 flex flex-col items-start">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#ddd8cc] text-[11px] md:text-xs tracking-[2.5px] uppercase font-bold text-[#8b6b4d] mb-4 shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#8b6b4d]" />
            <span>Room makeover • Curated décor</span>
          </div>

          {/* Script accent */}
          <span className="font-caveat text-3xl md:text-4xl lg:text-[42px] font-semibold text-[#8b6b4d] mb-2 transform -rotate-1 select-none">
            Small changes. Big difference.
          </span>

          {/* Main Headline */}
          <h1 className="font-playfair text-[46px] sm:text-[62px] md:text-[76px] lg:text-[88px] font-semibold tracking-[-0.04em] text-[#173c2d] leading-[0.95] mb-6">
            Make your space
            <br />
            <span className="italic font-normal">truly yours.</span>
          </h1>

          {/* Subtitle / Paragraph */}
          <p className="max-w-[500px] text-base md:text-lg leading-relaxed text-[#5c6159] mb-8 font-normal">
            Beautiful little details for rooms that feel like you — from cozy bedding and botanical art to warm fairy lighting, greenery, and finishing touches.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              id="hero-shop-button"
              onClick={onExploreShop}
              className="px-7 py-4 rounded-full bg-[#173c2d] text-white font-bold text-xs md:text-sm tracking-wider uppercase border border-[#173c2d] hover:bg-[#235440] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(23,60,45,0.22)] transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>SHOP MAKEOVER PICKS</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              id="hero-mood-button"
              onClick={onExploreMood}
              className="px-7 py-4 rounded-full bg-transparent text-[#173c2d] font-bold text-xs md:text-sm tracking-wider uppercase border border-[#173c2d]/80 hover:bg-[#173c2d]/10 hover:border-[#173c2d] transition-all duration-200 cursor-pointer"
            >
              EXPLORE INSPIRATION
            </button>

            {onOpenAdmin && (
              <button
                id="hero-admin-button"
                onClick={onOpenAdmin}
                className="px-6 py-4 rounded-full bg-[#f2ecdf] hover:bg-[#e6ddcc] text-[#173c2d] font-bold text-xs md:text-sm tracking-wider uppercase border border-[#d5cbba] hover:-translate-y-0.5 shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-2"
                title="Open Zyntex Admin Dashboard & Operations"
              >
                <LayoutDashboard className="w-4 h-4 text-[#173c2d]" />
                <span>ADMIN DASHBOARD</span>
              </button>
            )}
          </div>

          {/* Trust stats pill */}
          <div className="mt-9 flex items-center gap-6 pt-6 border-t border-[#ddd8cc]/80 text-xs text-[#696e67]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#173c2d]" />
              <span className="font-medium text-[#20251f]">Free Shipping</span> over ₹1,499
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8a9b82]" />
              <span className="font-medium text-[#20251f]">Easy 7-Day</span> Room Fits
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Card with Pinned Sticky Notes */}
        <div className="relative w-full">
          <div className="relative min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] rounded-[34px] overflow-hidden bg-[#ded8ca] shadow-[0_30px_70px_rgba(23,60,45,0.18)] border border-white/60 group">
            {/* Primary Hero Room Image */}
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85"
              alt="Zyntex room makeover inspiration"
              className="w-full h-full min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] object-cover block transition-transform duration-700 group-hover:scale-[1.02]"
              onError={(e) => {
                // Fallback image in case of network issue
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            {/* Gradient scrim for depth */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Pinned Note One (Top Left) */}
            <div className="absolute -left-3 sm:-left-5 top-12 sm:top-16 bg-[#fffaf0]/95 backdrop-blur-md px-5 py-4 rounded shadow-[0_12px_28px_rgba(0,0,0,0.14)] font-caveat text-xl sm:text-2xl font-semibold text-[#173c2d] -rotate-6 border border-[#eee7d8] transition-transform hover:rotate-0 hover:scale-105 duration-200 cursor-default select-none">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8b6b4d]/40 absolute -top-1 left-1/2 -translate-x-1/2 shadow-xs" />
              Style your space,<br />your way ✦
            </div>

            {/* Pinned Note Two (Bottom Right) */}
            <div className="absolute -right-2 sm:-right-4 bottom-10 sm:bottom-12 bg-[#fffaf0]/95 backdrop-blur-md px-5 py-3.5 rounded shadow-[0_12px_28px_rgba(0,0,0,0.14)] font-caveat text-xl sm:text-2xl font-semibold text-[#8b6b4d] rotate-3 border border-[#eee7d8] transition-transform hover:rotate-0 hover:scale-105 duration-200 cursor-default select-none">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#173c2d]/40 absolute -top-1 left-1/2 -translate-x-1/2 shadow-xs" />
              Pinteresty. Cozy. Yours.
            </div>
          </div>

          {/* Whimsical Botanical Leaf Accents */}
          <div className="absolute -left-6 top-1/4 text-3xl sm:text-4xl text-[#173c2d]/40 pointer-events-none select-none animate-pulse">
            ⌁
          </div>
          <div className="absolute -right-4 bottom-4 text-3xl sm:text-4xl text-[#8b6b4d]/50 pointer-events-none select-none">
            ✿
          </div>
        </div>
      </div>
    </section>
  );
};
