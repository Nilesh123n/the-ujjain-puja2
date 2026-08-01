import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Plus, 
  User, 
  Phone, 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  RefreshCw,
  Home,
  Settings,
  X,
  Image as ImageIcon,
  Upload,
  Edit3,
  Trash2,
  Save,
  RotateCcw,
  Layout,
  FileImage,
  Check
} from 'lucide-react';
import { BookingData, Puja } from '../types';
import { useCustomization } from '../context/CustomizationContext';

interface SecretAdminPortalProps {
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  onGoHome: () => void;
}

// Initial Mock Bookings for Admin Portal Demo
const MOCK_ADMIN_BOOKINGS: BookingData[] = [
  {
    bookingId: 'MPJ-98241',
    pujaId: 1,
    pujaName: 'Maha Rudrabhishek Puja in Mahakaleshwar',
    pujaPrice: 3500,
    priceDisplay: '₹3,500',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@gmail.com',
    pujaDate: '2026-08-05',
    pujaType: 'In-Person (Ujjain Temple)',
    city: 'Indore',
    gotra: 'Kashyap',
    rashi: 'Mesh (Aries)',
    wishes: 'Family health and business prosperity',
    paymentMethod: 'Razorpay / UPI',
    paymentId: 'pay_Pkj982310x',
    paymentStatus: 'SUCCESS',
    timestamp: '2026-07-30 14:22'
  },
  {
    bookingId: 'MPJ-98242',
    pujaId: 2,
    pujaName: 'Kaal Sarp Dosh Shanti Puja (Ram Ghat)',
    pujaPrice: 4200,
    priceDisplay: '₹4,200',
    fullName: 'Priya Verma',
    phone: '+91 91234 56789',
    email: 'priya.v@yahoo.com',
    pujaDate: '2026-08-08',
    pujaType: 'Live Online Video Puja + Prasad Home Delivery',
    city: 'Delhi',
    gotra: 'Bhardwaj',
    rashi: 'Kanya (Virgo)',
    wishes: 'Career stability and removing career obstacles',
    paymentMethod: 'UPI Direct Scan',
    paymentId: 'upi_txn_776120491',
    paymentStatus: 'SUCCESS',
    timestamp: '2026-07-30 18:45'
  },
  {
    bookingId: 'MPJ-98243',
    pujaId: 3,
    pujaName: 'Mangal Dosh Shanti Bhaat Puja (Mangalnath)',
    pujaPrice: 3100,
    priceDisplay: '₹3,100',
    fullName: 'Amitabh Mishra',
    phone: '+91 94150 99887',
    email: 'amitabh.mishra@outlook.com',
    pujaDate: '2026-08-10',
    pujaType: 'In-Person (Ujjain Temple)',
    city: 'Bhopal',
    gotra: 'Vashistha',
    rashi: 'Vrishabh (Taurus)',
    wishes: 'Marriage proposal success and peace',
    paymentMethod: 'Cash / Pending Verification',
    paymentId: 'pending_offline',
    paymentStatus: 'PENDING',
    timestamp: '2026-07-31 09:10'
  }
];

