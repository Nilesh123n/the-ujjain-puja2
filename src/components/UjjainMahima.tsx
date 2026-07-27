import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface UjjainMahimaProps {
  onBookNow?: () => void;
}

export const UjjainMahima: React.FC<UjjainMahimaProps> = ({ onBookNow }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<number>(0);

  const mahimaItems = [
    {
      id: 'mahakal',
      titleEn: "Mahakaleshwar Jyotirlinga",
      titleHi: "श्री महाकालेश्वर स्वयंभू ज्योतिर्लिंग",
      subtitleEn: "Sole South-Facing (Dakshinmukhi) Jyotirlinga",
      subtitleHi: "एकमात्र दक्षिणमुखी स्वयंभू ज्योतिर्लिंग • काल के स्वामी",
      image: "https://images.unsplash.com/photo-1609619385002-f40f1df5e9e2?w=800&q=80",
      descEn: "Mahakaleshwar is the supreme lord of Time (Kaal). Being South-facing (Dakshinmukhi), worshipping here grants immunity against fear of untimely death (Akaal Mrityu) and bestows divine liberation.",
      descHi: "उज्जैन के महाकाल एकमात्र दक्षिणमुखी ज्योतिर्लिंग हैं। तंत्र-शास्त्र में दक्षिण दिशा काल की मानी गई है। महाकाल मंदिर में भस्म आरती व जलाभिषेक करने से अकाल मृत्यु का भय मिट जाता है।"
    },
    {
      id: 'pardeshwar',
      titleEn: "Pardeshwar Mahadev Mandir",
      titleHi: "विश्वविख्यात पारदेश्वर महादेव मंदिर",
      subtitleEn: "World's Largest Paras (Solidified Mercury) Shivling",
      subtitleHi: "1500 किग्रा का अलौकिक पारद शिवलिंग • आयुर्वेद एवं सिद्धि का केंद्र",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
      descEn: "Housing a magnificent 1500kg solidified mercury Shivling, Pardeshwar Mahadev is renowned in Rasashastra for absorbing negative body karma, healing chronic health conditions, and accelerating spiritual progress.",
      descHi: "पारद (पारा) शिवजी का प्रत्यक्ष वीर्य माना गया है। रसशास्त्र अनुसार पारद शिवलिंग के दर्शन व जलाभिषेक से करोड़ों शिवपूजन का फल प्राप्त होता है तथा समस्त शारीरिक व मानसिक व्याधियाँ शांत होती हैं।"
    },
    {
      id: 'mangalnath',
      titleEn: "Mangalnath Temple",
      titleHi: "श्री मंगलनाथ मंदिर (मंगल ग्रह उत्पत्ति स्थल)",
      subtitleEn: "Geographical Birthplace of Planet Mars (Mangal Grah)",
      subtitleHi: "मंगल दोष शांति एवं भात पूजा का विश्व में एकमात्र सिद्ध पीठ",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      descEn: "Matsya Purana identifies Mangalnath in Ujjain as the exact birthplace of Planet Mars. Performing Mangal Bhat Puja here completely neutralizes Mangal Dosh and brings marital harmony.",
      descHi: "मत्स्य पुराण अनुसार उज्जैन का मंगलनाथ स्थल ही मंगल ग्रह का जन्मस्थान है। संपूर्ण विश्व में मंगल दोष, विवाह विलंब एवं भूमि-भवन बाधा शांति के लिए यहाँ कराई गई भात पूजा अचूक मानी जाती है।"
    },
    {
      id: 'triveni',
      titleEn: "Triveni Sangam & Navgrah Temple",
      titleHi: "त्रिवेणी संगम एवं नवग्रह-शनि धाम",
      subtitleEn: "Holy Confluence of Shipra, Kanh & Saraswati Rivers",
      subtitleHi: "शनि साढ़ेसाती, ढैय्या एवं नवग्रह शांति का दिव्य सिद्ध स्थल",
      image: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=800&q=80",
      descEn: "Triveni is the sacred confluence where liquid amrit fell during Samudra Manthan. The Triveni Navgrah Shanti Puja here pacifies Sade Sati, Shani Dhaiya, and planetary afflictions instantly.",
      descHi: "शिप्रा, कन्ह व अदृश्य सरस्वती का यह पवित्र संगम है। समुद्र मंथन के समय अमृत की बूंदें यहाँ गिरी थीं। त्रिवेणी शनि मंदिर में तैल स्नान व नवग्रह पूजन से शनि देव की विशेष अनुकंपा मिलती है।"
    },
    {
      id: 'siddhwat',
      titleEn: "Siddhwat Banyan & Shipra Ghat",
      titleHi: "सिद्धवट क्षिप्रा तट (पितृ व कालसर्प मुक्ति)",
      subtitleEn: "Eternal Banyan Planted by Goddess Parvati",
      subtitleHi: "पितृ तर्पण, नारायण बलि एवं कालसर्प दोष शांति की पवित्र भूमि",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      descEn: "One of the 4 immortal banyan trees on Earth (along with Prayag's Akshayavat). Siddhwat is famous for Pitru Tarpan, Kalsarp Dosh Nivaran, and granting progeny blessings.",
      descHi: "माता पार्वती द्वारा रोपित यह अमर वटवृक्ष है। क्षिप्रा नदी के तट पर स्थित इस स्थान पर पिण्डदान, तर्पण व कालसर्प शांति कराने से पितरों को मोक्ष मिलता है और वंश वृद्धि होती है।"
    },
    {
      id: 'kalbhairav',
      titleEn: "Kal Bhairav & Harasiddhi Shaktipeeth",
      titleHi: "काल भैरव एवं हरसिद्धि शक्तिपीठ",
      subtitleEn: "Protectors of Avantika Nagari & 13th Shaktipeeth",
      subtitleHi: "तंत्र-मंत्र बाधा नाशक एवं माँ हरसिद्धि का अलौकिक स्थान",
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
      descEn: "Lord Kal Bhairav protects Avantika as its commander, while Harasiddhi Temple is the 13th Shaktipeeth where Goddess Sati's elbow fell. Worshipping here destroys all evil eyes and court obstacles.",
      descHi: "उज्जैन के सेनापति भगवान काल भैरव एवं 13वीं शक्तिपीठ माँ हरसिद्धि देवी भक्तों के समस्त शत्रु, मुकदमे, तंत्र-बाधा व विपत्तियों का तात्कालिक निवारण करते हैं।"
    }
  ];

  return (
    <section id="ujjain-mahima" className="py-20 bg-[#f2b705] text-[#2C1A0E] border-y-2 border-[#ffffff] relative overflow-hidden">
      {/* BACKGROUND SHIVA YANTRA PATTERN */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#ff5c00] border border-[#ff5c00] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            <span>🕉️</span> {t('mahima_badge', 'Avantika Kshetra')}
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#2C1A0E] leading-tight">
            {lang === 'hi' ? 'उज्जैन महिमा • पवित्र महाकाल अवंतिका क्षेत्र' : 'Ujjain Mahima • Holy Glory of Ujjain'}
          </h2>
          <p className="text-sm sm:text-base text-[#3A220F] font-medium leading-relaxed">
            {t('mahima_sub', 'Why performing Puja in sacred Ujjain bestows 1000x divine merit & removes all planetary doshas')}
          </p>

          {/* SANSKRIT SHLOKA BOX */}
          <div className="mt-6 p-4 sm:p-5 bg-[#ffffff] border-2 border-[#f2b705] rounded-2xl shadow-xl max-w-2xl mx-auto text-[#2C1A0E]">
            <p className="font-cinzel font-bold text-base sm:text-lg text-[#2C1A0E] tracking-wide leading-relaxed">
              "अवंतिकायां विहितावतारं मुक्तिप्रदानाय च सज्जनानाम्।<br className="hidden sm:inline" />
              अकालमृत्योः परिरक्षणार्थं वन्दे महाकालमहासमुद्रम्॥"
            </p>
            <p className="text-xs text-[#5C3A1E] mt-2 italic font-medium">
              {lang === 'hi'
                ? '— उज्जैन में अवतरित महाकाल सज्जनों को मुक्ति देने वाले एवं अकाल मृत्यु से रक्षा करने वाले हैं।'
                : '— Lord Mahakal incarnated in Ujjain to grant liberation to devotas and protect against untimely death.'}
            </p>
          </div>
        </div>

        {/* TAB NAVIGATION FOR HIGHLIGHTS */}
        <div className="flex justify-center items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8">
          {mahimaItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === idx
                  ? 'bg-[#ff5c00] text-white border-white shadow-lg scale-105'
                  : 'bg-[#ffffff] text-[#2C1A0E] border-[#2C1A0E]/10 hover:bg-white'
              }`}
            >
              <span>{idx === 0 ? '🔱' : idx === 1 ? '🪔' : idx === 2 ? '🔴' : idx === 3 ? '🪐' : idx === 4 ? '🌳' : '🌺'}</span>
              <span>{lang === 'hi' ? item.titleHi.split('(')[0] : item.titleEn}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE FEATURED HERO CARD */}
        <div className="bg-[#ffffff] border-2 border-[#f2b705] rounded-3xl overflow-hidden shadow-2xl mb-12 grid grid-cols-1 lg:grid-cols-12 text-[#2C1A0E]">
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[380px]">
            <img
              src={mahimaItems[activeTab].image}
              alt={mahimaItems[activeTab].titleEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden flex items-end p-6">
              <span className="text-[#2C1A0E] text-xs font-bold uppercase tracking-wider bg-[#f2b705] px-3 py-1 rounded-full">
                {lang === 'hi' ? mahimaItems[activeTab].subtitleHi : mahimaItems[activeTab].subtitleEn}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="hidden lg:inline-block text-[#2C1A0E] text-xs font-bold uppercase tracking-wider bg-[#f2b705] px-3 py-1 rounded-full mb-3">
                {lang === 'hi' ? mahimaItems[activeTab].subtitleHi : mahimaItems[activeTab].subtitleEn}
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C1A0E] mb-4">
                {lang === 'hi' ? mahimaItems[activeTab].titleHi : mahimaItems[activeTab].titleEn}
              </h3>
              <p className="text-sm sm:text-base text-[#5C3A1E] leading-relaxed">
                {lang === 'hi' ? mahimaItems[activeTab].descHi : mahimaItems[activeTab].descEn}
              </p>
            </div>

            <div className="pt-4 border-t border-[#2C1A0E]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2C1A0E]">
                <span>✨ Ujjain Spiritual Merit:</span>
                <span className="bg-[#f2b705] text-[#2C1A0E] font-bold px-2.5 py-0.5 rounded-full border border-[#2C1A0E]/20">1000x Fruitfulness</span>
              </div>
              {onBookNow && (
                <button
                  onClick={onBookNow}
                  className="bg-[#f2b705] hover:bg-[#2C1A0E] hover:text-white text-[#2C1A0E] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>📿</span> {lang === 'hi' ? 'उज्जैन में पूजा बुक करें' : 'Book Ujjain Puja'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 6 GRID CARDS SHOWCASING ALL 6 HOLY SPOTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mahimaItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`bg-[#ffffff] border-2 ${
                activeTab === idx ? 'border-[#2C1A0E] shadow-xl scale-[1.02]' : 'border-[#f2b705] hover:border-[#2C1A0E]'
              } rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1 text-[#2C1A0E] shadow-md`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">
                    {idx === 0 ? '🔱' : idx === 1 ? '🪔' : idx === 2 ? '🔴' : idx === 3 ? '🪐' : idx === 4 ? '🌳' : '🌺'}
                  </span>
                  <span className="text-[10px] bg-[#f2b705] text-[#2C1A0E] font-bold px-2.5 py-1 rounded-full border border-[#2C1A0E]/20">
                    Spot #{idx + 1}
                  </span>
                </div>
                <h4 className="font-cinzel text-base font-bold text-[#2C1A0E] mb-2 group-hover:text-[#5C3A1E] transition-colors">
                  {lang === 'hi' ? item.titleHi.split('(')[0] : item.titleEn}
                </h4>
                <p className="text-xs text-[#5C3A1E] line-clamp-3 leading-relaxed">
                  {lang === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2C1A0E]/20 flex items-center justify-between text-[11px] font-bold text-[#5C3A1E]">
                <span>{lang === 'hi' ? 'विस्तार देखें' : 'View Significance'} →</span>
                <i className="fas fa-chevron-right text-[10px]"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
