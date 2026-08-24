import { Puja, AstrologyService, Testimonial } from '../types';
import { FAQS, TESTIMONIALS, ASTROLOGY_SERVICES } from '../data/pujaData';

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'https://ujjainpuja.com';
};

/**
 * 1. Organization & Local Business Schema (Pardeshwar Mahadev Mandir & Ujjain Puja)
 */
export const getOrganizationSchema = (baseUrl: string = getBaseUrl()) => {
  return {
    '@context': 'https://schema.org',
    '@type': ['HinduTemple', 'LocalBusiness', 'ReligiousOrganization'],
    '@id': `${baseUrl}/#organization`,
    name: 'Ujjain Puja - Authentic Vedic Rituals & Astrology Services',
    alternateName: [
      'श्री अवंतिका वैदिक तीर्थ सेवा',
      'Ujjain Puja Services',
      'Pardeshwar Mahadev Mandir Ujjain'
    ],
    url: baseUrl,
    logo: `${baseUrl}/ujjain_puja_logo_1784894507247.jpg`,
    image: [
      `${baseUrl}/mahakal_temple_bg_1785148009037.jpg`,
      `${baseUrl}/ujjain_puja_logo_1784894507247.jpg`
    ],
    description:
      'Book authentic Vedic puja, Rudrabhishek, Kalsarp Dosh Shanti, Mangal Dosh Bhaat Puja, and astrology consultations in Ujjain. Performed by experienced Vedic pandits with online live streaming and door-step prasad delivery.',
    telephone: '+91-9993540314',
    email: 'devotee@ujjainpuja.com',
    priceRange: '₹501 - ₹1,00,000',
    currenciesAccepted: 'INR, USD, EUR, GBP, AED',
    paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking, Razorpay, Cash',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pardeshwar Mahadev Mandir, Near Mahakaleshwar Temple, Jaisinghpura',
      addressLocality: 'Ujjain',
      addressRegion: 'Madhya Pradesh',
      postalCode: '456006',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.1828,
      longitude: 75.7681
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '05:00',
        closes: '22:00'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2580',
      bestRating: '5',
      worstRating: '1'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9993540314',
      contactType: 'customer service',
      areaServed: ['IN', 'US', 'GB', 'CA', 'AU', 'AE'],
      availableLanguage: ['Hindi', 'English', 'Sanskrit']
    },
    sameAs: [
      'https://wa.me/919993540314',
      `${baseUrl}/#contact`,
      `${baseUrl}/llms.txt`
    ]
  };
};

/**
 * 2. WebSite Schema with SearchAction
 */
export const getWebSiteSchema = (baseUrl: string = getBaseUrl()) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Ujjain Puja | Authentic Vedic Rituals & Astrology Services',
    alternateName: 'Ujjain Puja',
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: ['hi', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/#pujas?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * 3. BreadcrumbList Schema
 */
export const getBreadcrumbsSchema = (activeTab: string, customTitle?: string, baseUrl: string = getBaseUrl()) => {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl
    }
  ];

  if (activeTab === 'pujas') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: customTitle || 'All Vedic Pujas & Havan',
      item: `${baseUrl}/#pujas`
    });
  } else if (activeTab === 'astrology') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Vedic Astrology & Kundali Analysis',
      item: `${baseUrl}/#astrology`
    });
  } else if (activeTab === 'about') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'About Ujjain & Vedic Pandits',
      item: `${baseUrl}/#about`
    });
  } else if (activeTab === 'contact') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Contact Us & Temple Office',
      item: `${baseUrl}/#contact`
    });
  } else if (activeTab === 'thankyou') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Booking Confirmation',
      item: `${baseUrl}/#thankyou`
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
};

/**
 * 4. Single Puja / Service Schema (Product + Service)
 */
export const getSinglePujaSchema = (puja: Puja, baseUrl: string = getBaseUrl()) => {
  const absoluteImage = puja.image.startsWith('http')
    ? puja.image
    : `${baseUrl}${puja.image.startsWith('/') ? '' : '/'}${puja.image}`;

  return {
    '@context': 'https://schema.org',
    '@type': ['Service', 'Product'],
    '@id': `${baseUrl}/puja/${puja.id}#service`,
    name: puja.name,
    alternateName: puja.nameHi || puja.name,
    description: `${puja.description} ${puja.longDesc || ''}`.trim(),
    image: [absoluteImage],
    category: puja.category,
    serviceType: 'Vedic Hindu Puja & Ritual Ceremony',
    provider: {
      '@id': `${baseUrl}/#organization`
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vedic Ritual Packages',
      itemListElement: (puja.includes || []).map((inc, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: inc
        }
      }))
    },
    offers: {
      '@type': 'Offer',
      price: puja.price,
      priceCurrency: 'INR',
      priceValidUntil: '2028-12-31',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/#pujas`,
      seller: {
        '@id': `${baseUrl}/#organization`
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  };
};

