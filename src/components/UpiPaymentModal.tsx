import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface UpiPaymentModalProps {
  amount: number;
  bookingId: string;
  pujaName: string;
  customerName: string;
  customerPhone: string;
  upiId?: string;
  upiName?: string;
  onPaymentSuccess: (utrNumber: string) => void;
  onCancel: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  amount,
  bookingId,
  pujaName,
  customerName,
  customerPhone,
  upiId = import.meta.env.VITE_UPI_ID || 'ramayentertainment@ybl',
  upiName = import.meta.env.VITE_UPI_NAME || 'The Ujjain Puja Services',
  onPaymentSuccess,
  onCancel,
}) => {
  const { lang } = useLanguage();
  const [utrNumber, setUtrNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate UPI Deep Link
  const note = `Puja Booking ${bookingId} - ${pujaName.slice(0, 20)}`;
  const encodedNote = encodeURIComponent(note);
  const encodedName = encodeURIComponent(upiName);
  
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${encodedNote}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      alert(
        lang === 'hi'
          ? 'कृपया वैध 12-अंकीय UPI UTR / Transaction ID दर्ज करें।'
          : 'Please enter a valid UPI UTR / Transaction reference ID.'
      );
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess(utrNumber.trim());
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#B5460F] relative text-[#5C3A1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#5C3A1E] to-[#B5460F] p-5 text-white text-center relative">
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
          <div className="text-2xl mb-1">📱</div>
          <h3 className="font-cinzel text-lg sm:text-xl font-bold">
            {lang === 'hi' ? 'UPI / QR कोड भुगतान' : 'Pay via UPI / QR Code'}
          </h3>
          <p className="text-xs text-amber-100/90 mt-1">
            {pujaName} • ₹{amount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* QR CODE CONTAINER */}
          <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#2C1A0E]/10 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-[#B5460F] uppercase tracking-wider mb-2">
              {lang === 'hi' ? 'स्कैन करके तुरंत भुगतान करें' : 'Scan QR Code with any UPI App'}
            </span>
            <div className="bg-white p-3 rounded-2xl border-2 border-[#B5460F]/30 shadow-md mb-2">
              <img
                src={qrCodeUrl}
                alt="UPI Payment QR Code"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>
            <p className="text-[11px] font-bold text-[#5C3A1E]">
              {upiName}
            </p>
            <div className="flex items-center gap-2 mt-1.5 bg-white px-3 py-1.5 rounded-full border border-[#B5460F]/30">
              <span className="text-xs font-mono font-bold text-[#B5460F] select-all">{upiId}</span>
              <button
                onClick={handleCopyUpi}
                className="text-xs font-bold text-[#5C3A1E] hover:text-[#B5460F] cursor-pointer ml-1"
                title="Copy UPI ID"
              >
                {isCopied ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>

          {/* DIRECT APP BUTTONS FOR MOBILE */}
          <div>
            <label className="block text-[11px] font-bold text-[#8B6F5E] uppercase tracking-wider mb-1.5 text-center">
              {lang === 'hi' ? 'या ऐप द्वारा सीधा भुगतान करें (Mobile Apps):' : 'Or Open Directly in UPI App:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={upiDeepLink}
                className="bg-[#1A73E8] hover:bg-[#1557B0] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <i className="fab fa-[#1A73E8] text-sm"></i>
                <span>Google Pay / UPI</span>
              </a>
              <a
                href={upiDeepLink}
                className="bg-[#5F259F] hover:bg-[#4A1D7C] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>PhonePe / Paytm</span>
              </a>
            </div>
          </div>

          {/* UTR / REFERENCE NUMBER INPUT */}
          <form onSubmit={handleSubmitUtr} className="pt-2 border-t border-[#2C1A0E]/10 space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'भुगतान के बाद 12-अंकीय UTR / Ref No दर्ज करें *' : 'Enter 12-Digit UPI UTR / Ref No after payment *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 420812345678"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                className="w-full bg-[#ffffff] border-2 border-[#2C1A0E]/10 focus:border-[#B5460F] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#2C1A0E] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-sm py-3 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Verifying Payment...
                </>
              ) : (
                <>
                  <span>✅</span> {lang === 'hi' ? 'भुगतान की पुष्टि करें (Confirm Payment)' : 'Confirm & Submit UTR'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