export const SecretAdminPortal: React.FC<SecretAdminPortalProps> = ({ showToast, onGoHome }) => {
  const { 
    heroContent, 
    updateHeroContent, 
    pujas, 
    updatePuja, 
    addPuja, 
    deletePuja, 
    resetToDefaults 
  } = useCustomization();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [pinInput, setPinInput] = useState<string>('');
  const [storedPin, setStoredPin] = useState<string>(() => {
    return localStorage.getItem('admin_pin') || '7777';
  });

  const [loginError, setLoginError] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);

  // Admin Portal Navigation Tabs
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'hero' | 'pujas' | 'pandits' | 'settings'>('bookings');
  
  // Bookings State
  const [bookings, setBookings] = useState<BookingData[]>(() => {
    const saved = localStorage.getItem('admin_bookings_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_ADMIN_BOOKINGS;
      }
    }
    return MOCK_ADMIN_BOOKINGS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  
  // New Booking Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newBookingName, setNewBookingName] = useState('');
  const [newBookingPhone, setNewBookingPhone] = useState('');
  const [newBookingPujaId, setNewBookingPujaId] = useState<number>(1);
  const [newBookingDate, setNewBookingDate] = useState('');
  const [newBookingGotra, setNewBookingGotra] = useState('');

  // Hero Section Form State
  const [heroTitle1, setHeroTitle1] = useState(heroContent.title1);
  const [heroTitle2, setHeroTitle2] = useState(heroContent.title2);
  const [heroDesc, setHeroDesc] = useState(heroContent.description);
  const [heroBadge, setHeroBadge] = useState(heroContent.badge);
  const [heroBgImage, setHeroBgImage] = useState(heroContent.bgImage);

  // Sync state if context changes externally
  useEffect(() => {
    setHeroTitle1(heroContent.title1);
    setHeroTitle2(heroContent.title2);
    setHeroDesc(heroContent.description);
    setHeroBadge(heroContent.badge);
    setHeroBgImage(heroContent.bgImage);
  }, [heroContent]);

  // Puja Cards Editing State
  const [editingPuja, setEditingPuja] = useState<Puja | null>(null);
  const [pujaSearch, setPujaSearch] = useState<string>('');
  const [isAddPujaModalOpen, setIsAddPujaModalOpen] = useState<boolean>(false);

  // New Puja Card State
  const [newPujaTitle, setNewPujaTitle] = useState('');
  const [newPujaTitleHi, setNewPujaTitleHi] = useState('');
  const [newPujaPrice, setNewPujaPrice] = useState<number>(2100);
  const [newPujaPriceDisplay, setNewPujaPriceDisplay] = useState('₹2,100');
  const [newPujaCategory, setNewPujaCategory] = useState('rudra');
  const [newPujaLocation, setNewPujaLocation] = useState('Pardeshwar Mahadev Mandir, Ujjain');
  const [newPujaDuration, setNewPujaDuration] = useState('2-3 Hours');
  const [newPujaDescription, setNewPujaDescription] = useState('');
  const [newPujaImage, setNewPujaImage] = useState('https://images.unsplash.com/photo-1609619385002-f40f1df5e9e2?w=800&q=80');

  // Change PIN State
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  // Sync bookings to localStorage
  useEffect(() => {
    localStorage.setItem('admin_bookings_data', JSON.stringify(bookings));
  }, [bookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === storedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
      showToast('🔑 Welcome to Ujjain Puja Secret Admin Portal', 'success');
    } else {
      setLoginError('Incorrect Security PIN. Please try again.');
      showToast('❌ Invalid Security PIN', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPinInput('');
    showToast('🔒 Logged out of Admin Portal', 'info');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPinInput !== storedPin) {
      showToast('❌ Existing PIN is incorrect', 'error');
      return;
    }
    if (newPinInput.length < 4) {
      showToast('❌ New PIN must be at least 4 digits', 'error');
      return;
    }
    setStoredPin(newPinInput);
    localStorage.setItem('admin_pin', newPinInput);
    setOldPinInput('');
    setNewPinInput('');
    showToast('✅ Security PIN updated successfully', 'success');
  };

  // HELPER TO VALIDATE IMAGE FILE SIZE (MIN 100KB, MAX 10MB) AND ASPECT RATIO (16:9, 4:3 SUPPORT)
  const validateAndProcessImageFile = (
    file: File,
    onSuccess: (base64: string, info: { ext: string; width: number; height: number; ratioStr: string }) => void
  ) => {
    // 1. Minimum 100KB check (100 * 1024 bytes)
    if (file.size < 100 * 1024) {
      const kb = (file.size / 1024).toFixed(1);
      showToast(`⚠️ File size is too small (${kb} KB). Minimum 100 KB required!`, 'error');
      return;
    }

    // 2. Maximum 10MB check (10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      showToast(`⚠️ File size is too large (${mb} MB). Maximum 10 MB allowed!`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      if (!base64Str) return;

      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = width / height;

        let ratioStr = `${width}x${height}`;
        if (Math.abs(ratio - 16 / 9) < 0.15) {
          ratioStr = `16:9 (${width}x${height})`;
        } else if (Math.abs(ratio - 4 / 3) < 0.15) {
          ratioStr = `4:3 (${width}x${height})`;
        } else if (Math.abs(ratio - 1) < 0.12) {
          ratioStr = `1:1 Square (${width}x${height})`;
        }

        const ext = file.name.split('.').pop()?.toUpperCase() || 'PNG/JPG';
        onSuccess(base64Str, { ext, width, height, ratioStr });
      };
      img.onerror = () => {
        showToast('⚠️ Failed to load image file. Please select a valid PNG or JPG file.', 'error');
      };
    };
    reader.readAsDataURL(file);
  };

  // HERO SECTION FILE PICKER HANDLER
  const handleHeroImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessImageFile(file, (base64Str, info) => {
        setHeroBgImage(base64Str);
        showToast(`🖼️ ${info.ext} Image loaded! Aspect Ratio: ${info.ratioStr}. Click "Save Hero Changes" to apply.`, 'success');
      });
    }
  };

  const handleSaveHeroForm = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent({
      title1: heroTitle1,
      title2: heroTitle2,
      description: heroDesc,
      badge: heroBadge,
      bgImage: heroBgImage
    });
    showToast('✨ Hero Section updated and reflected live on Home Page!', 'success');
  };

  // EDIT PUJA CARD FILE PICKER HANDLER
  const handleEditPujaImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPuja) {
      validateAndProcessImageFile(file, (base64Str, info) => {
        setEditingPuja({ ...editingPuja, image: base64Str });
        showToast(`🖼️ ${info.ext} Image loaded! Aspect Ratio: ${info.ratioStr}.`, 'success');
      });
    }
  };

  // NEW PUJA CARD FILE PICKER HANDLER
  const handleNewPujaImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessImageFile(file, (base64Str, info) => {
        setNewPujaImage(base64Str);
        showToast(`🖼️ ${info.ext} Image loaded! Aspect Ratio: ${info.ratioStr}.`, 'success');
      });
    }
  };

  const handleSavePujaCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPuja) return;
    updatePuja(editingPuja);
    setEditingPuja(null);
    showToast(`✅ "${editingPuja.name}" updated successfully!`, 'success');
  };

  const handleCreateNewPuja = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPujaTitle.trim()) {
      showToast('❌ Please enter a valid puja title', 'error');
      return;
    }
    const createdPuja: Puja = {
      id: Date.now(),
      name: newPujaTitle,
      nameHi: newPujaTitleHi || newPujaTitle,
      price: newPujaPrice,
      priceDisplay: newPujaPriceDisplay || `₹${newPujaPrice.toLocaleString('en-IN')}`,
      category: newPujaCategory,
      location: newPujaLocation,
      pandits: '1-2 Pandits',
      duration: newPujaDuration,
      popular: true,
      description: newPujaDescription || 'Authentic Vedic Puja performed by experienced Acharyas in Ujjain.',
      descriptionHi: 'उज्जैन के सिद्ध पीठ पर अनुभवी वैदिक विद्वानों द्वारा विधिपूर्वक पूजन।',
      longDesc: 'Complete Vedic ritual performed according to classical scriptures with sankalp and holy prasad delivery.',
      includes: ['Per person with Puja material', 'Pandit Seva', 'Sankalp & Samagri', 'Prasad Delivery'],
      benefits: ['Spiritual harmony', 'Divine Mahakal grace', 'Obstacle removal'],
      benefitsHi: ['आत्मिक व मानसिक शांति', 'भगवान महाकाल की विशेष कृपा'],
      image: newPujaImage,
      tag: 'New Seva'
    };

    addPuja(createdPuja);
    setIsAddPujaModalOpen(false);
    setNewPujaTitle('');
    setNewPujaTitleHi('');
    setNewPujaDescription('');
    showToast(`✨ Created new Puja card: "${createdPuja.name}"!`, 'success');
  };

  const handleDeletePujaCard = (pujaId: number, pujaName: string) => {
    if (window.confirm(`Are you sure you want to delete "${pujaName}"?`)) {
      deletePuja(pujaId);
      showToast(`🗑️ Deleted "${pujaName}"`, 'info');
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: 'SUCCESS' | 'PENDING' | 'FAILED') => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, paymentStatus: newStatus } : b))
    );
    showToast(`Updated status of ${bookingId} to ${newStatus}`, 'success');
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const puja = pujas.find((p) => p.id === Number(newBookingPujaId)) || pujas[0];
    const newEntry: BookingData = {
      bookingId: 'MPJ-' + Math.floor(10000 + Math.random() * 90000),
      pujaId: puja.id,
      pujaName: puja.name,
      pujaPrice: puja.price,
      priceDisplay: puja.priceDisplay,
      fullName: newBookingName,
      phone: newBookingPhone,
      email: `${newBookingName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      pujaDate: newBookingDate || new Date().toISOString().split('T')[0],
      pujaType: 'In-Person (Ujjain Temple)',
      city: 'Ujjain Walk-in',
      gotra: newBookingGotra || 'Kashyap',
      paymentMethod: 'Cash / Offline',
      paymentId: 'cash_' + Date.now().toString().slice(-6),
      paymentStatus: 'SUCCESS',
      timestamp: new Date().toLocaleString('en-IN')
    };

    setBookings((prev) => [newEntry, ...prev]);
    setIsAddModalOpen(false);
    setNewBookingName('');
    setNewBookingPhone('');
    setNewBookingGotra('');
    setNewBookingDate('');
    showToast(`✅ Booking created for ${newBookingName}!`, 'success');
  };

  const handleSendWhatsAppNotice = (booking: BookingData) => {
    const text = encodeURIComponent(
      `🙏 *MAHAKAL UJJAIN PUJA CONFIRMATION*\n━━━━━━━━━━━━━━━━━━━━\n🪔 *Booking ID:* ${booking.bookingId}\n👤 *Devotee:* ${booking.fullName}\n🌺 *Puja:* ${booking.pujaName}\n📅 *Date:* ${booking.pujaDate}\n📍 *Type:* ${booking.pujaType}\n💰 *Status:* ${booking.paymentStatus}\n━━━━━━━━━━━━━━━━━━━━\nYour puja arrangements in Ujjain are successfully coordinated. Jai Mahakal!`
    );
    const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.pujaName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredPujasForAdmin = pujas.filter((p) =>
    p.name.toLowerCase().includes(pujaSearch.toLowerCase()) ||
    (p.nameHi && p.nameHi.toLowerCase().includes(pujaSearch.toLowerCase())) ||
    p.category.toLowerCase().includes(pujaSearch.toLowerCase())
  );

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'SUCCESS')
    .reduce((acc, curr) => acc + (curr.pujaPrice || 0), 0);

  // If NOT Authenticated -> Show Secret PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C1A0E] via-[#3d2413] to-[#1a0f08] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2C1A0E]/90 border-2 border-[#f2b705]/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
          {/* Top Decorative Banner */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#f2b705]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#f2b705]/20 border-2 border-[#f2b705] rounded-2xl flex items-center justify-center mx-auto text-[#f2b705] shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-cinzel text-2xl font-bold text-[#f2b705]">Secret Admin Portal</h1>
            <p className="text-xs text-amber-200/80">
              Authorized access only. Enter security PIN to unlock Mahakal Puja Seva management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200/90 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#f2b705]" /> Enter Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Enter 4-digit PIN..."
                  className="w-full bg-black/40 border border-[#f2b705]/30 focus:border-[#f2b705] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-300/70 hover:text-amber-200 px-2 py-1"
                >
                  {showPin ? 'Hide' : 'Show'}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-red-400 font-medium flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#f2b705] to-[#ff5c00] text-[#2C1A0E] font-bold text-sm py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Unlock Admin Portal
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f2b705]/10 border border-[#f2b705]/20 rounded-full text-[11px] text-[#f2b705]">
              <span>💡 Default PIN:</span>
              <strong className="font-mono text-white">{storedPin}</strong>
            </div>

            <button
              onClick={onGoHome}
              className="block w-full text-center text-xs text-amber-300/70 hover:text-white transition-colors pt-1"
            >
              ← Return to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1A0E]">
      {/* ADMIN HEADER */}
      <header className="bg-[#2C1A0E] text-white border-b-2 border-[#f2b705] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f2b705] text-[#2C1A0E] rounded-xl flex items-center justify-center font-bold font-cinzel text-xl shadow-md">
              🔱
            </div>
            <div>
              <h1 className="font-cinzel text-lg font-bold text-[#f2b705] flex items-center gap-2">
                Mahakal Puja Admin <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans font-normal">Live Editor</span>
              </h1>
              <p className="text-xs text-amber-200/70">Content, Images, Prices & Devotee Bookings Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#ff5c00] hover:bg-[#e05200] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Booking
            </button>

            <button
              onClick={onGoHome}
              className="bg-white/10 hover:bg-white/20 text-amber-200 text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              title="View Public Site"
            >
              <Home className="w-4 h-4" /> View Site
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-950/80 hover:bg-red-900 border border-red-500/30 text-red-200 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Lock Portal
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-[#f2b705]/40 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#2C1A0E]/60 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-2xl font-black text-[#2C1A0E] mt-1">{bookings.length}</h3>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">All time records</p>
            </div>
            <div className="w-12 h-12 bg-[#f2b705]/15 text-[#2C1A0E] rounded-xl flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#2C1A0E]/60 uppercase tracking-wider">Active Pujas</p>
              <h3 className="text-2xl font-black text-emerald-800 mt-1">{pujas.length} Offerings</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Editable in real-time</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border-2 border-amber-500/30 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#2C1A0E]/60 uppercase tracking-wider">Confirmed Revenue</p>
              <h3 className="text-2xl font-black text-amber-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
              <p className="text-[11px] text-amber-700 font-medium mt-1">Verified payments</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#2C1A0E]/20 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#2C1A0E]/60 uppercase tracking-wider">Hero Banner</p>
              <h3 className="text-2xl font-black text-[#2C1A0E] mt-1">Custom Bg</h3>
              <p className="text-[11px] text-indigo-700 font-medium mt-1">File upload ready</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-800 rounded-xl flex items-center justify-center font-bold">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-[#2C1A0E]/15 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveAdminTab('bookings')}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeAdminTab === 'bookings'
                ? 'bg-[#2C1A0E] text-[#f2b705] shadow-md'
                : 'bg-white/60 text-[#2C1A0E] hover:bg-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Devotee Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('hero')}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeAdminTab === 'hero'
                ? 'bg-[#2C1A0E] text-[#f2b705] shadow-md'
                : 'bg-white/60 text-[#2C1A0E] hover:bg-white'
            }`}
          >
            <Layout className="w-4 h-4" /> Hero Section & Image Editor
          </button>

          <button
            onClick={() => setActiveAdminTab('pujas')}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeAdminTab === 'pujas'
                ? 'bg-[#2C1A0E] text-[#f2b705] shadow-md'
                : 'bg-white/60 text-[#2C1A0E] hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Puja Cards & Prices ({pujas.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('pandits')}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeAdminTab === 'pandits'
                ? 'bg-[#2C1A0E] text-[#f2b705] shadow-md'
                : 'bg-white/60 text-[#2C1A0E] hover:bg-white'
            }`}
          >
            <User className="w-4 h-4" /> Pandit Roster
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeAdminTab === 'settings'
                ? 'bg-[#2C1A0E] text-[#f2b705] shadow-md'
                : 'bg-white/60 text-[#2C1A0E] hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings & Reset
          </button>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeAdminTab === 'bookings' && (
          <div className="bg-white border-2 border-[#2C1A0E]/10 rounded-2xl p-6 shadow-sm space-y-5">
            {/* SEARCH & FILTERS BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by devotee name, booking ID, phone, or puja..."
                  className="w-full bg-[#FAF8F5] border border-gray-300 focus:border-[#2C1A0E] rounded-xl pl-10 pr-4 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-[#2C1A0E]/70">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESS">Confirmed / SUCCESS</option>
                  <option value="PENDING">Pending Verification</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>

            {/* TABLE OF BOOKINGS */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2C1A0E] text-[#f2b705] font-semibold">
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Devotee Details</th>
                    <th className="p-3">Puja Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500 font-medium">
                        No bookings match your current search or status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.bookingId} className="hover:bg-amber-50/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#2C1A0E]">
                          {booking.bookingId}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-[#2C1A0E]">{booking.fullName}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-amber-700" /> {booking.phone}
                          </div>
                          {booking.gotra && (
                            <div className="text-[10px] text-amber-800 font-medium">Gotra: {booking.gotra}</div>
                          )}
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="font-medium text-gray-800 line-clamp-1">{booking.pujaName}</span>
                          <span className="text-[10px] text-gray-500 block">{booking.pujaType}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap font-medium text-gray-700">
                          {booking.pujaDate}
                        </td>
                        <td className="p-3 font-bold text-[#2C1A0E] whitespace-nowrap">
                          {booking.priceDisplay || `₹${booking.pujaPrice}`}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <select
                            value={booking.paymentStatus || 'PENDING'}
                            onChange={(e) =>
                              handleStatusChange(booking.bookingId, e.target.value as any)
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border outline-none cursor-pointer ${
                              booking.paymentStatus === 'SUCCESS'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : booking.paymentStatus === 'PENDING'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="SUCCESS">✅ Confirmed</option>
                            <option value="PENDING">⏳ Pending</option>
                            <option value="FAILED">❌ Failed</option>
                          </select>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all cursor-pointer"
                              title="View Full Booking Info"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendWhatsAppNotice(booking)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all flex items-center gap-1 font-semibold text-[11px] px-2 cursor-pointer"
                              title="Send WhatsApp Confirmation"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: HERO SECTION EDITOR (WITH FILE UPLOADER) */}
        {activeAdminTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* HERO FORM */}
            <div className="lg:col-span-6 bg-white border-2 border-[#2C1A0E]/10 rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#2C1A0E] font-cinzel flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#f2b705]" /> Edit Top Hero Section Content
                </h2>
                <p className="text-xs text-gray-500">
                  Update hero headings, descriptions, and background image from your local device.
                </p>
              </div>

              <form onSubmit={handleSaveHeroForm} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Trust Badge Text
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#2C1A0E]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Hero Title Line 1 (Yellow)
                    </label>
                    <input
                      type="text"
                      value={heroTitle1}
                      onChange={(e) => setHeroTitle1(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-800 outline-none focus:border-[#2C1A0E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Hero Title Line 2 (Yellow)
                    </label>
                    <input
                      type="text"
                      value={heroTitle2}
                      onChange={(e) => setHeroTitle2(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-800 outline-none focus:border-[#2C1A0E]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Hero Description Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#2C1A0E]"
                    required
                  />
                </div>

                {/* FILE PICKER FOR HERO BACKGROUND */}
                <div className="p-4 bg-amber-50/80 border-2 border-dashed border-[#f2b705]/60 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className="text-xs font-bold text-[#2C1A0E] flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#ff5c00]" /> Select Hero Background Image from Device
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300">
                        Size: 100KB - 10MB
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md border border-blue-300">
                        Ratio: 16:9 / 4:3
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                        PNG, JPG, WEBP
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="cursor-pointer bg-[#2C1A0E] hover:bg-black text-[#f2b705] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all">
                      <FileImage className="w-4 h-4" /> Pick File (PNG / JPG / WEBP)
                      <input
                        type="file"
                        accept="image/*,image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                        onChange={handleHeroImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <span className="text-[11px] text-gray-500 italic">or paste URL below:</span>
                  </div>

                  <input
                    type="text"
                    value={heroBgImage}
                    onChange={(e) => setHeroBgImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-[11px] font-mono outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ff5c00] hover:bg-[#e05200] text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Hero Section Changes
                </button>
              </form>
            </div>

            {/* HERO LIVE PREVIEW BOX */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                👀 Live Real-Time Hero Preview
              </span>
              
              <div className="relative min-h-[380px] rounded-2xl overflow-hidden border-2 border-[#2C1A0E] shadow-xl flex items-center justify-center text-center p-6 text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center z-0 transition-all"
                  style={{ backgroundImage: `url(${heroBgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0" />

                <div className="relative z-10 space-y-4 max-w-lg">
                  <div className="inline-block bg-[#ff5c00] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {heroBadge}
                  </div>

                  <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#f2b705] leading-tight drop-shadow-lg">
                    <span className="text-[#f2b705]">{heroTitle1}</span> <br />
                    <span className="text-[#f2b705]">{heroTitle2}</span>
                  </h1>

                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    {heroDesc}
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px]">
                    <span className="bg-[#ff5c00] text-white font-bold px-4 py-2 rounded-full shadow-sm">
                      Book Puja Now
                    </span>
                    <span className="bg-[#f2b705] text-[#2C1A0E] font-bold px-4 py-2 rounded-full shadow-sm">
                      🤖 AI Recommendation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUJA CARDS & PRICES EDITOR */}
        {activeAdminTab === 'pujas' && (
          <div className="bg-white border-2 border-[#2C1A0E]/10 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#2C1A0E] font-cinzel flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#f2b705]" /> Puja Cards, Titles, Prices & Images
                </h2>
                <p className="text-xs text-gray-500">
                  Edit titles, pricing, descriptions or upload local photos for any Puja card.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={pujaSearch}
                    onChange={(e) => setPujaSearch(e.target.value)}
                    placeholder="Search puja cards..."
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                  />
                </div>

                <button
                  onClick={() => setIsAddPujaModalOpen(true)}
                  className="bg-[#2C1A0E] hover:bg-black text-[#f2b705] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Create New Puja
                </button>
              </div>
            </div>

            {/* PUJA CARDS GRID FOR ADMIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPujasForAdmin.map((puja) => (
                <div key={puja.id} className="border-2 border-gray-200 hover:border-[#f2b705] rounded-2xl overflow-hidden bg-[#FAF8F5]/60 flex flex-col justify-between shadow-xs transition-all">
                  <div>
                    {/* CARD IMAGE PREVIEW */}
                    <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                      <img
                        src={puja.image}
                        alt={puja.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-[#2C1A0E]/90 text-[#f2b705] border border-[#f2b705]/40 text-xs font-black px-2.5 py-1 rounded-lg shadow-md font-mono">
                        {puja.priceDisplay}
                      </div>
                      <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
                        {puja.category}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-[#2C1A0E] line-clamp-1">{puja.name}</h3>
                      {puja.nameHi && (
                        <p className="text-xs font-medium text-amber-800 line-clamp-1">{puja.nameHi}</p>
                      )}
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{puja.description}</p>
                      
                      <div className="text-[11px] text-gray-500 pt-2 space-y-0.5 border-t border-gray-200/80">
                        <div>📍 {puja.location}</div>
                        <div>⏱️ {puja.duration} | 👨‍🦲 {puja.pandits}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingPuja(puja)}
                      className="flex-1 bg-[#2C1A0E] hover:bg-black text-[#f2b705] font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Card
                    </button>

                    <button
                      onClick={() => handleDeletePujaCard(puja.id, puja.name)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition-all cursor-pointer"
                      title="Delete Puja Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PANDIT ROSTER */}
        {activeAdminTab === 'pandits' && (
          <div className="bg-white border-2 border-[#2C1A0E]/10 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#2C1A0E] font-cinzel">Ujjain Certified Pandits Roster</h2>
              <p className="text-xs text-gray-500">Experienced Vedic Purohits & Acharyas at Mahakaleshwar & Ramghat</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Pt. Rameshwar Shastri', exp: '22+ Years', spec: 'Mahamrityunjaya & Rudrabhishek', temple: 'Mahakaleshwar Temple', status: 'Available' },
                { name: 'Acharya Vidyanand Trivedi', exp: '18+ Years', spec: 'Kaal Sarp Dosh & Bhaat Puja', temple: 'Mangalnath & Ram Ghat', status: 'In Ritual' },
                { name: 'Pt. Shivkumar Joshi', exp: '25+ Years', spec: 'Navgrah Shanti & Chandi Havan', temple: 'Harsiddhi Temple Ujjain', status: 'Available' }
              ].map((pandit, idx) => (
                <div key={idx} className="border-2 border-[#f2b705]/30 rounded-2xl p-5 space-y-3 bg-[#FAF8F5] text-[#2C1A0E]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#2C1A0E] text-[#f2b705] rounded-xl flex items-center justify-center font-bold text-xl">
                      🕉️
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#2C1A0E]">{pandit.name}</h3>
                      <span className="text-[11px] text-amber-800 font-semibold">{pandit.exp} Experience</span>
                    </div>
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <div><strong>Specialization:</strong> {pandit.spec}</div>
                    <div><strong>Primary Location:</strong> {pandit.temple}</div>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-gray-200 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {pandit.status}
                    </span>
                    <button
                      onClick={() => showToast(`Assigned ${pandit.name} for upcoming ritual schedule.`, 'success')}
                      className="text-xs bg-[#2C1A0E] text-[#f2b705] font-semibold px-3 py-1 rounded-lg hover:bg-black cursor-pointer"
                    >
                      Assign Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & RESET TO DEFAULTS */}
        {activeAdminTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CHANGE PIN */}
            <div className="bg-white border-2 border-[#2C1A0E]/10 rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#2C1A0E] font-cinzel">Admin Security & Access PIN</h2>
                <p className="text-xs text-gray-500">Update the PIN required to enter `/secret-admin-portal`</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                <p className="font-bold">Current Security PIN: <span className="font-mono text-base ml-1">{storedPin}</span></p>
                <p className="text-amber-800/80">Keep this PIN safe. Anyone with this PIN can access the secret admin route.</p>
              </div>

              <form onSubmit={handleChangePin} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Current Security PIN</label>
                  <input
                    type="password"
                    value={oldPinInput}
                    onChange={(e) => setOldPinInput(e.target.value)}
                    placeholder="Enter current PIN..."
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3.5 py-2 text-xs outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">New Security PIN (min 4 characters)</label>
                  <input
                    type="text"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Enter new PIN (e.g. 9988)..."
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3.5 py-2 text-xs outline-none font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#2C1A0E] hover:bg-black text-[#f2b705] font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Update Security PIN
                </button>
              </form>
            </div>

            {/* RESET CONTENT DEFAULTS */}
            <div className="bg-white border-2 border-red-500/20 rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-bold text-red-900 font-cinzel">Reset Site Content to Factory Defaults</h2>
                <p className="text-xs text-gray-500">Restore original Hero Section text, prices, and default Puja cards.</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2">
                <p className="font-bold">⚠️ Warning: Factory Reset</p>
                <p>
                  This will discard all custom text, price modifications, and uploaded local device images, resetting the catalog back to original defaults.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Reset all Hero text, Puja prices & custom images to defaults?')) {
                    resetToDefaults();
                    showToast('🔄 Reset site content & images to default state!', 'info');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Custom Content
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PUJA CARD MODAL */}
      {editingPuja && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#2C1A0E] rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingPuja(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-[#2C1A0E] font-cinzel">Edit Puja Card</h3>
              <p className="text-xs text-gray-500">Modify title, pricing, location, or upload image from local device</p>
            </div>

            <form onSubmit={handleSavePujaCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Puja Title (English)</label>
                  <input
                    type="text"
                    value={editingPuja.name}
                    onChange={(e) => setEditingPuja({ ...editingPuja, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Puja Title (Hindi)</label>
                  <input
                    type="text"
                    value={editingPuja.nameHi || ''}
                    onChange={(e) => setEditingPuja({ ...editingPuja, nameHi: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Price Numeric (₹)</label>
                  <input
                    type="number"
                    value={editingPuja.price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingPuja({
                        ...editingPuja,
                        price: val,
                        priceDisplay: `₹${val.toLocaleString('en-IN')}`
                      });
                    }}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none font-bold text-amber-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Price Display String</label>
                  <input
                    type="text"
                    value={editingPuja.priceDisplay}
                    onChange={(e) => setEditingPuja({ ...editingPuja, priceDisplay: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
                  <select
                    value={editingPuja.category}
                    onChange={(e) => setEditingPuja({ ...editingPuja, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="rudra">Rudra Pujas</option>
                    <option value="dosh">Dosh Nivaran</option>
                    <option value="navgrah">Navgrah Pujas</option>
                    <option value="shani">Shani Pujas</option>
                    <option value="jap">Planet Jap</option>
                    <option value="special">Special Pujas</option>
                    <option value="online">Online Pujas</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Temple Location</label>
                  <input
                    type="text"
                    value={editingPuja.location}
                    onChange={(e) => setEditingPuja({ ...editingPuja, location: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingPuja.description}
                  onChange={(e) => setEditingPuja({ ...editingPuja, description: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                  required
                />
              </div>

              {/* LOCAL FILE PICKER FOR PUJA CARD IMAGE */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-[#2C1A0E] flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#ff5c00]" /> Select Card Image from Local Device
                  </label>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300">
                      100KB - 10MB
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md border border-blue-300">
                      16:9 / 4:3
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                      PNG, JPG, WEBP
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 border border-gray-300">
                    <img src={editingPuja.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <label className="cursor-pointer bg-[#2C1A0E] hover:bg-black text-[#f2b705] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                    <FileImage className="w-3.5 h-3.5" /> Pick Image File (PNG/JPG)
                    <input
                      type="file"
                      accept="image/*,image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                      onChange={handleEditPujaImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={editingPuja.image}
                  onChange={(e) => setEditingPuja({ ...editingPuja, image: e.target.value })}
                  placeholder="Or paste image URL..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-[11px] font-mono outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPuja(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff5c00] hover:bg-[#e05200] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW PUJA CARD MODAL */}
      {isAddPujaModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#2C1A0E] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddPujaModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-[#2C1A0E] font-cinzel">Create New Puja Card</h3>
              <p className="text-xs text-gray-500">Add a new ritual offering with title, pricing, and photo upload</p>
            </div>

            <form onSubmit={handleCreateNewPuja} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Puja Title (English)</label>
                <input
                  type="text"
                  value={newPujaTitle}
                  onChange={(e) => setNewPujaTitle(e.target.value)}
                  placeholder="e.g. Special Chandi Havan"
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Puja Title (Hindi)</label>
                <input
                  type="text"
                  value={newPujaTitleHi}
                  onChange={(e) => setNewPujaTitleHi(e.target.value)}
                  placeholder="e.g. विशेष चंडी हवन"
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Price Numeric (₹)</label>
                  <input
                    type="number"
                    value={newPujaPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewPujaPrice(val);
                      setNewPujaPriceDisplay(`₹${val.toLocaleString('en-IN')}`);
                    }}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Category</label>
                  <select
                    value={newPujaCategory}
                    onChange={(e) => setNewPujaCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="rudra">Rudra Pujas</option>
                    <option value="dosh">Dosh Nivaran</option>
                    <option value="navgrah">Navgrah Pujas</option>
                    <option value="shani">Shani Pujas</option>
                    <option value="jap">Planet Jap</option>
                    <option value="special">Special Pujas</option>
                    <option value="online">Online Pujas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  rows={2}
                  value={newPujaDescription}
                  onChange={(e) => setNewPujaDescription(e.target.value)}
                  placeholder="Auspicious ritual for health, prosperity, and divine blessings..."
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              {/* LOCAL FILE PICKER FOR NEW PUJA */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-[#2C1A0E] flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#ff5c00]" /> Select Card Image from Local Device
                  </label>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300">
                      100KB - 10MB
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md border border-blue-300">
                      16:9 / 4:3
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                      PNG, JPG, WEBP
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-[#2C1A0E] hover:bg-black text-[#f2b705] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                    <FileImage className="w-3.5 h-3.5" /> Choose Image File (PNG/JPG)
                    <input
                      type="file"
                      accept="image/*,image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                      onChange={handleNewPujaImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2C1A0E] text-[#f2b705] font-bold text-xs py-3 rounded-xl shadow-md hover:bg-black transition-all cursor-pointer mt-2"
              >
                Create Puja Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#2C1A0E] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-200 pb-3">
              <span className="text-[10px] font-mono font-bold bg-[#f2b705]/20 text-[#2C1A0E] px-2.5 py-1 rounded-full">
                {selectedBooking.bookingId}
              </span>
              <h3 className="text-lg font-bold text-[#2C1A0E] font-cinzel mt-2">{selectedBooking.pujaName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 block text-[10px]">DEVOTEE NAME</span>
                <strong className="text-gray-900">{selectedBooking.fullName}</strong>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 block text-[10px]">PHONE NUMBER</span>
                <strong className="text-gray-900">{selectedBooking.phone}</strong>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 block text-[10px]">PUJA DATE</span>
                <strong className="text-gray-900">{selectedBooking.pujaDate}</strong>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 block text-[10px]">AMOUNT</span>
                <strong className="text-emerald-800">{selectedBooking.priceDisplay || `₹${selectedBooking.pujaPrice}`}</strong>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 block text-[10px]">GOTRA</span>
                <strong className="text-gray-900">{selectedBooking.gotra || 'Not provided'}</strong>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 block text-[10px]">RASHI / NAKSHATRA</span>
                <strong className="text-gray-900">{selectedBooking.rashi || 'Not provided'}</strong>
              </div>
            </div>

            {selectedBooking.wishes && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs">
                <span className="font-bold text-amber-900 block">Sankalp / Devotee Wishes:</span>
                <p className="text-amber-900/90 italic">{selectedBooking.wishes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleSendWhatsAppNotice(selectedBooking)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" /> Send WhatsApp Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL BOOKING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#2C1A0E] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-[#2C1A0E] font-cinzel">Add Walk-in Devotee Booking</h3>
              <p className="text-xs text-gray-500">Record an offline or telephone puja booking in Ujjain</p>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Devotee Full Name</label>
                <input
                  type="text"
                  value={newBookingName}
                  onChange={(e) => setNewBookingName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={newBookingPhone}
                  onChange={(e) => setNewBookingPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Select Puja Ritual</label>
                <select
                  value={newBookingPujaId}
                  onChange={(e) => setNewBookingPujaId(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                >
                  {pujas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.priceDisplay})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Puja Date</label>
                  <input
                    type="date"
                    value={newBookingDate}
                    onChange={(e) => setNewBookingDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Devotee Gotra</label>
                  <input
                    type="text"
                    value={newBookingGotra}
                    onChange={(e) => setNewBookingGotra(e.target.value)}
                    placeholder="e.g. Kashyap"
                    className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2C1A0E] text-[#f2b705] font-bold text-xs py-3 rounded-xl shadow-md hover:bg-black transition-all cursor-pointer mt-2"
              >
                Create Booking Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
