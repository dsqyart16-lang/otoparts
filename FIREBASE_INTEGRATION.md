# Firebase Integration - Panduan Penggunaan

## Ringkasan Perubahan

Aplikasi OtoParts kini dilengkapi dengan integrasi Firebase untuk persisten data, autentikasi real-time, dan sinkronisasi data.

## File-File Baru

### 1. `/src/firebase.js`
Service layer Firebase yang menyediakan:
- **Auth Functions**: `registerUser()`, `loginUser()`, `logoutUser()`, `onAuthChange()`
- **Product Functions**: `addProduct()`, `getProducts()`, `onProductsChange()`
- **Cart Functions**: `addToCart()`, `getCart()`, `updateCartItem()`, `removeFromCart()`, `onCartChange()`
- **Order Functions**: `createOrder()`, `getOrders()`, `onOrdersChange()`
- **Chat Functions**: `sendMessage()`, `onChatChange()`
- **Profile Functions**: `updateUserProfile()`, `getUserProfile()`

### 2. `/.env.local`
File konfigurasi Firebase (JANGAN COMMIT):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_DATABASE_URL=...
```

## Perubahan di App.jsx

### State Baru
```javascript
const [isLoading, setIsLoading] = useState(false);      // Loading state
const [firebaseError, setFirebaseError] = useState(null);  // Error messages
```

### Fungsi Baru
```javascript
// Check if Firebase is properly configured
isFirebaseConfigured()
```

### Fungsi yang Diupdate
```javascript
handleLogin()   // Sekarang support Firebase + fallback to mock
handleLogout()  // Sekarang clear cart dan support Firebase logout
```

### UI Improvements
- Error messages di login form
- Loading indicator saat login
- "Mode Demo" message ketika Firebase belum dikonfigurasi
- Disabled state untuk form saat loading

## Cara Menggunakan Firebase

### 1. Setup (Lihat `FIREBASE_SETUP.md`)

### 2. Login dengan Firebase
```javascript
import * as fb from './firebase';

// User akan login dengan email/password
// Data akan disimpan di Firebase Realtime Database
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    if (isFirebaseConfigured()) {
      await fb.loginUser(email, password);
      // User berhasil login
    }
  } catch (error) {
    // Handle error
  }
};
```

### 3. Menambah Produk (Seller)
```javascript
await fb.addProduct({
  name: 'Kampas Rem',
  price: 55000,
  category: 'pengereman',
  description: 'Kampas rem original',
  // ... fields lainnya
});
```

### 4. Menambah ke Keranjang
```javascript
await fb.addToCart(userId, {
  id: 'p1',
  name: 'Kampas Rem',
  price: 55000,
  quantity: 1
});
```

### 5. Real-time Listener untuk Cart
```javascript
fb.onCartChange(userId, (cartItems) => {
  // cartItems sudah update secara real-time
  setCartItems(cartItems);
});
```

## Fallback Mode (Mock Data)

Jika Firebase belum dikonfigurasi atau tidak tersedia:
- ✅ App tetap berfungsi (menggunakan mock data)
- ✅ Login akan menggunakan data lokal (no Firebase)
- ℹ️ Data tidak akan persistent (hilang saat refresh)
- ℹ️ Pesan "Mode Demo" ditampilkan di login

## Environment Variables

### Development (.env.local)
```
VITE_FIREBASE_API_KEY=your_dev_key
VITE_FIREBASE_AUTH_DOMAIN=your-dev-project.firebaseapp.com
...
```

### Production
- Deploy ke platform seperti Vercel/Netlify
- Set environment variables di platform dashboard
- Jangan commit .env.local

## Security Best Practices

### Firebase Rules untuk Production
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "products": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('userType').val() === 'seller'"
    }
  }
}
```

### Tips Keamanan
- ✅ Jangan expose API Key di client-side (gunakan Firebase Security Rules)
- ✅ Validasi semua input di client dan server
- ✅ Gunakan Authentication sebelum write/update
- ✅ Set Production Rules sebelum go-live
- ✅ Monitor Firebase Console untuk suspicious activities

## Debugging

### Check Firebase Configuration
```javascript
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
});
```

### Check Authentication State
```javascript
fb.onAuthChange((user) => {
  console.log('Current user:', user);
});
```

### Firebase Console Monitoring
- Real-time Database → Data
- Authentication → Users
- Database → Rules

## Roadmap Integrasi Firebase

- [ ] Simpan cart ke Firebase (semi-implemented)
- [ ] Real-time order tracking
- [ ] Chat dengan Firebase Functions
- [ ] Upload gambar produk ke Firebase Storage
- [ ] Analytics & Performance Monitoring
- [ ] Cloud Functions untuk order processing

## Need Help?

1. **Setup Issues**: Lihat `FIREBASE_SETUP.md`
2. **API Reference**: Lihat dokumentasi di `/src/firebase.js`
3. **Firebase Docs**: https://firebase.google.com/docs
4. **Error Messages**: Check browser console untuk detailed errors

---

**Last Updated**: March 4, 2026
