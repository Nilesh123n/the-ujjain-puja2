import React, { useState, useEffect } from 'react';
import { Puja, BookingData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCustomization } from '../context/CustomizationContext';

interface BookingModalProps {
  puja: Puja | null;
  onClose: () => void;
  onConfirmBooking: (booking: BookingData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  puja,
  onClose,
  onConfirmBooking,
  showToast
}) => {
  const { pujas } = useCustomization();
  const [selectedPuja, setSelectedPuja] = useState<Puja>(puja || pujas[0]);
  const [numPersons, setNumPersons] = useState<number>(1);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pujaDate, setPujaDate] = useState('');
  const [city, setCity] = useState('');
  const [gotra, setGotra] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [rashi, setRashi] = useState('');
  const [wishes, setWishes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [customRazorpayKey, setCustomRazorpayKey] = useState<string>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('razorpay_key_id') : '') || '';
  });
  const [customRazorpaySecret, setCustomRazorpaySecret] = useState<string>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('razorpay_key_secret') : '') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponCodeMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState('');
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (puja) {
      setSelectedPuja(puja);
    }
  }, [puja]);

  // Set min date to tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handlePujaChange = (pujaId: number) => {
    const found = pujas.find((p) => p.id === pujaId);
    if (found) {
      setSelectedPuja(found);
    }
  };

  // Price calculations
  const basePrice = selectedPuja.price * numPersons;
  const finalPrice = Math.max(0, basePrice - appliedDiscount);

  const handleWhatsAppChat = () => {
    const textMsg = encodeURIComponent(
      `Jai Shree Mahakal! 🙏\n\n` +
      `I would like to book / inquire about *${selectedPuja.name}*.\n\n` +
      `📌 *Devotee Booking Details:*\n` +
      `• *Name:* ${fullName.trim() || 'Not specified'}\n` +
      `• *Phone:* ${phone.trim() || 'Not specified'}\n` +
      `• *Gotra:* ${gotra.trim() || 'Kashyap'}\n` +
      `• *Date:* ${pujaDate || 'Auspicious Upcoming Date'}\n` +
      `• *Persons:* ${numPersons}\n` +
      `• *Amount:* ₹${finalPrice.toLocaleString('en-IN')}\n` +
      (wishes.trim() ? `• *Sankalp Wish:* ${wishes.trim()}\n` : '') +
      `\nPlease assist me on WhatsApp with booking & Panditji coordination.`
    );
    showToast('Redirecting to WhatsApp Pandit Coordinator...', 'info');
    window.open(`https://wa.me/919993540314?text=${textMsg}`, '_blank');
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showToast('Please enter a valid coupon code.', 'error');
      return;
    }

    if (code === 'MAHAKAL10') {
      const disc = Math.round(basePrice * 0.1);
      setAppliedDiscount(disc);
      setCouponCodeMsg('🎉 MAHAKAL10 applied! 10% OFF');
      showToast(`🎉 Coupon MAHAKAL10 applied! You saved ₹${disc.toLocaleString('en-IN')}`, 'success');
    } else if (code === 'UJJAIN500') {
      const disc = Math.min(500, basePrice);
      setAppliedDiscount(disc);
      setCouponCodeMsg('🎉 UJJAIN500 applied! ₹500 OFF');
      showToast(`🎉 Coupon UJJAIN500 applied! You saved ₹${disc.toLocaleString('en-IN')}`, 'success');
    } else if (code === 'FIRSTPUJA') {
      const disc = Math.round(basePrice * 0.15);
      setAppliedDiscount(disc);
      setCouponCodeMsg('🎉 FIRSTPUJA applied! 15% OFF');
      showToast(`🎉 Coupon FIRSTPUJA applied! You saved ₹${disc.toLocaleString('en-IN')}`, 'success');
    } else if (code === 'SHIVA21') {
      const disc = Math.round(basePrice * 0.21);
      setAppliedDiscount(disc);
      setCouponCodeMsg('🎉 SHIVA21 applied! 21% OFF');
      showToast(`🎉 Coupon SHIVA21 applied! You saved ₹${disc.toLocaleString('en-IN')}`, 'success');
    } else {
      showToast('Invalid coupon code. Try MAHAKAL10 or UJJAIN500', 'error');
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(0);
    setCouponCode('');
    setCouponCodeMsg('');
    showToast('Coupon removed', 'info');
  };

  const createBookingData = (payId: string, payStatus: string = 'SUCCESS'): BookingData => {
    const bookingId = pendingBookingId || ('UJP' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100));
    return {
      bookingId,
      pujaId: selectedPuja.id,
      pujaName: selectedPuja.name,
      pujaPrice: finalPrice,
      priceDisplay: '₹' + finalPrice.toLocaleString('en-IN'),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      pujaDate,
      pujaType: selectedPuja.category,
      city: city.trim() || 'Ujjain / Online',
      gotra: gotra.trim() || 'Kashyap (Default)',
      nakshatra: nakshatra.trim(),
      rashi,
      wishes: wishes.trim(),
      paymentMethod,
      paymentId: payId,
      paymentStatus: payStatus as 'SUCCESS' | 'PENDING' | 'FAILED',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
  };

  const loadRazorpaySdk = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      showToast('Initializing Razorpay secure payment...', 'info');

      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded || typeof window === 'undefined' || !(window as any).Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const generatedBookingId = pendingBookingId || ('UJP' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100));

      const sharedNotes = {
        bookingId: generatedBookingId,
        pujaId: selectedPuja.id,
        pujaName: selectedPuja.name,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        email: email.trim(),
        bookingDate: pujaDate,
        gotra: gotra.trim() || 'Kashyap',
        city: city.trim() || 'Ujjain / Online',
        pujaType: selectedPuja.category || 'Special Seva',
      };

      const savedKeyId = typeof window !== 'undefined' ? localStorage.getItem('razorpay_key_id') : null;
      const savedKeySecret = typeof window !== 'undefined' ? localStorage.getItem('razorpay_key_secret') : null;
      const keyId = (customRazorpayKey.trim() || savedKeyId?.trim() || import.meta.env.VITE_RAZORPAY_KEY_ID?.trim() || '').trim();
      const keySecret = (customRazorpaySecret.trim() || savedKeySecret?.trim() || '').trim();

      let orderData: any = null;
      try {
        const response = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalPrice,
            currency: 'INR',
            receipt: 'rcpt_' + Date.now(),
            notes: sharedNotes,
            clientKeyId: keyId,
            clientKeySecret: keySecret,
          }),
        });

        if (response.ok) {
          orderData = await response.json();
        }
      } catch (fetchErr) {
        console.warn('Backend order creation fetch failed:', fetchErr);
      }

      const activeKeyId = orderData?.keyId || keyId;

      if (!activeKeyId || !activeKeyId.startsWith('rzp_')) {
        setIsSubmitting(false);
        setShowKeyInput(true);
        showToast('Please enter your Razorpay Key ID & Key Secret to proceed.', 'info');
        return;
      }

      // Check if order creation requires Secret or failed
      if (!orderData?.orderId) {
        setIsSubmitting(false);
        setShowKeyInput(true);
        if (orderData?.requiresSecret) {
          showToast(
            lang === 'hi'
              ? 'Razorpay Order बनाने के लिए Key Secret आवश्यक है। कृपया दर्ज करें या GPay / UPI QR से भुगतान करें।'
              : 'Razorpay Key Secret is required to create live orders. Enter Key Secret below or pay via GPay / UPI QR.',
            'info'
          );
        } else {
          showToast(
            lang === 'hi'
              ? 'Razorpay ऑर्डर सृजन विफल रहा। नीचे सही Key Secret दर्ज करें या GPay / QR चुनें।'
              : 'Razorpay order creation failed. Please enter valid Key Secret or pay via GPay / QR.',
            'info'
          );
        }
        return;
      }

      const options: any = {
        key: activeKeyId,
        order_id: orderData.orderId,
        amount: orderData?.amount || Math.round(finalPrice * 100),
        currency: orderData?.currency || 'INR',
        name: 'Mahakal Temple Puja Services',
        description: `Sankalp Puja: ${selectedPuja.name}`,
        image: (selectedPuja.image && selectedPuja.image.startsWith('http')) ? selectedPuja.image : 'https://images.unsplash.com/photo-1609619385002-f40f1df5e9e2?w=200&q=80',
        prefill: {
          name: fullName.trim(),
          email: email.trim() || 'devotee@ujjainpuja.com',
          contact: phone.trim(),
        },
        notes: sharedNotes,
        theme: {
          color: '#B5460F',
        },
        handler: function (res: any) {
          setIsSubmitting(false);
          const payId = res.razorpay_payment_id || ('RZP_' + Date.now().toString().slice(-8));
          showToast('🎉 Razorpay Payment Successful!', 'success');
          onConfirmBooking(createBookingData(payId, 'SUCCESS'));
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            showToast('Payment window closed.', 'info');
          },
          escape: true,
          backdropclose: false
        },
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (res: any) {
          setIsSubmitting(false);
          console.warn('Razorpay payment failed notice:', res);
          const desc = res.error?.description || res.error?.reason || 'Payment cancelled or failed.';
          showToast(`Razorpay Notice: ${desc}`, 'error');
          setShowKeyInput(true);
          setShowUpiQr(true);
        });
        rzp.open();
      } catch (openErr: any) {
        console.error('Failed to open Razorpay checkout modal:', openErr);
        setIsSubmitting(false);
        setShowKeyInput(true);
        setShowUpiQr(true);
        showToast('Razorpay Key issue. Opening GPay / UPI QR payment option...', 'info');
      }
    } catch (err: any) {
      console.error('Razorpay payment error:', err);
      setIsSubmitting(false);
      setShowUpiQr(true);
      showToast('Opening Direct GPay / PhonePe / QR Payment...', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    if (!pujaDate) {
      showToast('Please select your preferred puja date.', 'error');
      return;
    }

    const bId = 'UJP' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100);
    setPendingBookingId(bId);

    if (paymentMethod === 'upi') {
      setShowUpiQr(true);
      return;
    }

    setIsSubmitting(true);
    handleRazorpayPayment();
  };

  const name = lang === 'hi' && selectedPuja.nameHi ? selectedPuja.nameHi : selectedPuja.name;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2C1A0E]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-[#f7ae62] relative modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#ffffff] border border-[#f7ae62] text-[#5C3A1E] font-bold text-lg hover:bg-[#f7ae62] hover:text-white transition-all flex items-center justify-center z-10 cursor-pointer"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#5C3A1E] to-[#e07b39] p-6 text-white text-center rounded-t-3xl relative">
          <div className="text-3xl mb-1">📿</div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold">
            {lang === 'hi' ? 'वैदिक पूजा संकल्प बुकिंग' : 'Book Your Sacred Puja'}
          </h2>
          <p className="text-xs text-amber-100/90 mt-1">
            {name} • {selectedPuja.location.split(',')[0]}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
          {/* PUJA SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'पूजा पैकेज चुनें' : 'Select Ritual Package'}
            </label>
            <select
              value={selectedPuja.id}
              onChange={(e) => handlePujaChange(Number(e.target.value))}
              className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#2C1A0E] outline-none"
            >
              {pujas.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'hi' && p.nameHi ? p.nameHi : p.name} ({p.priceDisplay})
                </option>
              ))}
            </select>
          </div>

          {/* NAME & PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your full name'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2C1A0E] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'व्हाट्सएप / मोबाइल *' : 'WhatsApp / Phone *'}
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2C1A0E] outline-none transition-all"
              />
            </div>
          </div>

          {/* EMAIL & DATE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2C1A0E] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'पूजा तिथि *' : 'Preferred Puja Date *'}
              </label>
              <input
                type="date"
                required
                min={minDateStr}
                value={pujaDate}
                onChange={(e) => setPujaDate(e.target.value)}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2C1A0E] outline-none transition-all"
              />
            </div>
          </div>

          {/* CITY & PERSONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'शहर / स्थान' : 'City / Location'}
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Delhi, Ujjain"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2C1A0E] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'यजमान संख्या' : 'Number of Devotees'}
              </label>
              <select
                value={numPersons}
                onChange={(e) => setNumPersons(Number(e.target.value))}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#2C1A0E] outline-none"
              >
                <option value={1}>1 Person</option>
                <option value={2}>2 Persons (Family)</option>
                <option value={3}>3 Persons</option>
                <option value={4}>4 Persons</option>
                <option value={5}>5+ Persons Group</option>
              </select>
            </div>
          </div>

          {/* GOTRA, NAKSHATRA, RASHI */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#5C3A1E] uppercase mb-1">Gotra</label>
              <input
                type="text"
                placeholder="e.g. Kashyap"
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 rounded-xl px-2.5 py-2 text-xs text-[#2C1A0E] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5C3A1E] uppercase mb-1">Nakshatra</label>
              <input
                type="text"
                placeholder="Optional"
                value={nakshatra}
                onChange={(e) => setNakshatra(e.target.value)}
                className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 rounded-xl px-2.5 py-2 text-xs text-[#2C1A0E] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5C3A1E] uppercase mb-1">Rashi</label>
              <select
                value={rashi}
                onChange={(e) => setRashi(e.target.value)}
                className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 rounded-xl px-2 py-2 text-xs text-[#2C1A0E] outline-none"
              >
                <option value="">Rashi</option>
                <option value="Mesh">Mesh (Aries)</option>
                <option value="Vrishabh">Vrishabh</option>
                <option value="Mithun">Mithun</option>
                <option value="Kark">Kark</option>
                <option value="Singh">Singh</option>
                <option value="Kanya">Kanya</option>
                <option value="Tula">Tula</option>
                <option value="Vrishchik">Vrishchik</option>
                <option value="Dhanu">Dhanu</option>
                <option value="Makar">Makar</option>
                <option value="Kumbh">Kumbh</option>
                <option value="Meen">Meen</option>
              </select>
            </div>
          </div>

          {/* SANKALP MESSAGE */}
          <div>
            <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'विशेष मनोकामना / संकल्प' : 'Sankalp Message / Special Prayer (Optional)'}
            </label>
            <textarea
              rows={2}
              placeholder={lang === 'hi' ? 'संकल्प हेतु विशेष प्रार्थना एवं इच्छा लिख सकते हैं...' : 'Any specific prayer or family wish for panditji during sankalp...'}
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#f7ae62] rounded-xl px-3.5 py-2 text-xs text-[#2C1A0E] outline-none resize-none"
            />
          </div>

          {/* COUPON SECTION */}
          <div className="bg-[#ffffff] p-3 rounded-xl border border-[#2C1A0E]/10 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Coupon Code (e.g. MAHAKAL10, UJJAIN500)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 uppercase bg-white border border-[#2C1A0E]/10 rounded-lg px-3 py-1.5 text-xs font-bold tracking-wider outline-none"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="bg-[#5C3A1E] text-[#f7ae62] hover:bg-[#2C1A0E] px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
                <span>{couponMsg}</span>
                <button type="button" onClick={removeCoupon} className="text-red-500 font-bold hover:underline cursor-pointer">
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1.5">
              {lang === 'hi' ? 'भुगतान माध्यम चुनें' : 'Select Payment Option'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#ff5c00] bg-[#f2b705] text-[#2C1A0E] font-bold shadow-sm'
                    : 'border-[#2C1A0E]/10 bg-[#ffffff] text-[#8B6F5E] hover:border-[#f7ae62]'
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="sr-only"
                />
                <i className="fas fa-credit-card text-lg mb-1 text-[#B5460F]"></i>
                <span className="text-xs font-bold">Razorpay / Online Pay</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#ff5c00] bg-[#f2b705] text-[#2C1A0E] font-bold shadow-sm'
                    : 'border-[#2C1A0E]/10 bg-[#ffffff] text-[#8B6F5E] hover:border-[#f7ae62]'
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="sr-only"
                />
                <i className="fas fa-mobile-alt text-lg mb-1 text-[#B5460F]"></i>
                <span className="text-xs font-bold">GPay / PhonePe / QR</span>
              </label>
            </div>

            {showKeyInput && (
              <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2.5 text-xs shadow-sm">
                <div className="flex items-center justify-between font-bold text-[#2C1A0E]">
                  <span>🔑 {lang === 'hi' ? 'Razorpay Key ID एवं Key Secret दर्ज करें' : 'Enter Razorpay Key ID & Key Secret'}</span>
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C3A1E] mb-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={customRazorpayKey}
                      onChange={(e) => setCustomRazorpayKey(e.target.value)}
                      placeholder="e.g. rzp_live_TKQ0HEnQP01SZE"
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 font-mono text-xs outline-none focus:border-[#ff5c00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C3A1E] mb-1">Razorpay Key Secret</label>
                    <input
                      type="password"
                      value={customRazorpaySecret}
                      onChange={(e) => setCustomRazorpaySecret(e.target.value)}
                      placeholder="e.g. ywZ9PwaRiRpsZjGQwkI0Itbk"
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 font-mono text-xs outline-none focus:border-[#ff5c00]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (customRazorpayKey.trim() && customRazorpayKey.trim().startsWith('rzp_')) {
                          localStorage.setItem('razorpay_key_id', customRazorpayKey.trim());
                          if (customRazorpaySecret.trim()) {
                            localStorage.setItem('razorpay_key_secret', customRazorpaySecret.trim());
                          }
                          showToast('✅ Credentials saved! Retrying Razorpay order...', 'success');
                          setShowKeyInput(false);
                          handleRazorpayPayment();
                        } else {
                          showToast('Please enter a valid Razorpay Key ID starting with rzp_live_ or rzp_test_', 'error');
                        }
                      }}
                      className="flex-1 bg-[#ff5c00] hover:bg-[#e05200] text-white py-2 rounded-lg font-bold transition-all cursor-pointer text-center text-xs shadow-sm"
                    >
                      Save Credentials & Pay with Razorpay
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowKeyInput(false);
                        setShowUpiQr(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs shadow-sm"
                    >
                      Pay via GPay / QR
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Razorpay requires both Key ID & Key Secret to generate live order signatures. Get them from Razorpay Dashboard → Account & Settings → API Keys.
                </p>
              </div>
            )}
          </div>

          {/* TOTAL & SUBMIT */}
          <div className="pt-2 border-t border-[#2C1A0E]/10 space-y-3">
            <div className="bg-[#f2b705] p-3.5 rounded-xl border border-[#ff5c00] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#5C3A1E] font-medium block">
                  {lang === 'hi' ? 'कुल देय राशि' : 'Total Payable Amount'}
                </span>
                <span className="text-[10px] text-[#8B6F5E]">
                  {lang === 'hi' ? 'सामग्री, दक्षिणा एवं प्रसाद सहित' : 'Includes Samagri, Pandit Seva & Prasad'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-cinzel text-2xl font-bold text-[#e09040]">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {appliedDiscount > 0 && (
                  <span className="block text-[10px] text-emerald-700 font-bold">
                    Saved ₹{appliedDiscount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-base py-3.5 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing Booking...
                </>
              ) : (
                <>
                  <i className="fas fa-lock text-sm"></i> Proceed to Pay ₹{finalPrice.toLocaleString('en-IN')}
                </>
              )}
            </button>

            {/* CHAT ON WHATSAPP BUTTON */}
            <button
              type="button"
              onClick={handleWhatsAppChat}
              className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-sm py-3 rounded-full shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:shadow-lg active:scale-[0.99]"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span>{lang === 'hi' ? 'WhatsApp पर बातचीत एवं सहायता लें' : 'Chat on WhatsApp for Help & Booking'}</span>
            </button>
            <p className="text-[11px] text-center text-[#8B6F5E]">
              🔒 256-Bit Encrypted Payment. Direct WhatsApp booking confirmation sent immediately.
            </p>
          </div>
        </form>
      </div>

      {showUpiQr && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#f2b705] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setShowUpiQr(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer font-bold"
            >
              ✕
            </button>
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Instant UPI / GPay Payment
              </span>
              <h3 className="text-lg font-bold text-[#2C1A0E] font-cinzel mt-1">
                Scan & Pay ₹{finalPrice.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-gray-500">
                Use Google Pay, PhonePe, Paytm, or BHIM to pay instantly
              </p>
            </div>

            {/* QR CODE DISPLAY */}
            <div className="bg-[#FAF8F5] border-2 border-dashed border-[#f2b705] p-4 rounded-2xl inline-block shadow-inner relative">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  `upi://pay?pa=ramayentertainment@ybl&pn=The%20Ujjain%20Puja%20Services&am=${finalPrice}&cu=INR`
                )}`}
                alt="UPI Payment QR Code"
                className="w-48 h-48 mx-auto rounded-lg shadow-sm"
              />
              <div className="mt-2 text-xs font-mono font-bold text-[#2C1A0E] flex items-center justify-center gap-1.5">
                <span>UPI ID: ramayentertainment@ybl</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('ramayentertainment@ybl');
                    showToast('✅ UPI ID Copied!', 'success');
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded font-sans cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* DIRECT UPI APP LINKS FOR MOBILE */}
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <a
                href={`upi://pay?pa=ramayentertainment@ybl&pn=The%20Ujjain%20Puja%20Services&am=${finalPrice}&cu=INR`}
                className="bg-blue-50 border border-blue-200 text-blue-700 py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <span className="text-xs font-black">GPay</span>
                <span className="text-[10px] font-normal">Google Pay</span>
              </a>
              <a
                href={`upi://pay?pa=ramayentertainment@ybl&pn=The%20Ujjain%20Puja%20Services&am=${finalPrice}&cu=INR`}
                className="bg-purple-50 border border-purple-200 text-purple-700 py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-purple-100 transition-all cursor-pointer"
              >
                <i className="fas fa-mobile-alt text-base"></i>
                <span className="text-[10px] font-normal">PhonePe</span>
              </a>
              <a
                href={`upi://pay?pa=ramayentertainment@ybl&pn=The%20Ujjain%20Puja%20Services&am=${finalPrice}&cu=INR`}
                className="bg-cyan-50 border border-cyan-200 text-cyan-700 py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-cyan-100 transition-all cursor-pointer"
              >
                <i className="fas fa-wallet text-base"></i>
                <span className="text-[10px] font-normal">Paytm</span>
              </a>
            </div>

            {/* UTR TRANSACTION REF INPUT */}
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl text-left space-y-2 shadow-sm">
              <label className="text-xs font-bold text-[#2C1A0E] flex items-center justify-between">
                <span>{lang === 'hi' ? '12-अंकों का UPI UTR / Transaction No.' : 'Enter 12-Digit UPI UTR / Ref No.'}</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-200/80 px-2 py-0.5 rounded-full">* Required</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="e.g. 423456789012"
                maxLength={20}
                className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono tracking-widest font-bold text-[#2C1A0E] outline-none focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]/30 transition-all"
              />
              <p className="text-[10px] text-gray-600 leading-tight">
                {lang === 'hi'
                  ? 'GPay / PhonePe / Paytm से भुगतान के बाद दिखने वाला 12-अंकों का UTR / Txn ID यहाँ लिखें।'
                  : 'After payment, enter the 12-digit UTR / Ref ID shown in Google Pay or PhonePe.'}
              </p>
            </div>

            {/* CONFIRM BUTTON WITH UTR */}
            <button
              type="button"
              onClick={() => {
                const cleanUtr = utrNumber.trim();
                if (!cleanUtr || cleanUtr.length < 6) {
                  showToast(
                    lang === 'hi'
                      ? 'कृपया सही 12-अंकों का UPI UTR / Transaction No. दर्ज करें।'
                      : 'Please enter a valid 12-digit UPI UTR / Transaction Reference Number.',
                    'error'
                  );
                  return;
                }
                setShowUpiQr(false);
                const payId = 'UPI_UTR_' + cleanUtr;
                showToast(
                  lang === 'hi'
                    ? '🎉 UTR दर्ज हो गया! पूजा बुकिंग सफलतापूर्वक कन्फर्म हुई।'
                    : '🎉 UTR Submitted! Puja Booking Confirmed Successfully.',
                  'success'
                );
                onConfirmBooking(createBookingData(payId, 'SUCCESS'));
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <i className="fas fa-check-circle text-lg"></i>
              <span>{lang === 'hi' ? 'UTR जमा करें एवं बुकिंग कन्फर्म करें' : 'Submit UTR & Confirm Booking'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
