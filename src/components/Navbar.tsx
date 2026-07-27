import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/images/ujjain_puja_logo_1784894507247.jpg';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#ffffff] shadow-lg border-b-2 border-[#f2b705] py-2'
          : 'bg-[#ffffff] border-b border-[#f2b705]/50 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* LOGO */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left cursor-pointer border-none bg-transparent"
        >
          <img
            src={logoImg}
            alt="Ujjain Puja Logo"
            className="w-12 h-12 object-contain rounded-full border-2 border-[#2C1A0E]/20 shadow-md group-hover:scale-105 transition-transform bg-white"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="font-cinzel text-xl font-black text-[#2C1A0E] tracking-tight leading-none">
              Ujjain Puja
            </div>
            <div className="text-[10px] font-semibold text-[#5C3A1E] tracking-wider uppercase mt-0.5">
              {lang === 'hi' ? 'जय महाकाल • श्री अवंतिका सेवा' : 'Jai Mahakal • Sacred Avantika Seva'}
            </div>
          </div>
        </button>

        {/* DESKTOP NAV LINKS */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          <li>
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                  : 'text-[#2C1A0E] hover:text-[#5C3A1E] hover:bg-[#2C1A0E]/10'
              }`}
            >
              <i className="fas fa-home mr-1.5 opacity-80"></i> {t('nav_home', 'Home')}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('pujas')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pujas'
                  ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                  : 'text-[#2C1A0E] hover:text-[#5C3A1E] hover:bg-[#2C1A0E]/10'
              }`}
            >
              <i className="fas fa-om mr-1.5 opacity-80"></i> {t('nav_puja', 'Puja')}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('astrology')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'astrology'
                  ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                  : 'text-[#2C1A0E] hover:text-[#5C3A1E] hover:bg-[#2C1A0E]/10'
              }`}
            >
              <i className="fas fa-star mr-1.5 opacity-80"></i> {t('nav_astrology', 'Astrology')}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                  : 'text-[#2C1A0E] hover:text-[#5C3A1E] hover:bg-[#2C1A0E]/10'
              }`}
            >
              <i className="fas fa-info-circle mr-1.5 opacity-80"></i> {t('nav_about', 'About Us')}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                  : 'text-[#2C1A0E] hover:text-[#5C3A1E] hover:bg-[#2C1A0E]/10'
              }`}
            >
              <i className="fas fa-phone-alt mr-1.5 opacity-80"></i> {t('nav_contact', 'Contact')}
            </button>
          </li>

          {/* LANGUAGE TOGGLE SWITCHER */}
          <li className="ml-2">
            <div className="flex bg-[#2C1A0E]/10 border border-[#2C1A0E]/20 rounded-full p-0.5 shadow-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                    : 'text-[#2C1A0E] hover:text-[#5C3A1E]'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-[#f2b705] text-[#2C1A0E] shadow-xs'
                    : 'text-[#2C1A0E] hover:text-[#5C3A1E]'
                }`}
              >
                🇮🇳 हिंदी
              </button>
            </div>
          </li>

          {/* BOOK NOW CTA */}
          <li className="ml-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#f2b705] hover:bg-[#2C1A0E] hover:text-white text-[#2C1A0E] font-bold text-xs px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <span>📿</span> {t('nav_book_now', 'Book Now')}
            </button>
          </li>
        </ul>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2">
          {/* MOBILE LANG TOGGLE BUTTON */}
          <button
            onClick={toggleLang}
            className="bg-[#f2b705] border border-[#2C1A0E]/20 text-[#2C1A0E] font-bold text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
          >
            <span>🌐</span> {lang === 'en' ? 'EN' : 'हिंदी'}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#2C1A0E] text-2xl p-2 rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden bg-[#ffffff] border-b-2 border-[#f2b705] px-6 py-5 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-3 text-left py-2.5 px-4 rounded-xl font-medium text-base ${
                activeTab === 'home' ? 'bg-[#f2b705] text-[#2C1A0E] font-bold' : 'text-[#2C1A0E]'
              }`}
            >
              <i className="fas fa-home w-6"></i> {t('nav_home', 'Home')}
            </button>
            <button
              onClick={() => handleNavClick('pujas')}
              className={`flex items-center gap-3 text-left py-2.5 px-4 rounded-xl font-medium text-base ${
                activeTab === 'pujas' ? 'bg-[#f2b705] text-[#2C1A0E] font-bold' : 'text-[#2C1A0E]'
              }`}
            >
              <i className="fas fa-om w-6"></i> {t('nav_puja', 'Puja')}
            </button>
            <button
              onClick={() => handleNavClick('astrology')}
              className={`flex items-center gap-3 text-left py-2.5 px-4 rounded-xl font-medium text-base ${
                activeTab === 'astrology' ? 'bg-[#f2b705] text-[#2C1A0E] font-bold' : 'text-[#2C1A0E]'
              }`}
            >
              <i className="fas fa-star w-6"></i> {t('nav_astrology', 'Astrology')}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`flex items-center gap-3 text-left py-2.5 px-4 rounded-xl font-medium text-base ${
                activeTab === 'about' ? 'bg-[#f2b705] text-[#2C1A0E] font-bold' : 'text-[#2C1A0E]'
              }`}
            >
              <i className="fas fa-info-circle w-6"></i> {t('nav_about', 'About Us')}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`flex items-center gap-3 text-left py-2.5 px-4 rounded-xl font-medium text-base ${
                activeTab === 'contact' ? 'bg-[#f2b705] text-[#2C1A0E] font-bold' : 'text-[#2C1A0E]'
              }`}
            >
              <i className="fas fa-phone-alt w-6"></i> {t('nav_contact', 'Contact')}
            </button>

            {/* LANGUAGE SELECTOR IN MOBILE DRAWER */}
            <div className="pt-2 flex items-center justify-between border-t border-[#2C1A0E]/20">
              <span className="text-xs font-bold text-[#2C1A0E]">Language / भाषा:</span>
              <div className="flex bg-[#2C1A0E]/10 rounded-full p-0.5">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lang === 'en' ? 'bg-[#f2b705] text-[#2C1A0E]' : 'text-[#2C1A0E]'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lang === 'hi' ? 'bg-[#f2b705] text-[#2C1A0E]' : 'text-[#2C1A0E]'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
              className="mt-2 w-full bg-[#f2b705] hover:bg-[#2C1A0E] hover:text-white text-[#2C1A0E] font-bold py-3 rounded-full text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📿</span> {t('nav_book_now', 'Book Now')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
