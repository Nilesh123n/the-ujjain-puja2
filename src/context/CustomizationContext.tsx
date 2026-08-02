import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  refreshCustomization: () => Promise<void>;
  uploadImageFile: (file: File) => Promise<{ url: string; success: boolean; error?: string }>;
  isLoadingBackend: boolean;
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

  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(true);

  // Helper to persist customization to backend database
  const saveToBackend = useCallback(async (hero: HeroContent, list: Puja[]) => {
    try {
      await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroContent: hero, pujas: list }),
      });
    } catch (err) {
      console.warn('Failed to sync customization with backend database:', err);
    }
  }, []);

  // Refresh method to re-fetch from backend API
  const refreshCustomization = useCallback(async () => {
    try {
      const response = await fetch('/api/customization');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          if (result.data.heroContent) {
            setHeroContent(result.data.heroContent);
            localStorage.setItem('app_hero_content', JSON.stringify(result.data.heroContent));
          }
          if (Array.isArray(result.data.pujas) && result.data.pujas.length > 0) {
            setPujas(result.data.pujas);
            localStorage.setItem('app_pujas_data', JSON.stringify(result.data.pujas));
          }
        }
      }
    } catch (err) {
      console.warn('Could not refresh customization from backend database:', err);
    }
  }, []);

  // Fetch from backend API on initial mount and set up periodic sync polling (every 8 seconds)
  useEffect(() => {
    let isMounted = true;
    const initialFetch = async () => {
      try {
        await refreshCustomization();
      } finally {
        if (isMounted) setIsLoadingBackend(false);
      }
    };

    initialFetch();

    // Live background polling for instant multi-session global sync (every 3 seconds)
    const interval = setInterval(() => {
      refreshCustomization();
    }, 3000);

    const handleFocus = () => {
      refreshCustomization();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshCustomization]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('app_hero_content', JSON.stringify(heroContent));
  }, [heroContent]);

  useEffect(() => {
    localStorage.setItem('app_pujas_data', JSON.stringify(pujas));
  }, [pujas]);

  const updateHeroContent = (newHero: Partial<HeroContent>) => {
    setHeroContent((prev) => {
      const updated = { ...prev, ...newHero };
      saveToBackend(updated, pujas);
      return updated;
    });
  };

  const updatePuja = (updatedPuja: Puja) => {
    setPujas((prev) => {
      const updatedList = prev.map((p) => (p.id === updatedPuja.id ? updatedPuja : p));
      saveToBackend(heroContent, updatedList);
      return updatedList;
    });
  };

  const addPuja = (newPuja: Puja) => {
    setPujas((prev) => {
      const updatedList = [...prev, newPuja];
      saveToBackend(heroContent, updatedList);
      return updatedList;
    });
  };

  const deletePuja = (id: number) => {
    setPujas((prev) => {
      const updatedList = prev.filter((p) => p.id !== id);
      saveToBackend(heroContent, updatedList);
      return updatedList;
    });
  };

  const resetToDefaults = () => {
    setHeroContent(DEFAULT_HERO_CONTENT);
    setPujas(PUJA_DATA);
    localStorage.removeItem('app_hero_content');
    localStorage.removeItem('app_pujas_data');
    saveToBackend(DEFAULT_HERO_CONTENT, PUJA_DATA);
  };

  const uploadImageFile = async (file: File): Promise<{ url: string; success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Str = e.target?.result as string;
        if (!base64Str) {
          resolve({ url: '', success: false, error: 'Failed to read image file data' });
          return;
        }

        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Str, fileName: file.name }),
          });
          const data = await res.json();
          if (res.ok && data.success && data.url) {
            resolve({ url: data.url, success: true });
            return;
          } else {
            const errStr = data.error || data.message || `Upload failed with HTTP ${res.status}`;
            console.error('Supabase upload server error:', errStr);
            resolve({ url: '', success: false, error: errStr });
            return;
          }
        } catch (err: any) {
          console.error('Upload image to server exception:', err);
          resolve({ url: '', success: false, error: err.message || 'Network communication error' });
          return;
        }
      };
      reader.onerror = () => resolve({ url: '', success: false, error: 'File reader reading failed' });
      reader.readAsDataURL(file);
    });
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
        resetToDefaults,
        refreshCustomization,
        uploadImageFile,
        isLoadingBackend
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
