export interface Puja {
  id: number;
  name: string;
  nameHi?: string;
  price: number;
  priceDisplay: string;
  category: 'rudra' | 'dosh' | 'navgrah' | 'shani' | 'jap' | 'special' | 'online' | 'astrology' | string;
  location: string;
  locationHi?: string;
  pandits: string;
  duration: string;
  popular: boolean;
  description: string;
  descriptionHi?: string;
  longDesc?: string;
  longDescHi?: string;
  includes: string[];
  includesHi?: string[];
  benefits: string[];
  benefitsHi?: string[];
  image: string;
  tag?: string;
  tagHi?: string;
  jaapCount?: string;
  bestFor?: string;
  bestForHi?: string;
}

export interface AstrologyService {
  id: number;
  title: string;
  icon: string;
  description: string;
  priceDisplay: string;
  price: number;
  tag?: string;
  isPopular?: boolean;
}

export interface BookingData {
  bookingId: string;
  pujaId: number;
  pujaName: string;
  pujaPrice: number;
  priceDisplay: string;
  fullName: string;
  phone: string;
  email: string;
  pujaDate: string;
  pujaType: string;
  city: string;
  gotra?: string;
  nakshatra?: string;
  rashi?: string;
  wishes?: string;
  message?: string;
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus?: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
}

export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  review: string;
  emoji: string;
  puja: string;
}

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  prediction: string;
  color: string;
  day: string;
  number: string;
}

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: string;
}
