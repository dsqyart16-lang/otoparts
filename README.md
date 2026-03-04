# 🏍️ OtoParts - Aplikasi Marketplace Suku Cadang Motor

Aplikasi web modern untuk menjual dan membeli suku cadang motor dengan fitur pelacakan kompatibilitas, chat real-time, dan sistem cart yang canggih.

## ✨ Fitur Utama

### 👤 User Management
- ✅ Login/Register dengan Email & Password (Firebase)
- ✅ Dua tipe user: **Pembeli** dan **Penjual**
- ✅ Profil pengguna dengan order history & shop statistics

### 🏠 Marketplace Pembeli
- ✅ Browsing katalog suku cadang dengan filter cerdas
- ✅ Filter berdasarkan motor yang disimpan (kompatibilitas)
- ✅ Filter kategori sistem (Mesin, CVT, Kelistrikan, dll)
- ✅ Filter jarak toko dari lokasi
- ✅ Search dengan kode OEM dan nama produk
- ✅ Rating & Review dari penjual

### 🚀 Fitur Seller
- ✅ Kelola katalog produk
- ✅ Lihat statistik penjualan real-time
- ✅ Kelola pesanan dari pembeli
- ✅ Chat langsung dengan pembeli

### 💬 Komunikasi
- ✅ Real-time chat dengan penjual
- ✅ Riwayat chat tersimpan
- ✅ Notifikasi pesan baru

### 🛒 Keranjang & Checkout
- ✅ Add/remove items dari keranjang
- ✅ Quantity management
- ✅ Form pengiriman terintegrasi
- ✅ Kalkulasi otomatis total + ongkir

### 🔧 Sistem Garasi
- ✅ Simpan multiple motor di garasi
- ✅ Filter produk berdasarkan motor aktif
- ✅ Pastikan kompatibilitas 100% sebelum beli

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS 3 + PostCSS
- **Icons**: Lucide React
- **Backend**: Firebase Realtime Database
- **Auth**: Firebase Authentication
- **Hosting**: Ready for Vercel/Netlify

## 📱 Responsive Design

- **Mobile**: Bottom navigation + optimized UI
- **Desktop**: Sidebar navigation + expanded layout
- **Tablet**: Auto-scaling grid system

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase (Recommended)
Baca [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) untuk instruksi lengkap.

### 3. Run Development Server
```bash
npm run dev
```

Server akan berjalan di: `http://localhost:5173`

### 4. Build untuk Production
```bash
npm run build
```

## 📁 Project Structure

```
otoparts/
├── src/
│   ├── App.jsx              # Main application component
│   ├── firebase.js          # Firebase service layer
│   ├── index.css            # Global styles
│   ├── main.jsx             # Entry point
│   └── assets/              # Images & static files
├── .env.local               # Firebase configuration
├── FIREBASE_SETUP.md        # Setup guide lengkap
├── FIREBASE_INTEGRATION.md  # Firebase usage guide
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 📚 Dokumentasi

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Panduan setup Firebase lengkap
- **[FIREBASE_INTEGRATION.md](./FIREBASE_INTEGRATION.md)** - Cara menggunakan Firebase API
- Code comments di App.jsx untuk referensi

## 🔐 Security

- ✅ API keys di `.env.local` (tidak dicommit)
- ✅ Firebase Security Rules untuk database protection
- ✅ Authentication required untuk write operations

## 🎨 UI/UX Highlights

- **Mobile-First**: Optimal untuk HP
- **Responsive**: Automatic desktop/mobile layout
- **Loading States**: Spinner & disabled buttons
- **Error Handling**: User-friendly messages

## 📊 Database Schema

Firebase Realtime Database dengan struktur:
- `users/` - User profiles & authentication data
- `products/` - Product catalog
- `carts/` - Shopping cart items
- `orders/` - Order history
- `chats/` - Real-time messaging

Lihat [FIREBASE_INTEGRATION.md](./FIREBASE_INTEGRATION.md) untuk detail lengkap.

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel login && vercel
```

### Netlify
Drag & drop folder `dist/` ke Netlify dashboard.

## 👨‍💻 Development

### Hot Module Replacement (HMR)
Edit file → save → instant reload (Vite feature)

### Console Debugging
```javascript
console.log('User:', currentUser);
console.log('Cart:', cartItems);
console.log('Firebase:', import.meta.env);
```

## 📈 Roadmap

- [ ] Payment gateway (Stripe/Midtrans)
- [ ] Push notifications
- [ ] Image upload (Firebase Storage)
- [ ] Product reviews & ratings
- [ ] Order tracking real-time
- [ ] Admin dashboard
- [ ] Analytics

## 📄 License

MIT License

---

**Made with ❤️ for Indonesian motorcycle riders**
