import React from 'react';
import { Sparkles, Compass, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

export default function HeroBanner({ onExplore, onOpen3D }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-900/40 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/60 p-6 sm:p-10 shadow-2xl">
      
      {/* Background Subtle Traditional Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose-900/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Odisha Handloom Heritage • Sambalpuri Bandha</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Handwoven Stories for <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-100">Everyday Luxury</span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
          Experience our signature <strong>Crescent Hobo</strong> and everyday artisanal bags.
          Crafted from 100% pure handloom cotton & passapalli ikat by master weavers of Western Odisha,
          now featuring an <strong>interactive 3D angle studio</strong> and customized category sizes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button onClick={onExplore} className="btn-primary">
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button onClick={onOpen3D} className="btn-secondary">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Launch 3D Angle Studio</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">🧶</span>
            <span>100% Cotton Bandha</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">🏛️</span>
            <span>Odisha Master Weavers</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <span className="text-amber-400 text-sm">🔄</span>
            <span>360° 3D Interactive View</span>
          </div>
        </div>

      </div>
    </section>
  );
}
