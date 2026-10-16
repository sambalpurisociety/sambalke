import React from 'react';
import { Heart, Eye, Sparkles, ZoomIn, Check, Info } from 'lucide-react';

export default function Gallery({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  products,
  activeProductKey,
  onSelectProduct,
  onOpenModal,
  wishlist,
  onToggleWishlist,
}) {
  const currentProduct = products[activeProductKey] || Object.values(products)[0];
  const isCurrentWishlisted = wishlist.includes(activeProductKey);

  // Filter products based on selected category & subcategory
  const filteredProductEntries = Object.entries(products).filter(([key, prod]) => {
    if (selectedCategory === 'wishlist') {
      return wishlist.includes(key);
    }
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }
    if (selectedSubcategory !== 'all' && prod.subcategory !== selectedSubcategory) {
      return false;
    }
    return true;
  });

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="collection-section" className="space-y-6">
      
      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
        
        {/* Main Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectSubcategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            ✨ All Weaves ({Object.keys(products).length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectSubcategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}

          {/* Wishlist Tab */}
          <button
            onClick={() => onSelectCategory('wishlist')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCategory === 'wishlist'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-300 hover:text-white hover:bg-rose-500/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>Saved ({wishlist.length})</span>
          </button>
        </div>

        {/* Subcategories (if specific category selected) */}
        {activeCategoryObj && activeCategoryObj.subcategories?.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            <span className="text-stone-500 text-[11px] font-semibold">Subcategory:</span>
            <button
              onClick={() => onSelectSubcategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedSubcategory === 'all'
                  ? 'bg-stone-800 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All
            </button>
            {activeCategoryObj.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => onSelectSubcategory(sub)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedSubcategory === sub
                    ? 'bg-stone-800 text-amber-300 border border-amber-500/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Featured Active Bag Spotlight Viewer */}
      {currentProduct && (
        <div className="glass-panel p-4 sm:p-6 space-y-4">
          
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  {currentProduct.id}
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  {currentProduct.title}
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {currentProduct.fabric} • <span className="font-mono text-amber-200/80">Dimensions: {currentProduct.dimensions}</span>
              </p>
            </div>

            {/* Actions for Spotlight */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(activeProductKey)}
                className={`btn-wishlist ${isCurrentWishlisted ? 'active' : ''}`}
                title={isCurrentWishlisted ? 'Remove from interested' : 'Add to interested'}
              >
                <Heart className={`w-4 h-4 ${isCurrentWishlisted ? 'fill-current' : ''}`} />
                <span>{isCurrentWishlisted ? 'Saved' : 'Add to Interest'}</span>
              </button>

              <button
                onClick={() => onOpenModal(activeProductKey, '2d')}
                className="btn-primary"
                title="Open Ultra-HD and 3D angle viewer"
              >
                <Eye className="w-4 h-4" />
                <span>3D & Ultra-HD View</span>
              </button>
            </div>
          </div>

          {/* Interactive Hero Image Canvas */}
          <div
            onClick={() => onOpenModal(activeProductKey, '2d')}
            className="group relative aspect-square sm:aspect-[16/9] md:aspect-[21/9] max-h-[460px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950 border border-white/10 flex items-center justify-center cursor-pointer shadow-inner"
          >
            {/* Subtle Texture Grid Backdrop */}
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            <img
              src={currentProduct.img}
              alt={currentProduct.title}
              className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
            />

            {/* Hover Indicator Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs text-white opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="flex items-center gap-1.5 font-medium text-stone-300">
                <ZoomIn className="w-4 h-4 text-amber-400" />
                Click anywhere to open Ultra-HD 150% Zoom & 3D Studio
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-600/90 text-white font-bold text-[11px] shadow-sm hidden sm:inline-block">
                🌟 360° Angle Studio
              </span>
            </div>
          </div>

          {/* Quick Thumbnails Selector Strip */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Select Weave Variant:</span>
              <span className="font-mono text-[11px]">
                {filteredProductEntries.length} variants available
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {filteredProductEntries.map(([key, prod]) => {
                const isSelected = key === activeProductKey;
                const isWish = wishlist.includes(key);

                return (
                  <button
                    key={key}
                    onClick={() => onSelectProduct(key)}
                    className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1.5 transition-all duration-200 border ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/50 bg-white/10 scale-105'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                    title={prod.title}
                  >
                    <img
                      src={prod.img}
                      alt={prod.title}
                      className="w-full h-full object-contain"
                    />
                    {isWish && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 border border-white text-[10px] flex items-center justify-center text-white shadow-sm">
                        ❤️
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Grid of All Collection Products */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-white">
            {selectedCategory === 'wishlist' ? 'Your Saved Interested Bags' : 'Browse All Models & Weaves'}
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            {filteredProductEntries.length} items
          </span>
        </div>

        {filteredProductEntries.length === 0 ? (
          <div className="text-center py-16 glass-card space-y-3">
            <span className="text-4xl">🤍</span>
            <h4 className="text-base font-bold text-stone-200">No saved bags in your collection</h4>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Click the heart icon on any bag in the collection to add it to your interested list for bulk price quotations!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProductEntries.map(([key, prod]) => {
              const isWish = wishlist.includes(key);

              return (
                <div
                  key={key}
                  className="glass-card group p-3.5 flex flex-col justify-between space-y-3 relative overflow-hidden"
                >
                  {/* Top Heart Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(key);
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition border ${
                      isWish
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                        : 'bg-black/50 text-white/70 border-white/10 hover:text-white hover:bg-black/70'
                    }`}
                    title={isWish ? 'Remove from interested' : 'Save to interested'}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  {/* Image Click to View */}
                  <div
                    onClick={() => {
                      onSelectProduct(key);
                      onOpenModal(key, '2d');
                    }}
                    className="aspect-square rounded-xl bg-gradient-to-b from-stone-900/50 to-stone-950/80 p-3 flex items-center justify-center cursor-pointer relative overflow-hidden group-hover:border-amber-500/30 border border-white/5 transition"
                  >
                    <img
                      src={prod.img}
                      alt={prod.title}
                      className="max-h-[90%] max-w-[90%] object-contain transition-transform duration-300 group-hover:scale-108 drop-shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-white">
                      <span className="px-3 py-1.5 rounded-lg bg-amber-600/90 shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400/90 font-mono">
                      <span>{prod.id}</span>
                      <span>{prod.fabric.split(' ')[0]} Bandha</span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-white leading-snug line-clamp-1">
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 line-clamp-1">
                      {prod.dimensions}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-amber-300">
                      {prod.prices?.L ? `₹${prod.prices.L.toLocaleString()}` : 'Price on Request'}
                    </span>
                    <button
                      onClick={() => {
                        onSelectProduct(key);
                        onOpenModal(key, '3d');
                      }}
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>🔄 3D Studio</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </section>
  );
}
