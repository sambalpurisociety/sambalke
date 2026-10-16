import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import Gallery from './components/Gallery';
import CategoriesSection from './components/CategoriesSection';
import OrderForm from './components/OrderForm';
import ProductModal from './components/ProductModal';
import InterestedTray from './components/InterestedTray';
import AdminModal from './components/AdminModal';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './data/initialData';
import { Heart, Sparkles, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function App() {
  // 1. Categories State (Loaded from localStorage or defaults)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('sambalke_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 2. Products State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // 3. Selection & Filter States
  const [activeProductKey, setActiveProductKey] = useState('crimson_jaal');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [activeSection, setActiveSection] = useState('collection');

  // 4. Wishlist / Interested State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sambalke_user_interested');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Inquiries Log State
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('sambalke_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState('2d');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // 7. Toast Notification State
  const [toast, setToast] = useState(null);

  // Persist Categories
  useEffect(() => {
    localStorage.setItem('sambalke_categories', JSON.stringify(categories));
  }, [categories]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('sambalke_user_interested', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist Inquiries
  useEffect(() => {
    localStorage.setItem('sambalke_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleWishlist = (key) => {
    const prod = products[key];
    if (!prod) return;

    setWishlist((prev) => {
      const exists = prev.includes(key);
      if (exists) {
        showToast('🤍 Removed from Saved', `"${prod.title}" was removed.`);
        return prev.filter((k) => k !== key);
      } else {
        showToast('❤️ Added to Saved', `"${prod.title}" saved for your quote.`);
        return [...prev, key];
      }
    });
  };

  const handleOpenProductModal = (key, mode = '2d') => {
    if (key) setActiveProductKey(key);
    setProductModalMode(mode);
    setIsProductModalOpen(true);
  };

  const handleInquireFromModal = (key) => {
    setActiveProductKey(key);
    scrollToSection('order-form-section');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === 'collection') scrollToSection('collection-section');
    else if (section === 'categories') scrollToSection('categories-section');
    else if (section === 'order-form') scrollToSection('order-form-section');
  };

  // Admin Actions
  const handleAddCategory = (newCat) => {
    setCategories((prev) => [...prev, newCat]);
    showToast('✨ Category Created', `Added category "${newCat.name}"`);
  };

  const handleAddSubcategory = (catId, subName) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const subs = c.subcategories || [];
          if (!subs.includes(subName)) {
            return { ...c, subcategories: [...subs, subName] };
          }
        }
        return c;
      })
    );
    showToast('✨ Subcategory Added', `Added "${subName}" to category`);
  };

  const handleAddSize = (catId, newSize) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const currentSizes = c.sizes || [];
          return { ...c, sizes: [...currentSizes, newSize] };
        }
        return c;
      })
    );
    showToast('📏 Custom Size Added', `Added size [${newSize.code}] ${newSize.name}`);
  };

  const handleDeleteCategory = (catId) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('🗑️ Category Removed', `Category deleted successfully`);
  };

  const handleInquirySubmitted = (newInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
    showToast('🎉 Quotation Sent', `Reference ID #${newInquiry.id}`);
  };

  return (
    <div className="min-h-screen text-stone-100 p-3 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header Navigation */}
      <Header
        wishlistCount={wishlist.length}
        onOpenWishlist={() => {
          setSelectedCategory('wishlist');
          scrollToSection('collection-section');
        }}
        isAdminUnlocked={isAdminUnlocked}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* 2. Hero Showcase Banner */}
      <HeroBanner
        onExplore={() => scrollToSection('collection-section')}
        onOpen3D={() => handleOpenProductModal(activeProductKey, '3d')}
      />

      {/* 3. Product Gallery & 3D Interactive Spotlight */}
      <Gallery
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        products={products}
        activeProductKey={activeProductKey}
        onSelectProduct={setActiveProductKey}
        onOpenModal={handleOpenProductModal}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 4. Categories, Subcategories & Dimensions Architecture Section */}
      <CategoriesSection
        categories={categories}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 5. Inquiries & Multi-Product Quotation Form */}
      <OrderForm
        activeProductKey={activeProductKey}
        products={products}
        wishlist={wishlist}
        categories={categories}
        onRemoveFromWishlist={handleToggleWishlist}
        onInquirySubmitted={handleInquirySubmitted}
      />

      {/* 6. Footer */}
      <footer className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
        <div>
          <span className="font-title font-bold text-white tracking-wide text-sm">SAMBALKE HANDLOOMS</span>
          <span className="mx-2 text-stone-600">•</span>
          <span className="italic font-serif">"Handwoven stories for everyday journey"</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Coordinator</span>
          </a>

          <a
            href="mailto:sambalpurisociety@gmail.com"
            className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>sambalpurisociety@gmail.com</span>
          </a>
        </div>
      </footer>

      {/* Modals & Persistent Overlays */}
      
      {/* Product 2D/3D Showcase Lightbox Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productKey={activeProductKey}
        products={products}
        onSelectProduct={setActiveProductKey}
        initialMode={productModalMode}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onInquireFromModal={handleInquireFromModal}
      />

      {/* Persistent Interested Tray */}
      <InterestedTray
        wishlist={wishlist}
        products={products}
        onRemoveFromWishlist={handleToggleWishlist}
        onClearAll={() => setWishlist([])}
        onRequestAll={() => scrollToSection('order-form-section')}
      />

      {/* Admin Authorization & Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isUnlocked={isAdminUnlocked}
        onUnlock={() => setIsAdminUnlocked(true)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onAddSubcategory={handleAddSubcategory}
        onAddSize={handleAddSize}
        onDeleteCategory={handleDeleteCategory}
        inquiries={inquiries}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999999] glass-panel bg-stone-900/95 border-amber-500/40 p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-amber-200">{toast.title}</h5>
            <p className="text-[11px] text-stone-300">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