/**
 * 5. All Pujas Catalog / ItemList Schema
 */
export const getAllPujasCatalogSchema = (pujas: Puja[], baseUrl: string = getBaseUrl()) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${baseUrl}/#puja-catalog`,
    name: 'Vedic Pujas and Havan Rituals at Ujjain',
    description: 'Complete catalog of authentic Vedic Pujas performed at Pardeshwar Mahadev Mandir and holy shrines in Ujjain.',
    numberOfItems: pujas.length,
    itemListElement: pujas.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: getSinglePujaSchema(p, baseUrl)
    }))
  };
};

/**
 * 6. Astrology Services Schema
 */
export const getAstrologyServicesSchema = (services: AstrologyService[] = ASTROLOGY_SERVICES, baseUrl: string = getBaseUrl()) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${baseUrl}/#astrology-catalog`,
    name: 'Vedic Astrology & Jyotish Consultations',
    description: 'Online & offline Kundali matching, horoscope analysis, dasha remedies and Muhurat calculation.',
    numberOfItems: services.length,
    itemListElement: services.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        serviceType: 'Vedic Astrology Consultation',
        provider: {
          '@id': `${baseUrl}/#organization`
        },
        offers: {
          '@type': 'Offer',
          price: s.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  };
};

/**
 * 7. FAQPage Schema
 */
export const getFAQSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };
};

/**
 * 8. Reviews / Testimonials Schema
 */
export const getTestimonialsSchema = (baseUrl: string = getBaseUrl()) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@id': `${baseUrl}/#reviews`,
    name: 'Devotee Reviews and Testimonials for Ujjain Puja',
    review: TESTIMONIALS.map((t) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: t.name
      },
      reviewBody: t.review,
      itemReviewed: {
        '@type': 'Service',
        name: t.puja,
        provider: {
          '@id': `${baseUrl}/#organization`
        }
      }
    }))
  };
};

/**
 * 9. WebPage Schema tailored by Active Tab
 */
export const getWebPageSchema = (activeTab: string, baseUrl: string = getBaseUrl()) => {
  const pageConfigs: Record<string, { name: string; desc: string; type: string }> = {
    home: {
      name: 'Ujjain Puja - Authentic Vedic Rituals, Rudrabhishek & Astrology Services',
      desc: 'Book authentic Vedic puja, Rudrabhishek, Kalsarp Dosh, and astrology consultations in Ujjain at Pardeshwar Mahadev Mandir with live streaming.',
      type: 'WebPage'
    },
    pujas: {
      name: 'All Vedic Pujas & Havan in Ujjain | Book Online',
      desc: 'Explore and book authentic Rudrabhishek, Kalsarp Dosh, Mangal Dosh, and Mahamrityunjay pujas in Ujjain with transparent dakshina.',
      type: 'CollectionPage'
    },
    astrology: {
      name: 'Vedic Astrology, Kundali Matching & Jyotish Consultation',
      desc: 'Get accurate birth chart analysis, Gun Milan, Varshphal, and astrological dosha remedies by certified Vedic astrologers.',
      type: 'CollectionPage'
    },
    about: {
      name: 'About Ujjain Puja, Pardeshwar Mahadev Mandir & Vedic Pandits',
      desc: 'Learn about our heritage at Avantika Ujjain, the holy Paras Shivling at Pardeshwar Mandir, and our qualified Vedic scholar priests.',
      type: 'AboutPage'
    },
    contact: {
      name: 'Contact Ujjain Puja | Temple Address, Helpline & WhatsApp Booking',
      desc: 'Reach out to our 24/7 temple coordinators for puja bookings, muhurat inquiries, and guidance. Call or WhatsApp +91 9993540314.',
      type: 'ContactPage'
    },
    thankyou: {
      name: 'Booking Confirmed | Ujjain Puja',
      desc: 'Your sacred Vedic puja has been confirmed. Our temple team will connect on WhatsApp with live streaming and sankalp details.',
      type: 'ItemPage'
    }
  };

  const config = pageConfigs[activeTab] || pageConfigs.home;

  return {
    '@context': 'https://schema.org',
    '@type': config.type,
    '@id': `${baseUrl}/#${activeTab}`,
    url: `${baseUrl}/${activeTab === 'home' ? '' : '#' + activeTab}`,
    name: config.name,
    description: config.desc,
    isPartOf: {
      '@id': `${baseUrl}/#website`
    },
    about: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: ['hi', 'en']
  };
};
