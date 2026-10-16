import React from 'react';
import { Heart, X, Send, Sparkles } from 'lucide-react';

export default function InterestedTray({
  wishlist,
  products,
  onRemoveFromWishlist,
  onClearAll,
  onRequestAll,
}) {
  if (wishlist.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 glass-panel bg-stone-900/95 border-rose-500/40 p-3.5 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom-4 duration-300">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Saved Bag Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-thin">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-rose-300">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Saved ({wishlist.length}):</span>
          </div>

          <div className="flex items-center gap-1.5">
            {wishlist.map((key) => {
              const item = products[key];
              if (!item) return null;

              return (
                <div
                  key={key}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-stone-200 shrink-0"
                >
                  <img src={item.img} alt={item.title} className="w-5 h-5 object-contain" />
                  <span className="font-medium max-w-[120px] truncate">{item.title.replace(' Crescent Hobo', '')}</span>
                  <button
                    onClick={() => onRemoveFromWishlist(key)}
                    className="text-stone-400 hover:text-rose-400 p-0.5 rounded transition"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onRequestAll}
            className="btn-primary text-xs py-2 px-3.5 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Quote for All ({wishlist.length})</span>
          </button>

          <button
            onClick={onClearAll}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            title="Clear all saved"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
