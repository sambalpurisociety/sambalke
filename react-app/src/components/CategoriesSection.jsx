import React from 'react';
import { Layers, Plus, Ruler, Tag, ShieldCheck } from 'lucide-react';

export default function CategoriesSection({ categories, onOpenAdmin }) {
  return (
    <section id="categories-section" className="glass-panel p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Category & Dimensions Architecture</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Artisanal Categories, Weave Subcategories & Sizes
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl">
            Each SambalKe creation is categorized by silhouette, authentic handloom weave pattern, and precision dimensions tailored for everyday comfort.
          </p>
        </div>

        {/* Admin Action Trigger */}
        <button
          onClick={onOpenAdmin}
          className="btn-secondary text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Admin: Manage Categories & Sizes</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5 space-y-4 border border-white/10">
            
            {/* Category Title */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{cat.name}</h3>
                  <span className="text-[11px] font-mono text-amber-400/90 uppercase tracking-wider">
                    Category ID: {cat.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Subcategories Pills */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Weave Subcategories ({cat.subcategories?.length || 0}):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories?.map((sub) => (
                  <span
                    key={sub}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-stone-300 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes & Dimensions Specifications */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span>Configured Sizes & Dimensions ({cat.sizes?.length || 0}):</span>
              </span>

              <div className="space-y-1.5">
                {cat.sizes?.map((size) => (
                  <div
                    key={size.code}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-white/5 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 text-[10px]">
                          {size.code}
                        </span>
                        <span className="font-semibold text-white">{size.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-mono">{size.dimensions}</p>
                    </div>

                    <span className="font-mono font-bold text-amber-300">
                      ₹{size.price?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
