import React, { useState, useMemo } from 'react';
import { Heart, Eye, Star, ShoppingBag, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  wishlistIds: string[];
  selectedMood: string | null;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onClearMoodFilter: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  wishlistIds,
  selectedMood,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onClearMoodFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = ['All', 'Bedding', 'Lighting', 'Wall Art', 'Décor'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesMood = !selectedMood || p.mood === selectedMood;
        return matchesCategory && matchesMood;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, selectedMood, sortBy]);

  return (
    <section id="shop" className="py-20 md:py-28 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-8 md:mb-12">
          <div>
            <div className="text-xs uppercase tracking-[3px] font-bold text-[#8b6b4d] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8b6b4d]" />
              <span>Curated favourites</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold text-[#173c2d] tracking-tight leading-tight">
              Most-loved picks
            </h2>
          </div>
          <p className="max-w-[420px] text-[#5c6159] text-base leading-relaxed">
            Small upgrades that create a surprisingly big transformation in ambiance and warmth.
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#ddd8cc]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#173c2d] text-white shadow-xs'
                    : 'bg-[#eee9df]/80 text-[#20251f] hover:bg-[#e4ded3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Mood filter badge & Sort dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {selectedMood && (
              <div className="inline-flex items-center gap-2 bg-[#dfe7d8] px-3 py-1.5 rounded-full text-xs font-semibold text-[#173c2d]">
                <span>Mood: {selectedMood.replace('-', ' ')}</span>
                <button
                  onClick={onClearMoodFilter}
                  className="text-[#173c2d] hover:text-black font-bold ml-1 cursor-pointer"
                  title="Remove mood filter"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-medium text-[#5c6159]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <label htmlFor="product-sort-select" className="sr-only">Sort products</label>
              <select
                id="product-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/80 border border-[#ddd8cc] rounded-full px-3 py-1.5 text-xs text-[#20251f] font-medium outline-hidden focus:border-[#173c2d] cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white/40 rounded-3xl border border-[#ddd8cc] p-8">
            <p className="font-playfair text-2xl text-[#173c2d] mb-2">No makeover items match this filter</p>
            <p className="text-[#5c6159] text-sm mb-5">Try selecting a different category or clear active mood filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                onClearMoodFilter();
              }}
              className="px-6 py-2.5 rounded-full bg-[#173c2d] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#235440]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const discountPercent = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );

            return (
              <article
                key={product.id}
                className="group bg-[#fbfaf6] border border-[#ddd8cc] rounded-[24px] p-3 flex flex-col justify-between shadow-[0_4px_20px_rgba(23,60,45,0.03)] hover:shadow-[0_16px_32px_rgba(23,60,45,0.08)] transition-all duration-300 relative"
              >
                {/* Image Container with Badges and Overlay Actions */}
                <div className="relative rounded-[18px] overflow-hidden bg-[#e8e2d7] aspect-1/1.12">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    {product.badge && (
                      <span className="bg-[#173c2d] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {product.badge}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-[#8b6b4d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Heart Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10 cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300'
                        : 'bg-white/90 text-[#20251f] hover:bg-white hover:scale-110'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Quick View Button overlay on hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onQuickView(product)}
                      className="w-full py-2 bg-white/95 hover:bg-white text-[#173c2d] rounded-full text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>QUICK VIEW</span>
                    </button>
                  </div>
                </div>

                {/* Content Info */}
                <div className="pt-3.5 px-1.5 flex flex-col flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-[#8b6b4d] mb-1">
                    <Star className="w-3.5 h-3.5 fill-[#8b6b4d]" />
                    <span className="font-bold text-[#20251f]">{product.rating}</span>
                    <span className="text-[#888880]">({product.reviewsCount})</span>
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => onQuickView(product)}
                    className="font-playfair text-lg sm:text-xl font-semibold text-[#173c2d] mb-1 line-clamp-1 hover:text-[#8b6b4d] cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>

                  {/* Short Tag */}
                  <span className="text-[11px] text-[#7a8077] mb-2 font-medium">
                    {product.category} • {product.mood.replace('-', ' ')}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3 mt-auto">
                    <span className="font-bold text-base md:text-lg text-[#173c2d]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-[#999990] line-through font-normal">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-2.5 md:py-3 rounded-full border border-[#173c2d] bg-transparent text-[#173c2d] font-bold text-xs tracking-wider uppercase hover:bg-[#173c2d] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
