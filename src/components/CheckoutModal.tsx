import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Sparkles, Copy, Check, Eye } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  onOrderSuccess: (createdOrder: Order) => void;
  onOpenOrderInAdmin?: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onOrderSuccess,
  onOpenOrderInAdmin,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Rafeena Parveen',
    email: 'rafeenaparveen20@gmail.com',
    address: 'Flat 4B, Serene Garden Apartments',
    city: 'Bengaluru',
    postalCode: '560034',
    phone: '+91 98765 43210',
  });

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique sequential-style order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `#ZYX-${randomSuffix}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
        category: i.product.category,
      })),
      itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: totalAmount,
      discount: 0,
      shipping: 0,
      total: totalAmount,
      paymentMethod,
      status: 'processing',
      notes: 'Customer web checkout order',
    };

    setConfirmedOrder(newOrder);
    setStep('success');
    onOrderSuccess(newOrder);
  };

  const handleCopyOrderNumber = () => {
    if (confirmedOrder) {
      navigator.clipboard.writeText(confirmedOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex justify-center items-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#fffdf8] rounded-[32px] border border-[#ddd8cc] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#20251f] shadow-md flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#8b6b4d] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Express Room Makeover Checkout</span>
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-[#173c2d] mb-4">
              Complete Your Order
            </h3>

            {/* Order Summary Strip */}
            <div className="p-3.5 bg-[#f5efe3] rounded-2xl border border-[#ddd8cc] mb-6 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-[#173c2d] block">
                  {items.reduce((s, i) => s + i.quantity, 0)} Items Selected
                </span>
                <span className="text-[#696e67]">Standard Express (3–4 Business Days)</span>
              </div>
              <div className="text-right">
                <span className="text-[#888880] block text-[10px]">Total to Pay</span>
                <span className="font-bold text-base text-[#173c2d]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Shipping Inputs */}
            <div className="space-y-3 mb-6 text-xs">
              <h4 className="font-bold text-[#173c2d] uppercase tracking-wider text-[11px]">
                Shipping Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#696e67] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2 text-xs text-[#20251f] outline-hidden focus:border-[#173c2d]"
                  />
                </div>
                <div>
                  <label className="block text-[#696e67] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2 text-xs text-[#20251f] outline-hidden focus:border-[#173c2d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#696e67] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2 text-xs text-[#20251f] outline-hidden focus:border-[#173c2d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#696e67] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2 text-xs text-[#20251f] outline-hidden focus:border-[#173c2d]"
                  />
                </div>
                <div>
                  <label className="block text-[#696e67] mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2 text-xs text-[#20251f] outline-hidden focus:border-[#173c2d]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
              <h4 className="font-bold text-[#173c2d] uppercase tracking-wider text-[11px] mb-2">
                Payment Option
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-[#173c2d] bg-[#dfe7d8] text-[#173c2d] font-bold'
                      : 'border-[#ddd8cc] bg-white text-[#5c6159]'
                  }`}
                >
                  UPI / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#173c2d] bg-[#dfe7d8] text-[#173c2d] font-bold'
                      : 'border-[#ddd8cc] bg-white text-[#5c6159]'
                  }`}
                >
                  Credit/Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#173c2d] bg-[#dfe7d8] text-[#173c2d] font-bold'
                      : 'border-[#ddd8cc] bg-white text-[#5c6159]'
                  }`}
                >
                  Pay on Delivery
                </button>
              </div>
            </div>

            {/* Submit Order */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-colors cursor-pointer"
            >
              PLACE ROOM MAKEOVER ORDER (₹{totalAmount.toLocaleString('en-IN')})
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#696e67] mt-3">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#173c2d]" /> 256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#8a9b82]" /> Safe Contactless Delivery
              </span>
            </div>
          </form>
        ) : (
          /* Order Confirmation Celebration */
          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#dfe7d8] text-[#173c2d] flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#173c2d] mb-2">
              Your Room Makeover is on its way!
            </h3>
            
            {/* Prominent Order Number Display Box */}
            <div className="my-5 p-4 bg-[#f4ede1] rounded-2xl border border-[#ded5c5] max-w-sm mx-auto shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8b6b4d] block mb-1">
                Official Order Number
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#173c2d]">
                  {confirmedOrder?.orderNumber || '#ZYX-98421'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderNumber}
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#173c2d] border border-[#ddd8cc] transition-colors cursor-pointer"
                  title="Copy Order Number"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#696e67] mt-1">
                Save this order number to track your package or manage in Store Ops.
              </p>
            </div>

            <div className="bg-[#fbfaf6] p-4 rounded-2xl border border-[#ddd8cc] text-left text-xs mb-6 space-y-1.5 text-[#20251f]">
              <div className="flex justify-between">
                <span className="text-[#696e67]">Delivering to:</span>
                <span className="font-semibold text-[#173c2d]">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#696e67]">Address:</span>
                <span className="font-medium text-right text-[#5c6159]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#696e67]">Payment:</span>
                <span className="font-semibold uppercase text-[#173c2d]">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#696e67]">Total Paid:</span>
                <span className="font-bold text-[#173c2d] tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              {onOpenOrderInAdmin && confirmedOrder && (
                <button
                  type="button"
                  onClick={() => {
                    const ordNum = confirmedOrder.orderNumber;
                    setStep('details');
                    onClose();
                    onOpenOrderInAdmin(ordNum);
                  }}
                  className="px-6 py-3 rounded-full bg-[#1e4838] hover:bg-[#275d49] text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-[#e5d8b8]" />
                  <span>Inspect in Admin Orders</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  onClose();
                }}
                className="px-8 py-3 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Continue Exploring Zyntex
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
