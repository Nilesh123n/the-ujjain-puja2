import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/images/ujjain_puja_logo_1784894507247.jpg';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBooking }) => {
  const { lang, t } = useLanguage();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f2b705] text-[#2C1A0E] pt-16 pb-8 border-t-4 border-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2C1A0E]/20">
          {/* BRAND COLUMN */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImg}
                alt="Ujjain Puja Logo"
                className="w-13 h-13 object-contain rounded-full border-2 border-[#ffffff] bg-white shadow-md p-0.5"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#2C1A0E] leading-tight">Ujjain Puja</h3>
                <p className="text-xs text-[#5C3A1E] font-semibold uppercase tracking-wider">
                  {lang === 'hi' ? 'श्री अवंतिका वैदिक तीर्थ सेवा' : 'Spiritual & Vedic Services'}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#3A220F] font-medium leading-relaxed mb-6">
              {lang === 'hi'
                ? 'उज्जैन के मंगलनाथ एवं त्रिवेणी शनि मंदिर में शास्त्रोक्त विधि से पूजन एवं लाइव दर्शन। 150+ से अधिक श्रद्धालुओं द्वारा भरोसेमंद।'
                : 'Authentic Vedic pujas and spiritual consultations from the sacred city of Ujjain. Performed by experienced pandits in holy Ujjain. Trusted by 150+ devotees across 85+ cities.'}
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919993540314"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#ff5c00] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#2C1A0E] transition-all shadow-sm"
                title="WhatsApp"
              >
                <i className="fab fa-whatsapp text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#ff5c00] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#2C1A0E] transition-all shadow-sm"
                title="Instagram"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#ff5c00] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#2C1A0E] transition-all shadow-sm"
                title="Facebook"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#ff5c00] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#2C1A0E] transition-all shadow-sm"
                title="YouTube"
              >
                <i className="fab fa-youtube text-lg"></i>
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-cinzel text-lg font-bold text-[#2C1A0E] mb-5 pb-2 border-b border-[#2C1A0E]/20">
              {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => handleTabClick('home')}
                  className="text-[#2C1A0E]/90 hover:text-[#3A220F] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="fas fa-chevron-right text-[10px] text-[#2C1A0E]"></i> {t('nav_home', 'Home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('pujas')}
                  className="text-[#2C1A0E]/90 hover:text-[#3A220F] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="fas fa-chevron-right text-[10px] text-[#2C1A0E]"></i> {t('nav_puja', 'Puja')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('astrology')}
                  className="text-[#2C1A0E]/90 hover:text-[#3A220F] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="fas fa-chevron-right text-[10px] text-[#2C1A0E]"></i> {t('nav_astrology', 'Astrology')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('about')}
                  className="text-[#2C1A0E]/90 hover:text-[#3A220F] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="fas fa-chevron-right text-[10px] text-[#2C1A0E]"></i> {t('nav_about', 'About Us')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('contact')}
                  className="text-[#2C1A0E]/90 hover:text-[#3A220F] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="fas fa-chevron-right text-[10px] text-[#2C1A0E]"></i> {t('nav_contact', 'Contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-[#3A220F] font-bold hover:underline flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="fas fa-chevron-right text-[10px] text-[#2C1A0E]"></i> {t('nav_book_now', 'Book Puja Online')}
                </button>
              </li>
            </ul>
          </div>

          {/* POPULAR PUJAS */}
          <div>
            <h4 className="font-cinzel text-lg font-bold text-[#2C1A0E] mb-5 pb-2 border-b border-[#2C1A0E]/20">
              {lang === 'hi' ? 'लोकप्रिय पूजा' : 'Popular Pujas'}
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-[#2C1A0E]/90">
              <li className="hover:text-[#3A220F] transition-colors cursor-pointer" onClick={() => handleTabClick('pujas')}>
                🔱 {lang === 'hi' ? 'रुद्राभिषेक पूजा' : 'Rudrabhishek Puja'}
              </li>
              <li className="hover:text-[#3A220F] transition-colors cursor-pointer" onClick={() => handleTabClick('pujas')}>
                🌺 {lang === 'hi' ? 'कालसर्प दोष शांति' : 'Kalsarp Dosh Puja'}
              </li>
              <li className="hover:text-[#3A220F] transition-colors cursor-pointer" onClick={() => handleTabClick('pujas')}>
                🕉️ {lang === 'hi' ? 'महामृत्युंजय जाप' : 'Mahamrityunjay Jap'}
              </li>
              <li className="hover:text-[#3A220F] transition-colors cursor-pointer" onClick={() => handleTabClick('pujas')}>
                ⭐ {lang === 'hi' ? 'नवग्रह शांति पूजा' : 'Navgrah Shanti Puja'}
              </li>
              <li className="hover:text-[#3A220F] transition-colors cursor-pointer" onClick={() => handleTabClick('pujas')}>
                🪐 {lang === 'hi' ? 'शनि साढ़ेसाती पूजा' : 'Shani Sadeshati Puja'}
              </li>
              <li className="hover:text-[#3A220F] transition-colors cursor-pointer" onClick={() => handleTabClick('pujas')}>
                💫 {lang === 'hi' ? 'मंगल भात पूजा' : 'Mangal Dosh Puja'}
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="font-cinzel text-lg font-bold text-[#2C1A0E] mb-5 pb-2 border-b border-[#2C1A0E]/20">
              {lang === 'hi' ? 'संपर्क करें' : 'Reach Us'}
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-[#2C1A0E]">
              <li className="flex items-start gap-3">
                <i className="fab fa-whatsapp text-emerald-700 text-lg mt-0.5 shrink-0"></i>
                <div>
                  <a href="https://wa.me/919993540314" target="_blank" rel="noreferrer" className="hover:text-[#3A220F] font-bold">
                    +91 99935 40314
                  </a>
                  <p className="text-[11px] text-[#5C3A1E]">24/7 WhatsApp Support</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope text-[#3A220F] text-base mt-0.5 shrink-0"></i>
                <div>
                  <a href="mailto:hello@theujjainpuja.com" className="hover:text-[#3A220F] font-bold">
                    hello@theujjainpuja.com
                  </a>
                  <p className="text-[11px] text-[#5C3A1E]">Quick response within 2 hrs</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#3A220F]">
          <p>© 2026 Ujjain Puja | {t('footer_rights', 'All Rights Reserved.')}</p>
          <div className="flex gap-4">
            <span className="hover:text-[#2C1A0E] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#2C1A0E] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#2C1A0E] cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
