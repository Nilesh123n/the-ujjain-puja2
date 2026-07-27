import React, { useState } from 'react';
import { ZODIAC_SIGNS, ASTROLOGY_SERVICES } from '../data/pujaData';
import { ZodiacSign } from '../types';

interface AstrologyPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AstrologyPage: React.FC<AstrologyPageProps> = ({ showToast }) => {
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>(ZODIAC_SIGNS[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [consultType, setConsultType] = useState('Kundali Analysis');
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState('WhatsApp Call');

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !dob || !pob) {
      showToast('Please fill all required birth details.', 'error');
      return;
    }

    const msg = encodeURIComponent(
      `🔮 *Vedic Astrology Consultation Request*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${phone}\n` +
      `📅 *DOB:* ${dob}\n` +
      `⏰ *Birth Time:* ${tob || 'Not provided'}\n` +
      `📍 *Birth Place:* ${pob}\n` +
      `📜 *Service:* ${consultType}\n` +
      `💬 *Mode:* ${mode}\n` +
      `❓ *Question:* ${question || 'General Kundali Reading'}\n\n` +
      `🙏 Please confirm my consultation timing.`
    );

    window.open(`https://wa.me/919993540314?text=${msg}`, '_blank');
    showToast('Redirecting to WhatsApp for instant confirmation! 🔮', 'success');
  };

  return (
    <div className="pt-24 pb-20 animate-in fade-in duration-300">
      {/* COSMIC HERO */}
      <section className="relative bg-[#f2b705] text-[#2C1A0E] py-20 px-4 text-center overflow-hidden border-b-2 border-[#ffffff]">
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="inline-block bg-[#ff5c00] border border-[#ff5c00] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            🔮 Vedic Jyotish Consultation
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-[#2C1A0E] leading-tight">
            Unlock Your <span className="text-[#2C1A0E] underline decoration-[#2C1A0E]">Cosmic Destiny</span>
          </h1>
          <p className="text-sm sm:text-base text-[#3A220F] max-w-xl mx-auto leading-relaxed font-medium">
            Get 100% authentic birth chart (Janam Kundali) analysis, gun milan & planetary remedies directly from senior Ujjain Vedic astrologers.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#consult-form"
              className="bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              ⭐ Book Personal Consultation
            </a>
            <a
              href="https://wa.me/919993540314"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-md"
            >
              <i className="fab fa-whatsapp text-white text-base"></i> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ASTROLOGY SERVICES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#ff5c00] border border-[#ff5c00] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
            Our Offerings
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5C3A1E]">
            Vedic Jyotish Services
          </h2>
          <p className="text-sm text-[#8B6F5E] mt-2 max-w-lg mx-auto">
            Comprehensive horoscopic analysis for marriage, career, finance & planetary doshas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ASTROLOGY_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#ffffff] border-2 border-[#f2b705] rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1.5 text-[#2C1A0E]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl bg-[#f2b705]/20 w-14 h-14 rounded-2xl flex items-center justify-center border border-[#2C1A0E]/10 text-[#2C1A0E]">
                    {srv.icon}
                  </div>
                  {srv.tag && (
                    <span className="bg-[#f2b705] text-[#2C1A0E] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                      {srv.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#2C1A0E] mb-2">{srv.title}</h3>
                <p className="text-xs text-[#5C3A1E] leading-relaxed mb-6">{srv.description}</p>
              </div>

              <div className="pt-4 border-t border-[#2C1A0E]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#5C3A1E] block">Fee per session</span>
                  <span className="font-cinzel text-xl font-bold text-[#2C1A0E]">{srv.priceDisplay}</span>
                </div>
                <a
                  href={`https://wa.me/919993540314?text=I want to book ${encodeURIComponent(srv.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
                >
                  Book Session
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RASHIFAL / ZODIAC SELECTOR */}
      <section className="py-20 bg-[#f2b705] text-[#2C1A0E] border-y-2 border-[#ffffff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#ff5c00] border border-[#ff5c00] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
              Daily Rashifal
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#2C1A0E]">
              Check Today's Horoscope
            </h2>
            <p className="text-xs sm:text-sm text-[#3A220F] mt-2 font-medium">
              Select your Zodiac Rashi below for today's planetary prediction & lucky highlights.
            </p>
          </div>

          {/* ZODIAC CHIPS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {ZODIAC_SIGNS.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZodiac(z)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  selectedZodiac.id === z.id
                    ? 'bg-[#ff5c00] border-white text-white shadow-lg scale-105'
                    : 'bg-[#ffffff] border-[#2C1A0E]/10 text-[#2C1A0E] hover:bg-white'
                }`}
              >
                <span className="text-2xl mb-1">{z.symbol}</span>
                <span className="text-xs font-bold line-clamp-1">{z.name}</span>
                <span className="text-[10px] opacity-80">{z.dates}</span>
              </button>
            ))}
          </div>

          {/* SELECTED RASHIFAL RESULT */}
          <div className="bg-[#ffffff] border-2 border-[#f2b705] rounded-3xl p-6 sm:p-8 text-[#2C1A0E] max-w-3xl mx-auto space-y-4 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[#2C1A0E]/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedZodiac.symbol}</span>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#2C1A0E]">{selectedZodiac.name} Rashifal</h3>
                  <span className="text-xs text-[#5C3A1E]">{selectedZodiac.dates}</span>
                </div>
              </div>
              <span className="bg-[#f2b705] text-[#2C1A0E] font-bold text-[10px] px-3 py-1 rounded-full uppercase">
                Today's Reading
              </span>
            </div>

