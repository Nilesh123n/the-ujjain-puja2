import { Puja, AstrologyService, Testimonial, ZodiacSign } from '../types';

export const PUJA_DATA: Puja[] = [
  // ========== RUDRA PUJAS ==========
  {
    id: 1,
    name: "Rudrabhishek Puja",
    nameHi: "रुद्राभिषेक पूजा",
    price: 2100,
    priceDisplay: "₹2,100",
    category: "rudra",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "2-3 Hours",
    popular: true,
    description: "5th chapter of Rudra Ashtadhyay. A powerful sacred Abhishek ritual performed on the Shivling for spiritual purification and divine grace.",
    descriptionHi: "रुद्राष्टाध्यायी के पंचम अध्याय के पावन मंत्रों द्वारा पारद शिवलिंग पर दुग्धाभिषेक एवं जलाभिषेक अनुष्ठान।",
    longDesc: "Rudrabhishek is one of the most auspicious Vedic rituals dedicated to Lord Shiva. The 5th chapter of Rudra Ashtadhyay is chanted while performing Abhishek on the sacred Shivling at Pardeshwar Mahadev Mandir — home to the world's largest Paras Shivling. This ritual cleanses negative karma, brings peace of mind, and invites divine blessings into your life.",
    includes: ["Per person with Puja material", "Abhishek Samagri", "Pandit Seva", "Prasad Delivery"],
    benefits: ["Spiritual purification", "Peace of mind", "Divine grace of Shiva", "Removal of life obstacles"],
    benefitsHi: ["आत्मिक एवं मानसिक शांति", "रोग-दोष एवं संकट नाश", "भगवान महाकाल की विशेष कृपा", "मनोकामना पूर्ति"],
    image: "/images/pujas/1000277460.jpg",
    tag: "Most Booked",
    tagHi: "सर्वाधिक बुक",
    bestFor: "Individual or family seeking peace, spiritual elevation, and Shiva's protective blessings."
  },
  {
    id: 2,
    name: "Laghu Rudrabhishek",
    nameHi: "लघु रुद्राभिषेक",
    price: 15000,
    priceDisplay: "₹15,000",
    category: "rudra",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "11 Pandits",
    duration: "4-5 Hours",
    popular: true,
    description: "Complete Rudra Ashtadhyay - 11 Path. A grand collective ritual performed by 11 experienced Pandits for powerful blessings.",
    descriptionHi: "11 विद्वान पंडितों द्वारा संपूर्ण रुद्राष्टाध्यायी के 11 आवर्तन पाठ एवं भव्य जलाभिषेक-हवन।",
    longDesc: "Laghu Rudrabhishek involves the complete recitation of Rudra Ashtadhyay (11 paths) by 11 experienced Vedic pandits simultaneously. This powerful group ritual amplifies spiritual energy manifold and is ideal for those seeking significant life transformation, removal of major doshas, and intense divine blessings from Lord Shiva.",
    includes: ["Per person with Puja material", "11 Pandit Seva", "Complete Samagri", "Special Prasad"],
    benefits: ["Major dosh removal", "Career & business growth", "Family prosperity", "Spiritual upliftment"],
    benefitsHi: ["ग्रह-दोष एवं संकट निवारण", "व्यापार एवं नौकरी में वृद्धि", "परिवार में सुख-समृद्धि", "उत्कृष्ट आध्यात्मिक ऊर्जा"],
    image: "/images/mahakal_temple_bg_1785148009037.jpg",
    tag: "Grand Ritual",
    tagHi: "भव्य अनुष्ठान",
    bestFor: "Business owners, families celebrating milestones, or overcoming chronic hurdles."
  },
  {
    id: 3,
    name: "Maharudrabhishek",
    nameHi: "महारुद्राभिषेक",
    price: 100000,
    priceDisplay: "₹1,00,000",
    category: "rudra",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "50 Pandits",
    duration: "Full Day",
    popular: true,
    description: "Complete Rudra Ashtadhyay - 100 Path. Performed by 50 Pandits — the most auspicious and comprehensive Rudrabhishek.",
    descriptionHi: "50 वरिष्ठ वैदिक आचार्यों द्वारा संपूर्ण रुद्राष्टाध्यायी के 100 पाठ एवं महाहवन-पूर्णाहुति।",
    longDesc: "Maharudrabhishek is the supreme form of Rudrabhishek, performed by 50 expert Vedic pandits chanting 100 paths of Rudra Ashtadhyay simultaneously. This grand all-day ritual at Pardeshwar Mahadev Mandir creates an incredibly powerful spiritual atmosphere. It is considered one of the most potent rituals for complete life transformation, business success, and moksha.",
    includes: ["Per person with Puja material", "50 Pandit Seva", "Complete Grand Samagri", "Prasad Vitran & Bhojan"],
    benefits: ["Complete life transformation", "Business supreme success", "Moksha blessings", "Supreme divine grace"],
    benefitsHi: ["सर्वकार्य सिद्धि एवं महाविजय", "व्यापारिक व पारिवारिक उत्थान", "मोक्ष एवं महारोग मुक्ति", "सर्वोच्च महाकाल कृपा"],
    image: "/images/guru_jap_puja_1785563106786.jpg",
    tag: "Supreme",
    tagHi: "सर्वोच्च अनुष्ठान",
    bestFor: "Grand family vows, corporate prosperity, major health or life milestones."
  },
  {
    id: 4,
    name: "Mahamrityunjay Jap Anushthan",
    nameHi: "महामृत्युंजय जाप अनुष्ठान",
    price: 51000,
    priceDisplay: "₹51,000",
    category: "rudra",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "51 Pandits",
    jaapCount: "1,25,000 Jaap",
    duration: "Full Day",
    popular: true,
    description: "125,000 Mahamrityunjay Jaap performed by 51 experienced Pandits for health, longevity, and liberation from all fears.",
    descriptionHi: "51 योग्य ब्राह्मणों द्वारा 1,25,000 महामृत्युंजय मंत्र जाप, दशांश हवन एवं सम्पुट पाठ।",
    longDesc: "The Mahamrityunjay Mantra is Lord Shiva's most powerful healing mantra. In this grand anushthan, 51 experienced pandits collectively perform 1,25,000 jaaps of the Mahamrityunjay Mantra. This ritual is especially beneficial for those suffering from serious illness, fear of death, accidents, or prolonged health issues. It invokes Lord Shiva's healing and protective energy.",
    includes: ["Per person with Puja material", "51 Pandit Seva", "1,25,000 Jaap", "Complete Anushthan Samagri"],
    benefits: ["Health restoration", "Fear removal", "Longevity blessings", "Protection from accidents"],
    benefitsHi: ["असाध्य रोगों से रक्षा", "अकाल मृत्यु भय निवारण", "दीर्घायु एवं उत्तम स्वास्थ्य", "कवच एवं सुरक्षा"],
    image: "/images/pujas/1000277460.jpg",
    tag: "Health & Longevity",
    tagHi: "आरोग्य एवं दीर्घायु",
    bestFor: "Recovery from prolonged illness, protection before surgeries, longevity for elders."
  },

  // ========== DOSH NIVARAN PUJAS ==========
  {
    id: 5,
    name: "Kalsarp Dosh Puja",
    nameHi: "कालसर्प दोष शांति पूजा",
    price: 5100,
    priceDisplay: "₹5,100",
    category: "dosh",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "2-3 Hours",
    popular: true,
    description: "Remove the malefic effects of Kaal Sarp Yoga present in your Kundali. A powerful remedy ritual by experienced Ujjain priests.",
    descriptionHi: "अवंतिका तीर्थ उज्जैन में नाग-नागिन जोड़े के साथ संपूर्ण वैदिक विधान से कालसर्प योग शांति।",
    longDesc: "Kaal Sarp Dosh occurs when all 7 planets are placed between Rahu and Ketu in the birth chart. This dosh can cause repeated failures, financial troubles, relationship issues, and mental unrest. The Kalsarp Dosh Puja performed at Pardeshwar Mahadev Mandir in Ujjain is one of the most effective remedies, as Ujjain is considered the most powerful location for this puja.",
    includes: ["Per person with Puja material", "Pandit Seva", "Dosh Nivaran Samagri", "Prasad"],
    benefits: ["Kalsarp dosh removal", "Financial stability", "Relationship harmony", "Mental peace"],
    benefitsHi: ["कालसर्प दोष से मुक्ति", "करियर व धन बाधा निवारण", "मानसिक तनाव से शांति", "पारिवारिक सामंजस्य"],
    image: "/images/pujas/1000277466.jpg",
    tag: "Online Dosh Nivaran",
    tagHi: "ऑनलाइन दोष मुक्ति"
  },

  // ========== SPECIAL PUJAS ==========
  {
    id: 21,
    name: "Vivah Puja (Marriage Ceremony)",
    nameHi: "वैदिक विवाह संस्कार",
    price: 21000,
    priceDisplay: "₹21,000",
    category: "special",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "2 Pandits",
    duration: "3-4 Hours",
    popular: false,
    description: "A sacred Vedic marriage ceremony (Vivah Sanskar) performed by experienced pandits at the holy Pardeshwar Mahadev Mandir.",
    descriptionHi: "परदेश्वर महादेव मंदिर में विद्वान आचार्यों द्वारा वैदिक रीतियों एवं सप्तपदी से विवाह संस्कार।",
    longDesc: "Vivah Puja is the complete Vedic marriage ceremony performed at the sacred Pardeshwar Mahadev Mandir in Ujjain. The ritual includes all 16 steps of Vivah Sanskar including Saptapadi (seven steps), Mangalsutra ceremony, and taking sacred vows in front of Lord Shiva.",
    includes: ["Complete Vivah Samagri", "2 Pandit Seva", "Saptapadi Ritual", "Mangalsutra Ceremony", "Prasad"],
    benefits: ["Lifelong marital bliss", "Divine blessings", "Sacred bond", "Auspicious beginning"],
    benefitsHi: ["अखंड सौभाग्य एवं दांपत्य प्रेम", "भगवान महाकाल का आशीर्वाद", "पवित्र वैदिक बंधन", "सुखद जीवन की शुरुआत"],
    image: "/images/shukra_jap_puja_1785563093653.jpg",
    tag: "Marriage",
    tagHi: "विवाह संस्कार"
  },
  {
    id: 22,
    name: "Akhand Ramayan Path",
    nameHi: "अखंड रामायण पाठ (24 घंटे)",
    price: 11000,
    priceDisplay: "₹11,000",
    category: "special",
    location: "Temple / Home Venue",
    locationHi: "मंदिर अथवा निज निवास",
    pandits: "4 Pandits",
    duration: "24 Hours",
    popular: false,
    description: "Non-stop 24-hour recitation of complete Ramcharitmanas by 4 Pandits for family prosperity and divine Ram blessings.",
    descriptionHi: "4 पंडितों द्वारा 24 घंटे अनवरत श्रीरामचरितमानस के संपूर्ण काण्डों का गायन एवं आरती।",
    longDesc: "Akhand Ramayan Path is the continuous non-stop recitation of the complete Ramcharitmanas over 24 hours by 4 pandits working in shifts. This powerful ritual fills the home with divine energy.",
    includes: ["24-Hour Non-Stop Path", "4 Pandit Seva", "Complete Samagri", "Bhandara Prasad"],
    benefits: ["Family prosperity", "Vastu dosh removal", "Health & happiness", "Lord Ram blessings"],
    benefitsHi: ["गृह में सकारात्मक ऊर्जा", "वास्तु दोष एवं संकट नाश", "परिवार में शांति व समृद्धि", "श्रीराम कृपा"],
    image: "/images/guru_jap_puja_1785563106786.jpg",
    tag: "24 Hour Path",
    tagHi: "अखंड पाठ"
  },

  // ========== ONLINE PUJAS ==========
  {
    id: 23,
    name: "Online Rudrabhishek",
    nameHi: "ऑनलाइन लाइव रुद्राभिषेक",
    price: 1100,
    priceDisplay: "₹1,100",
    category: "online",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "2 Hours",
    popular: true,
    description: "Participate in Rudrabhishek from anywhere in the world via WhatsApp/Zoom live stream. Prasad delivered to your home.",
    descriptionHi: "विश्व में कहीं भी बैठकर व्हाट्सएप/ज़ूम लाइव वीडियो द्वारा ऑनलाइन रुद्राभिषेक में भाग लें।",
    longDesc: "Our Online Rudrabhishek service allows devotees from anywhere in the world to participate in the sacred Rudrabhishek at Pardeshwar Mahadev Mandir, Ujjain via WhatsApp or Zoom live stream. You can watch the entire ritual in real-time, offer your sankalp (intention), and receive prasad delivered to your doorstep.",
    includes: ["Live Stream via WhatsApp/Zoom", "Your Sankalp Taken", "Pandit Seva", "Prasad Home Delivery"],
    benefits: ["Participate from anywhere", "Real-time blessings", "Prasad at home", "Divine connection"],
    benefitsHi: ["घर बैठे लाइव दर्शन व संकल्प", "महाकाल का प्रत्यक्ष आशीर्वाद", "प्रसाद गृह डिलीवरी", "सुविधाजनक एवं पवित्र"],
    image: "/images/pujas/1000277460.jpg",
    tag: "Online Available",
    tagHi: "ऑनलाइन लाइव"
  },
  {
    id: 24,
    name: "Online Navgrah Shanti",
    nameHi: "ऑनलाइन नवग्रह शांति पूजा",
    price: 2100,
    priceDisplay: "₹2,100",
    category: "online",
    location: "Triveni Shani Mandir, Ujjain",
    locationHi: "त्रिवेणी शनि मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "3 Hours",
    popular: false,
    description: "Get Navgrah Shanti puja performed on your behalf at Triveni Shani Mandir with live video streaming and prasad delivery.",
    descriptionHi: "त्रिवेणी शनि मंदिर उज्जैन में आपके नाम व गोत्र से नवग्रह शांति एवं घर बैठे लाइव दर्शन।",
    longDesc: "Online Navgrah Shanti Puja is performed at the sacred Triveni Shani Mandir, Ujjain on your behalf. You receive a live video stream of the complete puja via WhatsApp or Zoom.",
    includes: ["Live Stream via WhatsApp/Zoom", "Your Sankalp Taken", "Complete Navgrah Samagri", "Prasad Home Delivery"],
    benefits: ["Worldwide participation", "Planetary peace", "Real-time connection", "Prasad at doorstep"],
    benefitsHi: ["नाम-गोत्र संकल्प", "लाइव वीडियो द्वारा पूजन", "गृह डिलीवरी द्वारा प्रसाद", "ग्रह शांति"],
    image: "/images/shukra_jap_puja_1785563093653.jpg",
    tag: "Worldwide",
    tagHi: "वैश्विक सेवा"
  },
  {
    id: 25,
    name: "Online Kalsarp Dosh Puja",
    nameHi: "ऑनलाइन कालसर्प दोष शांति",
    price: 2500,
    priceDisplay: "₹2,500",
    category: "online",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "2-3 Hours",
    popular: false,
    description: "Kalsarp Dosh Nivaran Puja performed at Ujjain on your behalf with live streaming. The most effective online remedy.",
    descriptionHi: "उज्जैन में आपके नाम-गोत्र से शास्त्रोक्त कालसर्प शांति एवं लाइव वीडियो कवरेज।",
    longDesc: "This online Kalsarp Dosh Puja is considered the most effective remedy for Kaal Sarp Yoga as it is performed at Pardeshwar Mahadev Mandir in Ujjain — the most powerful location for this specific puja.",
    includes: ["Live Stream via WhatsApp/Zoom", "Birth Details Sankalp", "Complete Dosh Nivaran Samagri", "Prasad Home Delivery"],
    benefits: ["Kalsarp dosh removal", "Worldwide access", "Authentic Ujjain ritual", "Home prasad delivery"],
    benefitsHi: ["कालसर्प योग से मुक्ति", "घर बैठे अनुष्ठान", "शास्त्रोक्त उज्जैन विधि", "डाक द्वारा प्रसाद"],
    image: "/images/pujas/1000277466.jpg",
    tag: "Online Dosh Nivaran",
    tagHi: "ऑनलाइन दोष मुक्ति"
  },
  // ========== SPECIAL PUJAS ==========
  {
    id: 21,
    name: "Vivah Puja (Marriage Ceremony)",
    nameHi: "वैदिक विवाह संस्कार",
    price: 21000,
    priceDisplay: "₹21,000",
    category: "special",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "2 Pandits",
    duration: "3-4 Hours",
    popular: false,
    description: "A sacred Vedic marriage ceremony (Vivah Sanskar) performed by experienced pandits at the holy Pardeshwar Mahadev Mandir.",
    descriptionHi: "परदेश्वर महादेव मंदिर में विद्वान आचार्यों द्वारा वैदिक रीतियों एवं सप्तपदी से विवाह संस्कार।",
    longDesc: "Vivah Puja is the complete Vedic marriage ceremony performed at the sacred Pardeshwar Mahadev Mandir in Ujjain. The ritual includes all 16 steps of Vivah Sanskar including Saptapadi (seven steps), Mangalsutra ceremony, and taking sacred vows in front of Lord Shiva.",
    includes: ["Complete Vivah Samagri", "2 Pandit Seva", "Saptapadi Ritual", "Mangalsutra Ceremony", "Prasad"],
    benefits: ["Lifelong marital bliss", "Divine blessings", "Sacred bond", "Auspicious beginning"],
    benefitsHi: ["अखंड सौभाग्य एवं दांपत्य प्रेम", "भगवान महाकाल का आशीर्वाद", "पवित्र वैदिक बंधन", "सुखद जीवन की शुरुआत"],
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    tag: "Marriage",
    tagHi: "विवाह संस्कार"
  },
  {
    id: 22,
    name: "Akhand Ramayan Path",
    nameHi: "अखंड रामायण पाठ (24 घंटे)",
    price: 11000,
    priceDisplay: "₹11,000",
    category: "special",
    location: "Temple / Home Venue",
    locationHi: "मंदिर अथवा निज निवास",
    pandits: "4 Pandits",
    duration: "24 Hours",
    popular: false,
    description: "Non-stop 24-hour recitation of complete Ramcharitmanas by 4 Pandits for family prosperity and divine Ram blessings.",
    descriptionHi: "4 पंडितों द्वारा 24 घंटे अनवरत श्रीरामचरितमानस के संपूर्ण काण्डों का गायन एवं आरती।",
    longDesc: "Akhand Ramayan Path is the continuous non-stop recitation of the complete Ramcharitmanas over 24 hours by 4 pandits working in shifts. This powerful ritual fills the home with divine energy.",
    includes: ["24-Hour Non-Stop Path", "4 Pandit Seva", "Complete Samagri", "Bhandara Prasad"],
    benefits: ["Family prosperity", "Vastu dosh removal", "Health & happiness", "Lord Ram blessings"],
    benefitsHi: ["गृह में सकारात्मक ऊर्जा", "वास्तु दोष एवं संकट नाश", "परिवार में शांति व समृद्धि", "श्रीराम कृपा"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    tag: "24 Hour Path",
    tagHi: "अखंड पाठ"
  },

  // ========== ONLINE PUJAS ==========
  {
    id: 23,
    name: "Online Rudrabhishek",
    nameHi: "ऑनलाइन लाइव रुद्राभिषेक",
    price: 1100,
    priceDisplay: "₹1,100",
    category: "online",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "2 Hours",
    popular: true,
    description: "Participate in Rudrabhishek from anywhere in the world via WhatsApp/Zoom live stream. Prasad delivered to your home.",
    descriptionHi: "विश्व में कहीं भी बैठकर व्हाट्सएप/ज़ूम लाइव वीडियो द्वारा ऑनलाइन रुद्राभिषेक में भाग लें।",
    longDesc: "Our Online Rudrabhishek service allows devotees from anywhere in the world to participate in the sacred Rudrabhishek at Pardeshwar Mahadev Mandir, Ujjain via WhatsApp or Zoom live stream. You can watch the entire ritual in real-time, offer your sankalp (intention), and receive prasad delivered to your doorstep.",
    includes: ["Live Stream via WhatsApp/Zoom", "Your Sankalp Taken", "Pandit Seva", "Prasad Home Delivery"],
    benefits: ["Participate from anywhere", "Real-time blessings", "Prasad at home", "Divine connection"],
    benefitsHi: ["घर बैठे लाइव दर्शन व संकल्प", "महाकाल का प्रत्यक्ष आशीर्वाद", "प्रसाद गृह डिलीवरी", "सुविधाजनक एवं पवित्र"],
    image: "https://images.unsplash.com/photo-1609619385002-f40f1df5e9e2?w=800&q=80",
    tag: "Online Available",
    tagHi: "ऑनलाइन लाइव"
  },
  {
    id: 24,
    name: "Online Navgrah Shanti",
    nameHi: "ऑनलाइन नवग्रह शांति पूजा",
    price: 2100,
    priceDisplay: "₹2,100",
    category: "online",
    location: "Triveni Shani Mandir, Ujjain",
    locationHi: "त्रिवेणी शनि मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "3 Hours",
    popular: false,
    description: "Get Navgrah Shanti puja performed on your behalf at Triveni Shani Mandir with live video streaming and prasad delivery.",
    descriptionHi: "त्रिवेणी शनि मंदिर उज्जैन में आपके नाम व गोत्र से नवग्रह शांति एवं घर बैठे लाइव दर्शन।",
    longDesc: "Online Navgrah Shanti Puja is performed at the sacred Triveni Shani Mandir, Ujjain on your behalf. You receive a live video stream of the complete puja via WhatsApp or Zoom.",
    includes: ["Live Stream via WhatsApp/Zoom", "Your Sankalp Taken", "Complete Navgrah Samagri", "Prasad Home Delivery"],
    benefits: ["Worldwide participation", "Planetary peace", "Real-time connection", "Prasad at doorstep"],
    benefitsHi: ["नाम-गोत्र संकल्प", "लाइव वीडियो द्वारा पूजन", "गृह डिलीवरी द्वारा प्रसाद", "ग्रह शांति"],
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    tag: "Worldwide",
    tagHi: "वैश्विक सेवा"
  },
  {
    id: 25,
    name: "Online Kalsarp Dosh Puja",
    nameHi: "ऑनलाइन कालसर्प दोष शांति",
    price: 2500,
    priceDisplay: "₹2,500",
    category: "online",
    location: "Pardeshwar Mahadev Mandir, Ujjain",
    locationHi: "परदेश्वर महादेव मंदिर, उज्जैन",
    pandits: "1 Pandit",
    duration: "2-3 Hours",
    popular: false,
    description: "Kalsarp Dosh Nivaran Puja performed at Ujjain on your behalf with live streaming. The most effective online remedy.",
    descriptionHi: "उज्जैन में आपके नाम-गोत्र से शास्त्रोक्त कालसर्प शांति एवं लाइव वीडियो कवरेज।",
    longDesc: "This online Kalsarp Dosh Puja is considered the most effective remedy for Kaal Sarp Yoga as it is performed at Pardeshwar Mahadev Mandir in Ujjain — the most powerful location for this specific puja.",
    includes: ["Live Stream via WhatsApp/Zoom", "Birth Details Sankalp", "Complete Dosh Nivaran Samagri", "Prasad Home Delivery"],
    benefits: ["Kalsarp dosh removal", "Worldwide access", "Authentic Ujjain ritual", "Home prasad delivery"],
    benefitsHi: ["कालसर्प योग से मुक्ति", "घर बैठे अनुष्ठान", "शास्त्रोक्त उज्जैन विधि", "डाक द्वारा प्रसाद"],
    image: "https://images.unsplash.com/photo-1620052581237-5d36667be337?w=800&q=80",
    tag: "Online Dosh Nivaran",
    tagHi: "ऑनलाइन दोष मुक्ति"
  }
];

export const ASTROLOGY_SERVICES: AstrologyService[] = [
  {
    id: 26,
    title: "Kundali Analysis",
    icon: "📜",
    description: "Detailed birth chart analysis covering all 12 houses, planetary positions, dashas, and future predictions for career, marriage, health & finances.",
    priceDisplay: "₹1,100",
    price: 1100,
    tag: "Most Popular",
    isPopular: true
  },
  {
    id: 27,
    title: "Horoscope Matching (Kundali Milan)",
    icon: "💑",
    description: "Gun Milan and detailed horoscope matching for marriage compatibility. Check 36 gunas, mangal dosh and nadi analysis for marital bliss.",
    priceDisplay: "₹801",
    price: 801
  },
  {
    id: 28,
    title: "Yearly Prediction (Varshphal)",
    icon: "📅",
    description: "Complete yearly horoscope prediction for all 12 months. Know auspicious dates, lucky colors, favorable timings and key life events.",
    priceDisplay: "₹1,501",
    price: 1501
  },
  {
    id: 29,
    title: "Career & Business Astrology",
    icon: "💼",
    description: "Discover your ideal career path through Vedic astrology. Get guidance on job changes, promotion timings, and business investments.",
    priceDisplay: "₹1,100",
    price: 1100
  },
  {
    id: 30,
    title: "Dosh Nivaran Consultation",
    icon: "⚡",
    description: "Identify and remove doshas from your kundali — Kalsarp Dosh, Mangal Dosh, Pitru Dosh, Shani Sade Sati and get authentic Vedic remedies.",
    priceDisplay: "₹1,501",
    price: 1501,
    tag: "Essential"
  },
  {
    id: 31,
    title: "Auspicious Muhurat",
    icon: "⏰",
    description: "Find the most auspicious time for important life events — marriage, griha pravesh, vehicle purchase, new business, or travel.",
    priceDisplay: "₹501",
    price: 501
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ramesh Sharma",
    city: "Delhi",
    rating: 5,
    review: "The Rudrabhishek puja was performed with utmost devotion at Pardeshwar Mandir. I felt a deep sense of peace and spiritual cleansing.",
    emoji: "🙏",
    puja: "Rudrabhishek Puja"
  },
  {
    name: "Sunita Verma",
    city: "Mumbai",
    rating: 5,
    review: "Kalsarp Dosh puja done for my son. Panditji explained each step beautifully. Transparent and divine experience in Ujjain.",
    emoji: "🌺",
    puja: "Kalsarp Dosh Puja"
  },
  {
    name: "Ajay Patel",
    city: "Ahmedabad",
    rating: 5,
    review: "Booked Navgrah Shanti puja online. The live stream was crystal clear and prasad was delivered to my home in Gujarat within 4 days.",
    emoji: "⭐",
    puja: "Online Navgrah Shanti"
  },
  {
    name: "Priya Joshi",
    city: "Pune",
    rating: 5,
    review: "Maharudrabhishek by 50 pandits was a life-changing experience. The energy and vibrations were incredibly powerful. Thank you!",
    emoji: "🔱",
    puja: "Maharudrabhishek"
  },
  {
    name: "Vikram Singh",
    city: "Jaipur",
    rating: 5,
    review: "The team is very responsive on WhatsApp. My Shani Sadeshati puja was performed beautifully at Triveni Shani Mandir.",
    emoji: "🪐",
    puja: "Shani Sadeshati Puja"
  },
  {
    name: "Meera Gupta",
    city: "Bangalore",
    rating: 5,
    review: "Booked Mahamrityunjay Jap for my father's health. The results were amazing. He recovered faster than expected. Jai Mahakal!",
    emoji: "🕉️",
    puja: "Mahamrityunjay Jap"
  }
];

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries (Mesh)",
    symbol: "♈",
    dates: "Mar 21 – Apr 19",
    prediction: "Aaj ka din aapke liye ati shubh hai. Surya ki kripa se career mein nayi unnati milegi. Prem sambandh mein madhurta rahegi. Swasthya ka dhyan rakhein.",
    color: "Red / Lal",
    day: "Tuesday",
    number: "9"
  },
  {
    id: "taurus",
    name: "Taurus (Vrishabh)",
    symbol: "♉",
    dates: "Apr 20 – May 20",
    prediction: "Shukra graha ki drishti se aaj prem aur kala mein safalta milegi. Arthik sthiti mazboot rahegi. Parivar mein sukh-shanti rahegi.",
    color: "White & Light Green",
    day: "Friday",
    number: "6"
  },
  {
    id: "gemini",
    name: "Gemini (Mithun)",
    symbol: "♊",
    dates: "May 21 – Jun 20",
    prediction: "Budh ka prabhav aaj aapki buddhi aur vaad-vivad shakti ko tez karega. Vyapar mein labh milega. Yatra ke yog hain.",
    color: "Yellow / Peela",
    day: "Wednesday",
    number: "5"
  },
  {
    id: "cancer",
    name: "Cancer (Kark)",
    symbol: "♋",
    dates: "Jun 21 – Jul 22",
    prediction: "Aaj Chandra ki kripa se mann prasanna rahega. Ghar aur parivar ke kaamon mein safalta milegi. Mata se ashirwad prapt hoga.",
    color: "Pearl White / Chandi",
    day: "Monday",
    number: "2"
  },
  {
    id: "leo",
    name: "Leo (Singh)",
    symbol: "♌",
    dates: "Jul 23 – Aug 22",
    prediction: "Surya dev ki kripa se aaj aapka aatmvishwas uchch rahega. Netritva shakti badhegi. Samaj mein maan-samman milega.",
    color: "Saffron & Orange",
    day: "Sunday",
    number: "1"
  },
  {
    id: "virgo",
    name: "Virgo (Kanya)",
    symbol: "♍",
    dates: "Aug 23 – Sep 22",
    prediction: "Budh graha ki drishti se aaj vivek aur buddhimatta ka prayog karein. Swasthya mein sudhar hoga. Karyasthhal par prasansa milegi.",
    color: "Emerald Green",
    day: "Wednesday",
    number: "3"
  },
  {
    id: "libra",
    name: "Libra (Tula)",
    symbol: "♎",
    dates: "Sep 23 – Oct 22",
    prediction: "Shukra ki shubh drishti se aaj prem aur partnership mein madhurta rahegi. Nyay aur satya ka saath dein. Dhan labh hoga.",
    color: "Pink & Royal Blue",
    day: "Friday",
    number: "7"
  },
  {
    id: "scorpio",
    name: "Scorpio (Vrishchik)",
    symbol: "♏",
    dates: "Oct 23 – Nov 21",
    prediction: "Mangal ki shakti se aaj aapki urja aur sahasi pravritti badhegi. Gupt karyon mein safalta milegi. Research aur business mein labh.",
    color: "Dark Red / Maroon",
    day: "Tuesday",
    number: "8"
  },
  {
    id: "sagittarius",
    name: "Sagittarius (Dhanu)",
    symbol: "♐",
    dates: "Nov 22 – Dec 21",
    prediction: "Guru Brihaspati ki kripa se aaj gyan aur dharma ke kaamon mein safalta milegi. Uchch shiksha mein pragati hogi. Shubh yog hain.",
    color: "Bright Yellow",
    day: "Thursday",
    number: "3"
  },
  {
    id: "capricorn",
    name: "Capricorn (Makar)",
    symbol: "♑",
    dates: "Dec 22 – Jan 19",
    prediction: "Shani dev ki mehnat aaj rang layegi. Vyavsayik safalta milegi. Zimedaariyaan badhegi par inaam bhi milega.",
    color: "Navy Blue & Black",
    day: "Saturday",
    number: "8"
  },
  {
    id: "aquarius",
    name: "Aquarius (Kumbh)",
    symbol: "♒",
    dates: "Jan 20 – Feb 18",
    prediction: "Shani aur Rahu ki drishti se aaj naye vichar aur innovation aayenge. Samajik karyon mein safalta milegi. Mitro ka saath milega.",
    color: "Electric Blue",
    day: "Saturday",
    number: "4"
  },
  {
    id: "pisces",
    name: "Pisces (Meen)",
    symbol: "♓",
    dates: "Feb 19 – Mar 20",
    prediction: "Guru ki kripa se aaj aapki aatmik shakti tez rahegi. Dhyaan aur puja mein man lagega. Kala aur sangeet mein safalta milegi.",
    color: "Sea Green & Gold",
    day: "Thursday",
    number: "7"
  }
];

