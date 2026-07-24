import React, { useState } from 'react';
import { Puja } from '../types';
import { PUJA_DATA, TESTIMONIALS, FAQS } from '../data/pujaData';
import { AiRecommendation } from '../components/AiRecommendation';
import { UjjainMahima } from '../components/UjjainMahima';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onOpenBooking: (puja?: Puja) => void;
  onOpenDetail: (puja: Puja) => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onOpenDetail,
  setActiveTab
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { lang, t } = useLanguage();

  const popularPujas = PUJA_DATA.filter((p) => p.popular).slice(0, 6);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 pt-28 pb-16 overflow-hidden">
        {/* BACKGROUND IMAGE & OVERLAY */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1609619385002-f40f1df5e9e2?w=1600&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6EC]/92 via-[#FDF6EC]/85 to-[#FDF6EC] z-0" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* TRUST BADGE */}
          <div className="inline-block bg-gradient-to-r from-[#f7ae62] via-[#e09040] to-[#f7ae62] text-[#5C3A1E] font-bold text-xs sm:text-sm px-5 py-2 rounded-full shadow-md tracking-wide">
            {t('hero_badge', '✨ Trusted by 150+ Devotees Worldwide')}
          </div>

          {/* MAIN HEADING */}
          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black text-[#5C3A1E] leading-tight">
            {t('hero_title_1', 'Sacred Puja Seva')} <br />
            <span className="text-[#e09040] drop-shadow-xs">{t('hero_title_2', 'in Holy Ujjain')}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C3A1E]/90 max-w-2xl mx-auto leading-relaxed">
            {t('hero_desc', 'Experience divine Mahakal blessings through authentic Vedic pujas, havans, and spiritual consultations performed by experienced pandits in sacred Ujjain.')}
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              onClick={() => onOpenBooking()}
              className="bg-gradient-to-r from-[#f7ae62] via-[#e09040] to-[#c47a2a] text-[#5C3A1E] hover:text-white font-bold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer flex items-center gap-2"
            >
              <span>🙏</span> {t('btn_book_puja', 'Book Puja Now')}
            </button>
            <a
              href="#ai-section"
              className="bg-transparent hover:bg-[#f7ae62]/20 border-2 border-[#f7ae62] text-[#5C3A1E] font-bold text-base px-7 py-3.5 rounded-full transition-all cursor-pointer flex items-center gap-2"
            >
              <span>🤖</span> {t('btn_ai_rec', 'AI Recommendation')}
            </a>
          </div>

          {/* STATS OVERLAY - UPDATED ACCORDING TO PROMPT */}
          <div className="pt-8">
            <div className="bg-[#FDF6EC]/95 backdrop-blur-md border-2 border-[#f7ae62] rounded-2xl p-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto divide-y md:divide-y-0 md:divide-x divide-[#f7ae62]/30">
              <div className="p-2">
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#e09040] block">150+</span>
                <span className="text-xs text-[#5C3A1E] font-semibold">{t('stat_pujas', 'Pujas Performed')}</span>
              </div>
              <div className="p-2">
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#e09040] block">85+</span>
                <span className="text-xs text-[#5C3A1E] font-semibold">{t('stat_cities', 'Cities Reached')}</span>
              </div>
              <div className="p-2">
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#e09040] block">25+</span>
                <span className="text-xs text-[#5C3A1E] font-semibold">{t('stat_scholars', 'Vedic Scholars')}</span>
              </div>
              <div className="p-2">
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#e09040] block">100%</span>
                <span className="text-xs text-[#5C3A1E] font-semibold">{t('stat_vidhi', 'Authentic Vidhi')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-gradient-to-r from-[#f7ae62] via-[#e09040] to-[#f7ae62] py-3.5 border-y border-[#c47a2a] overflow-hidden text-[#5C3A1E] font-cinzel font-semibold text-sm tracking-wider">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          <span>🙏 Rudrabhishek Puja</span>
          <span>🪔 Laghu Rudrabhishek</span>
          <span>🔱 Maharudrabhishek</span>
          <span>🕉️ Mahamrityunjay Jap</span>
          <span>🌺 Kalsarp Dosh Puja</span>
          <span>💫 Mangal Dosh Puja</span>
          <span>⭐ Navgrah Abhishek</span>
          <span>🌙 Shani Sadeshati Puja</span>
          <span>☀️ Surya Jap Puja</span>
          <span>💼 Budha Jap Puja</span>
          <span>🙏 Rudrabhishek Puja</span>
          <span>🪔 Laghu Rudrabhishek</span>
        </div>
      </div>

      {/* UJJAIN MAHIMA SECTION */}
      <UjjainMahima onBookNow={() => onOpenBooking()} />

      {/* AI RECOMMENDATION WIZARD */}
      <AiRecommendation onSelectPuja={(p) => onOpenBooking(p)} />

      {/* FEATURED PUJAS GRID - REPLACED EMOJIS WITH HIGH-QUALITY IMAGES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#F5E6D0] border border-[#f7ae62] text-[#e09040] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            {t('sec_popular_badge', 'Most Popular')}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5C3A1E]">
            {t('sec_popular_title', 'Sacred Puja Rituals')}
          </h2>
          <p className="text-sm text-[#8B6F5E] mt-2 max-w-lg mx-auto">
            {t('sec_popular_sub', 'Choose from our most sought-after Vedic rituals performed by certified Ujjain Priests.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularPujas.map((puja) => (
            <div
              key={puja.id}
              className="bg-white border-2 border-[#F5E6D0] hover:border-[#f7ae62] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1.5"
            >
              <div>
                {/* CARD IMAGE CONTAINER */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={puja.image}
                    alt={puja.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* TOP BADGE */}
                  {puja.tag && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-[#f7ae62] to-[#e09040] text-[#5C3A1E] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {lang === 'hi' && puja.tagHi ? puja.tagHi : puja.tag}
                    </span>
                  )}

                  {/* LOCATION & PANDIT TAGS ON IMAGE */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                    <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20">
                      📍 {lang === 'hi' && puja.locationHi ? puja.locationHi.split(',')[0] : puja.location.split(',')[0]}
                    </span>
                    <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20">
                      👨‍🏫 {puja.pandits}
                    </span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-6 space-y-3">
                  <h3 className="font-cinzel text-lg font-bold text-[#5C3A1E] line-clamp-1">
                    {lang === 'hi' && puja.nameHi ? puja.nameHi : puja.name}
                  </h3>
                  <p className="text-xs text-[#8B6F5E] leading-relaxed line-clamp-2">
                    {lang === 'hi' && puja.descriptionHi ? puja.descriptionHi : puja.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {(lang === 'hi' && puja.benefitsHi ? puja.benefitsHi : puja.benefits).slice(0, 2).map((benefit, i) => (
                      <span key={i} className="text-[10px] bg-amber-50 text-emerald-800 font-medium px-2.5 py-0.5 rounded-md border border-amber-200/50">
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="p-5 bg-[#FDF6EC] border-t border-[#F5E6D0] flex items-center justify-between gap-3">
                <div>
                  <span className="font-cinzel text-xl font-bold text-[#e09040] block">{puja.priceDisplay}</span>
                  <span className="text-[10px] text-[#8B6F5E]">{t('card_per_pkg', 'fixed package')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenDetail(puja)}
                    className="bg-[#F5E6D0] text-[#5C3A1E] hover:bg-[#f7ae62] font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                    title="View Details"
                  >
                    {t('card_details', 'Details')}
                  </button>
                  <button
                    onClick={() => onOpenBooking(puja)}
                    className="bg-gradient-to-r from-[#f7ae62] to-[#e09040] hover:from-[#e09040] hover:to-[#c47a2a] text-[#5C3A1E] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    {t('card_book', 'Book Now')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setActiveTab('pujas')}
            className="bg-[#5C3A1E] text-[#f7ae62] hover:bg-[#2C1A0E] font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-md cursor-pointer"
          >
            {t('btn_view_all_pujas', 'View All 25+ Pujas →')}
          </button>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gradient-to-br from-[#F5E6D0]/60 via-[#FDF6EC] to-[#F5E6D0]/60 border-y border-[#f7ae62]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#FDF6EC] border border-[#f7ae62] text-[#e09040] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
              {t('why_badge', 'Why Us')}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5C3A1E]">
              {t('why_title', 'Why Devotees Choose Ujjain Puja?')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🕉️',
                titleEn: 'Authentic Vedic Rituals',
                titleHi: 'शास्त्रोक्त वैदिक विधि',
                descEn: 'All pujas performed strictly according to ancient Vedic scriptures by certified priests.',
                descHi: 'समस्त पूजन प्रामाणिक वेदवेत्ता विद्वानों द्वारा संपूर्ण विधि-विधान से किए जाते हैं।'
              },
              {
                icon: '💰',
                titleEn: 'Transparent Pricing',
                titleHi: 'पारदर्शी पैकेज शुल्क',
                descEn: 'Fixed package rates with complete Samagri, Pandit Dakshina, and Prasad delivery included.',
                descHi: 'सामग्री, दक्षिणा एवं प्रसाद डिलीवरी सहित पारदर्शी और निश्चित शुल्क।'
              },
              {
                icon: '📱',
                titleEn: 'Live Video Streaming',
                titleHi: 'ऑनलाइन लाइव वीडियो संकल्प',
                descEn: 'Attend your puja live on WhatsApp or Zoom from anywhere in India or globally.',
                descHi: 'घर बैठे व्हाट्सएप/ज़ूम द्वारा लाइव पूजन दर्शन एवं नाम-गोत्र संकल्प।'
              },
              {
                icon: '🤖',
                titleEn: 'AI Recommendations',
                titleHi: 'एआई ज्योतिष परामर्श',
                descEn: 'Get personalized ritual suggestions tailored to your unique horoscopic needs.',
                descHi: 'अपनी ग्रह स्थिति अनुसार सबसे उपयुक्त पूजन का त्वरित सुझाव।'
              },
              {
                icon: '⚡',
                titleEn: 'Instant Confirmation',
                titleHi: 'तत्काल ऑनलाइन बुकिंग',
                descEn: 'Book online in minutes with secure Razorpay / UPI payments and instant WhatsApp receipt.',
                descHi: 'सुरक्षित ऑनलाइन भुगतान एवं तुरंत व्हाट्सएप रसीद।'
              },
              {
                icon: '🌟',
                titleEn: '150+ Happy Families',
                titleHi: '150+ संतुष्ट श्रद्धालु',
                descEn: 'Serving devotees with absolute devotion, purity and spiritual integrity.',
                descHi: 'पूर्ण निष्ठा, पवित्रता एवं श्रद्धा के साथ देव सेवा।'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-[#F5E6D0] hover:border-[#f7ae62] rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-cinzel text-lg font-bold text-[#5C3A1E] mb-2">
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </h3>
                <p className="text-xs text-[#8B6F5E] leading-relaxed">
                  {lang === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#F5E6D0] border border-[#f7ae62] text-[#e09040] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            {lang === 'hi' ? 'भक्तों के अनुभव' : 'Devotees Speak'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5C3A1E]">
            {lang === 'hi' ? 'श्रद्धालुओं की राय' : 'What Our Devotees Say'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testi, idx) => (
            <div key={idx} className="bg-white border-2 border-[#F5E6D0] rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-xs text-[#5C3A1E] italic leading-relaxed mb-4">"{testi.review}"</p>
              </div>
              <div className="pt-3 border-t border-[#F5E6D0] flex items-center justify-between">
                <div>
                  <strong className="font-cinzel text-sm text-[#5C3A1E] block">{testi.name}</strong>
                  <span className="text-[10px] text-[#8B6F5E]">{testi.city} • {testi.puja}</span>
                </div>
                <span className="text-2xl">{testi.emoji}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#FDF6EC] border-t-2 border-[#F5E6D0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#F5E6D0] border border-[#f7ae62] text-[#e09040] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="font-cinzel text-3xl font-bold text-[#5C3A1E]">
              {lang === 'hi' ? 'सामान्य प्रश्नोत्तर' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border-2 border-[#F5E6D0] rounded-xl overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-[#5C3A1E] cursor-pointer hover:bg-[#FDF6EC]/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <i className={`fas fa-chevron-down text-xs text-[#e09040] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}></i>
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-[#8B6F5E] leading-relaxed border-t border-[#F5E6D0]/50 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-[#f7ae62] via-[#e09040] to-[#c47a2a] text-[#5C3A1E] text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold">
            🙏 {lang === 'hi' ? 'महाकाल कृपा एवं दिव्य फल प्राप्त करें' : 'Ready to Experience Divine Blessings?'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#5C3A1E]/90">
            {lang === 'hi'
              ? 'आज ही अपना अनुष्ठान बुक करें एवं उज्जैन के सिद्ध आचार्यों द्वारा महाकाल का आशीर्वाद प्राप्त करें।'
              : 'Book your puja today and let our experienced pandits guide you towards spiritual peace, prosperity, and divine Mahakal grace.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-3">
            <button
              onClick={() => onOpenBooking()}
              className="bg-[#5C3A1E] hover:bg-[#2C1A0E] text-[#f7ae62] font-bold text-sm px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              📿 {t('btn_book_puja', 'Book Puja Now')}
            </button>
            <a
              href="https://wa.me/919993540314"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fab fa-whatsapp text-lg"></i> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
