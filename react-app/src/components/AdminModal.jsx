import React, { useState } from 'react';
import { Lock, Unlock, X, Plus, Trash2, Layers, Ruler, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AdminModal({
  isOpen,
  onClose,
  isUnlocked,
  onUnlock,
  categories,
  onAddCategory,
  onAddSubcategory,
  onAddSize,
  onDeleteCategory,
  inquiries = [],
}) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'sizes', 'inquiries'

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('👜');

  // New Subcategory State
  const [targetCatIdForSub, setTargetCatIdForSub] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // New Size State
  const [targetCatIdForSize, setTargetCatIdForSize] = useState('');
  const [newSizeCode, setNewSizeCode] = useState('');
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeDimensions, setNewSizeDimensions] = useState('');
  const [newSizePrice, setNewSizePrice] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'sambalke@2026') {
      onUnlock();
      setErrorMsg('');
      setPassword('');
    } else {
      setErrorMsg('Incorrect admin password. Default: sambalke@2026');
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName || !newCatId) return;
    onAddCategory({
      id: newCatId.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName,
      icon: newCatIcon || '👜',
      subcategories: [],
      sizes: [],
    });
    setNewCatName('');
    setNewCatId('');
  };

  const handleCreateSubcategory = (e) => {
    e.preventDefault();
    if (!targetCatIdForSub || !newSubcategoryName) return;
    onAddSubcategory(targetCatIdForSub, newSubcategoryName);
    setNewSubcategoryName('');
  };

  const handleCreateSize = (e) => {
    e.preventDefault();
    if (!targetCatIdForSize || !newSizeCode || !newSizeName) return;
    onAddSize(targetCatIdForSize, {
      code: newSizeCode.toUpperCase(),
      name: newSizeName,
      dimensions: newSizeDimensions || 'Custom dimensions',
      price: parseFloat(newSizePrice) || 1499,
    });
    setNewSizeCode('');
    setNewSizeName('');
    setNewSizeDimensions('');
    setNewSizePrice('');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] bg-stone-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="glass-panel bg-stone-900 border-white/15 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
              {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Admin Management Portal
              </h3>
              <p className="text-[11px] text-stone-400">
                {isUnlocked ? 'Authorized Session Active' : 'Restricted Artisan & Catalog Access'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Password Gate */}
        {!isUnlocked ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4 text-center max-w-sm mx-auto">
            <div className="text-3xl">🔒</div>
            <div>
              <h4 className="text-sm font-bold text-white">Enter Administrator Password</h4>
              <p className="text-xs text-stone-400 mt-1">
                Unlock category creation, custom size management, and customer inquiries.
              </p>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-white/20 text-white text-center text-sm font-mono tracking-widest focus:border-amber-400 focus:outline-none"
            />

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            )}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="w-1/2 btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="w-1/2 btn-primary text-xs">
                Unlock Portal
              </button>
            </div>

            <p className="text-[10px] text-stone-500">
              Default password: <code className="text-amber-300 font-bold">sambalke@2026</code>
            </p>
          </form>
        ) : (
          /* Unlocked Admin Workspace */
          <div className="space-y-4">
            
            {/* Admin Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-1/3 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'categories' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories & Sub</span>
              </button>

              <button
                onClick={() => setActiveTab('sizes')}
                className={`w-1/3 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'sizes' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Sizes & Dimensions</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-1/3 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'inquiries' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Inquiries ({inquiries.length})</span>
              </button>
            </div>

            {/* TAB 1: Categories & Subcategories */}
            {activeTab === 'categories' && (
              <div className="space-y-5 text-xs max-h-[60vh] overflow-y-auto pr-1">
                
                {/* 1. Add New Category */}
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-white/10 space-y-3">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Category</span>
                  </h4>

                  <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Tote Bags)"
                      value={newCatName}
                      onChange={(e) => {
                        setNewCatName(e.target.value);
                        if (!newCatId) setNewCatId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }}
                      className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ID (e.g. tote)"
                      value={newCatId}
                      onChange={(e) => setNewCatId(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white font-mono"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Icon (e.g. 👜)"
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="w-16 px-2 py-2 rounded-xl bg-stone-900 border border-white/10 text-center text-sm"
                      />
                      <button type="submit" className="flex-1 btn-primary text-xs py-2">
                        Add Category
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Add New Subcategory */}
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-white/10 space-y-3">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Subcategory for Category</span>
                  </h4>

                  <form onSubmit={handleCreateSubcategory} className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={targetCatIdForSub}
                      onChange={(e) => setTargetCatIdForSub(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white"
                      required
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name} ({c.id})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Subcategory Name (e.g. Silk Bandha)"
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white"
                      required
                    />

                    <button type="submit" className="btn-primary text-xs py-2 whitespace-nowrap">
                      Add Subcategory
                    </button>
                  </form>
                </div>

                {/* 3. Existing Categories Overview */}
                <div className="space-y-2">
                  <h5 className="font-semibold text-stone-300">Configured Categories:</h5>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="p-3 rounded-xl bg-stone-950 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 font-bold text-white">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                            <span className="text-[10px] text-amber-400 font-mono">({cat.id})</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cat.subcategories?.map((sub) => (
                              <span key={sub} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-stone-400">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        {categories.length > 1 && (
                          <button
                            onClick={() => onDeleteCategory(cat.id)}
                            className="p-1.5 text-stone-500 hover:text-rose-400 transition"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Sizes & Dimensions */}
            {activeTab === 'sizes' && (
              <div className="space-y-5 text-xs max-h-[60vh] overflow-y-auto pr-1">
                
                {/* Create Size Form */}
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-white/10 space-y-3">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Size for Category</span>
                  </h4>

                  <form onSubmit={handleCreateSize} className="space-y-2.5">
                    <select
                      value={targetCatIdForSize}
                      onChange={(e) => setTargetCatIdForSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white"
                      required
                    >
                      <option value="">-- Choose Category for Size --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name} ({c.id})
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Code (e.g. XXL)"
                        value={newSizeCode}
                        onChange={(e) => setNewSizeCode(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white font-mono"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Name (e.g. Weekend)"
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Dims (e.g. 16″×15″)"
                        value={newSizeDimensions}
                        onChange={(e) => setNewSizeDimensions(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white font-mono"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={newSizePrice}
                        onChange={(e) => setNewSizePrice(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white font-mono"
                        required
                      />
                    </div>

                    <button type="submit" className="w-full btn-primary text-xs py-2">
                      Add Custom Size to Category
                    </button>
                  </form>
                </div>

                {/* Existing Sizes Display */}
                <div className="space-y-3">
                  {categories.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-stone-950 border border-white/10 space-y-1.5">
                      <span className="font-bold text-stone-200">{c.icon} {c.name} Sizes:</span>
                      <div className="space-y-1">
                        {c.sizes?.map((s) => (
                          <div key={s.code} className="flex justify-between items-center text-[11px] p-2 rounded-lg bg-stone-900 border border-white/5">
                            <div>
                              <span className="font-bold text-amber-300 font-mono mr-2">[{s.code}]</span>
                              <span className="text-white">{s.name}</span>
                              <span className="text-stone-400 font-mono ml-2">({s.dimensions})</span>
                            </div>
                            <span className="font-mono text-amber-400 font-bold">₹{s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 3: Inquiries & Quotes Tracker */}
            {activeTab === 'inquiries' && (
              <div className="space-y-2 text-xs max-h-[60vh] overflow-y-auto pr-1">
                {inquiries.length === 0 ? (
                  <div className="text-center py-8 text-stone-400">
                    <p>No customer quotation requests received in this session yet.</p>
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div key={inq.id} className="p-3.5 rounded-xl bg-stone-950 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">{inq.id}</span>
                        <span className="text-[10px] text-stone-500">{inq.timestamp}</span>
                      </div>
                      <p className="text-white font-semibold">{inq.name} • <span className="font-mono text-emerald-400">{inq.phone}</span></p>
                      <p className="text-stone-300">Items: <span className="text-amber-200">{inq.bags?.join(', ')}</span></p>
                      <div className="text-[11px] text-stone-400 flex gap-3 pt-0.5">
                        <span>Size: {inq.size}</span>
                        <span>Pin: {inq.pincode}</span>
                        {inq.notes && <span>Notes: "{inq.notes}"</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
