import React, { useState, useMemo } from 'react';
import { Puja } from '../types';
import { PUJA_DATA } from '../data/pujaData';
import { useLanguage } from '../context/LanguageContext';

interface PujaPageProps {
  onOpenBooking: (puja: Puja) => void;
  onOpenDetail: (puja: Puja) => void;
}

export const PujaPage: React.FC<PujaPageProps> = ({ onOpenBooking, onOpenDetail }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { lang, t } = useLanguage();

  const categories = [
    { id: 'all', labelEn: 'All Pujas', labelHi: 'सभी पूजाएं', emoji: '🙏' },
    { id: 'rudra', labelEn: 'Rudra Pujas', labelHi: 'रुद्राभिषेक', emoji: '🔱' },
    { id: 'dosh', labelEn: 'Dosh Nivaran', labelHi: 'दोष निवारण', emoji: '🌺' },
    { id: 'navgrah', labelEn: 'Navgrah Pujas', labelHi: 'नवग्रह पूजा', emoji: '⭐' },
    { id: 'shani', labelEn: 'Shani Pujas', labelHi: 'शनि शांति', emoji: '🪐' },
    { id: 'jap', labelEn: 'Planet Jap', labelHi: 'ग्रह जप', emoji: '📿' },
    { id: 'special', labelEn: 'Special Pujas', labelHi: 'विशेष अनुष्ठान', emoji: '🌸' },
    { id: 'online', labelEn: 'Online Pujas', labelHi: 'ऑनलाइन लाइव', emoji: '📱' }
  ];

  const filteredPujas = useMemo(() => {
    let result = PUJA_DATA;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameHi && p.nameHi.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.benefits.some((b) => b.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20 animate-in fade-in duration-300">
      {/* PAGE HERO */}
      <section className="bg-[#f2b705] text-[#2C1A0E] py-14 px-4 text-center relative overflow-hidden border-b-2 border-[#FFFFE3]">
        <div className="max-w-4xl mx-auto relative z-10 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-[#2C1A0E] font-medium">
            <span>{t('nav_home', 'Home')}</span>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span>{t('nav_puja', 'Puja')}</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#2C1A0E]">
            {lang === 'hi' ? '🪔 उज्जैन सिद्ध वैदिक पूजा अनुष्ठान' : '🪔 Sacred Pujas at Ujjain'}
          </h1>
          <p className="text-sm sm:text-base text-[#3A220F] max-w-xl mx-auto font-medium">
            {lang === 'hi'
              ? 'उज्जैन के परदेश्वर महादेव, मंगलनाथ एवं त्रिवेणी धाम में 25+ सिद्ध पूजन एवं दोष निवारण।'
              : 'Explore 25+ authentic Vedic rituals, HAVAN, Jap Anushthans & Dosh Nivaran performed at Mahakal Nagari Ujjain.'}
          </p>
        </div>
      </section>

      {/* STICKY SEARCH & FILTER BAR */}
      <div className="bg-white border-b-2 border-[#2C1A0E]/10 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          {/* SEARCH INPUT */}
          <div className="max-w-xl mx-auto relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6F5E] text-sm"></i>
            <input
              type="text"
              placeholder={lang === 'hi' ? 'पूजा खोजें... जैसे रुद्राभिषेक, कालसर्प, शनि, नवग्रह' : 'Search pujas... e.g. Rudrabhishek, Kalsarp, Shani, Navgrah'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFE3] border-2 border-[#2C1A0E]/10 focus:border-[#2C1A0E] rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#2C1A0E] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B6F5E] hover:text-[#2C1A0E] text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  activeCategory === cat.id
                    ? 'bg-[#ff5c00] text-white border-[#ff5c00] shadow-xs'
                    : 'bg-[#FFFFE3] text-[#2C1A0E] border-[#2C1A0E]/10 hover:bg-[#2C1A0E]/10'
                }`}
              >
                {cat.emoji} {lang === 'hi' ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SORT & VIEW CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-[#8B6F5E] font-medium">
          {lang === 'hi' ? (
            <>कुल <span className="font-bold text-[#5C3A1E] text-sm">{filteredPujas.length}</span> पूजन उपलब्ध</>
          ) : (
            <>Showing <span className="font-bold text-[#5C3A1E] text-sm">{filteredPujas.length}</span> ritual packages</>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#2C1A0E]/10 rounded-xl px-3 py-1.5 text-xs text-[#5C3A1E] font-semibold outline-none cursor-pointer"
          >
            <option value="default">{lang === 'hi' ? 'क्रम: सामान्य' : 'Sort By: Default'}</option>
            <option value="price-low">{lang === 'hi' ? 'मूल्य: कम से अधिक' : 'Price: Low to High'}</option>
            <option value="price-high">{lang === 'hi' ? 'मूल्य: अधिक से कम' : 'Price: High to Low'}</option>
            <option value="popular">{lang === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most Popular First'}</option>
            <option value="name">{lang === 'hi' ? 'नाम अनुसार' : 'Name: A to Z'}</option>
          </select>

          <div className="flex bg-white border border-[#2C1A0E]/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#f7ae62] text-[#5C3A1E]' : 'text-[#8B6F5E]'
              }`}
              title="Grid View"
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs cursor-pointer ${
                viewMode === 'list' ? 'bg-[#f7ae62] text-[#5C3A1E]' : 'text-[#8B6F5E]'
              }`}
              title="List View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* PUJA GRID / LIST */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[50vh]">
        {filteredPujas.length === 0 ? (
          <div className="py-20 text-center bg-white border-2 border-dashed border-[#2C1A0E]/10 rounded-3xl p-8">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-cinzel text-xl font-bold text-[#5C3A1E] mb-1">
              {lang === 'hi' ? 'कोई पूजा परिणाम नहीं मिला' : 'No Pujas Found'}
            </h3>
            <p className="text-xs text-[#8B6F5E]">
              {lang === 'hi' ? 'कृपया अन्य शब्द जैसे "रुद्राभिषेक" या "कालसर्प" से पुनः प्रयास करें।' : 'Try searching with a different term like "Rudrabhishek" or reset filters.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 bg-[#f7ae62] text-[#5C3A1E] font-bold text-xs px-5 py-2 rounded-full cursor-pointer"
            >
              {lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-4'
            }
          >
            {filteredPujas.map((puja) => (
              <div
                key={puja.id}
                className={`bg-[#FFFFE3] border-2 border-[#f2b705] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-[#2C1A0E] ${
                  viewMode === 'list'
                    ? 'flex flex-col sm:flex-row items-center justify-between p-4 gap-4'
                    : 'flex flex-col justify-between'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div>
                      {/* CARD IMAGE */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={puja.image}
                          alt={puja.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {puja.tag && (
                          <span className="absolute top-3 right-3 bg-[#f2b705] text-[#2C1A0E] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            {lang === 'hi' && puja.tagHi ? puja.tagHi : puja.tag}
                          </span>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                          <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20">
                            📍 {lang === 'hi' && puja.locationHi ? puja.locationHi.split(',')[0] : puja.location.split(',')[0]}
                          </span>
                          <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20">
                            👨‍🏫 {puja.pandits}
                          </span>
                        </div>
                      </div>

                      {/* CARD CONTENT */}
                      <div className="p-6 space-y-3">
                        <h3 className="font-cinzel text-lg font-bold text-[#2C1A0E] line-clamp-1">
                          {lang === 'hi' && puja.nameHi ? puja.nameHi : puja.name}
                        </h3>
                        <p className="text-xs text-[#5C3A1E] leading-relaxed line-clamp-2">
                          {lang === 'hi' && puja.descriptionHi ? puja.descriptionHi : puja.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[11px] bg-[#f2b705] text-[#2C1A0E] font-bold px-2.5 py-1 rounded-full border border-[#2C1A0E]/10 flex items-center gap-1">
                            <i className="fas fa-clock text-[#2C1A0E]"></i> {puja.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="p-5 bg-[#f2b705] border-t border-[#2C1A0E]/10 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-cinzel text-xl font-bold text-[#2C1A0E] block">{puja.priceDisplay}</span>
                        <span className="text-[10px] text-[#5C3A1E]">{t('card_per_pkg', 'fixed package')}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onOpenDetail(puja)}
                          className="bg-white/60 text-[#2C1A0E] hover:bg-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          {t('card_details', 'Details')}
                        </button>
                        <button
                          onClick={() => onOpenBooking(puja)}
                          className="bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          {t('card_book', 'Book Now')}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <img
                        src={puja.image}
                        alt={puja.name}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#2C1A0E]/10"
                      />
                      <div>
                        <h3 className="font-cinzel text-base font-bold text-[#2C1A0E]">
                          {lang === 'hi' && puja.nameHi ? puja.nameHi : puja.name}
                        </h3>
                        <p className="text-xs text-[#5C3A1E] line-clamp-1">
                          {lang === 'hi' && puja.descriptionHi ? puja.descriptionHi : puja.description}
                        </p>
                        <div className="flex gap-3 text-[11px] text-[#5C3A1E] mt-1">
                          <span>📍 {lang === 'hi' && puja.locationHi ? puja.locationHi.split(',')[0] : puja.location.split(',')[0]}</span>
                          <span>👨‍🏫 {puja.pandits}</span>
                          <span>⏱️ {puja.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2C1A0E]/10">
                      <span className="font-cinzel text-xl font-bold text-[#2C1A0E]">{puja.priceDisplay}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onOpenDetail(puja)}
                          className="bg-white/60 text-[#2C1A0E] text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer hover:bg-white"
                        >
                          {t('card_details', 'Details')}
                        </button>
                        <button
                          onClick={() => onOpenBooking(puja)}
                          className="bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                        >
                          {t('card_book', 'Book Now')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
