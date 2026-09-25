import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex justify-center items-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#fffdf8] rounded-[32px] border border-[#ddd8cc] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#20251f] shadow-md flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative bg-[#e8e2d7] min-h-[300px] md:min-h-[460px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#173c2d] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Column: Info & Buy actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8b6b4d]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#8b6b4d]">
                  <Star className="w-3.5 h-3.5 fill-[#8b6b4d]" />
                  <span className="font-bold text-[#20251f]">{product.rating}</span>
                  <span className="text-[#888880]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-playfair text-2xl sm:text-3xl font-semibold text-[#173c2d] mb-3">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="font-bold text-2xl text-[#173c2d]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-[#999990] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5c6159] leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Details & Specs */}
              <div className="space-y-2 mb-6 text-xs text-[#20251f] border-t border-b border-[#eee7d8] py-3">
                {product.material && (
                  <div className="flex">
                    <span className="w-24 text-[#7a8077]">Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex">
                    <span className="w-24 text-[#7a8077]">Dimensions:</span>
                    <span className="font-medium">{product.dimensions}</span>
                  </div>
                )}
                {product.features && product.features.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#eee7d8]/60">
                    <span className="block text-[#7a8077] mb-1.5 font-medium">Key Highlights:</span>
                    <ul className="space-y-1">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[11px] text-[#4a5048]">
                          <Check className="w-3 h-3 text-[#173c2d] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#ddd8cc] rounded-full bg-white px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#5c6159] hover:text-black font-bold px-1.5 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold px-3 text-[#20251f]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#5c6159] hover:text-black font-bold px-1.5 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-6 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all duration-150"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-11 h-11 rounded-full border border-[#ddd8cc] flex items-center justify-center cursor-pointer transition-colors ${
                    isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white hover:bg-[#eee9df] text-[#20251f]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#696e67] pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#173c2d]" /> Free shipping over ₹1,499
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8a9b82]" /> 7-day hassle-free returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