            <p className="text-sm text-[#5C3A1E] leading-relaxed italic">{selectedZodiac.prediction}</p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#f2b705]/20 p-3 rounded-xl text-center border border-[#2C1A0E]/10">
                <span className="block text-[10px] text-[#5C3A1E] uppercase">Lucky Color</span>
                <span className="text-xs font-bold text-[#2C1A0E]">{selectedZodiac.color}</span>
              </div>
              <div className="bg-[#f2b705]/20 p-3 rounded-xl text-center border border-[#2C1A0E]/10">
                <span className="block text-[10px] text-[#5C3A1E] uppercase">Lucky Day</span>
                <span className="text-xs font-bold text-[#2C1A0E]">{selectedZodiac.day}</span>
              </div>
              <div className="bg-[#f2b705]/20 p-3 rounded-xl text-center border border-[#2C1A0E]/10">
                <span className="block text-[10px] text-[#5C3A1E] uppercase">Lucky Number</span>
                <span className="text-xs font-bold text-[#2C1A0E]">{selectedZodiac.number}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href={`https://wa.me/919993540314?text=I want detailed Kundali reading for ${encodeURIComponent(selectedZodiac.name)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-md"
              >
                <i className="fab fa-whatsapp text-sm"></i> Get Detailed Kundali Analysis on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9 PLANETS (NAVGRAH) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#ff5c00] border border-[#ff5c00] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
            Navgrah
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#2C1A0E]">
            The 9 Celestial Planets
          </h2>
          <p className="text-sm text-[#5C3A1E] mt-2 max-w-md mx-auto">
            Each planet influences specific energies in your birth chart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {[
            { name: 'Sun (Surya)', emoji: '☀️', desc: 'Governs Soul, Authority, Father, Health & Government Jobs.' },
            { name: 'Moon (Chandra)', emoji: '🌙', desc: 'Governs Mind, Peace, Emotions, Mother & Mental Clarity.' },
            { name: 'Mars (Mangal)', emoji: '🔴', desc: 'Governs Energy, Courage, Property, Marriage Harmony & Siblings.' },
            { name: 'Mercury (Budh)', emoji: '🟢', desc: 'Governs Intelligence, Business Acumen, Communication & Speech.' },
            { name: 'Jupiter (Guru)', emoji: '🟡', desc: 'Governs Wisdom, Wealth, Higher Education, Children & Luck.' },
            { name: 'Venus (Shukra)', emoji: '💗', desc: 'Governs Love, Luxury, Beauty, Arts & Marital Comforts.' },
            { name: 'Saturn (Shani)', emoji: '🪐', desc: 'Governs Karma, Discipline, Justice, Longevity & Perseverance.' },
            { name: 'Rahu (North Node)', emoji: '🌑', desc: 'Governs Foreign Lands, Ambition, Sudden Luck or Obstacles.' },
            { name: 'Ketu (South Node)', emoji: '☄️', desc: 'Governs Liberation, Moksha, Intuition & Spiritual Wisdom.' }
          ].map((planet, idx) => (
            <div key={idx} className="bg-[#ffffff] border-2 border-[#f2b705] rounded-2xl p-5 text-center shadow-xs text-[#2C1A0E] hover:border-[#2C1A0E] transition-all">
              <div className="text-4xl mb-2">{planet.emoji}</div>
              <h3 className="font-cinzel text-base font-bold text-[#2C1A0E] mb-1">{planet.name}</h3>
              <p className="text-xs text-[#5C3A1E]">{planet.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONSULTATION BOOKING FORM */}
      <section id="consult-form" className="py-20 bg-[#f2b705] border-t-2 border-[#ffffff] text-[#2C1A0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#ffffff] border-2 border-[#f2b705] rounded-3xl p-6 sm:p-10 shadow-2xl text-[#2C1A0E]">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#ff5c00] text-white font-bold text-xs px-4 py-1 rounded-full uppercase mb-2 shadow-xs border border-[#ff5c00]">
                Personal Session
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C1A0E]">
                Book Jyotish Consultation
              </h2>
              <p className="text-xs text-[#5C3A1E] mt-1">
                Fill your birth details below. Panditji will analyze your chart and connect on WhatsApp within 2 hrs.
              </p>
            </div>

            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Birth Place *</label>
                  <input
                    type="text"
                    required
                    placeholder="City, State"
                    value={pob}
                    onChange={(e) => setPob(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Select Consultation</label>
                  <select
                    value={consultType}
                    onChange={(e) => setConsultType(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] font-semibold outline-none"
                  >
                    <option value="Kundali Analysis">📜 Kundali Analysis — ₹1,100</option>
                    <option value="Horoscope Matching">💑 Gun Milan / Matching — ₹801</option>
                    <option value="Yearly Prediction">📅 Yearly Horoscope — ₹1,501</option>
                    <option value="Career Guidance">💼 Career Guidance — ₹1,100</option>
                    <option value="Dosh Consultation">⚡ Dosh Remedies — ₹1,501</option>
                    <option value="Muhurat">⏰ Auspicious Muhurat — ₹501</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Preferred Call Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] font-semibold outline-none"
                  >
                    <option value="WhatsApp Call">📱 WhatsApp Voice Call</option>
                    <option value="Direct Phone">📞 Direct Phone Call</option>
                    <option value="Video Call">🎥 WhatsApp Video Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Specific Query / Concern</label>
                <textarea
                  rows={2}
                  placeholder="Describe your primary question regarding career, marriage, health or family..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-xl px-3.5 py-2 text-xs text-[#2C1A0E] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-sm py-3.5 rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔮</span> Request Astrology Session
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
