import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface AiChatbotProps {
  onOpenBooking: () => void;
}

const KNOWLEDGE: Record<string, { keywords: string[]; text: string }> = {
  rudrabhishek: {
    keywords: ['rudra', 'abhishek', 'shivling', 'shiva', 'rudrabhishek', 'laghu'],
    text: `🙏 *Rudrabhishek Pujas at Ujjain*\n\n1️⃣ **Basic Rudrabhishek**: ₹2,100 | 1 Pandit | 2-3 Hrs\n2️⃣ **Laghu Rudrabhishek**: ₹15,000 | 11 Pandits | 4-5 Hrs\n3️⃣ **Maharudrabhishek**: ₹1,00,000 | 50 Pandits | Full Day\n\n📍 *Location*: Pardeshwar Mahadev Mandir (World's largest Paras Shivling)\nIncludes complete Vidhi Samagri + Prasad delivery.`
  },
  kalsarp: {
    keywords: ['kalsarp', 'kaal sarp', 'snake', 'dosh', 'rahu', 'ketu'],
    text: `🌺 *Kalsarp Dosh Puja - Ujjain*\n\n💰 **Price**: ₹5,100 (In-person) / ₹2,500 (Online Live Stream)\n📍 **Location**: Pardeshwar Mahadev Mandir, Ujjain\n\n*Removes Rahu-Ketu afflictions, financial blockages & career obstacles.* Would you like to reserve a slot now?`
  },
  mahamrityunjay: {
    keywords: ['mahamrityunjay', 'mrityunjay', 'health', 'illness', 'recovery', 'jaap'],
    text: `🕉️ *Mahamrityunjay Jap Anushthan*\n\n💰 **Price**: ₹51,000 | 51 Vedic Pandits | 1,25,000 Chantings\n📍 **Location**: Pardeshwar Mahadev Mandir, Ujjain\n\n*Ultimate Shiva healing mantra ritual for health recovery, longevity & safety from accidents.*`
  },
  navgrah: {
    keywords: ['navgrah', 'planet', 'grah', 'shanti', 'nine'],
    text: `⭐ *Navgrah Shanti Pujas*\n\n1️⃣ **Basic Navgrah Abhishek**: ₹1,100\n2️⃣ **Navgrah Shanti Level 1**: ₹3,100\n3️⃣ **Navgrah Shanti Level 2**: ₹11,000\n\n📍 **Location**: Triveni Shani Mandir, Ujjain\nHarmonizes all 9 planetary energies in your Kundali.`
  },
  shani: {
    keywords: ['shani', 'saturn', 'sade sati', 'sadeshati', 'dhaiya'],
    text: `🪐 *Shani Sade Sati & Dhaiya Puja*\n\n💰 **Price**: ₹5,100 (1 Pandit) / ₹8,500 (5 Pandits - 23,000 Jaap)\n📍 **Location**: Triveni Shani Mandir, Ujjain\nProvides immense relief from Saturn transit challenges & debt.`
  },
  astrology: {
    keywords: ['astrology', 'kundali', 'jyotish', 'milan', 'horoscope', 'future', 'prediction'],
    text: `🔮 *Vedic Astrology Consultations*\n\n📜 **Kundali Analysis**: ₹1,100\n💑 **Horoscope Matching**: ₹801\n📅 **Yearly Prediction**: ₹1,501\n💼 **Career Consultation**: ₹1,100\n\nDirect phone/video call with senior Ujjain Jyotish Pandits.`
  },
  price: {
    keywords: ['price', 'cost', 'fee', 'charge', 'rate', 'package'],
    text: `💰 *Ujjain Puja Transparent Rates*\n\n• Rudrabhishek: ₹2,100\n• Kalsarp Dosh: ₹5,100\n• Navgrah Shanti: ₹3,100\n• Shani Sadeshati: ₹5,100\n• Online Rudrabhishek: ₹1,100\n• Kundali Analysis: ₹1,100\n\nAll rates include full Samagri, Pandit Dakshina & Prasad shipment.`
  },
  online: {
    keywords: ['online', 'video', 'live', 'zoom', 'whatsapp', 'home'],
    text: `📱 *Online Puja & Live Video Streaming*\n\nAttend your puja live via WhatsApp video or Zoom call from anywhere in the world (USA, UK, UAE, Canada, Australia).\nSacred Prasad is shipped directly to your address within 5-7 days.`
  }
};

