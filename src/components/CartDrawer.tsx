import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1499;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = discountApplied ? Math.round(rawSubtotal * 0.1) : 0;
  const subtotal = rawSubtotal - discountAmount;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingAmount = isFreeShipping ? 0 : 99;
  const grandTotal = subtotal + shippingAmount;

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'ZYNTEX10' || promoInput.trim().toUpperCase() === 'WELCOME') {
      setDiscountApplied(true);
      setDiscountError('');
    } else {
      setDiscountError('Invalid code. Try ZYNTEX10 for 10% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fbfaf6] shadow-2xl flex flex-col border-l border-[#ddd8cc]">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#ddd8cc] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#173c2d]" />
              <h3 className="font-playfair text-xl font-bold text-[#173c2d]">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#5c6159] hover:bg-[#eee9df] hover:text-[#173c2d] cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#f5efe3] border-b border-[#ddd8cc]">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#173c2d]">
                <Sparkles className="w-4 h-4 text-[#8a9b82]" />
                <span>You’ve unlocked Free Standard Delivery! ✦</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#5c6159] mb-1.5 font-medium">
                  Add <b className="text-[#173c2d]">₹{amountNeeded.toLocaleString('en-IN')}</b> more to unlock Free Delivery
                </p>
                <div className="w-full h-1.5 bg-[#ddd8cc] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-[#173c2d] rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#eee7d8]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#eee9df] flex items-center justify-center text-[#8b6b4d] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-playfair text-xl font-semibold text-[#173c2d] mb-1">
                  Your bag is empty
                </h4>
                <p className="text-[#696e67] text-xs max-w-[240px] mb-6">
                  Discover small decor upgrades that make a surprisingly big difference.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#173c2d] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#235440] cursor-pointer"
                >
                  Start Styling
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-start">
                  {/* Item Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-20 rounded-xl object-cover bg-[#e8e2d7] shrink-0 border border-[#ddd8cc]"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-playfair text-sm font-semibold text-[#173c2d] truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-[11px] text-[#7a8077] block mb-1">
                      {item.product.category}
                    </span>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm text-[#173c2d]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-[#888880]">
                          (₹{item.product.price} each)
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#ddd8cc] rounded-full bg-white px-2 py-0.5 shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-[#5c6159] hover:text-black p-1 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 text-[#20251f]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-[#5c6159] hover:text-black p-1 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-xs text-[#888880] hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="px-6 py-5 bg-white border-t border-[#ddd8cc] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6b4d]" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ZYNTEX10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    disabled={discountApplied}
                    className="w-full bg-[#f7f3ea] border border-[#ddd8cc] rounded-full py-1.5 pl-8 pr-3 text-xs uppercase tracking-wider focus:outline-hidden focus:border-[#173c2d]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={discountApplied}
                  className="px-4 py-1.5 rounded-full bg-[#eee9df] hover:bg-[#e0d9cc] text-xs font-bold text-[#173c2d] cursor-pointer disabled:opacity-50"
                >
                  {discountApplied ? 'Applied' : 'Apply'}
                </button>
              </form>

              {discountError && (
                <p className="text-[11px] text-rose-600">{discountError}</p>
              )}
              {discountApplied && (
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>10% Welcome Discount applied!</span>
                </p>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-[#5c6159] pt-2 border-t border-[#eee7d8]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#20251f]">
                    ₹{rawSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount (10%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-[#20251f]">
                    {isFreeShipping ? 'FREE' : `₹${shippingAmount}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#173c2d] pt-2 border-t border-[#ddd8cc]">
                  <span>Total Due</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="drawer-checkout-button"
                onClick={onCheckout}
                className="w-full py-3.5 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
