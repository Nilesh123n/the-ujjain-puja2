import React from 'react';
import { Puja } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PujaDetailModalProps {
  puja: Puja | null;
  onClose: () => void;
  onBook: (puja: Puja) => void;
  onQuickWhatsApp: (puja: Puja) => void;
}

export const PujaDetailModal: React.FC<PujaDetailModalProps> = ({
  puja,
  onClose,
  onBook,
  onQuickWhatsApp
}) => {
  const { lang, t } = useLanguage();

  if (!puja) return null;

  const name = lang === 'hi' && puja.nameHi ? puja.nameHi : puja.name;
  const description = lang === 'hi' && puja.descriptionHi ? puja.descriptionHi : puja.description;
  const longDesc = lang === 'hi' && puja.longDescHi ? puja.longDescHi : puja.longDesc;
  const benefits = lang === 'hi' && puja.benefitsHi ? puja.benefitsHi : puja.benefits;
  const includes = lang === 'hi' && puja.includesHi ? puja.includesHi : puja.includes;
  const location = lang === 'hi' && puja.locationHi ? puja.locationHi : puja.location;
  const bestFor = lang === 'hi' && puja.bestForHi ? puja.bestForHi : puja.bestFor;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2C1A0E]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#f7ae62] relative modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-[#f7ae62] text-[#5C3A1E] font-bold text-lg hover:bg-[#f7ae62] hover:text-white transition-all flex items-center justify-center z-20 cursor-pointer shadow-md"
        >
          ✕
        </button>

        {/* HERO IMAGE BANNER */}
        <div className="relative h-60 w-full overflow-hidden rounded-t-3xl bg-slate-100">
          <img
            src={puja.image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
            {puja.tag && (
              <span className="self-start bg-[#e09040] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-md">
                {lang === 'hi' && puja.tagHi ? puja.tagHi : puja.tag}
              </span>
            )}
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold leading-tight">{name}</h2>
            <p className="text-xs text-amber-100/90 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* META GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FFFFE3] border border-[#2C1A0E]/10 p-3 rounded-xl flex items-center gap-3">
              <i className="fas fa-map-marker-alt text-[#e09040] text-lg"></i>
              <div>
                <span className="block text-[10px] text-[#8B6F5E] uppercase font-bold">
                  {lang === 'hi' ? 'स्थान' : 'Location'}
                </span>
                <span className="text-xs font-semibold text-[#5C3A1E] line-clamp-1">{location.split(',')[0]}</span>
              </div>
            </div>

            <div className="bg-[#FFFFE3] border border-[#2C1A0E]/10 p-3 rounded-xl flex items-center gap-3">
              <i className="fas fa-clock text-[#e09040] text-lg"></i>
              <div>
                <span className="block text-[10px] text-[#8B6F5E] uppercase font-bold">
                  {lang === 'hi' ? 'समय' : 'Duration'}
                </span>
                <span className="text-xs font-semibold text-[#5C3A1E]">{puja.duration}</span>
              </div>
            </div>

            <div className="bg-[#FFFFE3] border border-[#2C1A0E]/10 p-3 rounded-xl flex items-center gap-3">
              <i className="fas fa-user-tie text-[#e09040] text-lg"></i>
              <div>
                <span className="block text-[10px] text-[#8B6F5E] uppercase font-bold">
                  {lang === 'hi' ? 'पंडित संख्या' : 'Pandits'}
                </span>
                <span className="text-xs font-semibold text-[#5C3A1E]">{puja.pandits}</span>
              </div>
            </div>

            <div className="bg-[#FFFFE3] border border-[#2C1A0E]/10 p-3 rounded-xl flex items-center gap-3">
              <i className="fas fa-om text-[#e09040] text-lg"></i>
              <div>
                <span className="block text-[10px] text-[#8B6F5E] uppercase font-bold">
                  {lang === 'hi' ? 'जाप विधान' : 'Jaap Count'}
                </span>
                <span className="text-xs font-semibold text-[#5C3A1E]">{puja.jaapCount || "Standard Vidhi"}</span>
              </div>
            </div>
          </div>

          {/* LONG DESCRIPTION */}
          {longDesc && (
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80">
              <h4 className="font-cinzel text-base font-bold text-[#5C3A1E] mb-1.5 flex items-center gap-2">
                <i className="fas fa-book-open text-[#e09040]"></i> {lang === 'hi' ? 'अनुष्ठान विवरण' : 'Ritual Overview'}
              </h4>
              <p className="text-xs text-[#5C3A1E]/85 leading-relaxed">{longDesc}</p>
            </div>
          )}

          {/* BENEFITS */}
          <div>
            <h4 className="font-cinzel text-base font-bold text-[#5C3A1E] mb-3 flex items-center gap-2">
              <i className="fas fa-star text-[#e09040]"></i> {lang === 'hi' ? 'पूजा के फल' : 'Divine Benefits'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#2C1A0E] bg-[#FFFFE3] p-2.5 rounded-lg border border-[#2C1A0E]/10">
                  <i className="fas fa-check-circle text-emerald-600 shrink-0"></i>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INCLUDES */}
          <div>
            <h4 className="font-cinzel text-base font-bold text-[#5C3A1E] mb-3 flex items-center gap-2">
              <i className="fas fa-box-open text-[#e09040]"></i> {lang === 'hi' ? 'पैकेज में शामिल' : "What's Included in Package"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {includes.map((inc, idx) => (
                <span key={idx} className="bg-[#FFFFE3] border border-[#f7ae62]/50 text-[#5C3A1E] text-xs font-medium px-3 py-1.5 rounded-full">
                  ✓ {inc}
                </span>
              ))}
            </div>
          </div>

          {/* BEST FOR */}
          {bestFor && (
            <div className="bg-[#FFFFE3] p-3.5 rounded-xl border border-[#2C1A0E]/10">
              <span className="block text-[11px] font-bold text-[#e09040] uppercase tracking-wider mb-1">
                {lang === 'hi' ? 'किसके लिए विशेष' : 'Recommended For'}
              </span>
              <p className="text-xs text-[#8B6F5E]">{bestFor}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-[#FFFFE3] border-t border-[#2C1A0E]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#8B6F5E] block">{t('card_per_pkg', 'fixed package')}</span>
            <span className="font-cinzel text-2xl font-bold text-[#e09040]">{puja.priceDisplay}</span>
            <span className="text-[10px] text-[#8B6F5E] block">Including Samagri & Dakshina</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => onQuickWhatsApp(puja)}
              className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm px-5 py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <i className="fab fa-whatsapp text-lg"></i> WhatsApp
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(puja);
              }}
              className="flex-1 sm:flex-none bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-sm px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>📿</span> {t('card_book', 'Book Now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
