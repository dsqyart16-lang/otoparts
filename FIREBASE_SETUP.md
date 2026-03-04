# Firebase Setup Guide untuk OtoParts

Panduan ini menjelaskan cara mengkonfigurasi Firebase untuk aplikasi OtoParts.

## Langkah-Langkah Setup Firebase

### 1. Buat Project Firebase
- Kunjungi [Firebase Console](https://console.firebase.google.com/)
- Klik "Add project" atau "Create a project"
- Masukkan nama project (misalnya: "otoparts")
- Ikuti wizard untuk menyelesaikan pembuatan project

### 2. Aktifkan Realtime Database
- Dari Firebase Console, pilih project Anda
- Di sidebar kiri, pilih **"Build" → "Realtime Database"**
- Klik **"Create Database"**
- Pilih lokasi terdekat dengan users Anda
- Pilih mode **"Start in test mode"** (untuk development)
  - ⚠️ Ingat: Ganti ke "locked mode" sebelum production
- Klik **"Enable"**

### 3. Aktifkan Authentication
- Dari Firebase Console, pilih **"Build" → "Authentication"**
- Klik tab **"Sign-in method"**
- Klik **"Email/Password"**
- Enable **"Email/Password"**
- Klik **"Save"**

### 4. Dapatkan Firebase Config
- Dari Firebase Console, klik ⚙️ (Settings) → **"Project Settings"**
- Scroll ke bawah ke section **"Your apps"**
- Klik icon **"<>"** (Web) jika ada
- Copy konfigurasi yang ditampilkan
- Atau klik **"Add app"** → **"Web"** dan ikuti instruksi

### 5. Isi .env.local File
Buat file `.env.local` di root folder project (jika belum ada):

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

Contoh dari Firebase Config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxample...",
  authDomain: "otoparts-abc.firebaseapp.com",
  projectId: "otoparts-abc",
  storageBucket: "otoparts-abc.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefgh123456",
  databaseURL: "https://otoparts-abc.firebaseio.com"
};
```

### 6. Konfigurasi Security Rules (PENTING!)

Di Firebase Console → Realtime Database → **"Rules"**, ganti dengan:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['email', 'userType', 'name'])"
      }
    },
    "products": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('userType').val() === 'seller'",
      "$productId": {
        ".validate": "newData.hasChildren(['name', 'price', 'category'])"
      }
    },
    "carts": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "orders": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "chats": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Klik **"Publish"** untuk menyimpan rules.

### 7. Struktur Database

Aplikasi akan membuat struktur database otomatis:

```
otoparts-database/
├── users/
│   ├── {uid}/
│   │   ├── email: string
│   │   ├── userType: "buyer" | "seller"
│   │   ├── name: string
│   │   └── createdAt: timestamp
├── products/
│   ├── {productId}/
│   │   ├── name: string
│   │   ├── price: number
│   │   ├── category: string
│   │   └── ...
├── carts/
│   ├── {userId}/
│   │   ├── {itemId}/
│   │   │   ├── name: string
│   │   │   ├── price: number
│   │   │   ├── quantity: number
│   │   │   └── ...
├── orders/
│   ├── {userId}/
│   │   ├── {orderId}/
│   │   │   ├── items: array
│   │   │   ├── total: number
│   │   │   ├── status: "pending" | "completed" | "cancelled"
│   │   │   └── ...
└── chats/
    ├── {shopName}/
    │   ├── {messageId}/
    │   │   ├── text: string
    │   │   ├── sender: "user" | "seller"
    │   │   └── timestamp: timestamp
```

## Testing Login

Gunakan akun test Firebase atau buat user baru:

### Menggunakan Firebase Console
1. Buka Firebase Console → Authentication → Users
2. Klik **"Add user"**
3. Masukkan email & password
4. Klik **"Add user"**

### Di Aplikasi
- Akses halaman login
- Masukkan email dan password
- Pilih tipe pengguna (Pembeli/Penjual)
- Klik **"Masuk"**

## Mode Development

Saat `.env.local` belum dikonfigurasi atau tidak valid, aplikasi akan:
- Menampilkan pesan "Mode Demo: Firebase belum dikonfigurasi"
- Menggunakan mock data lokal
- Tetap berfungsi normal tanpa koneksi Firebase

## Troubleshooting

### Error: "MISSING or INSUFFICIENT PERMISSIONS"
- Pastikan Security Rules sudah di-update
- Restart aplikasi setelah mengubah rules

### Error: "Cannot find module 'firebase'"
- Jalankan: `npm install firebase`

### Firebase config tidak terdeteksi
- Periksa file `.env.local` sudah ada di root folder
- Pastikan nama variabel dimulai dengan `VITE_`
- Restart dev server setelah mengubah `.env.local`

### Preview: http://localhost:5173

## File-File Relevan
- `/src/firebase.js` - Firebase service & functions
- `/.env.local` - Firebase configuration (jangan commit!)
- `/package.json` - Dependencies

## Next Steps
1. Setup Firebase Testing dengan Firestore Emulator (optional)
2. Integrasikan pembayaran (Stripe/Midtrans)
3. Deploy ke production dengan mode keamanan penuh

---

**Catatan:** Jangan pernah commit file `.env.local` ke git. Ada di `.gitignore` untuk keamanan.