export const AiChatbot: React.FC<AiChatbotProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      text: '🙏 **Jai Mahakal!** Namaste!\n\nI am **Mahakal Bot**, your digital Vedic assistant. How can I guide you today?\n\n• Book a Sacred Puja\n• Check Puja Prices\n• Online Live Stream\n• Kundali & Astrology',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = generateBotResponse(query.toLowerCase());
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const generateBotResponse = (lower: string): string => {
    if (lower.includes('book') || lower.includes('reserve') || lower.includes('slot')) {
      return `📅 **Quick Booking Guide**\n\nYou can click the **Book Now** button at any time to open the secure booking form with online/UPI payment & instant WhatsApp receipt!\n\nWould you like me to open the booking portal for you now?`;
    }

    for (const key in KNOWLEDGE) {
      if (KNOWLEDGE[key].keywords.some((kw) => lower.includes(kw))) {
        return KNOWLEDGE[key].text;
      }
    }

    if (lower.includes('hi') || lower.includes('hello') || lower.includes('namaste') || lower.includes('jai mahakal')) {
      return `🙏 **Jai Mahakal!** Welcome to Ujjain Puja. How may I assist you with your spiritual needs or rituals today?`;
    }

    return `🙏 **Jai Mahakal!**\n\nI am pleased to help! You can ask me about:\n• *Rudrabhishek Puja*\n• *Kalsarp or Mangal Dosh*\n• *Online Video Pujas*\n• *Kundali Analysis*\n\nOr click below to talk to our Pandit team on WhatsApp directly!`;
  };

  const quickChips = [
    { label: '🔱 Rudrabhishek', action: 'tell me about rudrabhishek' },
    { label: '🌺 Kalsarp Dosh', action: 'kalsarp dosh puja price' },
    { label: '⭐ Navgrah Puja', action: 'navgrah shanti details' },
    { label: '📱 Online Puja', action: 'how online puja works' },
    { label: '🔮 Kundali Reading', action: 'astrology consultation' },
    { label: '📿 Book Now', action: 'book' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-[#ffffff] border-2 border-[#f7ae62] rounded-3xl w-80 sm:w-96 h-[500px] shadow-2xl flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#5C3A1E] to-[#e07b39] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-xl">
                🕉️
              </div>
              <div>
                <h4 className="font-cinzel text-base font-bold leading-none">Mahakal Bot</h4>
                <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online • Ujjain Seva
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-xl font-bold w-7 h-7 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES CONTAINER */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#ffffff]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#f7ae62] text-white flex items-center justify-center text-xs shrink-0 mt-1">
                    🕉️
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#5C3A1E] to-[#e07b39] text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-[#2C1A0E]/10 text-[#2C1A0E] rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-white/70' : 'text-[#8B6F5E]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#5C3A1E] text-white flex items-center justify-center text-xs shrink-0 mt-1">
                    👤
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-[#8B6F5E] italic">
                <div className="w-7 h-7 rounded-full bg-[#f7ae62] text-white flex items-center justify-center text-xs">
                  🕉️
                </div>
                <div className="bg-white border border-[#2C1A0E]/10 px-3 py-2 rounded-2xl flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-[#e09040] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#e09040] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#e09040] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK CHIPS */}
          <div className="px-3 py-2 bg-[#ffffff] border-t border-[#2C1A0E]/10 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.label.includes('Book Now')) {
                    onOpenBooking();
                  } else {
                    handleSendMessage(chip.action);
                  }
                }}
                className="shrink-0 bg-white hover:bg-[#f7ae62] hover:text-[#5C3A1E] border border-[#f7ae62]/60 text-[#5C3A1E] text-[11px] font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* INPUT AREA */}
          <div className="p-3 bg-white border-t border-[#2C1A0E]/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Mahakal Bot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-[#ffffff] border border-[#2C1A0E]/10 focus:border-[#f7ae62] rounded-full px-3.5 py-2 text-xs text-[#2C1A0E] outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#f7ae62] to-[#e09040] text-[#5C3A1E] font-bold flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BOT BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f7ae62] to-[#e09040] text-2xl flex items-center justify-center shadow-xl border-2 border-white hover:scale-110 transition-transform cursor-pointer relative"
        title="Chat with AI Mahakal Bot"
      >
        🤖
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  );
};
