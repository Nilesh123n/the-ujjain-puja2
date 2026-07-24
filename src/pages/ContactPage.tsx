import React, { useState } from 'react';

interface ContactPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ showToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Puja Booking Enquiry');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [pref, setPref] = useState('whatsapp');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setIsSending(true);

    const waMsg = encodeURIComponent(
      `📩 *New Contact Enquiry from Website*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${phone}\n` +
      `📧 *Email:* ${email || 'N/A'}\n` +
      `🏙️ *City:* ${city || 'N/A'}\n` +
      `📋 *Subject:* ${subject}\n` +
      `💬 *Message:* ${message}\n` +
      `📱 *Preferred Contact:* ${pref}`
    );

    setTimeout(() => {
      setIsSending(false);
      showToast('Message sent! Connecting to WhatsApp coordinator...', 'success');
      window.open(`https://wa.me/919993540314?text=${waMsg}`, '_blank');

      setName('');
      setPhone('');
      setEmail('');
      setCity('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="pt-24 pb-20 animate-in fade-in duration-300">
      {/* PAGE HERO */}
      <section className="bg-[#C87A2F] text-white py-16 px-4 text-center border-b-2 border-[#B5460F]">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-[#FDF6EC] font-medium">
            <span>Home</span>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span>Contact Us</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold">📞 Get in Touch with Us</h1>
          <p className="text-sm sm:text-base text-[#FDF6EC]/90 max-w-xl mx-auto">
            Our temple coordinators & pandits are available 24/7 to answer your queries and organize your rituals.
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-12 bg-[#FDF6EC] border-b-2 border-[#C87A2F]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-[#F5E6D0] hover:border-[#25D366] rounded-3xl p-6 text-center shadow-md transition-all group">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#25D366] text-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200 group-hover:scale-110 transition-transform">
                <i className="fab fa-whatsapp"></i>
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#5C3A1E]">WhatsApp Us</h3>
              <p className="text-xs text-[#8B6F5E] my-1">Fastest response within minutes</p>
              <a href="https://wa.me/919993540314" target="_blank" rel="noreferrer" className="text-sm font-bold text-[#5C3A1E] block mb-3 hover:text-[#25D366]">
                +91 99935 40314
              </a>
              <a
                href="https://wa.me/919993540314"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#25D366] text-white font-bold text-xs px-5 py-2 rounded-full shadow-xs hover:bg-[#128C7E] transition-colors"
              >
                Chat Now
              </a>
            </div>

            <div className="bg-white border-2 border-[#F5E6D0] hover:border-[#B5460F] rounded-3xl p-6 text-center shadow-md transition-all group">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#B5460F] text-3xl flex items-center justify-center mx-auto mb-4 border border-amber-200 group-hover:scale-110 transition-transform">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#5C3A1E]">Call Directly</h3>
              <p className="text-xs text-[#8B6F5E] my-1">Mon - Sun: 6:00 AM - 10:00 PM</p>
              <a href="tel:+919993540314" className="text-sm font-bold text-[#5C3A1E] block mb-3 hover:text-[#B5460F]">
                +91 99935 40314
              </a>
              <a
                href="tel:+919993540314"
                className="inline-block bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-xs px-5 py-2 rounded-full shadow-xs"
              >
                Call Now
              </a>
            </div>

          <div className="bg-white border-2 border-[#F5E6D0] hover:border-blue-400 rounded-3xl p-6 text-center shadow-md transition-all group">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 text-3xl flex items-center justify-center mx-auto mb-4 border border-blue-200 group-hover:scale-110 transition-transform">
              <i className="fas fa-envelope"></i>
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#5C3A1E]">Email Us</h3>
            <p className="text-xs text-[#8B6F5E] my-1">Detailed queries & receipt requests</p>
            <a href="mailto:hello@theujjainpuja.com" className="text-xs font-bold text-[#5C3A1E] block mb-3 hover:text-blue-600">
              hello@theujjainpuja.com
            </a>
            <a
              href="mailto:hello@theujjainpuja.com"
              className="inline-block bg-blue-600 text-white font-bold text-xs px-5 py-2 rounded-full shadow-xs"
            >
              Send Email
            </a>
          </div>

          <div className="bg-white border-2 border-[#F5E6D0] hover:border-rose-400 rounded-3xl p-6 text-center shadow-md transition-all group">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 text-3xl flex items-center justify-center mx-auto mb-4 border border-rose-200 group-hover:scale-110 transition-transform">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3 className="font-cinzel text-base font-bold text-[#5C3A1E]">Visit Temple</h3>
            <p className="text-xs text-[#8B6F5E] my-1">Pardeshwar Mahadev, Ujjain MP</p>
            <span className="text-[11px] font-medium text-[#5C3A1E] block mb-3">
              Near Mahakaleshwar Jyotirlinga
            </span>
            <a
              href="https://maps.google.com/?q=Pardeshwar+Mahadev+Mandir+Ujjain"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-rose-600 text-white font-bold text-xs px-5 py-2 rounded-full shadow-xs"
            >
              Directions
            </a>
          </div>
        </div>
      </div>
    </section>

      {/* MAIN CONTACT SECTION & FORM */}
      <section className="py-12 bg-[#C87A2F] border-b-2 border-[#B5460F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SUPPORT HOURS & SOCIAL */}
            <div className="lg:col-span-5 space-y-6 text-[#5C3A1E]">
              <div className="bg-[#FDF6EC] border-2 border-[#B5460F] rounded-3xl p-6 shadow-md">
                <h3 className="font-cinzel text-xl font-bold text-[#5C3A1E] mb-4 flex items-center gap-2">
                  <i className="fas fa-clock text-[#B5460F]"></i> Temple & Seva Timings
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-[#F5E6D0]">
                    <span className="font-semibold text-[#5C3A1E]">🌅 Morning Rituals</span>
                    <span className="text-[#8B6F5E]">6:00 AM – 12:00 PM</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Open</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-[#F5E6D0]">
                    <span className="font-semibold text-[#5C3A1E]">☀️ Afternoon Seva</span>
                    <span className="text-[#8B6F5E]">12:00 PM – 4:00 PM</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Open</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-[#F5E6D0]">
                    <span className="font-semibold text-[#5C3A1E]">🌆 Evening Aarti & Jap</span>
                    <span className="text-[#8B6F5E]">4:00 PM – 10:00 PM</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Open</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-[#F5E6D0]">
                    <span className="font-semibold text-[#5C3A1E]">📱 WhatsApp Support</span>
                    <span className="text-[#8B6F5E]">24 Hours / 7 Days</span>
                    <span className="bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Always Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FDF6EC] border-2 border-[#B5460F] rounded-3xl p-6 shadow-md">
                <h4 className="font-cinzel text-lg font-bold text-[#5C3A1E] mb-2">🚗 How to Reach Ujjain</h4>
                <ul className="text-xs text-[#5C3A1E]/90 space-y-2 leading-relaxed">
                  <li>• <strong>By Train:</strong> Ujjain Junction (UJN) is well connected nationwide. Temple is 3 km from station.</li>
                  <li>• <strong>By Air:</strong> Nearest airport is Indore Devi Ahilya Bai Holkar Airport (IDR), 55 km via expressway.</li>
                  <li>• <strong>By Road:</strong> Direct cabs and MP State luxury buses available from Indore, Bhopal, Ahmedabad.</li>
                </ul>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="lg:col-span-7 bg-[#FDF6EC] border-2 border-[#B5460F] rounded-3xl p-6 sm:p-8 shadow-xl text-[#5C3A1E]">
              <h3 className="font-cinzel text-2xl font-bold text-[#5C3A1E] mb-1">✉️ Send Message to Pandit Team</h3>
              <p className="text-xs text-[#8B6F5E] mb-6">
                Fill details below. Our temple coordinator will review your request and get back to you immediately.
              </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FDF6EC] border-2 border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-[#FDF6EC] border-2 border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FDF6EC] border-2 border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Your City / Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Indore, Delhi, USA"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FDF6EC] border-2 border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FDF6EC] border-2 border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] font-semibold outline-none"
                >
                  <option value="Puja Booking Enquiry">🪔 Puja Booking Enquiry</option>
                  <option value="Astrology Consultation">🔮 Astrology & Kundali</option>
                  <option value="Online Video Stream">📱 Online Puja Stream Query</option>
                  <option value="Prasad Shipment Track">📦 Prasad Delivery Status</option>
                  <option value="Custom Ritual Request">🔱 Custom Grand Anushthan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our pandit team assist you? Mention dates, gotra or specific questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FDF6EC] border-2 border-[#F5E6D0] focus:border-[#f7ae62] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1A0E] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3A1E] uppercase mb-1.5">Preferred Contact Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-[#5C3A1E] font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="contactPref"
                      value="whatsapp"
                      checked={pref === 'whatsapp'}
                      onChange={() => setPref('whatsapp')}
                    />
                    <i className="fab fa-whatsapp text-[#25D366]"></i> WhatsApp
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C3A1E] font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="contactPref"
                      value="call"
                      checked={pref === 'call'}
                      onChange={() => setPref('call')}
                    />
                    <i className="fas fa-phone-alt text-[#e09040]"></i> Phone Call
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#5C3A1E] font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="contactPref"
                      value="email"
                      checked={pref === 'email'}
                      onChange={() => setPref('email')}
                    />
                    <i className="fas fa-envelope text-blue-600"></i> Email
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#B5460F] hover:bg-[#8E350A] text-white font-bold text-sm py-3.5 rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending Message...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Message to Panditji
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

      {/* MAP PLACEHOLDER / MAP CONTAINER */}
      <section className="py-12 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white border-2 border-[#B5460F] rounded-3xl overflow-hidden shadow-lg">
            <div className="p-4 bg-[#F5E6D0] border-b border-[#f7ae62]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#5C3A1E]">
                <i className="fas fa-map-marked-alt text-[#e09040]"></i> Pardeshwar Mahadev Mandir & Triveni Shani Mandir Location
              </div>
              <a
                href="https://maps.google.com/?q=Mahakaleshwar+Jyotirlinga+Ujjain"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#e09040] hover:underline"
              >
                Open Google Maps ↗
              </a>
            </div>
            <div className="h-80 w-full bg-amber-50 relative flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.3824565896705!2d75.76795!3d23.18264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963700084f71bc5%3A0x5ab49b1da21c6012!2sMahakaleshwar%20Jyotirlinga!5e0!3m2!1sen!2sin!4v1698000000000"
                className="w-full h-full border-0"
                loading="lazy"
                title="Ujjain Temple Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
