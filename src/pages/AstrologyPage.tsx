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
      <section className="relative bg-[#C87A2F] text-white py-20 px-4 text-center overflow-hidden border-b-2 border-[#B5460F]">
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="inline-block bg-[#FDF6EC] border border-[#B5460F] text-[#B5460F] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            🔮 Vedic Jyotish Consultation
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white leading-tight">
            Unlock Your <span className="text-[#FDF6EC] underline decoration-[#B5460F]">Cosmic Destiny</span>
          </h1>
          <p className="text-sm sm:text-base text-[#FDF6EC]/90 max-w-xl mx-auto leading-relaxed">
            Get 100% authentic birth chart (Janam Kundali) analysis, gun milan & planetary remedies directly from senior Ujjain Vedic astrologers.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#consult-form"
              className="bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
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
          <span className="inline-block bg-[#F5E6D0] border border-[#f7ae62] text-[#e09040] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
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
              className="bg-white border-2 border-[#F5E6D0] hover:border-[#6c3483] rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center border border-purple-200">
                    {srv.icon}
                  </div>
                  {srv.tag && (
                    <span className="bg-[#6c3483] text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                      {srv.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#5C3A1E] mb-2">{srv.title}</h3>
                <p className="text-xs text-[#8B6F5E] leading-relaxed mb-6">{srv.description}</p>
              </div>

              <div className="pt-4 border-t border-[#F5E6D0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8B6F5E] block">Fee per session</span>
                  <span className="font-cinzel text-xl font-bold text-[#e09040]">{srv.priceDisplay}</span>
                </div>
                <a
                  href={`https://wa.me/919993540314?text=I want to book ${encodeURIComponent(srv.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
                >
                  Book Session
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RASHIFAL / ZODIAC SELECTOR */}
      <section className="py-20 bg-[#C87A2F] text-white border-y-2 border-[#B5460F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#FDF6EC] border border-[#B5460F] text-[#B5460F] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
              Daily Rashifal
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Check Today's Horoscope
            </h2>
            <p className="text-xs sm:text-sm text-[#FDF6EC]/90 mt-2">
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
                    ? 'bg-[#B5460F] border-white text-white shadow-lg scale-105'
                    : 'bg-[#FDF6EC] border-[#F5E6D0] text-[#5C3A1E] hover:bg-white'
                }`}
              >
                <span className="text-2xl mb-1">{z.symbol}</span>
                <span className="text-xs font-bold line-clamp-1">{z.name}</span>
                <span className="text-[10px] opacity-80">{z.dates}</span>
              </button>
            ))}
          </div>

          {/* SELECTED RASHIFAL RESULT */}
          <div className="bg-[#FDF6EC] border-2 border-[#B5460F] rounded-3xl p-6 sm:p-8 text-[#5C3A1E] max-w-3xl mx-auto space-y-4 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[#F5E6D0] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedZodiac.symbol}</span>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#B5460F]">{selectedZodiac.name} Rashifal</h3>
                  <span className="text-xs text-[#8B6F5E]">{selectedZodiac.dates}</span>
                </div>
              </div>
              <span className="bg-[#B5460F] text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase">
                Today's Reading
              </span>
            </div>

            <p className="text-sm text-purple-100/90 leading-relaxed italic">{selectedZodiac.prediction}</p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10">
                <span className="block text-[10px] text-purple-300 uppercase">Lucky Color</span>
                <span className="text-xs font-bold text-[#f0c040]">{selectedZodiac.color}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10">
                <span className="block text-[10px] text-purple-300 uppercase">Lucky Day</span>
                <span className="text-xs font-bold text-[#f0c040]">{selectedZodiac.day}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10">
                <span className="block text-[10px] text-purple-300 uppercase">Lucky Number</span>
                <span className="text-xs font-bold text-[#f0c040]">{selectedZodiac.number}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href={`https://wa.me/919993540314?text=I want detailed Kundali reading for ${encodeURIComponent(selectedZodiac.name)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-md"
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
          <span className="inline-block bg-[#F5E6D0] border border-[#f7ae62] text-[#e09040] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            Navgrah
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5C3A1E]">
            The 9 Celestial Planets
          </h2>
          <p className="text-sm text-[#8B6F5E] mt-2 max-w-md mx-auto">
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
            <div key={idx} className="bg-white border-2 border-[#F5E6D0] rounded-2xl p-5 text-center shadow-xs hover:border-[#f7ae62] transition-all">
              <div className="text-4xl mb-2">{planet.emoji}</div>
              <h3 className="font-cinzel text-base font-bold text-[#5C3A1E] mb-1">{planet.name}</h3>
              <p className="text-xs text-[#8B6F5E]">{planet.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONSULTATION BOOKING FORM */}
      <section id="consult-form" className="py-20 bg-[#C87A2F] border-t-2 border-[#B5460F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FDF6EC] border-2 border-[#B5460F] rounded-3xl p-6 sm:p-10 shadow-2xl text-[#5C3A1E]">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#F5E6D0] border border-[#B5460F] text-[#B5460F] font-bold text-xs px-4 py-1 rounded-full uppercase mb-2 shadow-xs">
                Personal Session
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5C3A1E]">
                Book Jyotish Consultation
              </h2>
              <p className="text-xs text-[#8B6F5E] mt-1">
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
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
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
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
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
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
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
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Select Consultation</label>
                  <select
                    value={consultType}
                    onChange={(e) => setConsultType(e.target.value)}
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] font-semibold outline-none"
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
                    className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] font-semibold outline-none"
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
                  className="w-full bg-[#FDF6EC] border border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2 text-xs text-[#2C1A0E] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-sm py-3.5 rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
