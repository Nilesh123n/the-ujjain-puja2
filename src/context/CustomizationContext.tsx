import React, { createContext, useContext, useState, useEffect } from 'react';
import { Puja } from '../types';
import { PUJA_DATA } from '../data/pujaData';
import mahakalBgImage from '../assets/images/mahakal_temple_bg_1785148009037.jpg';

export interface HeroContent {
  title1: string;
  title2: string;
  description: string;
  badge: string;
  bgImage: string;
}

const DEFAULT_HERO_CONTENT: HeroContent = {
  title1: 'Sacred Puja Seva',
  title2: 'in Holy Ujjain',
  description: 'Experience divine Mahakal blessings through authentic Vedic pujas, havans, and spiritual consultations performed by experienced pandits in sacred Ujjain.',
  badge: '✨ Trusted by 150+ Devotees Worldwide',
  bgImage: mahakalBgImage
};

interface CustomizationContextType {
  heroContent: HeroContent;
  updateHeroContent: (newHero: Partial<HeroContent>) => void;
  pujas: Puja[];
  updatePuja: (updatedPuja: Puja) => void;
  addPuja: (newPuja: Puja) => void;
  deletePuja: (id: number) => void;
  resetToDefaults: () => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroContent, setHeroContent] = useState<HeroContent>(() => {
    const saved = localStorage.getItem('app_hero_content');
    if (saved) {
      try {
        return { ...DEFAULT_HERO_CONTENT, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_HERO_CONTENT;
      }
    }
    return DEFAULT_HERO_CONTENT;
  });

  const [pujas, setPujas] = useState<Puja[]>(() => {
    const saved = localStorage.getItem('app_pujas_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PUJA_DATA;
      }
    }
    return PUJA_DATA;
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('app_hero_content', JSON.stringify(heroContent));
  }, [heroContent]);

  useEffect(() => {
    localStorage.setItem('app_pujas_data', JSON.stringify(pujas));
  }, [pujas]);

  const updateHeroContent = (newHero: Partial<HeroContent>) => {
    setHeroContent((prev) => ({ ...prev, ...newHero }));
  };

  const updatePuja = (updatedPuja: Puja) => {
    setPujas((prev) =>
      prev.map((p) => (p.id === updatedPuja.id ? updatedPuja : p))
    );
  };

  const addPuja = (newPuja: Puja) => {
    setPujas((prev) => [newPuja, ...prev]);
  };

  const deletePuja = (id: number) => {
    setPujas((prev) => prev.filter((p) => p.id !== id));
  };

  const resetToDefaults = () => {
    setHeroContent(DEFAULT_HERO_CONTENT);
    setPujas(PUJA_DATA);
    localStorage.removeItem('app_hero_content');
    localStorage.removeItem('app_pujas_data');
  };

  return (
    <CustomizationContext.Provider
      value={{
        heroContent,
        updateHeroContent,
        pujas,
        updatePuja,
        addPuja,
        deletePuja,
        resetToDefaults
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
