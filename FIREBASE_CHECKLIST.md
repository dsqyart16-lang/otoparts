# 🚀 Firebase Setup Checklist

Gunakan checklist ini untuk memastikan Firebase sudah fully integrated.

## ✅ Installation & Setup

- [ ] `npm install firebase` sudah dijalankan
- [ ] `package.json` menampilkan `"firebase": "^..."` di dependencies
- [ ] `src/firebase.js` exist dan berisi Firebase service layer
- [ ] `.env.local` file exist di root folder

## 📋 Firebase Project Setup

- [ ] Firebase project dibuat di console.firebase.google.com
- [ ] Realtime Database sudah di-enable
- [ ] Authentication dengan Email/Password sudah di-enable
- [ ] Firebase credentials di-copy ke `.env.local`

### .env.local Template
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_DATABASE_URL=xxx
```

## 🔐 Security Rules

- [ ] Firebase Security Rules sudah updated
- [ ] Test rules dengan "Test mode" atau proper rules
- [ ] Users database protected dengan auth checks
- [ ] Products readable for all, writable for sellers only
- [ ] Carts hanya accessible oleh owner

### Recommended Rules
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

## 🧪 Testing

- [ ] App berjalan tanpa error: `npm run dev`
- [ ] Login form menampilkan correct state:
  - [ ] Menampilkan "Mode Demo" jika Firebase tidak configured
  - [ ] Menampilkan input fields jika ready to login
- [ ] Bisa login dengan mock data (tanpa Firebase)
- [ ] Error message muncul jika login gagal

### Test Users (Create di Firebase Console)
- [ ] Email: `buyer@test.com` / Password: `password123`
- [ ] Email: `seller@test.com` / Password: `password123`

## 🔄 App Integration

- [ ] `src/App.jsx` import Firebase service: `import * as fb from './firebase'`
- [ ] `handleLogin()` menggunakan Firebase ketika available
- [ ] `handleLogout()` menggunakan Firebase ketika available
- [ ] Error handling dan loading states implemented
- [ ] `isFirebaseConfigured()` helper function bekerja correct

## 📦 Deployment Preparation

- [ ] `.gitignore` sudah mengignore `.env.local` (check: `*.local`)
- [ ] `.env.local` TIDAK tercakup dalam git commits
- [ ] README.md updated dengan Firebase info
- [ ] Documentation files exist:
  - [ ] `FIREBASE_SETUP.md`
  - [ ] `FIREBASE_INTEGRATION.md`
  - [ ] `README.md`

## 🌐 Local Development

- [ ] Dev server berjalan: `http://localhost:5173`
- [ ] HMR (Hot Module Replacement) bekerja
- [ ] Login button accessible di app
- [ ] Can switch between Buyer/Seller tipe

## ☁️ Production Deployment Ready

- [ ] Build command tested: `npm run build`
- [ ] Dist folder generated without errors
- [ ] Production hosting selected (Vercel/Netlify/etc)
- [ ] Environment variables setup di hosting platform
- [ ] Firebase project in "Production mode" (strict rules)

## 📚 Documentation

- [ ] Baca `FIREBASE_SETUP.md` untuk setup details
- [ ] Baca `FIREBASE_INTEGRATION.md` untuk API reference
- [ ] Baca `README.md` untuk project overview
- [ ] Review `src/firebase.js` untuk available functions

## 🔧 Troubleshooting Checklist

Jika ada issues, check:
- [ ] `.env.local` file ada dan lengkap
- [ ] Semua Firebase credentials correct
- [ ] Dev server di-restart setelah `.env.local` changes
- [ ] Firebase Console security rules sudah updated
- [ ] Browser console untuk error messages
- [ ] Firebase Console → Database untuk data verification

## 🎯 Next Features to Integrate

Untuk full Firebase integration:
- [ ] Real-time cart updates (listener)
- [ ] Real-time order tracking
- [ ] Real-time chat messages
- [ ] Product catalog dari Firebase
- [ ] User profiles saved to Firebase
- [ ] Order history from Firebase
- [ ] Firebase Storage untuk images
- [ ] Cloud Functions untuk order processing

## ✨ Completion Status

Total Tasks: **Sesuai checkbox di atas**

| Status | Task |
|--------|------|
| ✅ Done | Firebase package installed |
| ✅ Done | firebase.js service layer created |
| ✅ Done | .env.local template created |
| ✅ Done | App.jsx integrated with Firebase |
| ✅ Done | Documentation written |
| ⏳ Pending | Firebase project setup (user action) |
| ⏳ Pending | .env.local configuration (user action) |
| ⏳ Pending | Security Rules update (user action) |
| ⏳ Pending | Production deployment |

---

**Status**: 🟢 Ready for Firebase Integration
**Time to Setup**: ~15-20 minutes (Firebase project creation)
**Time to First Login**: ~5 minutes (after Firebase setup)

**Good luck! 🚀**