export const TEAM_PANDITS = [
  {
    name: "Pt. Ramesh Sharma",
    role: "Head Vedic Pandit",
    experience: "Senior Vedic Scholar",
    avatar: "🧙‍♂️",
    desc: "Expert in Rudrabhishek and Shiva rituals. Graduate of Kashi Vidyapeeth with deep knowledge of Vedic scriptures.",
    specialties: ["Rudrabhishek", "Shiva Rituals", "Mahamrityunjay"]
  },
  {
    name: "Pt. Suresh Joshi",
    role: "Senior Dosh Specialist",
    experience: "Dosh Specialist Scholar",
    avatar: "🧙",
    desc: "Specialist in Dosh Nivaran pujas including Kalsarp, Mangal Dosh, and Shani Shanti rituals at Ujjain.",
    specialties: ["Kalsarp Dosh", "Mangal Dosh", "Shani Shanti"]
  },
  {
    name: "Pt. Dinesh Trivedi",
    role: "Jyotish & Navgrah Scholar",
    experience: "Jyotish Scholar",
    avatar: "👨‍🏫",
    desc: "Expert astrologer and puja specialist for Navgrah Shanti, Kundali analysis and planetary remedies.",
    specialties: ["Navgrah Shanti", "Kundali Milan", "Grah Shanti"]
  },
  {
    name: "Pt. Mahesh Upadhyay",
    role: "Tantrik & Mahavidya Scholar",
    experience: "Anushthan Expert",
    avatar: "🧓",
    desc: "Expert in powerful tantrik pujas, Baglamukhi, Kali puja, and all goddess rituals performed with Vedic discipline.",
    specialties: ["Baglamukhi", "Kali Puja", "Durga Saptashati"]
  }
];

