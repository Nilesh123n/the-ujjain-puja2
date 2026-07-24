import React, { useState } from 'react';
import { Puja } from '../types';
import { PUJA_DATA } from '../data/pujaData';

interface AiRecommendationProps {
  onSelectPuja: (puja: Puja) => void;
}

export const AiRecommendation: React.FC<AiRecommendationProps> = ({ onSelectPuja }) => {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [dosh, setDosh] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Puja[]>([]);

  const handleSelectOption = (stepNum: number, value: string) => {
    if (stepNum === 1) {
      setPurpose(value);
      setStep(2);
    } else if (stepNum === 2) {
      setDosh(value);
      setStep(3);
    } else if (stepNum === 3) {
      setBudget(value);
      setStep(4); // Result step
      calculateRecommendations(purpose, dosh, value);
    }
  };

  const calculateRecommendations = (pVal: string, dVal: string, bVal: string) => {
    setIsLoading(true);

    setTimeout(() => {
      let result: Puja[] = [];

      // DOSH LOGIC
      if (dVal === 'kalsarpa') {
        result.push(...PUJA_DATA.filter((p) => p.id === 5 || p.id === 25));
      } else if (dVal === 'mangal') {
        result.push(...PUJA_DATA.filter((p) => p.id === 6 || p.id === 17));
      } else if (dVal === 'pitra') {
        result.push(...PUJA_DATA.filter((p) => p.id === 7));
      } else if (dVal === 'shani') {
        result.push(...PUJA_DATA.filter((p) => p.id === 11 || p.id === 12));
      }

      // PURPOSE LOGIC
      if (pVal === 'health') {
        result.push(...PUJA_DATA.filter((p) => p.id === 4 || p.id === 1));
      } else if (pVal === 'wealth') {
        result.push(...PUJA_DATA.filter((p) => p.id === 15 || p.id === 2 || p.id === 1));
      } else if (pVal === 'marriage') {
        result.push(...PUJA_DATA.filter((p) => p.id === 6 || p.id === 18 || p.id === 21));
      } else if (pVal === 'education') {
        result.push(...PUJA_DATA.filter((p) => p.id === 15 || p.id === 16));
      } else if (pVal === 'peace') {
        result.push(...PUJA_DATA.filter((p) => p.id === 1 || p.id === 8 || p.id === 14));
      } else if (pVal === 'protection') {
        result.push(...PUJA_DATA.filter((p) => p.id === 1 || p.id === 4 || p.id === 19));
      }

      // BUDGET FILTER
      let maxPrice = 999999;
      if (bVal === 'basic') maxPrice = 5100;
      else if (bVal === 'standard') maxPrice = 15000;
      else if (bVal === 'premium') maxPrice = 51000;

      result = result.filter((p) => p.price <= maxPrice);

      // Unique deduplication
      const seen = new Set<number>();
      result = result.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      // Fallback if none found
      if (result.length === 0) {
        result = PUJA_DATA.filter((p) => p.popular && p.price <= maxPrice).slice(0, 3);
      }

      setRecommendations(result.slice(0, 3));
      setIsLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setPurpose('');
    setDosh('');
    setBudget('');
    setRecommendations([]);
  };

  return (
    <section id="ai-section" className="py-20 bg-[#C87A2F] text-white border-y-2 border-[#B5460F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-10">
          <span className="inline-block bg-[#FDF6EC] border border-[#B5460F] text-[#B5460F] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
            🤖 AI Powered Recommendation
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white">
            AI Puja Recommender
          </h2>
          <p className="text-sm text-[#FDF6EC]/90 mt-2 max-w-md mx-auto">
            Answer 3 quick questions — our intelligent algorithm will match the ideal Vedic ritual for your unique planetary needs & goals.
          </p>
        </div>

        {/* AI CARD */}
        <div className="bg-[#FDF6EC] border-2 border-[#B5460F] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-[#5C3A1E]">
          {/* STEP INDICATORS */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 max-w-md mx-auto">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                step >= 1
                  ? 'bg-[#B5460F] text-white border-[#B5460F] shadow-md'
                  : 'bg-[#F5E6D0] text-[#8B6F5E] border-transparent'
              }`}
            >
              1
            </div>
            <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#B5460F]' : 'bg-[#F5E6D0]'}`} />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                step >= 2
                  ? 'bg-[#B5460F] text-white border-[#B5460F] shadow-md'
                  : 'bg-[#F5E6D0] text-[#8B6F5E] border-transparent'
              }`}
            >
              2
            </div>
            <div className={`h-1 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#B5460F]' : 'bg-[#F5E6D0]'}`} />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                step >= 3
                  ? 'bg-[#B5460F] text-white border-[#B5460F] shadow-md'
                  : 'bg-[#F5E6D0] text-[#8B6F5E] border-transparent'
              }`}
            >
              3
            </div>
          </div>

          {/* STEP 1: PURPOSE */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#5C3A1E] text-center mb-6">
                What is your primary intent or purpose for seeking a Puja?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'health', icon: 'fas fa-heartbeat', label: 'Health & Wellbeing' },
                  { id: 'wealth', icon: 'fas fa-coins', label: 'Wealth & Prosperity' },
                  { id: 'marriage', icon: 'fas fa-ring', label: 'Marriage & Relations' },
                  { id: 'education', icon: 'fas fa-graduation-cap', label: 'Career & Education' },
                  { id: 'peace', icon: 'fas fa-peace', label: 'Peace & Mental Calm' },
                  { id: 'protection', icon: 'fas fa-shield-alt', label: 'Protection & Safety' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(1, opt.id)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#FDF6EC] border-2 border-[#F5E6D0] hover:border-[#f7ae62] hover:bg-[#F5E6D0] transition-all text-left font-medium text-sm text-[#5C3A1E] cursor-pointer group"
                  >
                    <i className={`${opt.icon} text-lg text-[#e09040] group-hover:scale-110 transition-transform`}></i>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DOSH */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#5C3A1E] text-center mb-6">
                Any specific planetary affliction or Dosh in Kundali?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'kalsarpa', icon: 'fas fa-infinity', label: 'Kalsarpa Dosh' },
                  { id: 'mangal', icon: 'fas fa-fire', label: 'Mangal Dosh / Mangalik' },
                  { id: 'pitra', icon: 'fas fa-users', label: 'Pitra Dosh (Ancestral)' },
                  { id: 'shani', icon: 'fas fa-circle', label: 'Shani Sade Sati / Dhaiya' },
                  { id: 'general', icon: 'fas fa-star', label: 'General Blessings' },
                  { id: 'none', icon: 'fas fa-question-circle', label: 'Not Sure (Guide Me)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(2, opt.id)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#FDF6EC] border-2 border-[#F5E6D0] hover:border-[#f7ae62] hover:bg-[#F5E6D0] transition-all text-left font-medium text-sm text-[#5C3A1E] cursor-pointer group"
                  >
                    <i className={`${opt.icon} text-lg text-[#e09040] group-hover:scale-110 transition-transform`}></i>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#5C3A1E] text-center mb-6">
                Select your comfortable budget preference?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {[
                  { id: 'basic', icon: 'fas fa-rupee-sign', label: 'Essential (₹1,100 – ₹5,100)' },
                  { id: 'standard', icon: 'fas fa-gem', label: 'Standard (₹5,101 – ₹15,000)' },
                  { id: 'premium', icon: 'fas fa-crown', label: 'Grand Anushthan (₹15,000 – ₹51,000)' },
                  { id: 'grand', icon: 'fas fa-award', label: 'Supreme Ritual (₹51,001+)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(3, opt.id)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#FDF6EC] border-2 border-[#F5E6D0] hover:border-[#f7ae62] hover:bg-[#F5E6D0] transition-all text-left font-medium text-sm text-[#5C3A1E] cursor-pointer group"
                  >
                    <i className={`${opt.icon} text-lg text-[#e09040] group-hover:scale-110 transition-transform`}></i>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RESULT */}
          {step === 4 && (
            <div className="animate-in fade-in duration-300">
              {isLoading ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="spinner"></div>
                  <p className="font-cinzel text-lg font-bold text-[#5C3A1E]">
                    AI is analyzing your horoscopic requirements...
                  </p>
                  <p className="text-xs text-[#8B6F5E]">Matching Vedic mantras, vidhi & location in Ujjain</p>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="font-cinzel text-xl font-bold text-[#5C3A1E] flex items-center justify-center gap-2">
                      <span>✨</span> AI Recommended Pujas for You
                    </h3>
                    <p className="text-xs text-[#8B6F5E] mt-1">
                      Based on your preferences ({purpose || 'Intent'}, {dosh || 'Dosh'}, {budget || 'Budget'})
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {recommendations.map((puja) => (
                      <div
                        key={puja.id}
                        className="bg-[#FDF6EC] border-2 border-[#f7ae62] rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all transform hover:-translate-y-1"
                      >
                        <div>
                          <div className="text-3xl mb-2 text-center">{puja.emoji}</div>
                          <h4 className="font-cinzel font-bold text-sm text-[#5C3A1E] mb-1 leading-tight text-center">
                            {puja.name}
                          </h4>
                          <p className="text-[11px] text-[#8B6F5E] mb-3 line-clamp-2 text-center">
                            {puja.description}
                          </p>
                        </div>
                        <div>
                          <div className="font-cinzel font-bold text-base text-[#e09040] text-center mb-3">
                            {puja.priceDisplay}
                          </div>
                          <button
                            onClick={() => onSelectPuja(puja)}
                            className="w-full bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            Book This Puja
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleReset}
                      className="bg-transparent border-2 border-[#f7ae62] text-[#5C3A1E] font-semibold text-xs px-6 py-2.5 rounded-full hover:bg-[#f7ae62] transition-colors cursor-pointer"
                    >
                      🔄 Reset & Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
