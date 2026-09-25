import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToBag: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToBag,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fbfaf6] shadow-2xl flex flex-col border-l border-[#ddd8cc]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#ddd8cc] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h3 className="font-playfair text-xl font-bold text-[#173c2d]">
                Saved Favorites ({wishlistItems.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#5c6159] hover:bg-[#eee9df] hover:text-[#173c2d] cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#eee7d8]">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#eee9df] flex items-center justify-center text-[#8b6b4d] mb-4">
                  <Heart className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-playfair text-xl font-semibold text-[#173c2d] mb-1">
                  Your wishlist is empty
                </h4>
                <p className="text-[#696e67] text-xs max-w-[240px] mb-6">
                  Save pieces you love to style your dream makeover board.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#173c2d] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#235440] cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              wishlistItems.map((product) => (
                <div key={product.id} className="py-4 flex gap-4 items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-18 h-20 rounded-xl object-cover bg-[#e8e2d7] shrink-0 border border-[#ddd8cc]"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-playfair text-sm font-semibold text-[#173c2d] truncate">
                      {product.name}
                    </h5>
                    <span className="text-[11px] text-[#7a8077] block mb-1">
                      {product.category}
                    </span>
                    <div className="font-bold text-sm text-[#173c2d] mb-3">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onMoveToBag(product)}
                        className="flex-1 py-1.5 px-3 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#888880] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