export const FAQS = [
  {
    q: "Can I attend the puja online from outside India?",
    a: "Yes! We provide live video streaming of all pujas via WhatsApp or Zoom. You can participate in real-time from anywhere globally across 85+ cities. Sacred Prasad is shipped safely to your address."
  },
  {
    q: "How do I book a puja?",
    a: "Click 'Book Now' on any puja card, fill in your details (Name, Gotra, Date, Phone), and choose your preferred payment option (Razorpay, UPI, or WhatsApp). You will receive instant confirmation!"
  },
  {
    q: "What is included in the puja price?",
    a: "All prices include complete puja samagri (ingredients), experienced Pandit Dakshina, temple arrangement, live streaming setup, and home delivery of Prasad. There are zero hidden charges."
  },
  {
    q: "Can I cancel or reschedule my booking?",
    a: "Yes! You can reschedule up to 48 hours before the puja date free of charge. Cancellations made 72+ hours before are eligible for a full refund."
  },
  {
    q: "Which sacred temples in Ujjain are the pujas performed at?",
    a: "Rudra pujas & Dosh pujas are conducted at Pardeshwar Mahadev Mandir (home to the world's largest Paras Shivling) near Mahakal Temple. Navgrah & Shani pujas are held at Triveni Shani Mandir."
  },
  {
    q: "How will I receive Prasad?",
    a: "Prasad is dispatched via express courier to your doorstep within 5-7 working days after the completion of the ritual."
  }
];
