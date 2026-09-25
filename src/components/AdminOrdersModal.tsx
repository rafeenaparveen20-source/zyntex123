import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  Printer, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  Plus, 
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Package,
  Sparkles,
  FileText
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateTracking: (orderId: string, trackingNumber: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddOrder: (newOrder: Order) => void;
  availableProducts: Product[];
  initialSearchQuery?: string;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onUpdateTracking,
  onDeleteOrder,
  onAddOrder,
  availableProducts,
  initialSearchQuery = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [printPreviewOrder, setPrintPreviewOrder] = useState<Order | null>(null);

  // New order form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newSelectedProduct, setNewSelectedProduct] = useState(availableProducts[0]?.id || '');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newPayment, setNewPayment] = useState<'upi' | 'card' | 'cod'>('upi');

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm) ||
        order.customer.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  if (!isOpen) return null;

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setTrackingInput(order.trackingNumber || '');
    setIsCreatingNew(false);
    setPrintPreviewOrder(null);
  };

  const handleSaveTracking = (orderId: string) => {
    onUpdateTracking(orderId, trackingInput);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, trackingNumber: trackingInput });
    }
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = availableProducts.find((p) => p.id === newSelectedProduct) || availableProducts[0];
    if (!product) return;

    // Generate consecutive or unique order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderNumber = `#ZYX-${randomSuffix}`;

    const subtotal = product.price * newQuantity;
    const discount = subtotal > 3000 ? 300 : 0;
    const shipping = subtotal > 1500 ? 0 : 99;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: generatedOrderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: newCustomerName || 'Walk-in Decor Client',
        email: newEmail || 'client@zyntexstore.com',
        phone: newPhone || '+91 98000 00000',
        address: newAddress || '108 Decor Studio Lane',
        city: newCity || 'Bengaluru',
        postalCode: newPostalCode || '560001',
      },
      items: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: newQuantity,
          image: product.image,
          category: product.category,
        },
      ],
      itemCount: newQuantity,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: newPayment,
      status: 'processing',
      notes: 'Manually logged by Store Operations Admin',
    };

    onAddOrder(newOrder);
    setIsCreatingNew(false);
    handleSelectOrder(newOrder);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Processing
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Package className="w-3 h-3 text-blue-600" /> Packed
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3 text-purple-600" /> Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#fbfaf6] rounded-[28px] border border-[#ddd8cc] shadow-2xl flex flex-col overflow-hidden text-[#20251f]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#173c2d] text-[#f7f3ea] flex items-center justify-between border-b border-[#24523f]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#234d3c] rounded-xl text-[#e5d8b8]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-playfair text-xl md:text-2xl font-bold tracking-tight text-white">
                  Order Numbers & Fulfillment
                </h2>
                <span className="bg-[#e5d8b8] text-[#173c2d] text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                  {orders.length} Total Orders
                </span>
              </div>
              <p className="text-xs text-[#a9c0a6]">
                Track order numbers, customer fulfillment, invoices, and shipping statuses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsCreatingNew(true);
                setSelectedOrder(null);
                setPrintPreviewOrder(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5d8b8] hover:bg-[#efe5ce] text-[#173c2d] text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Order</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Split view (List on left, details on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Order Numbers List & Filters */}
          <div className={`w-full md:w-[48%] lg:w-[44%] border-r border-[#e5dfd3] flex flex-col bg-[#fdfcf9] ${selectedOrder || isCreatingNew ? 'hidden md:flex' : 'flex'}`}>
            {/* Search and Filters toolbar */}
            <div className="p-4 border-b border-[#e5dfd3] space-y-3 bg-[#f8f5ee]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search order number (#ZYX-...), name, phone, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#ddd8cc] rounded-xl pl-9 pr-4 py-2 text-xs text-[#20251f] placeholder-[#888880] focus:outline-none focus:border-[#173c2d]"
                />
                <Search className="w-4 h-4 text-[#888880] absolute left-3 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888880] hover:text-[#20251f]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Segmented Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
                {(['all', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#173c2d] text-white font-semibold'
                        : 'bg-white hover:bg-[#eee8dc] text-[#5c6159] border border-[#ddd8cc]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Feed */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#eee8dc]">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-[#7a8077]">
                  <Package className="w-10 h-10 mx-auto text-[#c2bcaf] mb-2" />
                  <p className="font-semibold text-sm text-[#20251f]">No orders match your filter</p>
                  <p className="text-xs text-[#7a8077] mt-1">Try searching a different order number or clear filter</p>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={ord.id}
                      onClick={() => handleSelectOrder(ord)}
                      className={`p-4 transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-[#eef3eb] border-l-4 border-l-[#173c2d]' 
                          : 'hover:bg-[#f6f2e9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#173c2d] tracking-tight">
                            {ord.orderNumber}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyOrderNumber(ord.orderNumber);
                            }}
                            className="p-1 rounded hover:bg-black/5 text-[#888880] hover:text-[#173c2d] transition-colors"
                            title="Copy Order Number"
                          >
                            {copiedId === ord.orderNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-[#888880] tabular-nums">{dateStr}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-medium text-[#20251f] block">{ord.customer.fullName}</span>
                          <span className="text-[#696e67] text-[11px]">{ord.customer.city} · {ord.itemCount} {ord.itemCount === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#173c2d] text-sm tabular-nums block">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#888880] uppercase tracking-wider">{ord.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>{getStatusBadge(ord.status)}</div>
                        {ord.trackingNumber && (
                          <span className="text-[10px] font-mono text-[#696e67] truncate max-w-[140px]">
                            {ord.trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* List Footer with Metrics */}
            <div className="p-3 bg-[#f2ece0] border-t border-[#e5dfd3] flex items-center justify-between text-xs text-[#5c6159]">
              <span>Showing <b>{filteredOrders.length}</b> of <b>{orders.length}</b> orders</span>
              <span className="font-mono tabular-nums font-semibold text-[#173c2d]">
                Sum: ₹{filteredOrders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Right Column: Order Detail / Creation View / Print Preview */}
          <div className="flex-1 bg-[#fffdf8] flex flex-col overflow-y-auto">
            
            {/* View 1: Create New Order manually */}
            {isCreatingNew ? (
              <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ddd8cc]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCreatingNew(false)}
                      className="p-1 rounded-full hover:bg-[#eee8dc] text-[#5c6159]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-[#173c2d]">Create Manual Order</h3>
                      <p className="text-xs text-[#696e67]">Issue an official order number for walk-in or offline clients</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
                  <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#ddd8cc] space-y-3">
                    <h4 className="font-bold text-[#173c2d] uppercase tracking-wider text-[11px]">Customer Info</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#696e67] mb-1">Customer Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                          placeholder="e.g. Rafeena Parveen"
                          className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[#696e67] mb-1">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#696e67] mb-1">Email</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="rafeenaparveen20@gmail.com"
                          className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[#696e67] mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="Bengaluru"
                          className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#696e67] mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Apartment / Villa / Street"
                        className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#ddd8cc] space-y-3">
                    <h4 className="font-bold text-[#173c2d] uppercase tracking-wider text-[11px]">Select Item & Quantity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[#696e67] mb-1">Zyntex Decor Piece</label>
                        <select
                          value={newSelectedProduct}
                          onChange={(e) => setNewSelectedProduct(e.target.value)}
                          className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                        >
                          {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — ₹{p.price.toLocaleString('en-IN')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#696e67] mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-[#ddd8cc] rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#696e67] mb-1">Payment Method</label>
                      <div className="flex gap-2">
                        {(['upi', 'card', 'cod'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setNewPayment(method)}
                            className={`px-3 py-1.5 rounded-lg border uppercase font-medium cursor-pointer ${
                              newPayment === method
                                ? 'bg-[#173c2d] text-white border-[#173c2d]'
                                : 'bg-white text-[#5c6159] border-[#ddd8cc]'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#173c2d] hover:bg-[#235440] text-white font-bold rounded-xl shadow-sm uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                      Issue Order Number & Record Sale
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(false)}
                      className="px-5 py-3 border border-[#ddd8cc] hover:bg-[#eee8dc] text-[#5c6159] font-medium rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : printPreviewOrder ? (
              /* View 2: Printable Invoice / Order Slip */
              <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#ddd8cc]">
                  <button
                    onClick={() => setPrintPreviewOrder(null)}
                    className="flex items-center gap-1.5 text-xs text-[#5c6159] hover:text-[#173c2d]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to details
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#173c2d] text-white rounded-lg text-xs font-semibold hover:bg-[#235440]"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Slip
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#ddd8cc] shadow-sm font-sans text-xs">
                  <div className="flex justify-between items-start border-b border-[#eee8dc] pb-4 mb-4">
                    <div>
                      <h2 className="font-playfair text-2xl font-bold text-[#173c2d]">Zyntex</h2>
                      <p className="text-[11px] text-[#696e67]">Room Makeover & Cozy Decor</p>
                      <p className="text-[10px] text-[#888880]">GSTIN: 29AABCS1429Q1Z2 · Bangalore, India</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-[#173c2d] block">
                        {printPreviewOrder.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#888880]">
                        {new Date(printPreviewOrder.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="mt-1">{getStatusBadge(printPreviewOrder.status)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8b6b4d] block mb-1">Delivering To:</span>
                      <p className="font-semibold text-[#173c2d]">{printPreviewOrder.customer.fullName}</p>
                      <p className="text-[#5c6159]">{printPreviewOrder.customer.address}</p>
                      <p className="text-[#5c6159]">{printPreviewOrder.customer.city} - {printPreviewOrder.customer.postalCode}</p>
                      <p className="text-[#5c6159]">Phone: {printPreviewOrder.customer.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8b6b4d] block mb-1">Shipment Info:</span>
                      <p className="text-[#5c6159]">Payment: <b className="uppercase">{printPreviewOrder.paymentMethod}</b></p>
                      <p className="text-[#5c6159]">Tracking: <b>{printPreviewOrder.trackingNumber || 'Unassigned'}</b></p>
                      <p className="text-[#5c6159]">Items Count: <b>{printPreviewOrder.itemCount}</b></p>
                    </div>
                  </div>

                  <table className="w-full border-collapse mb-4 text-xs">
                    <thead>
                      <tr className="border-b border-[#ddd8cc] text-[#696e67] text-left">
                        <th className="py-2">Item Description</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee8dc]">
                      {printPreviewOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-medium text-[#20251f]">{it.name}</td>
                          <td className="py-2.5 text-center tabular-nums">{it.quantity}</td>
                          <td className="py-2.5 text-right tabular-nums">₹{it.price.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 text-right font-semibold tabular-nums">₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="border-t border-[#ddd8cc] pt-3 flex justify-between items-center text-sm font-bold text-[#173c2d]">
                    <span>Total Amount Paid / Payable</span>
                    <span className="font-mono text-base">₹{printPreviewOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ) : selectedOrder ? (
              /* View 3: Complete Single Order Management */
              <div className="p-6 md:p-8 flex-1 flex flex-col space-y-6">
                
                {/* Top Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ddd8cc]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="md:hidden p-1.5 rounded-full hover:bg-[#eee8dc]"
                      title="Back to list"
                    >
                      <ArrowLeft className="w-5 h-5 text-[#5c6159]" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-2xl font-bold text-[#173c2d]">
                          {selectedOrder.orderNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyOrderNumber(selectedOrder.orderNumber)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eee8dc] hover:bg-[#e0d8c8] text-xs font-medium text-[#173c2d]"
                        >
                          {copiedId === selectedOrder.orderNumber ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Order #</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#696e67] mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPrintPreviewOrder(selectedOrder)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd8cc] rounded-xl hover:bg-[#eee8dc] text-xs font-semibold text-[#173c2d] cursor-pointer"
                      title="Generate and print order receipt slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete order ${selectedOrder.orderNumber}?`)) {
                          onDeleteOrder(selectedOrder.id);
                          setSelectedOrder(null);
                        }
                      }}
                      className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Switcher Bar */}
                <div className="p-4 bg-[#f6f2e9] rounded-2xl border border-[#ddd8cc] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#173c2d] uppercase tracking-wider text-[11px]">
                      Fulfillment Status Flow
                    </span>
                    <span className="text-[#696e67]">Click stage to update order status</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {(['processing', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map((stage) => {
                      const isActive = selectedOrder.status === stage;
                      return (
                        <button
                          key={stage}
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, stage);
                            setSelectedOrder({ ...selectedOrder, status: stage });
                          }}
                          className={`py-2 px-2.5 rounded-xl border text-center capitalize font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#173c2d] text-white border-[#173c2d] shadow-sm'
                              : 'bg-white hover:bg-[#fbfaf6] text-[#5c6159] border-[#ddd8cc]'
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer and Logistics Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Card */}
                  <div className="p-4 bg-white rounded-2xl border border-[#ddd8cc] space-y-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#8b6b4d]">
                      <User className="w-3.5 h-3.5" />
                      <span>Customer & Delivery Details</span>
                    </div>
                    <div className="font-bold text-sm text-[#173c2d]">{selectedOrder.customer.fullName}</div>
                    <div className="flex items-center gap-2 text-[#5c6159]">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#888880]" />
                      <span>{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5c6159]">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-[#888880]" />
                      <span className="font-mono">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#5c6159]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#888880] mt-0.5" />
                      <span>{selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.postalCode}</span>
                    </div>
                  </div>

                  {/* Logistics & Tracking Card */}
                  <div className="p-4 bg-white rounded-2xl border border-[#ddd8cc] space-y-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#8b6b4d]">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Logistics & Courier Tracking</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#696e67] mb-1 font-medium">Tracking Number / AWB</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="e.g. BLUEDART-882910"
                          className="flex-1 bg-[#fdfcf9] border border-[#ddd8cc] rounded-xl px-3 py-1.5 text-xs font-mono text-[#20251f]"
                        />
                        <button
                          onClick={() => handleSaveTracking(selectedOrder.id)}
                          className="px-3 py-1.5 bg-[#173c2d] hover:bg-[#235440] text-white rounded-xl font-bold cursor-pointer text-xs"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-[#eee8dc]">
                      <span className="text-[#696e67]">Payment Mode:</span>
                      <span className="font-bold text-[#173c2d] uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                    {selectedOrder.notes && (
                      <div className="text-[11px] bg-[#fbfaf6] p-2 rounded-lg border border-[#eee8dc] text-[#5c6159]">
                        <b>Notes:</b> {selectedOrder.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="bg-white rounded-2xl border border-[#ddd8cc] overflow-hidden text-xs">
                  <div className="p-4 bg-[#f8f5ee] border-b border-[#ddd8cc] flex justify-between items-center">
                    <span className="font-bold text-[#173c2d] uppercase tracking-wider text-[11px]">
                      Items in this Order ({selectedOrder.itemCount})
                    </span>
                    <span className="text-[#696e67]">Verified Zyntex room makeover pieces</span>
                  </div>

                  <div className="divide-y divide-[#eee8dc]">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl border border-[#ddd8cc]"
                          />
                          <div>
                            <span className="font-bold text-sm text-[#173c2d] block">{item.name}</span>
                            <span className="text-[#696e67] text-[11px]">Qty: {item.quantity} · Unit: ₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm text-[#173c2d] tabular-nums">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-4 bg-[#fdfcf9] border-t border-[#ddd8cc] space-y-1.5 text-xs text-[#5c6159]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="tabular-nums">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Makeover Promo Discount</span>
                        <span className="tabular-nums">-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping (Express Safe Packaging)</span>
                      <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#173c2d] pt-2 border-t border-[#ddd8cc]">
                      <span>Grand Total</span>
                      <span className="font-mono text-base tabular-nums">
                        ₹{selectedOrder.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Empty state placeholder when no order selected */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#7a8077]">
                <Package className="w-14 h-14 text-[#c2bcaf] mb-3" />
                <h3 className="font-playfair text-xl font-bold text-[#20251f]">Select an Order Number</h3>
                <p className="text-xs text-[#7a8077] max-w-sm mt-1 mb-4 leading-relaxed">
                  Choose any order from the left panel to review items, edit shipping status, copy the order number, or generate official dispatch slips.
                </p>
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="px-4 py-2 bg-[#173c2d] hover:bg-[#235440] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  + Create New Manual Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
