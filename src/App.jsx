import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Wrench, ShoppingCart, User, Home, 
  MapPin, Star, ChevronRight, ShieldCheck, 
  AlertCircle, Plus, CheckCircle2, Package,
  MessageCircle, Send, ArrowLeft, Trash2, Minus, X,
  Truck, MapPinned, Phone, Edit3, Lock, Bell, Info,
  BarChart3, Store, DollarSign, Zap, Settings, Download
} from 'lucide-react';
import './index.css';

// --- MOCK DATA ---
const MOCK_BIKES = [
  { id: 'b1', brand: 'Honda', model: 'Vario 150', year: 2018 },
  { id: 'b2', brand: 'Yamaha', model: 'NMAX 155', year: 2020 },
  { id: 'b3', brand: 'Kawasaki', model: 'Ninja 250 FI', year: 2019 },
];

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: Package },
  { id: 'pengereman', name: 'Pengereman', icon: AlertCircle },
  { id: 'penggerak', name: 'Mesin & CVT', icon: Wrench },
  { id: 'kelistrikan', name: 'Kelistrikan', icon: Search },
];

const MOCK_PRODUCTS = [
  { 
    id: 'p1', name: 'Kampas Rem Depan Original (Pad Set)', oemCode: '06455-K59-A71', 
    price: 55000, category: 'pengereman', compatibleBikes: ['b1'], 
    rating: 4.8, sold: 1250, shop: 'Astra Motor Official', isOriginal: true,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1629897148566-6b2158654c60?auto=format&fit=crop&q=80&w=300&h=300'
  },
  { 
    id: 'p2', name: 'V-Belt CVT Bando Racing', oemCode: '23100-K36-J01', 
    price: 125000, category: 'penggerak', compatibleBikes: ['b1'], 
    rating: 4.9, sold: 850, shop: 'Maju Jaya Part', isOriginal: false,
    distance: 12.0,
    image: 'https://images.unsplash.com/photo-1590634567280-f80e7d58a8a4?auto=format&fit=crop&q=80&w=300&h=300'
  },
  { 
    id: 'p3', name: 'Kampas Rem Belakang', oemCode: '3C1-F530K-00', 
    price: 65000, category: 'pengereman', compatibleBikes: ['b2'], 
    rating: 4.7, sold: 430, shop: 'Yamaha Putera', isOriginal: true,
    distance: 4.8,
    image: 'https://images.unsplash.com/photo-1629897148566-6b2158654c60?auto=format&fit=crop&q=80&w=300&h=300'
  },
  { 
    id: 'p4', name: 'Busi Iridium NGK CPR9EAIX-9', oemCode: 'CPR9EAIX-9', 
    price: 95000, category: 'kelistrikan', compatibleBikes: ['b1', 'b2'], 
    rating: 5.0, sold: 2100, shop: 'Toko Busi JKT', isOriginal: true,
    distance: 22.5,
    image: 'https://images.unsplash.com/photo-1605274280925-9cb14dfcf6b9?auto=format&fit=crop&q=80&w=300&h=300'
  },
  { 
    id: 'p5', name: 'Filter Oli Original', oemCode: '16097-0008', 
    price: 85000, category: 'penggerak', compatibleBikes: ['b3'], 
    rating: 4.9, sold: 320, shop: 'Kawasaki Suramadu', isOriginal: true,
    distance: 8.0,
    image: 'https://images.unsplash.com/photo-1590634567280-f80e7d58a8a4?auto=format&fit=crop&q=80&w=300&h=300'
  },
];

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeTab, setActiveTab] = useState('home');
  const [myGarage, setMyGarage] = useState([MOCK_BIKES[0]]);
  const [selectedBikeId, setSelectedBikeId] = useState(MOCK_BIKES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxRadius, setMaxRadius] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', userType: 'buyer' });

  const [activeChatShop, setActiveChatShop] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { 
      shop: 'Astra Motor Official', 
      messages: [
        { id: 1, text: 'Halo, kampas rem Vario 150 ready?', sender: 'user', time: '10:00' }, 
        { id: 2, text: 'Ready kak, ori AHM. Silakan diorder ya.', sender: 'shop', time: '10:05' }
      ] 
    }
  ]);

  const selectedBike = myGarage.find(b => b.id === selectedBikeId) || null;

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesBike = selectedBike ? product.compatibleBikes.includes(selectedBike.id) : true;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.oemCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesRadius = maxRadius === 'all' || product.distance <= parseInt(maxRadius);

      return matchesBike && matchesSearch && matchesCategory && matchesRadius;
    });
  }, [selectedBike, searchQuery, selectedCategory, maxRadius]);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === productId 
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.length;

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setCurrentUser({
        email: loginForm.email,
        userType: loginForm.userType,
        name: loginForm.email.split('@')[0]
      });
      setShowLogin(false);
      setLoginForm({ email: '', password: '', userType: 'buyer' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleStartChat = (shopName) => {
    setActiveChatShop(shopName);
    if (!chatHistory.some(chat => chat.shop === shopName)) {
      setChatHistory([...chatHistory, { shop: shopName, messages: [] }]);
    }
    setActiveTab('chatRoom');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatShop) return;

    setChatHistory(prev => prev.map(chat => {
      if (chat.shop === activeChatShop) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { 
              id: Date.now(), 
              text: newMessage, 
              sender: 'user', 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]
        };
      }
      return chat;
    }));
    setNewMessage('');
  };

  const renderHome = () => (
    <div className={`${isMobile ? 'pb-24' : 'pb-6'}`}>
      <div className={`bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3 ${isMobile ? 'mx-4 mt-4 p-4' : 'm-6 p-6'}`}>
        <div className="bg-orange-500 p-2 rounded-lg text-white mt-1 flex-shrink-0">
          <Wrench size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Mode Kompatibilitas Aktif</h3>
          <p className="text-sm text-slate-600 mt-1">
            Menampilkan suku cadang yang 100% cocok untuk 
            <span className="font-semibold text-red-600 block">
              {selectedBike ? `${selectedBike.brand} ${selectedBike.model} (${selectedBike.year})` : 'Semua Motor'}
            </span>
          </p>
        </div>
      </div>

      <div className={`mt-6 ${isMobile ? '' : 'mb-6'}`}>
        <h2 className={`font-bold text-slate-800 mb-3 ${isMobile ? 'px-4' : 'px-6'}`}>Kategori Sistem</h2>
        <div className={`flex ${isMobile ? 'overflow-x-auto px-4 gap-3 pb-2 hide-scrollbar' : 'flex-wrap gap-3 px-6'}`}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-colors ${
                selectedCategory === cat.id 
                  ? 'bg-red-700 text-white border-red-700' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-6 ${isMobile ? 'px-4' : 'px-6'}`}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-bold text-slate-800">Rekomendasi Part</h2>
            <span className="text-xs text-orange-600 font-medium">{filteredProducts.length} Produk Ditemukan</span>
          </div>
          <select
            value={maxRadius}
            onChange={(e) => setMaxRadius(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg text-slate-600 bg-white py-1.5 px-2 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer"
          >
            <option value="all">Jarak: Semua</option>
            <option value="5">&lt; 5 km</option>
            <option value="15">&lt; 15 km</option>
            <option value="30">&lt; 30 km</option>
          </select>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <AlertCircle className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-slate-600 font-medium">Part tidak ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">Coba cari dengan kata kunci atau kode OEM lain.</p>
          </div>
        ) : (
          <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-4'}`}>
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="relative aspect-square bg-slate-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.isOriginal && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={12} />
                      OEM
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <p className="text-xs text-slate-500 font-mono mb-1">Kode: {product.oemCode}</p>
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight mb-2 flex-grow">{product.name}</h3>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mb-2 gap-y-1">
                    <div className="flex items-center gap-0.5">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span>{product.rating}</span>
                      <span className="mx-0.5">•</span>
                      <span>{product.sold} tjl</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-orange-600 font-medium">
                      <MapPin size={10} />
                      <span>{product.distance} km</span>
                    </div>
                  </div>
                  <div className="font-bold text-red-700 mb-3">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => handleStartChat(product.shop)}
                      className="p-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center"
                      title="Chat Penjual"
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-grow bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChatList = () => (
    <div className={`${isMobile ? 'pb-24' : 'pb-0'}`}>
      {isMobile && (
        <div className="bg-red-700 text-white p-4 sticky top-0 z-10 shadow-md">
          <h1 className="text-lg font-bold">Pesan</h1>
        </div>
      )}
      <div className={`${isMobile ? 'divide-y divide-slate-200' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6'}`}>
        {chatHistory.length === 0 ? (
          <div className="text-center py-10">
            <MessageCircle className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500 text-sm">Belum ada pesan.</p>
          </div>
        ) : (
          chatHistory.map((chat, idx) => (
            <div 
              key={idx} 
              onClick={() => handleStartChat(chat.shop)}
              className={`${isMobile ? 'p-4 bg-white hover:bg-slate-50 flex items-center gap-3' : 'p-4 bg-white rounded-lg border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md'} cursor-pointer transition-all`}
            >
              <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold ${isMobile ? 'text-lg' : 'text-2xl'} shrink-0`}>
                {chat.shop.charAt(0)}
              </div>
              <div className={`${isMobile ? 'flex-grow overflow-hidden' : 'flex-grow'}`}>
                <div className={`${isMobile ? 'flex justify-between items-center mb-1' : 'mb-2'}`}>
                  <h3 className="font-bold text-slate-800">{chat.shop}</h3>
                  {chat.messages.length > 0 && isMobile && (
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {chat.messages[chat.messages.length - 1].time}
                    </span>
                  )}
                </div>
                <p className={`text-slate-500 ${isMobile ? 'text-xs truncate' : 'text-sm line-clamp-2'}`}>
                  {chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].text 
                    : 'Belum ada pesan. Mulai percakapan!'}
                </p>
                {!isMobile && chat.messages.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">
                    {chat.messages[chat.messages.length - 1].time}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderChatRoom = () => {
    if (!isMobile) return null; // Hide on desktop
    
    const currentChat = chatHistory.find(c => c.shop === activeChatShop);
    
    return (
      <div className="flex flex-col h-full bg-slate-50 z-30 absolute inset-0 max-w-md mx-auto">
        <div className="bg-red-700 text-white p-4 flex items-center gap-3 shadow-md shrink-0">
          <button onClick={() => setActiveTab('chat')} className="p-1 hover:bg-red-800 rounded">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
              {activeChatShop?.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">{activeChatShop}</h2>
              <p className="text-[10px] text-orange-200">Online</p>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 pb-20">
          {currentChat?.messages.length === 0 && (
            <div className="text-center text-xs text-slate-400 my-4 bg-slate-200 py-1 px-3 rounded-full w-max mx-auto">
              Percakapan dengan {activeChatShop} dimulai
            </div>
          )}
          {currentChat?.messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border-t border-slate-200 p-3 shrink-0 pb-safe">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-grow bg-slate-100 border-transparent rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-orange-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:bg-slate-400 transition-colors shrink-0"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderPurchase = () => (
    <div className={`fixed inset-0 z-50 bg-black/50 flex ${isMobile ? 'items-end' : 'items-center justify-center'} ${isMobile ? 'max-w-md mx-auto' : ''}`}>
      <div className={`bg-white ${isMobile ? 'w-full rounded-t-2xl' : 'rounded-2xl w-full max-w-2xl'} shadow-2xl ${isMobile ? 'max-h-[90vh]' : 'max-h-[95vh]'} overflow-y-auto`}>
        <div className="sticky top-0 bg-red-700 text-white p-4 flex items-center justify-between shadow-md z-10">
          <h1 className="text-lg font-bold">Keranjang Belanja</h1>
          <button 
            onClick={() => setShowCart(false)}
            className="p-1 hover:bg-red-800 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <ShoppingCart className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-600 font-medium mb-2">Keranjang Anda kosong</p>
              <p className="text-sm text-slate-500">Tambahkan suku cadang untuk memulai belanja.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-slate-50 rounded-xl border border-slate-200 p-3 shadow-sm">
                    <div className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-sm text-slate-800 line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Kode: {item.oemCode}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-red-600">Rp {item.price.toLocaleString('id-ID')}</span>
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2 text-sm font-medium text-slate-700">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 text-right">
                      <p className="text-xs font-semibold text-slate-800">Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 sticky bottom-0">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">Detail Pengiriman</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1 text-xs">Nama Penerima</label>
                    <input
                      type="text"
                      placeholder="Isikan nama lengkap"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1 text-xs">No. Telepon</label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1 text-xs">Alamat Pengiriman</label>
                    <textarea
                      placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi"
                      rows="2"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 mb-4">
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal ({cartItems.length} item)</span>
                    <span className="font-semibold text-slate-800">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ongkir (Standar)</span>
                    <span className="font-semibold text-slate-800">Rp 25.000</span>
                  </div>
                  <div className="border-t border-orange-300 pt-2 flex justify-between">
                    <span className="font-bold text-slate-800">Total Pembayaran</span>
                    <span className="font-bold text-lg text-red-600">Rp {(cartTotal + 25000).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg mb-4">
                Lanjut ke Pembayaran
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center ${isMobile ? 'max-w-md mx-auto' : ''}`}>
      <div className={`bg-white rounded-2xl shadow-2xl p-6 ${isMobile ? 'w-96 max-w-[calc(100%-2rem)]' : 'w-full max-w-md'}`}>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Masuk OtoParts</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Pengguna</label>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="buyer"
                  checked={loginForm.userType === 'buyer'}
                  onChange={(e) => setLoginForm({...loginForm, userType: e.target.value})}
                  className="w-4 h-4"
                />
                <span className="ml-2 text-sm text-slate-700">Pembeli</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="seller"
                  checked={loginForm.userType === 'seller'}
                  onChange={(e) => setLoginForm({...loginForm, userType: e.target.value})}
                  className="w-4 h-4"
                />
                <span className="ml-2 text-sm text-slate-700">Penjual</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              placeholder="contoh@email.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
          >
            Masuk
          </button>
        </form>
        
        <button
          onClick={() => setShowLogin(false)}
          className="w-full mt-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );

  const renderBuyerProfile = () => (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-red-600 via-red-600 to-red-700 text-white p-6 rounded-b-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <ShoppingCart size={120} />
        </div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-lg">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-xl">{currentUser.name}</h2>
            <p className="text-red-100 text-sm">{currentUser.email}</p>
            <p className="text-red-200 text-xs mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Akun Pembeli Terverifikasi</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><ShoppingCart size={18} className="text-red-600" /> Riwayat Pemesanan</h3>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">1 Pesanan</span>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-all hover:shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">Pesanan #001</p>
                  <p className="text-xs text-slate-500 mt-1">Kampas Rem Depan + V-Belt</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1"><CheckCircle2 size={12} /> Terkirim</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-slate-800">Rp 180.000</p>
                <button className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  Lihat Detail <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download size={16} /> Lihat Semua Pesanan
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><MapPin size={18} className="text-blue-600" /> Alamat Tersimpan</h3>
            <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <Plus size={16} className="text-slate-400" />
            </button>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">🏠 Rumah</p>
                <p className="text-sm text-slate-600 mt-2">Jl. Merdeka No. 123, Jakarta Selatan</p>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Phone size={12} /> 081234567890</p>
              </div>
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <Edit3 size={16} className="text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18} className="text-purple-600" /> Pengaturan Akun</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group">
              <span className="flex items-center gap-2"><Edit3 size={16} className="text-slate-400 group-hover:text-slate-600" /> Ubah Profil</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group">
              <span className="flex items-center gap-2"><Bell size={16} className="text-slate-400 group-hover:text-slate-600" /> Notifikasi</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group">
              <span className="flex items-center gap-2"><Lock size={16} className="text-slate-400 group-hover:text-slate-600" /> Privasi & Keamanan</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSellerProfile = () => (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-red-600 via-red-600 to-red-700 text-white p-6 rounded-b-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Store size={120} />
        </div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-lg">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-xl">{currentUser.name}</h2>
            <p className="text-red-100 text-sm">{currentUser.email}</p>
            <p className="text-red-200 text-xs mt-1 flex items-center gap-1"><ShieldCheck size={12} /> Dijamin Asli</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-orange-400 via-red-500 to-rose-500 rounded-xl p-5 text-white shadow-lg">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 hover:bg-white/30 transition-all">
              <p className="text-3xl font-bold">24</p>
              <p className="text-xs text-orange-100 mt-1 flex items-center justify-center gap-1"><Package size={12} /> Produk</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 hover:bg-white/30 transition-all">
              <p className="text-3xl font-bold">1.2M</p>
              <p className="text-xs text-orange-100 mt-1 flex items-center justify-center gap-1"><DollarSign size={12} /> Penjualan</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 hover:bg-white/30 transition-all">
              <p className="text-3xl font-bold">4.8</p>
              <p className="text-xs text-orange-100 mt-1 flex items-center justify-center gap-1"><Star size={12} /> Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Store size={18} className="text-green-600" /> Kelola Toko</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex flex-col items-center gap-2">
              <Package size={20} />
              <span className="text-sm">Kelola Produk</span>
            </button>
            <button className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex flex-col items-center gap-2">
              <ShoppingCart size={20} />
              <span className="text-sm">Lihat Pesanan</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Zap size={18} className="text-yellow-600" /> Penjualan Terbaru</h3>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">Hot</span>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-all hover:shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">V-Belt CVT Bando Racing</p>
                  <p className="text-xs text-slate-500 mt-1">5 unit terjual</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full">Terjual 5</span>
              </div>
              <p className="text-sm font-bold text-red-600 flex items-center gap-1"><DollarSign size={14} /> Rp 625.000</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-yellow-600 text-yellow-600 hover:bg-yellow-50 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <BarChart3 size={16} /> Lihat Analytics
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18} className="text-purple-600" /> Pengaturan Toko</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group">
              <span className="flex items-center gap-2"><Edit3 size={16} className="text-slate-400 group-hover:text-slate-600" /> Profil Toko</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group">
              <span className="flex items-center gap-2"><DollarSign size={16} className="text-slate-400 group-hover:text-slate-600" /> Bank & Rekening</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button className="w-full text-left text-sm text-slate-700 hover:bg-slate-50 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group">
              <span className="flex items-center gap-2"><Info size={16} className="text-slate-400 group-hover:text-slate-600" /> Kebijakan Toko</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!currentUser) {
      return (
        <div className="flex flex-col items-center justify-center pb-24 pt-20 px-4 text-center">
          <User size={64} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Belum Login</h2>
          <p className="text-slate-600 text-sm mb-6">Silakan login untuk mengakses profil Anda</p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            Masuk Sekarang
          </button>
        </div>
      );
    }

    return currentUser.userType === 'buyer' ? renderBuyerProfile() : renderSellerProfile();
  };

  const renderGarage = () => (
    <div className={`${isMobile ? 'p-4 pb-24' : 'p-6 pb-6'}`}>
      <div className="bg-red-700 text-white rounded-2xl p-5 mb-6 shadow-lg shadow-red-700/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Wrench size={20} className="text-orange-300" />
            Garasi Saya
          </h2>
          <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">{myGarage.length} Motor</span>
        </div>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-red-50 mb-4`}>
          Simpan data motor Anda untuk memfilter suku cadang yang dijamin 100% cocok tanpa takut salah beli.
        </p>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Plus size={18} />
          Tambah Motor Baru
        </button>
      </div>

      <h3 className="font-bold text-slate-800 mb-3">Daftar Kendaraan</h3>
      <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {MOCK_BIKES.map(bike => {
          const isSaved = myGarage.some(b => b.id === bike.id);
          const isActive = selectedBikeId === bike.id;
          
          return (
            <div 
              key={bike.id} 
              className={`p-4 rounded-xl border-2 transition-all ${
                isActive ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-800">{bike.brand} {bike.model}</h4>
                    {isActive && <CheckCircle2 size={16} className="text-orange-600" />}
                  </div>
                  <p className="text-sm text-slate-500">Tahun: {bike.year}</p>
                </div>
                
                {isSaved ? (
                  <button 
                    onClick={() => setSelectedBikeId(bike.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                      isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isActive ? 'Sedang Dipakai' : 'Gunakan'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setMyGarage([...myGarage, bike])}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Simpan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Desktop Navigation Component
  const renderDesktopNav = () => (
    <nav className="w-64 bg-gradient-to-b from-red-600 to-red-700 text-white flex flex-col border-r border-red-800 shadow-lg">
      <div className="p-6 border-b border-red-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-orange-400 rounded-lg p-2.5 flex items-center justify-center">
            <Wrench size={24} className="text-red-700" />
          </div>
          <div>
            <h1 className="font-black text-xl">OtoParts</h1>
            <p className="text-xs text-red-100">Marketplace Suku Cadang</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'home' 
                ? 'bg-white text-red-600 shadow-md' 
                : 'text-red-100 hover:bg-red-500/50'
            }`}
          >
            <Home size={20} />
            <span>Beranda</span>
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'garage' 
                ? 'bg-white text-red-600 shadow-md' 
                : 'text-red-100 hover:bg-red-500/50'
            }`}
          >
            <Wrench size={20} />
            <span>Garasi Saya</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'chat' || activeTab === 'chatRoom'
                ? 'bg-white text-red-600 shadow-md' 
                : 'text-red-100 hover:bg-red-500/50'
            }`}
          >
            <MessageCircle size={20} />
            <span>Chat Penjual</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'profile' 
                ? 'bg-white text-red-600 shadow-md' 
                : 'text-red-100 hover:bg-red-500/50'
            }`}
          >
            <User size={20} />
            <span>Profil Saya</span>
            {currentUser && <span className="ml-auto w-2.5 h-2.5 bg-green-400 rounded-full"></span>}
          </button>
        </div>
      </div>

      <div className="border-t border-red-500 p-3">
        <button 
          onClick={() => setShowCart(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-400 text-white transition-all shadow-md relative"
        >
          <ShoppingCart size={20} />
          <span>Keranjang</span>
          {cartCount > 0 && (
            <span className="ml-auto bg-yellow-400 text-red-700 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );

  // Desktop Header Component
  const renderDesktopHeader = () => (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={20} className="text-red-500" />
            </div>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent block pl-10 p-3 placeholder-slate-400 transition-all"
              placeholder="Cari nama part atau kode OEM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('garage')}
          className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md"
        >
          <MapPin size={18} />
          <span className="whitespace-nowrap">
            {selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : 'Semua Motor'}
          </span>
        </button>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {isMobile ? (
        // MOBILE LAYOUT
        <div className="max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col h-screen bg-white">
          <header className="bg-red-700 pt-6 pb-4 px-4 sticky top-0 z-10 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-white font-black text-xl tracking-tight flex items-center gap-2">
                <Wrench className="text-white" size={24} />
                OtoParts
              </h1>
              <button 
                onClick={() => setShowCart(true)}
                className="relative hover:opacity-80 transition-opacity"
              >
                <ShoppingCart className="text-white" size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-yellow-500 text-slate-900 text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-red-700">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-red-300" />
              </div>
              <input
                type="text"
                className="w-full bg-red-800 border border-red-600 text-white text-sm rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent block pl-10 p-3 placeholder-red-300 transition-all"
                placeholder="Cari nama part atau kode OEM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button 
              onClick={() => setActiveTab('garage')}
              className="mt-3 w-full bg-red-800 border border-red-600 rounded-lg p-2 flex items-center justify-between hover:bg-red-900 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-red-100">
                <MapPin size={14} className="text-orange-400" />
                <span>Garasi Aktif:</span>
                <span className="text-white font-semibold">
                  {selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : 'Semua Motor'}
                </span>
              </div>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          </header>

          <main className="flex-grow overflow-y-auto">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'garage' && renderGarage()}
            {activeTab === 'chat' && renderChatList()}
            {activeTab === 'profile' && renderProfile()}
          </main>

          {activeTab === 'chatRoom' && renderChatRoom()}

          {showCart && renderPurchase()}

          {showLogin && renderLogin()}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="fixed bottom-20 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-30 transition-all hover:scale-110"
              title="Logout"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 flex justify-around items-center p-3 pb-safe z-20">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'home' ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Home size={24} className={activeTab === 'home' ? 'fill-red-100' : ''} />
              <span className="text-[10px] font-medium">Beranda</span>
            </button>
            <button 
              onClick={() => setActiveTab('garage')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'garage' ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Wrench size={24} className={activeTab === 'garage' ? 'fill-red-100' : ''} />
              <span className="text-[10px] font-medium">Garasi</span>
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'chat' || activeTab === 'chatRoom' ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <MessageCircle size={24} className={activeTab === 'chat' || activeTab === 'chatRoom' ? 'fill-red-100' : ''} />
              <span className="text-[10px] font-medium">Chat</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors relative ${activeTab === 'profile' ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <User size={24} className={activeTab === 'profile' ? 'fill-red-100' : ''} />
              <span className="text-[10px] font-medium">Profil</span>
              {currentUser && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          </nav>
        </div>
      ) : (
        // DESKTOP LAYOUT
        <div className="flex h-screen overflow-hidden">
          {renderDesktopNav()}
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderDesktopHeader()}

            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'home' && renderHome()}
                {activeTab === 'garage' && renderGarage()}
                {activeTab === 'chat' && renderChatList()}
                {activeTab === 'profile' && renderProfile()}
              </div>
            </main>
          </div>

          {activeTab === 'chatRoom' && renderChatRoom()}

          {showCart && renderPurchase()}

          {showLogin && renderLogin()}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-30 transition-all hover:scale-110"
              title="Logout"
            >
              <ArrowLeft size={24} />
            </button>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
