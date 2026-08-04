import React, { useEffect, useState } from 'react';
import { BookingData } from '../types';

interface ThankYouPageProps {
  booking: BookingData | null;
  onGoHome: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ booking, onGoHome }) => {
  const [countdown, setCountdown] = useState(7200); // 2 hours

useEffect(() => {
    // Meta Pixel Lead Event Tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatCountdown = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FDF0DD] to-[#FFF5E6] flex flex-col items-center justify-center px-4 animate-in fade-in duration-300">
      <div className="max-w-2xl w-full bg-white border-2 border-[#f7ae62] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* TOP ACCENT BAR */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#f7ae62] via-[#e09040] to-[#c47a2a]" />

        {/* ANIMATED SUCCESS CHECK */}
        <div className="relative inline-block my-2">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center text-5xl mx-auto shadow-inner">
            🙏
          </div>
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-2 text-xs font-bold shadow-md">
            ✓
          </span>
        </div>

        {/* HEADING */}
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
            Payment & Booking Confirmed
          </span>
          <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-[#5C3A1E]">
            🎉 Jai Mahakal! Booking Successful
          </h1>
          <p className="text-xs sm:text-sm text-[#8B6F5E] mt-1 max-w-md mx-auto">
            Your sacred puja request has been registered. Our Senior Pandit coordinator will reach out on WhatsApp within 2 hours.
          </p>
        </div>

        {/* COUNTDOWN TIMER */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#5C3A1E]">
          <span className="text-xl">⏱️</span>
          <span>Pandit Coordinator WhatsApp Contact Window:</span>
          <span className="font-mono text-base font-bold text-[#e09040] bg-white px-3 py-1 rounded-lg border border-[#2C1A0E]/10">
            {formatCountdown(countdown)}
          </span>
        </div>

        {/* BOOKING DETAILS CARD */}
        {booking && (
          <div className="bg-[#ffffff] border-2 border-[#2C1A0E]/10 rounded-2xl p-5 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#2C1A0E]/10 pb-2 font-bold text-[#5C3A1E]">
              <span className="font-cinzel text-sm">Booking Receipt</span>
              <span className="text-[#e09040] bg-amber-100/60 px-2.5 py-0.5 rounded-md font-mono">{booking.bookingId}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#5C3A1E]">
              <div>
                <span className="text-[10px] text-[#8B6F5E] block uppercase font-bold">Devotee Name</span>
                <span className="font-semibold text-sm">{booking.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B6F5E] block uppercase font-bold">Puja Ritual</span>
                <span className="font-semibold text-sm">{booking.pujaName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B6F5E] block uppercase font-bold">Preferred Date</span>
                <span className="font-semibold">{booking.pujaDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B6F5E] block uppercase font-bold">Amount Paid</span>
                <span className="font-bold text-emerald-700 text-sm">{booking.priceDisplay}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B6F5E] block uppercase font-bold">WhatsApp / Phone</span>
                <span className="font-semibold">{booking.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8B6F5E] block uppercase font-bold">Gotra / Location</span>
                <span className="font-semibold">{booking.gotra} • {booking.city}</span>
              </div>
            </div>
          </div>
        )}

        {/* ROADMAP STEPS */}
        <div className="bg-white border border-[#2C1A0E]/10 rounded-2xl p-4 text-left space-y-2">
          <h4 className="font-cinzel font-bold text-xs text-[#5C3A1E] mb-2 flex items-center gap-2">
            <i className="fas fa-list-ol text-[#e09040]"></i> What Happens Next?
          </h4>
          <div className="space-y-2 text-xs text-[#8B6F5E]">
            <div className="flex gap-2 items-start">
              <span className="w-5 h-5 rounded-full bg-[#f7ae62] text-[#5C3A1E] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <span><strong>WhatsApp Confirmation:</strong> Panditji will send timing and puja item checklist on your WhatsApp.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="w-5 h-5 rounded-full bg-[#f7ae62] text-[#5C3A1E] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <span><strong>Live Video Link:</strong> If attending online, a private Zoom/WhatsApp link will be shared 15 mins prior.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="w-5 h-5 rounded-full bg-[#f7ae62] text-[#5C3A1E] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <span><strong>Prasad Courier:</strong> Mahakal Prasad & sacred Vibhuti dispatched via courier within 5 days.</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/919993540314?text=${encodeURIComponent(
              `🙏 *Booking Confirmation Check*\nBooking ID: ${booking?.bookingId || 'N/A'}\nName: ${booking?.fullName || ''}\nPuja: ${booking?.pujaName || ''}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-md"
          >
            <i className="fab fa-whatsapp text-base"></i> Open WhatsApp Chat
          </a>

          <button
            onClick={printReceipt}
            className="bg-[#ffffff] hover:bg-[#f7ae62] text-[#5C3A1E] font-bold text-xs px-5 py-3 rounded-full transition-colors flex items-center gap-2 cursor-pointer border border-[#2C1A0E]/10"
          >
            <i className="fas fa-print"></i> Print Receipt
          </button>

          <button
            onClick={onGoHome}
            className="bg-[#5C3A1E] hover:bg-[#2C1A0E] text-[#f7ae62] font-bold text-xs px-6 py-3 rounded-full transition-all cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
