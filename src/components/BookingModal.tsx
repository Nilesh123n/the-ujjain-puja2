import React, { useState, useEffect } from 'react';
import { Puja, BookingData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCustomization } from '../context/CustomizationContext';
import { UpiPaymentModal } from './UpiPaymentModal';

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
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponCodeMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
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

  const handleRazorpayPayment = async () => {
    try {
      showToast('Initializing Razorpay secure payment...', 'info');
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPrice,
          currency: 'INR',
          receipt: 'rcpt_' + Date.now(),
          notes: {
            pujaName: selectedPuja.name,
            customerName: fullName.trim(),
            customerPhone: phone.trim(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create payment order. Please try again.');
      }

      const orderData = await response.json();

      if (!orderData || !orderData.orderId) {
        throw new Error(orderData?.error || 'Invalid order data received from server.');
      }

      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        throw new Error('Razorpay SDK failed to load in browser. Please refresh and try again.');
      }

      const keyId = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TKQ0HEnQP01Sze';

      const options = {
        key: keyId,
        amount: orderData.amount || finalPrice * 100,
        currency: orderData.currency || 'INR',
        name: 'Mahakal Temple Puja Services',
        description: `Sankalp Puja: ${selectedPuja.name}`,
        image: selectedPuja.image || 'https://images.unsplash.com/photo-1609619385002-f40f1df5e9e2?w=200&q=80',
        order_id: orderData.isTestFallback ? undefined : orderData.orderId,
        prefill: {
          name: fullName.trim(),
          email: email.trim() || 'devotee@ujjainpuja.com',
          contact: phone.trim(),
        },
        notes: {
          bookingDate: pujaDate,
          gotra: gotra.trim() || 'Kashyap',
        },
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
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (res: any) {
        setIsSubmitting(false);
        showToast(`Payment failed: ${res.error?.description || 'Transaction declined'}`, 'error');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay payment error:', err);
      setIsSubmitting(false);
      showToast(err?.message || 'Payment initialization failed. Please try again.', 'error');
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
      setShowUpiModal(true);
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      // WhatsApp or standard offline pay
      setTimeout(() => {
        setIsSubmitting(false);
        onConfirmBooking(createBookingData('PAY_WA_' + Date.now().toString().slice(-6), 'PENDING_CONFIRMATION'));
      }, 800);
    }
  };

  const handleUpiSuccess = (utrNumber: string) => {
    setShowUpiModal(false);
    showToast('🎉 UPI Payment Submitted with UTR: ' + utrNumber, 'success');
    onConfirmBooking(createBookingData('UPI_UTR_' + utrNumber, 'SUCCESS'));
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
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#ff5c00] bg-[#f2b705] text-[#2C1A0E] font-bold'
                    : 'border-[#2C1A0E]/10 bg-[#ffffff] text-[#8B6F5E]'
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
                <i className="fas fa-credit-card text-base mb-1"></i>
                <span className="text-[11px]">Razorpay / Card</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#ff5c00] bg-[#f2b705] text-[#2C1A0E] font-bold'
                    : 'border-[#2C1A0E]/10 bg-[#ffffff] text-[#8B6F5E]'
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
                <i className="fas fa-mobile-alt text-base mb-1"></i>
                <span className="text-[11px]">GPay / UPI</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'whatsapp'
                    ? 'border-[#25D366] bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-[#2C1A0E]/10 bg-[#ffffff] text-[#8B6F5E]'
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value="whatsapp"
                  checked={paymentMethod === 'whatsapp'}
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="sr-only"
                />
                <i className="fab fa-whatsapp text-base mb-1 text-[#25D366]"></i>
                <span className="text-[11px]">Pay via WhatsApp</span>
              </label>
            </div>
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
            <p className="text-[11px] text-center text-[#8B6F5E]">
              🔒 256-Bit Encrypted Payment. Direct WhatsApp booking confirmation sent immediately.
            </p>
          </div>
        </form>
      </div>

      {showUpiModal && (
        <UpiPaymentModal
          amount={finalPrice}
          bookingId={pendingBookingId}
          pujaName={selectedPuja.name}
          customerName={fullName}
          customerPhone={phone}
          upiId={import.meta.env.VITE_UPI_ID || 'ramayentertainment@ybl'}
          upiName={import.meta.env.VITE_UPI_NAME || 'The Ujjain Puja Services'}
          onPaymentSuccess={handleUpiSuccess}
          onCancel={() => setShowUpiModal(false)}
        />
      )}
    </div>
  );
};
