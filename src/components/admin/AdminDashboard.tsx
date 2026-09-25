import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Key, 
  LogOut, 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle, 
  Truck, 
  AlertCircle, 
  Copy, 
  Sparkles, 
  Layers, 
  FileText,
  Lock,
  UserCheck,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Order, OrderStatus, Product } from '../../types';
import { ChangePasswordModal } from './ChangePasswordModal';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateTracking: (orderId: string, trackingNumber: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddOrder: (newOrder: Order) => void;
  onGenerateTestOrder: () => void;
  onBackToStore: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onUpdateTracking,
  onDeleteOrder,
  onAddOrder,
  onGenerateTestOrder,
  onBackToStore,
  onShowToast,
}) => {
  const { user, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'security'>('overview');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'packed').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customer.phone.includes(searchTerm) ||
      ord.customer.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    onShowToast(`Copied ${num} to clipboard`, 'info');
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSelectOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setTrackingInput(ord.trackingNumber || '');
  };

  const handleSaveTracking = (orderId: string) => {
    if (!trackingInput.trim()) return;
    onUpdateTracking(orderId, trackingInput.trim());
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, trackingNumber: trackingInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#20251f] flex flex-col selection:bg-[#173c2d] selection:text-white">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#132c22] border-b border-[#244f3d] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand + View Return */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b3e30] hover:bg-[#235440] text-[#e5d8b8] text-xs font-semibold rounded-full border border-[#2e5e49] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <div className="h-4 w-px bg-[#244f3d] hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair text-xl font-bold tracking-tight text-white">
                  Zyntex
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1e4c39] text-[#b6d4c1] border border-[#2d6b52]">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex items-center gap-1 bg-[#19382b] p-1 rounded-xl border border-[#285743]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#e5d8b8] text-[#173c2d] shadow-sm font-bold'
                  : 'text-[#c6d7c2] hover:text-white hover:bg-[#234b3a]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-[#e5d8b8] text-[#173c2d] shadow-sm font-bold'
                  : 'text-[#c6d7c2] hover:text-white hover:bg-[#234b3a]'
              }`}
            >
              <span>Order Numbers</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                activeTab === 'orders' ? 'bg-[#173c2d] text-white' : 'bg-[#295642] text-[#e5d8b8]'
              }`}>
                {totalOrders}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-[#e5d8b8] text-[#173c2d] shadow-sm font-bold'
                  : 'text-[#c6d7c2] hover:text-white hover:bg-[#234b3a]'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Security</span>
            </button>
          </div>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Change Password Button */}
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c4535] hover:bg-[#265d48] text-xs font-medium text-[#e5d8b8] border border-[#2f6851] transition-all cursor-pointer"
              title="Change administrator password"
            >
              <Key className="w-3.5 h-3.5 text-[#e5d8b8]" />
              <span className="hidden md:inline">Change Password</span>
            </button>

            {/* User Chip */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#193a2d] rounded-full border border-[#285743] text-xs text-[#dce7da]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono">{user?.email || 'admin@zyntex.com'}</span>
            </div>

            {/* Logout */}
            <button
              onClick={async () => {
                await logout();
                onShowToast('Signed out of admin session', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/60 hover:bg-red-900/80 text-red-200 text-xs font-semibold border border-red-800/50 transition-colors cursor-pointer"
              title="Sign out of admin panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Welcome banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#173c2d] to-[#255b46] text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#e5d8b8] font-bold">
                    Zyntex Home Operations Control
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Live Active
                  </span>
                </div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold">
                  Welcome, Administrator
                </h1>
                <p className="text-xs sm:text-sm text-[#cbd6c7] max-w-xl">
                  Manage real-time order numbers, dispatch workflows, inventory signals, and administrative account security.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onGenerateTestOrder}
                  className="px-4 py-2.5 rounded-full bg-[#e5d8b8] hover:bg-[#f2e7cc] text-[#173c2d] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Generate Demo Order</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>View All Orders ({totalOrders})</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-white border border-[#ddd8cc] shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#5c6159] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[11px]">Total Revenue</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#173c2d]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#8a9b82] mt-1 flex items-center gap-1">
                  <span>Gross receipts across {totalOrders} orders</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#ddd8cc] shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#5c6159] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[11px]">Order Registry</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#173c2d]">
                  {totalOrders}
                </p>
                <p className="text-[11px] text-[#8a9b82] mt-1">
                  Sequential #ZYX order numbers
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#ddd8cc] shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#5c6159] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[11px]">Awaiting Dispatch</span>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
                  {pendingOrders}
                </p>
                <p className="text-[11px] text-[#8a9b82] mt-1">
                  Requires fulfillment attention
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#ddd8cc] shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#5c6159] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[11px]">Avg. Order Value</span>
                  <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#173c2d]">
                  ₹{avgOrderValue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#8a9b82] mt-1">
                  {deliveredOrders} orders successfully delivered
                </p>
              </div>
            </div>

            {/* Quick Recent Orders strip */}
            <div className="bg-white rounded-3xl border border-[#ddd8cc] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#173c2d]">
                    Live Order Numbers Monitor
                  </h3>
                  <p className="text-xs text-[#5c6159]">
                    Click any order to update status, enter dispatch tracking, or inspect customer address
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#173c2d] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Registry</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#eee9df] text-[#8a9b82] font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Order #</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">City</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee9df]">
                    {orders.slice(0, 6).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fbfaf6] transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#173c2d]">
                          <button
                            onClick={() => handleCopyOrderNumber(ord.orderNumber)}
                            className="hover:underline flex items-center gap-1.5 cursor-pointer"
                            title="Copy Order #"
                          >
                            <span>{ord.orderNumber}</span>
                            <Copy className="w-3 h-3 text-[#8a9b82]" />
                          </button>
                        </td>
                        <td className="py-3 px-3 text-[#5c6159]">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 font-medium text-[#20251f]">
                          {ord.customer.fullName}
                        </td>
                        <td className="py-3 px-3 text-[#5c6159]">{ord.customer.city}</td>
                        <td className="py-3 px-3 font-mono font-bold">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ord.status === 'processing'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'packed'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setTrackingInput(ord.trackingNumber || '');
                              setActiveTab('orders');
                            }}
                            className="text-xs text-[#173c2d] hover:underline font-semibold cursor-pointer"
                          >
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER NUMBERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search and Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#ddd8cc] shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#8a9b82] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order number (#ZYX-...), customer name, phone, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#fbfaf6] border border-[#ddd8cc] rounded-full text-xs text-[#20251f] focus:outline-none focus:border-[#173c2d]"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(['all', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-full capitalize font-medium transition-all cursor-pointer ${
                        statusFilter === status
                          ? 'bg-[#173c2d] text-white font-bold'
                          : 'bg-[#eee9df] text-[#5c6159] hover:bg-[#e2dcce]'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={onGenerateTestOrder}
                className="px-4 py-2 bg-[#173c2d] hover:bg-[#235440] text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Sample Order</span>
              </button>
            </div>

            {/* Split View: Orders List & Detail Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-[#ddd8cc] p-5 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-lg font-bold text-[#173c2d]">
                    Orders Registry ({filteredOrders.length})
                  </h3>
                  <span className="text-xs text-[#8a9b82]">Click an order to manage fulfillment</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eee9df] text-[#8a9b82] uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Select</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee9df]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-xs text-[#8a9b82]">
                            No orders matching your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => {
                          const isSelected = selectedOrder?.id === ord.id;
                          return (
                            <tr
                              key={ord.id}
                              onClick={() => handleSelectOrder(ord)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#f4efe4]' : 'hover:bg-[#fbfaf6]'
                              }`}
                            >
                              <td className="py-3 px-3 font-mono font-bold text-[#173c2d]">
                                {ord.orderNumber}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-medium text-[#20251f]">{ord.customer.fullName}</div>
                                <div className="text-[11px] text-[#8a9b82]">{ord.customer.city}</div>
                              </td>
                              <td className="py-3 px-3 text-[#5c6159]">{ord.itemCount} items</td>
                              <td className="py-3 px-3 font-mono font-bold">
                                ₹{ord.total.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    ord.status === 'processing'
                                      ? 'bg-amber-100 text-amber-800'
                                      : ord.status === 'packed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : ord.status === 'shipped'
                                      ? 'bg-purple-100 text-purple-800'
                                      : ord.status === 'delivered'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button className="px-2.5 py-1 rounded-md bg-[#eee9df] hover:bg-[#e2dcce] text-[11px] font-bold text-[#173c2d]">
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Detail & Actions Panel */}
              <div className="bg-white rounded-3xl border border-[#ddd8cc] p-6 shadow-sm">
                {selectedOrder ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#eee9df]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8a9b82]">
                          Selected Order
                        </span>
                        <h4 className="font-mono text-lg font-bold text-[#173c2d]">
                          {selectedOrder.orderNumber}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopyOrderNumber(selectedOrder.orderNumber)}
                        className="px-2.5 py-1 rounded-lg bg-[#eee9df] text-xs font-semibold text-[#173c2d] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy #</span>
                      </button>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-[#20251f] uppercase tracking-wider text-[10px]">
                        Customer Details
                      </span>
                      <p className="font-semibold text-sm text-[#173c2d]">
                        {selectedOrder.customer.fullName}
                      </p>
                      <p className="text-[#5c6159]">{selectedOrder.customer.email}</p>
                      <p className="text-[#5c6159]">{selectedOrder.customer.phone}</p>
                      <p className="text-[#5c6159] bg-[#fbfaf6] p-2.5 rounded-xl border border-[#eee9df]">
                        {selectedOrder.customer.address}, {selectedOrder.customer.city} -{' '}
                        {selectedOrder.customer.postalCode}
                      </p>
                    </div>

                    {/* Status Changer */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-[#20251f]">
                        Update Fulfillment Status
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['processing', 'packed', 'shipped', 'delivered'] as OrderStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => {
                                onUpdateOrderStatus(selectedOrder.id, st);
                                setSelectedOrder({ ...selectedOrder, status: st });
                              }}
                              className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                selectedOrder.status === st
                                  ? 'bg-[#173c2d] text-white shadow-sm'
                                  : 'bg-[#eee9df] text-[#5c6159] hover:bg-[#e2dcce]'
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Tracking Number Input */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-[#20251f]">
                        Courier Tracking Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="e.g. BLUEDART-98421"
                          className="flex-1 px-3 py-2 bg-[#fbfaf6] border border-[#ddd8cc] rounded-xl text-xs font-mono"
                        />
                        <button
                          onClick={() => handleSaveTracking(selectedOrder.id)}
                          className="px-3 py-2 bg-[#173c2d] hover:bg-[#235440] text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Items ordered */}
                    <div className="space-y-2 pt-2 border-t border-[#eee9df]">
                      <span className="font-bold text-[#20251f] uppercase tracking-wider text-[10px]">
                        Order Items ({selectedOrder.items.length})
                      </span>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedOrder.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 p-2 bg-[#fbfaf6] rounded-xl border border-[#eee9df] text-xs"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="flex-1 truncate">
                              <p className="font-semibold truncate">{item.name}</p>
                              <p className="text-[11px] text-[#8a9b82]">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-mono font-bold">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#eee9df] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5c6159]">Total Payable:</span>
                      <span className="font-mono text-base font-bold text-[#173c2d]">
                        ₹{selectedOrder.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full py-16 text-center text-xs text-[#8a9b82] space-y-2">
                    <Package className="w-10 h-10 mx-auto text-[#d4cdbf]" />
                    <p className="font-semibold text-[#5c6159]">No Order Selected</p>
                    <p>Select any order from the table to view customer and dispatch details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & ACCOUNT */}
        {activeTab === 'security' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-[#ddd8cc] p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center gap-3 pb-5 border-b border-[#eee9df]">
                <div className="w-12 h-12 rounded-2xl bg-[#173c2d] text-[#e5d8b8] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#173c2d]">
                    Administrator Account & Security
                  </h3>
                  <p className="text-xs text-[#5c6159]">
                    Manage access credentials, password policies, and active sessions.
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#fbfaf6] border border-[#eee9df]">
                  <span className="text-[10px] uppercase font-bold text-[#8a9b82]">
                    Admin Identifier
                  </span>
                  <p className="text-sm font-bold text-[#173c2d] mt-1 font-mono">
                    {user?.email || 'admin@zyntex.com'}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Super Administrator
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbfaf6] border border-[#eee9df]">
                  <span className="text-[10px] uppercase font-bold text-[#8a9b82]">
                    Password Protection
                  </span>
                  <p className="text-sm font-bold text-[#173c2d] mt-1">
                    PBKDF2 SHA-512 Encrypted
                  </p>
                  <p className="text-[11px] text-[#8a9b82] mt-2">
                    Salted 100,000-iteration key derivation
                  </p>
                </div>
              </div>

              {/* Password Management Action */}
              <div className="p-5 rounded-2xl bg-[#f4efe4] border border-[#d8d0bf] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#173c2d] flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#8b6b4d]" />
                    <span>Change Admin Password</span>
                  </h4>
                  <p className="text-xs text-[#5c6159] mt-0.5">
                    Update your account password anytime. Must be at least 8 characters with letters and numbers.
                  </p>
                </div>
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Change Password
                </button>
              </div>

              {/* Security Standards Overview */}
              <div className="space-y-3 pt-4 border-t border-[#eee9df] text-xs text-[#5c6159]">
                <span className="font-bold text-[#20251f] uppercase tracking-wider text-[10px] block">
                  Security Protections Enforced:
                </span>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Server-side credentials validation using constant-time timing-safe hash comparison.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No passwords stored in plain text or exposed in frontend code.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mandatory first-login temporary password replacement required on setup.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cryptographic session tokens with 12-hour expiration window and brute-force rate limiting.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccessToast={(msg) => onShowToast(msg, 'success')}
      />
    </div>
  );
};
