import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  remove,
  onValue,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Auth Functions
export const registerUser = (email, password, userData) => {
  return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const uid = userCredential.user.uid;
    return set(ref(database, `users/${uid}`), {
      email,
      userType: userData.userType,
      name: userData.name,
      createdAt: new Date().toISOString(),
      ...userData
    }).then(() => ({ uid, ...userData }));
  });
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    return get(ref(database, `users/${userCredential.user.uid}`)).then((snapshot) => {
      return { uid: userCredential.user.uid, ...snapshot.val() };
    });
  });
};

export const logoutUser = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await get(ref(database, `users/${user.uid}`));
      callback({ uid: user.uid, ...userData.val() });
    } else {
      callback(null);
    }
  });
};

// Products Functions
export const addProduct = (product) => {
  return push(ref(database, 'products'), {
    ...product,
    createdAt: new Date().toISOString()
  });
};

export const getProducts = () => {
  return get(ref(database, 'products')).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }));
    }
    return [];
  });
};

export const onProductsChange = (callback) => {
  onValue(ref(database, 'products'), (snapshot) => {
    if (snapshot.exists()) {
      const products = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }));
      callback(products);
    } else {
      callback([]);
    }
  });
};

// Cart Functions
export const addToCart = (userId, product) => {
  return push(ref(database, `carts/${userId}`), {
    ...product,
    quantity: 1,
    addedAt: new Date().toISOString()
  });
};

export const getCart = (userId) => {
  return get(ref(database, `carts/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        cartItemId: id,
        ...data
      }));
    }
    return [];
  });
};

export const updateCartItem = (userId, cartItemId, quantity) => {
  if (quantity <= 0) {
    return remove(ref(database, `carts/${userId}/${cartItemId}`));
  }
  return update(ref(database, `carts/${userId}/${cartItemId}`), { quantity });
};

export const removeFromCart = (userId, cartItemId) => {
  return remove(ref(database, `carts/${userId}/${cartItemId}`));
};

export const onCartChange = (userId, callback) => {
  onValue(ref(database, `carts/${userId}`), (snapshot) => {
    if (snapshot.exists()) {
      const cartItems = Object.entries(snapshot.val()).map(([id, data]) => ({
        cartItemId: id,
        ...data
      }));
      callback(cartItems);
    } else {
      callback([]);
    }
  });
};

// Orders Functions
export const createOrder = (userId, orderData) => {
  return push(ref(database, `orders/${userId}`), {
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
};

export const getOrders = (userId) => {
  return get(ref(database, `orders/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        orderId: id,
        ...data
      }));
    }
    return [];
  });
};

export const onOrdersChange = (userId, callback) => {
  onValue(ref(database, `orders/${userId}`), (snapshot) => {
    if (snapshot.exists()) {
      const orders = Object.entries(snapshot.val()).map(([id, data]) => ({
        orderId: id,
        ...data
      }));
      callback(orders);
    } else {
      callback([]);
    }
  });
};

// Chat Functions
export const sendMessage = (shopName, userId, message) => {
  return push(ref(database, `chats/${shopName}`), {
    userId,
    text: message,
    sender: 'user',
    timestamp: new Date().toISOString()
  });
};

export const onChatChange = (shopName, callback) => {
  onValue(ref(database, `chats/${shopName}`), (snapshot) => {
    if (snapshot.exists()) {
      const messages = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }));
      callback(messages);
    } else {
      callback([]);
    }
  });
};

// User Profile Functions
export const updateUserProfile = (userId, profileData) => {
  return update(ref(database, `users/${userId}`), profileData);
};

export const getUserProfile = (userId) => {
  return get(ref(database, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  });
};

export default {
  auth,
  database,
  registerUser,
  loginUser,
  logoutUser,
  onAuthChange,
  addProduct,
  getProducts,
  onProductsChange,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  onCartChange,
  createOrder,
  getOrders,
  onOrdersChange,
  sendMessage,
  onChatChange,
  updateUserProfile,
  getUserProfile
};
