import React from 'react';
import { Heart, Lock, Unlock, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Header({
  wishlistCount,
  onOpenWishlist,
  isAdminUnlocked,
  onOpenAdmin,
  activeSection,
  onNavigate,
}) {
  return (
    <header className="glass-panel sticky top-4 z-40 mx-auto max-w-7xl px-4 py-3 sm:px-6 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand Logo & Heritage Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('collection')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 border border-amber-500/40 flex items-center justify-center text-xl shadow-md shadow-amber-950/50">
            🌙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-title text-xl font-bold tracking-wider text-white">
                SAMBALKE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Heritage
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-serif italic hidden sm:block">
              Authentic Sambalpuri Bandha & Crescent Hobo Studio
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-stone-300">
          <button
            onClick={() => onNavigate('collection')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSection === 'collection' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Collection
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSection === 'categories' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Categories & Sizes
          </button>
          <button
            onClick={() => onNavigate('order-form')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSection === 'order-form' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:text-white hover:bg-white/5'
            }`}
          >
            Request Quotation
          </button>
        </nav>

        {/* Right Actions: Wishlist & Admin */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
              wishlistCount > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
            title="View saved bags"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">Saved</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                wishlistCount > 0 ? 'bg-rose-500 text-white' : 'bg-stone-800 text-stone-400'
              }`}
            >
              {wishlistCount}
            </span>
          </button>

          {/* Admin Lock / Unlock Portal Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              isAdminUnlocked
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10 hover:text-stone-200'
            }`}
            title={isAdminUnlocked ? 'Admin Portal (Unlocked)' : 'Admin Authentication Required'}
          >
            {isAdminUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isAdminUnlocked ? 'Admin Active' : 'Admin'}</span>
          </button>

        </div>

      </div>
    </header>
  );
}
