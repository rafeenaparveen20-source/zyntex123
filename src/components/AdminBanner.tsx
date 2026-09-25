import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  PlusCircle, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  Sparkles,
  Layers,
  X,
  Lock,
  UserCheck,
  LayoutDashboard
} from 'lucide-react';
import { Order } from '../types';

interface AdminBannerProps {
  orders: Order[];
  onOpenOrdersModal: (initialOrderNumber?: string) => void;
  onGenerateTestOrder: () => void;
  isVisible: boolean;
  onToggleVisible: () => void;
  onHeightChange?: (height: number) => void;
  isAuthenticated?: boolean;
  adminEmail?: string;
  onOpenAdminDashboard?: () => void;
  onOpenAdminLogin?: () => void;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({
  orders,
  onOpenOrdersModal,
  onGenerateTestOrder,
  isVisible,
  onToggleVisible,
  onHeightChange,
  isAuthenticated = false,
  adminEmail = 'admin@zyntex.com',
  onOpenAdminDashboard,
  onOpenAdminLogin,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const bannerRef = React.useRef<HTMLDivElement>(null);

  // Measure and notify parent of exact banner height
  React.useEffect(() => {
    if (!isVisible) {
      onHeightChange?.(0);
      return;
    }

    const updateHeight = () => {
      if (bannerRef.current) {
        onHeightChange?.(bannerRef.current.offsetHeight);
      }
    };

    updateHeight();

    if (bannerRef.current && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(bannerRef.current);
      return () => ro.disconnect();
    }
  }, [isVisible, isCollapsed, orders.length, onHeightChange]);

  // Calculate live stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'packed').length;
  const latestOrders = orders.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onOpenOrdersModal(quickSearch.trim());
      setQuickSearch('');
    } else {
      onOpenOrdersModal();
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed top-2 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
        <button
          onClick={onToggleVisible}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#173c2d] hover:bg-[#235440] text-[#f7f3ea] text-xs font-semibold rounded-full shadow-lg border border-[#305e4c] transition-all cursor-pointer"
          title="Open Store Operations Banner"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e5d8b8]" />
          <span>Admin Banner</span>
          <span className="bg-[#e5d8b8] text-[#173c2d] text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums">
            {totalOrders}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div ref={bannerRef} className="relative z-50 w-full bg-[#132c22] border-b border-[#2d5845] text-[#f7f3ea] transition-all duration-300 shadow-md">
      {/* Top micro bar with system indicator */}
      <div className="max-w-[1340px] mx-auto px-4 py-2 sm:py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Brand / Admin Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f4335] text-[#d6e5d0] text-xs font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Store Operations</span>
              <span className="text-[#8a9b82]">·</span>
              <span className="text-[#e2dbce] hidden sm:inline">Order Numbers & Fulfillment</span>
            </div>

            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center gap-4 text-xs text-[#cdd8c8] pl-2 border-l border-[#274f3f]">
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#e5d8b8]" />
                <span className="text-[#a4b49f]">Total Orders:</span>
                <span className="font-bold text-white tabular-nums">{totalOrders}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#95d5b2]" />
                <span className="text-[#a4b49f]">Gross Value:</span>
                <span className="font-bold text-white tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[#a4b49f]">Awaiting Dispatch:</span>
                <span className="font-bold text-amber-300 tabular-nums">{pendingOrders}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions & Collapse */}
          <div className="flex items-center gap-2 text-xs">
            {/* Quick Search Order # */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Find Order #..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-36 md:w-44 bg-[#1b3b2f] text-white placeholder-[#87a092] text-xs rounded-full pl-7 pr-3 py-1 border border-[#2b5845] focus:outline-none focus:border-[#74a88f] focus:w-52 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#87a092] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Add Demo Order Button */}
            <button
              onClick={onGenerateTestOrder}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1e4838] hover:bg-[#285c48] text-[#f7f3ea] border border-[#346a53] transition-colors cursor-pointer text-xs"
              title="Generate a realistic sample order with sequential order number"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#e5d8b8]" />
              <span className="hidden md:inline">+ New Order</span>
              <span className="md:hidden">+ Demo</span>
            </button>

            {/* View All Order Numbers Manager Button */}
            <button
              onClick={() => onOpenOrdersModal()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5d8b8] hover:bg-[#f2e7cc] text-[#173c2d] font-bold shadow-sm transition-colors cursor-pointer text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#173c2d]" />
              <span>Order Numbers</span>
              <span className="bg-[#173c2d] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums">
                {totalOrders}
              </span>
            </button>

            {/* Admin Panel Dashboard or Login Button */}
            {isAuthenticated ? (
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e4c39] hover:bg-[#265d48] text-[#b6d4c1] hover:text-white border border-[#2d6b52] font-semibold transition-colors cursor-pointer text-xs"
                title={`Admin Dashboard (${adminEmail})`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#274438] hover:bg-[#345c4c] text-[#e5d8b8] border border-[#3c6b57] font-semibold transition-colors cursor-pointer text-xs"
                title="Sign in to Zyntex Admin Portal"
              >
                <Lock className="w-3.5 h-3.5 text-[#e5d8b8]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Collapse / Expand details */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md text-[#87a092] hover:text-white hover:bg-[#1b3b2f] transition-colors"
              title={isCollapsed ? "Expand live order numbers" : "Collapse banner details"}
              aria-label="Toggle banner expansion"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {/* Close / Hide Banner */}
            <button
              onClick={onToggleVisible}
              className="p-1 rounded-md text-[#87a092] hover:text-white hover:bg-[#1b3b2f] transition-colors"
              title="Minimize banner to floating button"
              aria-label="Hide banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Order Numbers Ticker Strip */}
        {!isCollapsed && (
          <div className="mt-2 pt-2 border-t border-[#234d3c] flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar max-w-full">
              <span className="text-[11px] uppercase tracking-wider text-[#9bb098] font-semibold whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#e5d8b8]" />
                Recent Orders:
              </span>

              {latestOrders.map((ord) => {
                const statusColor = 
                  ord.status === 'processing' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  ord.status === 'packed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                  ord.status === 'shipped' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                  ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                  'bg-red-500/20 text-red-300 border-red-500/40';

                return (
                  <button
                    key={ord.id}
                    onClick={() => onOpenOrdersModal(ord.orderNumber)}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18382c] hover:bg-[#204939] border border-[#2b5643] transition-all cursor-pointer whitespace-nowrap group shrink-0"
                    title={`Click to view details for ${ord.orderNumber}`}
                  >
                    <span className="font-mono font-bold text-white text-xs group-hover:text-[#e5d8b8] transition-colors">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[#9cb099] text-[11px] truncate max-w-[90px]">
                      {ord.customer.fullName.split(' ')[0]}
                    </span>
                    <span className="text-white font-medium tabular-nums text-[11px]">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${statusColor}`}>
                      {ord.status}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#8ea48b] ml-auto">
              <span className="hidden sm:inline">Click any order number to update status & print invoice</span>
              <button
                onClick={() => onOpenOrdersModal()}
                className="text-[#e5d8b8] hover:underline font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>View All ({totalOrders})</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
