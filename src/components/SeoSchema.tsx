import React, { useEffect } from 'react';
import { Puja } from '../types';
import {
  getBaseUrl,
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbsSchema,
  getWebPageSchema,
  getAllPujasCatalogSchema,
  getAstrologyServicesSchema,
  getFAQSchema,
  getTestimonialsSchema,
  getSinglePujaSchema
} from '../lib/seoSchema';

interface SeoSchemaProps {
  activeTab: string;
  selectedDetailPuja?: Puja | null;
  selectedBookingPuja?: Puja | null;
  pujas: Puja[];
}

export const SeoSchema: React.FC<SeoSchemaProps> = ({
  activeTab,
  selectedDetailPuja,
  selectedBookingPuja,
  pujas
}) => {
  useEffect(() => {
    const baseUrl = getBaseUrl();
    const activePuja = selectedDetailPuja || selectedBookingPuja;

    // Dynamic Title & Meta Description update
    const titleMap: Record<string, string> = {
      home: 'Ujjain Puja | Authentic Vedic Rituals & Astrology Services',
      pujas: 'All Vedic Pujas & Havan in Ujjain | Book Online - Ujjain Puja',
      astrology: 'Vedic Astrology, Kundali Matching & Jyotish Consultation | Ujjain Puja',
      about: 'About Ujjain Puja & Pardeshwar Mahadev Mandir | Vedic Scholars',
      contact: 'Contact Ujjain Puja | Temple Address & WhatsApp Helpline',
      thankyou: 'Booking Confirmed | Ujjain Puja'
    };

    const descMap: Record<string, string> = {
      home: 'Book authentic Vedic puja, Rudrabhishek, Kalsarp Dosh, and astrology consultations in Ujjain. Expert pandits, transparent pricing, online & offline booking available.',
      pujas: 'Explore authentic Vedic pujas including Rudrabhishek, Kalsarp Dosh, Mangal Dosh, and Mahamrityunjay anushthan performed at Pardeshwar Mandir Ujjain.',
      astrology: 'Consult certified Vedic astrologers for Kundali analysis, Horoscope matching (Gun Milan), Varshphal, and astrological dosha remedies.',
      about: 'Learn about Avantika Ujjain holy heritage, world largest Paras Shivling at Pardeshwar Mandir, and our team of traditionally initiated Vedic Pandits.',
      contact: 'Contact Ujjain Puja coordinators for booking inquiries, muhurat dates, and spiritual guidance. WhatsApp & Call: +91 9993540314.',
      thankyou: 'Thank you for booking your sacred puja with Ujjain Puja. Our team will contact you shortly with live streaming and sankalp details.'
    };

    if (activePuja) {
      document.title = `${activePuja.name} (${activePuja.priceDisplay}) | Book Online - Ujjain Puja`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `${activePuja.name} in Ujjain at Pardeshwar Mandir. ${activePuja.description} Price: ${activePuja.priceDisplay}. Online live stream & Prasad delivery available.`
        );
      }
    } else {
      document.title = titleMap[activeTab] || titleMap.home;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', descMap[activeTab] || descMap.home);
      }
    }

    // Build collection of structured schemas
    const schemas: any[] = [
      getOrganizationSchema(baseUrl),
      getWebSiteSchema(baseUrl),
      getWebPageSchema(activeTab, baseUrl),
      getBreadcrumbsSchema(activeTab, activePuja?.name, baseUrl),
      getFAQSchema(),
      getTestimonialsSchema(baseUrl)
    ];

    if (activeTab === 'pujas' || activeTab === 'home') {
      schemas.push(getAllPujasCatalogSchema(pujas, baseUrl));
    }

    if (activeTab === 'astrology' || activeTab === 'home') {
      schemas.push(getAstrologyServicesSchema(undefined, baseUrl));
    }

    if (activePuja) {
      schemas.push(getSinglePujaSchema(activePuja, baseUrl));
    }

    // Inject or update the dynamic ld+json script element
    const scriptId = 'dynamic-ldjson-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@graph': schemas
      },
      null,
      2
    );

    return () => {
      // Keep script active for search engines & scrapers
    };
  }, [activeTab, selectedDetailPuja, selectedBookingPuja, pujas]);

  return null;
};
