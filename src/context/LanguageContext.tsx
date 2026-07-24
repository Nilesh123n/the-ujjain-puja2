import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  nav_home: { en: 'Home', hi: 'मुख्यपृष्ठ' },
  nav_puja: { en: 'Puja', hi: 'पूजा' },
  nav_astrology: { en: 'Astrology', hi: 'ज्योतिष' },
  nav_about: { en: 'About Us', hi: 'हमारे बारे में' },
  nav_contact: { en: 'Contact', hi: 'संपर्क करें' },
  nav_book_now: { en: 'Book Now', hi: 'पूजा बुक करें' },

  // Hero
  hero_badge: { en: '✨ Trusted by 150+ Devotees Worldwide', hi: '✨ 150+ श्रद्धालुओं द्वारा भरोसेमंद' },
  hero_title_1: { en: 'Sacred Puja Seva', hi: 'पवित्र पूजा सेवा' },
  hero_title_2: { en: 'in Holy Ujjain', hi: 'पवित्र अवंतिका उज्जैन में' },
  hero_desc: {
    en: 'Experience divine Mahakal blessings through authentic Vedic pujas, havans, and spiritual consultations performed by experienced pandits in sacred Ujjain.',
    hi: 'उज्जैन के वरिष्ठ एवं प्रामाणिक विद्वान पंडितों द्वारा शास्त्रोक्त विधि से सिद्ध सिद्धेश्वर, परदेश्वर महादेव एवं त्रिवेणी धाम में ऑनलाइन व प्रत्यक्ष पूजा कराएं।'
  },
  btn_book_puja: { en: 'Book Puja Now', hi: 'पूजा बुक करें' },
  btn_ai_rec: { en: 'AI Recommendation', hi: 'एआई परामर्श' },

  // Stats
  stat_pujas: { en: '150+ Pujas Performed', hi: '150+ पूजा संपन्न' },
  stat_cities: { en: '85+ Cities Reached', hi: '85+ शहरों में सेवा' },
  stat_scholars: { en: '25+ Vedic Scholars', hi: '25+ प्रामाणिक विद्वान' },
  stat_vidhi: { en: '100% Authentic Vidhi', hi: '100% शास्त्रोक्त विधि' },

  // Sections
  sec_popular_badge: { en: 'Most Popular', hi: 'सर्वाधिक लोकप्रिय' },
  sec_popular_title: { en: 'Sacred Puja Rituals', hi: 'पवित्र पूजा सेवाएं' },
  sec_popular_sub: {
    en: 'Choose from our most sought-after Vedic rituals performed by certified Ujjain Priests.',
    hi: 'उज्जैन के सिद्ध पीठों पर अनुभवी पंडितों द्वारा संपादित मुख्य वैदिक अनुष्ठान चुनें।'
  },
  btn_view_all_pujas: { en: 'View All 25+ Pujas →', hi: 'सभी 25+ पूजा देखें →' },

  // Ujjain Mahima
  mahima_badge: { en: 'Avantika Kshetra', hi: 'अवंतिका क्षेत्र' },
  mahima_title: { en: 'Ujjain Mahima • Holy Glory of Ujjain', hi: 'उज्जैन महिमा • श्री महाकाल अवंतिका क्षेत्र' },
  mahima_sub: {
    en: 'Why performing Puja in sacred Ujjain bestows 1000x divine merit & removes all planetary doshas',
    hi: 'उज्जैन में पूजा-अनुष्ठान कराने का विशेष महत्व एवं 1000 गुना फल प्राप्ति का शास्त्रोक्त रहस्य'
  },

  // Why Us
  why_badge: { en: 'Why Us', hi: 'हमारा विशेष चयन' },
  why_title: { en: 'Why Devotees Choose Ujjain Puja?', hi: 'भक्त उज्जैन पूजा ही क्यों चुनते हैं?' },

  // Card Controls & Actions
  card_details: { en: 'Details', hi: 'विवरण' },
  card_book: { en: 'Book Now', hi: 'बुक करें' },
  card_per_pkg: { en: 'fixed package', hi: 'निश्चित पैकेज' },
  
  // Footer
  footer_tagline: { en: 'Authentic Vedic Rituals from Ujjain', hi: 'उज्जैन से प्रामाणिक वैदिक पूजा अनुष्ठान' },
  footer_rights: { en: '© 2026 Ujjain Puja | All Rights Reserved.', hi: '© 2026 उज्जैन पूजा | सर्वाधिकार सुरक्षित।' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('ujjain_puja_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('ujjain_puja_lang', newLang);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
  };

  const t = (key: string, defaultText?: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
