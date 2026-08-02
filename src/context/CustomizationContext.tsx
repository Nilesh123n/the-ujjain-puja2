import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Puja } from '../types';
import { PUJA_DATA } from '../data/pujaData';
import mahakalBgImage from '../assets/images/mahakal_temple_bg_1785148009037.jpg';
import { supabase } from '../lib/supabase';

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
  uploadImageFile: (file: File) => Promise<string>;
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
    if (supabase) {
      try {
        await supabase.from('customization').upsert(
          {
            id: 1,
            hero_content: hero,
            pujas: list,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
        if (Array.isArray(list) && list.length > 0) {
          const sanitizedList = list.map((p) => ({
            id: typeof p.id === 'number' ? p.id : parseInt(String(p.id)) || Date.now(),
            title: p.name || (p as any).title || 'Puja Seva',
            price: typeof p.price === 'number' ? p.price : parseInt(String(p.price).replace(/[^0-9]/g, '')) || 0,
            description: p.description || '',
          }));
          await supabase.from('puja').upsert(sanitizedList, { onConflict: 'id' });
        }
      } catch (sbErr) {
        console.warn('Frontend Supabase client upsert notice:', sbErr);
      }
    }

    try {
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroContent: hero, pujas: list }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // If server auto-converted any base64 images into clean /uploads/ URLs, update client state
          if (result.data.heroContent && result.data.heroContent.bgImage !== hero.bgImage) {
            setHeroContent(result.data.heroContent);
          }
          if (Array.isArray(result.data.pujas)) {
            setPujas(result.data.pujas);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to sync customization with backend database:', err);
    }
  }, []);

  // Refresh method to re-fetch from backend API or Supabase SDK
  const refreshCustomization = useCallback(async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('customization').select('*').limit(1);
        if (!error && data && data.length > 0) {
          const record = data[0];
          const fetchedHero = record.hero_content || record.heroContent;
          const fetchedPujas = record.pujas;

          if (fetchedHero) {
            setHeroContent(fetchedHero);
            try { localStorage.setItem('app_hero_content', JSON.stringify(fetchedHero)); } catch (_) {}
          }
          if (Array.isArray(fetchedPujas) && fetchedPujas.length > 0) {
            setPujas(fetchedPujas);
            try { localStorage.setItem('app_pujas_data', JSON.stringify(fetchedPujas)); } catch (_) {}
          }
          return;
        }
      } catch (sbErr) {
        console.warn('Frontend Supabase refresh notice:', sbErr);
      }
    }

    try {
      const response = await fetch('/api/customization');
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const result = await response.json();
          if (result.success && result.data) {
            if (result.data.heroContent) {
              setHeroContent(result.data.heroContent);
              try { localStorage.setItem('app_hero_content', JSON.stringify(result.data.heroContent)); } catch (_) {}
            }
            if (Array.isArray(result.data.pujas) && result.data.pujas.length > 0) {
              setPujas(result.data.pujas);
              try { localStorage.setItem('app_pujas_data', JSON.stringify(result.data.pujas)); } catch (_) {}
            }
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

  // Save to localStorage whenever state changes with try-catch to prevent QuotaExceededError crashes
  useEffect(() => {
    try {
      localStorage.setItem('app_hero_content', JSON.stringify(heroContent));
    } catch (e) {
      console.warn('localStorage hero_content save notice (quota exceeded):', e);
    }
  }, [heroContent]);

  useEffect(() => {
    try {
      localStorage.setItem('app_pujas_data', JSON.stringify(pujas));
    } catch (e) {
      console.warn('localStorage pujas_data save notice (quota exceeded):', e);
    }
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

  const uploadImageFile = async (file: File): Promise<string> => {
    // Tier 1: Try direct Supabase Storage SDK upload if client is initialized
    if (supabase) {
      try {
        const timeStamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const filePath = `${timeStamp}_${randomStr}_${sanitizedFileName}`;

        let { error: uploadError } = await supabase.storage
          .from('pujas')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'image/png',
          });

        if (uploadError && uploadError.message?.toLowerCase().includes('not found')) {
          const { error: createErr } = await supabase.storage.createBucket('pujas', { public: true });
          if (!createErr) {
            const retry = await supabase.storage
              .from('pujas')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type || 'image/png',
              });
            uploadError = retry.error;
          }
        }

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('pujas')
            .getPublicUrl(filePath);

          if (publicUrlData && publicUrlData.publicUrl) {
            console.log('Successfully uploaded image via Supabase Storage SDK:', publicUrlData.publicUrl);
            return publicUrlData.publicUrl;
          }
        } else {
          console.warn('Supabase storage SDK upload notice:', uploadError.message);
        }
      } catch (sbErr) {
        console.warn('Supabase client upload exception:', sbErr);
      }
    }

    // Tier 2: Try Server API endpoint /api/upload-image
    try {
      const base64Str = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      if (base64Str) {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Str, fileName: file.name }),
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && (data.url || data.localUrl)) {
              const serverUrl = data.url || data.localUrl;
              console.log('Successfully uploaded image via server API:', serverUrl);
              return serverUrl;
            }
          }
        }
      }
    } catch (apiErr) {
      console.warn('Server upload endpoint exception:', apiErr);
    }

    // Tier 3: Guaranteed client-side Base64 Data URL fallback so upload never fails
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          console.log('Image converted to Base64 Data URL fallback');
          resolve(result);
        } else {
          reject(new Error('Failed to process image file.'));
        }
      };
      reader.onerror = (err) => reject(err);
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
