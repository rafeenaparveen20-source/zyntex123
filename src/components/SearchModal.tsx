import React, { useState, useMemo } from 'react';
import { X, Search, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');

  const quickTags = ['Bedding', 'Fairy Lights', 'Planters', 'Wall Art', 'Cozy Warm', 'Lamps'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.mood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#fffdf8] rounded-[28px] border border-[#ddd8cc] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-5 border-b border-[#ddd8cc] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#8a9b82] shrink-0" />
          <input
            type="text"
            placeholder="Search cozy bedding, fairy lights, planters, wall art..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-hidden text-sm sm:text-base text-[#20251f] placeholder:text-[#999990]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#888880] hover:text-black px-2 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5c6159] hover:bg-[#eee9df] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Tag Pills */}
        <div className="px-6 py-3 bg-[#f7f3ea] border-b border-[#ddd8cc] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#888880] font-medium whitespace-nowrap">Suggested:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 bg-white hover:bg-[#eee9df] text-[#20251f] rounded-full border border-[#ddd8cc] whitespace-nowrap font-medium cursor-pointer transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!query ? (
            <div className="py-10 text-center text-[#696e67] text-xs">
              <p className="font-playfair text-lg text-[#173c2d] mb-1 font-semibold">
                Explore the Makeover Collection
              </p>
              Type in a product keyword or click one of the suggested tags above.
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-[#696e67]">
              <p className="font-playfair text-xl text-[#173c2d] mb-1 font-semibold">
                No matching pieces found
              </p>
              <p className="text-xs text-[#888880]">
                We couldn’t find anything matching "{query}". Try "bedding", "lights", or "planter".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 bg-white hover:bg-[#f5efe3] rounded-2xl border border-[#ddd8cc] flex gap-3 items-center cursor-pointer transition-colors group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#e8e2d7] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-playfair font-semibold text-sm text-[#173c2d] truncate group-hover:text-[#8b6b4d]">
                      {product.name}
                    </h5>
                    <span className="text-[11px] text-[#7a8077] block mb-1">
                      {product.category}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#173c2d]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="p-1.5 rounded-full bg-[#173c2d] text-white hover:bg-[#235440] shadow-xs cursor-pointer"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
