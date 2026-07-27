import React from 'react';
import { TEAM_PANDITS } from '../data/pujaData';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="pt-24 pb-20 animate-in fade-in duration-300">
      {/* PAGE HERO */}
      <section className="bg-[#f2b705] text-[#2C1A0E] py-16 px-4 text-center border-b-2 border-[#ffffff]">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-[#2C1A0E] font-medium">
            <span>{t('nav_home', 'Home')}</span>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span>{t('nav_about', 'About Us')}</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#2C1A0E]">
            {lang === 'hi' ? 'ℹ️ हमारे विद्वान एवं तीर्थ सेवा' : 'ℹ️ About Ujjain Puja'}
          </h1>
          <p className="text-sm sm:text-base text-[#3A220F] max-w-xl mx-auto font-medium">
            {lang === 'hi'
              ? 'उज्जैन के पावन धाम से सिद्ध पूजन एवं वैदिक संस्कृति का प्रसार।'
              : 'Bringing authentic Vedic traditions, Mahakal blessings, and certified scholars to devotees around the world.'}
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#ffffff] py-8 border-b-2 border-[#2C1A0E]/10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-cinzel text-3xl font-black text-[#2C1A0E] block">150+</span>
            <span className="text-xs text-[#2C1A0E] font-semibold">{lang === 'hi' ? 'संतुष्ट परिवार' : 'Happy Families Served'}</span>
          </div>
          <div>
            <span className="font-cinzel text-3xl font-black text-[#2C1A0E] block">85+</span>
            <span className="text-xs text-[#2C1A0E] font-semibold">{lang === 'hi' ? 'शहरों में सेवा' : 'Cities Reached'}</span>
          </div>
          <div>
            <span className="font-cinzel text-3xl font-black text-[#2C1A0E] block">25+</span>
            <span className="text-xs text-[#2C1A0E] font-semibold">{lang === 'hi' ? 'वैदिक विद्वान' : 'Certified Pandits'}</span>
          </div>
          <div>
            <span className="font-cinzel text-3xl font-black text-[#2C1A0E] block">100%</span>
            <span className="text-xs text-[#2C1A0E] font-semibold">{lang === 'hi' ? 'शास्त्रोक्त विधि' : 'Authentic Vidhi'}</span>
          </div>
        </div>
      </section>

      {/* SACRED JOURNEY STORY */}
      <section className="py-20 bg-[#f2b705] text-[#2C1A0E] border-b-2 border-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-4/3 bg-[#ffffff] rounded-3xl flex items-center justify-center text-8xl shadow-xl border-2 border-[#2C1A0E]/20 text-[#2C1A0E]">
              🛕
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#2C1A0E] text-[#ffffff] p-5 rounded-2xl shadow-xl text-center">
              <span className="font-cinzel text-3xl font-black block">Ujjain</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#f2b705]">
                {lang === 'hi' ? 'अवंतिका तीर्थ' : 'Holy Avantika Seva'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="inline-block bg-[#ff5c00] text-white font-bold text-xs px-3.5 py-1 rounded-full uppercase shadow-md border border-[#ff5c00]">
              {lang === 'hi' ? 'हमारा संकल्प' : 'Our Journey'}
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#2C1A0E] leading-tight">
              {lang === 'hi'
                ? 'अवंतिका तीर्थ में सनातन संस्कृति एवं वैदिक पूजन का संरक्षण'
                : 'Preserving Vedic Sanatana Traditions in Sacred Ujjain'}
            </h2>
            <p className="text-xs sm:text-sm text-[#3A220F] leading-relaxed font-medium">
              Ujjain Puja was established with a singular devotion: making authentic Vedic rituals accessible to every devotee across India and globally. Located in Ujjain — the eternal city of Lord Mahakal and Avantika Kshetra — we serve with absolute purity.
            </p>
            <p className="text-xs sm:text-sm text-[#3A220F] leading-relaxed font-medium">
              Every ritual is performed adhering strictly to ancient Samhita, Ashtadhyay, and Agamas. Whether attending in-person at Pardeshwar Mahadev or participating live via high-definition video calls, devotees experience absolute purity and peace.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-3 bg-[#ffffff] p-3 rounded-xl border border-[#2C1A0E]/10 text-[#2C1A0E]">
                <i className="fas fa-certificate text-[#2C1A0E] text-lg"></i>
                <span className="text-xs font-bold">100% Certified Kashi & Ujjain Vidyapeeth Scholars</span>
              </div>
              <div className="flex items-center gap-3 bg-[#ffffff] p-3 rounded-xl border border-[#2C1A0E]/10 text-[#2C1A0E]">
                <i className="fas fa-video text-[#2C1A0E] text-lg"></i>
                <span className="text-xs font-bold">Live Video Streaming for Devotees in 85+ Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET OUR PANDITS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#ff5c00] text-white font-bold text-xs px-3.5 py-1 rounded-full uppercase mb-2 shadow-md border border-[#ff5c00]">
            Vedic Scholars
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5C3A1E]">
            {lang === 'hi' ? 'हमारे विद्वान पंडित' : 'Meet Our Senior Pandits'}
          </h2>
          <p className="text-sm text-[#8B6F5E] mt-1 max-w-md mx-auto">
            Experienced priests dedicated to strictly executing your Sankalp according to Vedic scriptures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_PANDITS.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#ffffff] border-2 border-[#f2b705] rounded-3xl p-6 text-center text-[#2C1A0E] shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="w-20 h-20 rounded-full bg-[#f2b705] text-[#2C1A0E] text-4xl flex items-center justify-center mx-auto mb-4 border-2 border-[#2C1A0E]/10 shadow-md">
                {p.avatar}
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#2C1A0E]">{p.name}</h3>
              <span className="text-[11px] font-bold text-[#5C3A1E] block mb-1">{p.role}</span>
              <span className="inline-block bg-[#f2b705] text-[#2C1A0E] text-[10px] font-bold px-3 py-0.5 rounded-full border border-[#2C1A0E]/10 mb-3">
                {p.experience}
              </span>
              <p className="text-xs text-[#5C3A1E] leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {p.specialties.map((s, i) => (
                  <span key={i} className="text-[9px] bg-[#f2b705]/20 text-[#2C1A0E] font-medium px-2 py-0.5 rounded-md border border-[#2C1A0E]/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-16 bg-[#f2b705] border-t-2 border-[#ffffff] text-[#2C1A0E] text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <h3 className="font-cinzel text-2xl font-bold text-[#2C1A0E]">
            {lang === 'hi' ? 'भरोसा एवं प्रमाण पत्र' : 'Trust Badges & Certifications'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#2C1A0E]">
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#2C1A0E]/10 shadow-xs">
              <span className="text-3xl block mb-1">🏆</span>
              <span className="text-xs font-bold text-[#2C1A0E] block">Top Puja Platform</span>
              <span className="text-[10px] text-[#5C3A1E]">Ujjain Tirth</span>
            </div>
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#2C1A0E]/10 shadow-xs">
              <span className="text-3xl block mb-1">🔒</span>
              <span className="text-xs font-bold text-[#2C1A0E] block">256-Bit SSL</span>
              <span className="text-[10px] text-[#5C3A1E]">100% Payment Safe</span>
            </div>
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#2C1A0E]/10 shadow-xs">
              <span className="text-3xl block mb-1">📜</span>
              <span className="text-xs font-bold text-[#2C1A0E] block">Vedic Authenticity</span>
              <span className="text-[10px] text-[#5C3A1E]">Scripture Compliant</span>
            </div>
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#2C1A0E]/10 shadow-xs">
              <span className="text-3xl block mb-1">📦</span>
              <span className="text-xs font-bold text-[#2C1A0E] block">Prasad Shipment</span>
              <span className="text-[10px] text-[#5C3A1E]">Tracked Delivery</span>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={onOpenBooking}
              className="bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              📿 {t('btn_book_puja', 'Book Your Puja Today')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
