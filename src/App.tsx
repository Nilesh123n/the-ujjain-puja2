import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { PujaDetailModal } from './components/PujaDetailModal';
import { BookingModal } from './components/BookingModal';
import { AiChatbot } from './components/AiChatbot';

import { HomePage } from './pages/HomePage';
import { PujaPage } from './pages/PujaPage';
import { AstrologyPage } from './pages/AstrologyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { SecretAdminPortal } from './pages/SecretAdminPortal';

import { Puja, BookingData } from './types';
import { PUJA_DATA } from './data/pujaData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDetailPuja, setSelectedDetailPuja] = useState<Puja | null>(null);
  const [selectedBookingPuja, setSelectedBookingPuja] = useState<Puja | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Check route for secret admin portal on load and location change
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (
        path === '/secret-admin-portal' ||
        path.startsWith('/secret-admin-portal') ||
        hash === '#secret-admin-portal' ||
        hash === '#/secret-admin-portal'
      ) {
        setActiveTab('secret-admin');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenBooking = (puja?: Puja) => {
    if (puja) {
      setSelectedBookingPuja(puja);
    } else {
      setSelectedBookingPuja(PUJA_DATA[0]);
    }
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (booking: BookingData) => {
    setConfirmedBooking(booking);
    setIsBookingOpen(false);
    setActiveTab('thankyou');
    addToast('🎉 Puja Booking Confirmed Successfully!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickWhatsApp = (puja: Puja) => {
    const msg = encodeURIComponent(
      `🙏 *PUJA ENQUIRY - UJJAIN PUJA*\n━━━━━━━━━━━━━━━━━━\n🪔 *Puja:* ${puja.name}\n💰 *Price:* ${puja.priceDisplay}\n⏱️ *Duration:* ${puja.duration}\n📍 *Location:* ${puja.location}\n━━━━━━━━━━━━━━━━━━\nI want to book this puja. Please guide me.\n🙏 Jai Mahakal!`
    );
    window.open(`https://wa.me/919993540314?text=${msg}`, '_blank');
    addToast('Opening WhatsApp Chat...', 'info');
  };

  // IF SECRET ADMIN PORTAL IS ACTIVE
  if (activeTab === 'secret-admin') {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <Toast toasts={toasts} onRemove={removeToast} />
        <SecretAdminPortal
          showToast={addToast}
          onGoHome={() => {
            window.history.pushState({}, '', '/');
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#2C1A0E] relative selection:bg-[#f7ae62] selection:text-[#5C3A1E]">
      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* TOAST CONTAINER */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onOpenBooking={handleOpenBooking}
            onOpenDetail={(puja) => setSelectedDetailPuja(puja)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'pujas' && (
          <PujaPage
            onOpenBooking={handleOpenBooking}
            onOpenDetail={(puja) => setSelectedDetailPuja(puja)}
          />
        )}

        {activeTab === 'astrology' && <AstrologyPage showToast={addToast} />}

        {activeTab === 'about' && (
          <AboutPage onOpenBooking={() => handleOpenBooking()} />
        )}

        {activeTab === 'contact' && <ContactPage showToast={addToast} />}

        {activeTab === 'thankyou' && (
          <ThankYouPage
            booking={confirmedBooking}
            onGoHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919993540314"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float group"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="absolute right-16 bg-[#5C3A1E] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-sans">
          Chat on WhatsApp 🙏
        </span>
      </a>

      {/* AI CHATBOT "MAHAKAL BOT" */}
      <AiChatbot onOpenBooking={() => handleOpenBooking()} />

      {/* PUJA DETAIL MODAL */}
      <PujaDetailModal
        puja={selectedDetailPuja}
        onClose={() => setSelectedDetailPuja(null)}
        onBook={handleOpenBooking}
        onQuickWhatsApp={handleQuickWhatsApp}
      />

      {/* MULTI-STEP BOOKING MODAL */}
      {isBookingOpen && (
        <BookingModal
          puja={selectedBookingPuja}
          onClose={() => setIsBookingOpen(false)}
          onConfirmBooking={handleConfirmBooking}
          showToast={addToast}
        />
      )}
    </div>
  );
}
