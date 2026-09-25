import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';

interface ShopTheLookProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddBundleToCart: (items: Product[]) => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({
  products,
  onAddToCart,
  onAddBundleToCart,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Curated look items
  const lookProductIds = [
    'soft-linen-bedding',
    'botanical-wall-prints',
    'warm-fairy-lights',
    'minimal-planter-set',
  ];

  const lookItems = products.filter((p) => lookProductIds.includes(p.id));
  const totalRegularPrice = lookItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const bundlePrice = lookItems.reduce((sum, item) => sum + item.price, 0);

  const hotspots = [
    {
      id: 'hs1',
      x: 45,
      y: 42,
      productId: 'soft-linen-bedding',
      title: 'Soft Linen Bedding',
      price: 1899,
      tag: 'Queen duvet & 2 shams',
    },
    {
      id: 'hs2',
      x: 64,
      y: 28,
      productId: 'botanical-wall-prints',
      title: 'Botanical Wall Prints',
      price: 749,
      tag: 'Set of 3 A3 gallery prints',
    },
    {
      id: 'hs3',
      x: 28,
      y: 65,
      productId: 'warm-fairy-lights',
      title: 'Warm Fairy Lights',
      price: 599,
      tag: '100 LED ambient wire',
    },
    {
      id: 'hs4',
      x: 82,
      y: 60,
      productId: 'minimal-planter-set',
      title: 'Minimal Planter Set',
      price: 899,
      tag: 'Terracotta & bamboo saucers',
    },
  ];

  return (
    <section id="look" className="py-20 md:py-28 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Interactive Room Stage with Hotspots */}
          <div className="relative min-h-[460px] sm:min-h-[540px] lg:min-h-[580px] rounded-[32px] overflow-hidden bg-[#ded8ca] shadow-[0_20px_50px_rgba(23,60,45,0.12)] border border-white/60">
            <img
              src="https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1400&q=88"
              alt="Cozy bedroom styled with Zyntex home decor"
              className="w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[580px] object-cover block"
            />

            {/* Instruction tooltip badge */}
            <div className="absolute top-5 left-5 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#173c2d] shadow-md flex items-center gap-1.5 select-none">
              <span className="w-2 h-2 rounded-full bg-[#173c2d] animate-ping" />
              <span>Tap pins to inspect details</span>
            </div>

            {/* Hotspots */}
            {hotspots.map((hs) => {
              const matchedProduct = products.find((p) => p.id === hs.productId);
              const isActive = activeHotspot === hs.id;

              return (
                <div
                  key={hs.id}
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Pulsing Hotspot Button */}
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                    onMouseEnter={() => setActiveHotspot(hs.id)}
                    className="relative group p-2 cursor-pointer focus:outline-hidden"
                    aria-label={`View ${hs.title}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-[#173c2d]/20 animate-ping" />
                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white border-4 border-[#173c2d] shadow-[0_0_0_6px_rgba(255,255,255,0.7)] group-hover:scale-125 transition-transform duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#173c2d]" />
                    </span>
                  </button>

                  {/* Hotspot Popover Tooltip */}
                  {isActive && (
                    <div
                      className={`absolute z-30 w-56 p-3.5 rounded-2xl bg-[#fffdf8]/95 backdrop-blur-md border border-white/90 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 ${
                        hs.x > 50 ? '-translate-x-full right-2' : 'left-2'
                      } ${hs.y > 60 ? '-translate-y-full -top-3' : 'top-3'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-playfair font-semibold text-sm text-[#173c2d] leading-snug">
                          {hs.title}
                        </h4>
                        <span className="text-xs font-bold text-[#8b6b4d] shrink-0">
                          ₹{hs.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5c6159] mb-2.5 leading-tight">{hs.tag}</p>

                      {matchedProduct && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(matchedProduct);
                          }}
                          className="w-full py-1.5 px-3 rounded-full bg-[#173c2d] text-white text-[11px] font-bold tracking-wide uppercase hover:bg-[#235440] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Editorial Copy & Itemized Bundle Checklist */}
          <div className="bg-[#173c2d] text-white rounded-[32px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between shadow-[0_20px_50px_rgba(23,60,45,0.18)]">
            <div>
              <div className="text-xs uppercase tracking-[3px] font-bold text-[#cfd9c9] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8a9b82]" />
                <span>One room. One mood.</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[44px] font-semibold text-white tracking-tight leading-tight mb-4">
                Shop the cozy bedroom.
              </h2>

              <p className="text-[#dce4db] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                Everything you need to turn an ordinary corner into your favourite place in the house. Layered French linen, atmospheric fairy wire, botanical foliage, and minimal ceramics.
              </p>

              {/* Itemized List */}
              <ul className="divide-y divide-white/15 my-6">
                {lookItems.map((item) => (
                  <li
                    key={item.id}
                    className="py-3.5 flex items-center justify-between text-sm sm:text-base hover:bg-white/5 px-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      const match = hotspots.find((h) => h.productId === item.id);
                      if (match) setActiveHotspot(match.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-[#cfd9c9]">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-[#f7f3ea]">{item.name}</span>
                    </div>
                    <b className="font-semibold text-white">₹{item.price.toLocaleString('en-IN')}</b>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bundle Pricing and Shop This Look Button */}
            <div className="pt-6 border-t border-white/20">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-[#cfd9c9] block font-medium">Complete 4-Piece Room Bundle</span>
                  <span className="text-xs text-emerald-300 font-semibold">Special Bundle Price</span>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      ₹{bundlePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#cfd9c9] line-through">
                      ₹{totalRegularPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                id="shop-this-look-button"
                onClick={() => onAddBundleToCart(lookItems)}
                className="w-full py-4 rounded-full bg-white text-[#173c2d] hover:bg-[#f7f3ea] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#173c2d]" />
                <span>SHOP THIS ENTIRE LOOK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
