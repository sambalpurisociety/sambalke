import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, MessageCircle, MapPin, Phone, Mail, User, Sparkles, X } from 'lucide-react';

export default function OrderForm({
  activeProductKey,
  products,
  wishlist,
  categories,
  onRemoveFromWishlist,
  onInquirySubmitted,
}) {
  const [selectedBags, setSelectedBags] = useState(() => {
    const list = Array.from(new Set([activeProductKey, ...wishlist]));
    return list.filter((k) => !!products[k]);
  });

  // Sync when wishlist changes
  React.useEffect(() => {
    setSelectedBags((prev) => {
      const merged = Array.from(new Set([activeProductKey, ...wishlist, ...prev]));
      return merged.filter((k) => !!products[k]);
    });
  }, [activeProductKey, wishlist, products]);

  const [size, setSize] = useState('L');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Available sizes across categories
  const allSizes = categories.flatMap((c) => c.sizes || []);

  const handlePincodeCheck = (val) => {
    setPincode(val);
    if (val.length === 6) {
      if (/^[1-9][0-9]{5}$/.test(val)) {
        if (val.startsWith('75') || val.startsWith('76')) {
          setPincodeMsg('✅ Odisha Local Hub: Express Handloom Delivery (2–3 Days)');
        } else if (val.startsWith('11') || val.startsWith('40') || val.startsWith('56') || val.startsWith('70')) {
          setPincodeMsg('✅ Metro Hub: Priority Courier Delivery (3–5 Days)');
        } else {
          setPincodeMsg('✅ All-India Handloom Delivery Available (4–7 Days)');
        }
      } else {
        setPincodeMsg('⚠️ Please enter a valid 6-digit Indian Postal Code');
      }
    } else {
      setPincodeMsg('');
    }
  };

  const handleRemoveBag = (key) => {
    if (selectedBags.length <= 1) {
      alert("At least one bag must be selected to request a price quotation.");
      return;
    }
    setSelectedBags((prev) => prev.filter((k) => k !== key));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please provide your name and phone number for quotation.");
      return;
    }

    setIsSubmitting(true);

    const inquiryRecord = {
      id: `INQ-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      name,
      phone,
      email,
      pincode,
      size,
      bags: selectedBags.map((k) => products[k]?.title || k),
      notes,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedData(inquiryRecord);
      if (onInquirySubmitted) onInquirySubmitted(inquiryRecord);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#f43f5e', '#ffffff'],
        });
      } catch (err) {
        console.log(err);
      }
    }, 700);
  };

  const handleWhatsAppShare = () => {
    if (!submittedData) return;
    const text = `Hello SambalKe Handlooms! I submitted quotation request *#${submittedData.id}* on your website for:\n\n*Items:* ${submittedData.bags.join(', ')}\n*Preferred Size:* ${submittedData.size}\n*Delivery Pin:* ${submittedData.pincode}\n*Customer Name:* ${submittedData.name}\n\nPlease share official quotations and handloom availability.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="order-form-section" className="glass-panel p-6 sm:p-8 space-y-6">
      
      {/* Section Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Handloom Quotation & Inquiry</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">
          Request Price Quotation & Custom Sizing
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Every piece is handcrafted by Sambalpuri artisan collectives. Receive official quotations, delivery timelines, and handloom certificates directly via WhatsApp and Email.
        </p>
      </div>

      {isSuccess && submittedData ? (
        <div className="glass-card p-6 border-emerald-500/40 text-center space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              Quotation Request Received!
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              Thank you, <strong>{submittedData.name}</strong>. Reference ID: <span className="font-mono text-amber-300 font-bold">{submittedData.id}</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Our artisan coordinator will reach you at <strong>{submittedData.phone}</strong> with official pricing and weave dispatch schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp Now</span>
            </button>

            <button
              onClick={() => {
                setIsSuccess(false);
                setSubmittedData(null);
              }}
              className="btn-secondary text-xs"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Selected Bags for Quotation */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
              <span>Bags Included in this Quotation ({selectedBags.length}):</span>
              <span className="text-[11px] text-amber-400 font-mono">Multi-Product Enabled</span>
            </label>

            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-stone-900/60 border border-white/10">
              {selectedBags.map((key) => {
                const bag = products[key];
                if (!bag) return null;

                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white"
                  >
                    <img src={bag.img} alt={bag.title} className="w-6 h-6 object-contain" />
                    <div>
                      <p className="font-bold">{bag.title}</p>
                      <span className="text-[10px] text-amber-300 font-mono">{bag.id}</span>
                    </div>
                    {selectedBags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBag(key)}
                        className="text-stone-400 hover:text-rose-400 p-1"
                        title="Remove bag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sizing & Specifications */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300">
              Select Preferred Silhouette Size:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {allSizes.slice(0, 3).map((s) => (
                <button
                  type="button"
                  key={s.code}
                  onClick={() => setSize(s.code)}
                  className={`p-3 rounded-xl border text-left transition ${
                    size === s.code
                      ? 'border-amber-400 bg-amber-500/15 text-white ring-2 ring-amber-400/40'
                      : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{s.name} ({s.code})</span>
                    <span className="text-[11px] font-mono text-amber-400">₹{s.price}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">{s.dimensions}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sasmita Mohapatra"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-white/10 text-white placeholder-stone-500 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* WhatsApp / Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>WhatsApp / Mobile Number *</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-white/10 text-white placeholder-stone-500 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sasmita@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-white/10 text-white placeholder-stone-500 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Delivery Pincode */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Delivery Pincode *</span>
              </label>
              <input
                type="text"
                required
                maxLength="6"
                value={pincode}
                onChange={(e) => handlePincodeCheck(e.target.value)}
                placeholder="e.g. 751001 or 560001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/80 border border-white/10 text-white placeholder-stone-500 text-xs focus:border-amber-400 focus:outline-none"
              />
              {pincodeMsg && (
                <p className="text-[11px] text-amber-300 font-medium pt-0.5">{pincodeMsg}</p>
              )}
            </div>

          </div>

          {/* Customization Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-300">
              Special Artisan Notes / Strap Customization:
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please include extra brass key clip or specific strap length."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-900/80 border border-white/10 text-white placeholder-stone-500 text-xs focus:border-amber-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting to Artisan Collective...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Quotation Request for {selectedBags.length} Item{selectedBags.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </section>
  );
}
