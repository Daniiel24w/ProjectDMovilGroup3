import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC178eWMFdsEiXKyRvOhTuSc6yoED3npgE",
  authDomain: "projectgroup3-aa58b.firebaseapp.com",
  projectId: "projectgroup3-aa58b",
  storageBucket: "projectgroup3-aa58b.firebasestorage.app",
  messagingSenderId: "1031481233503",
  appId: "1:1031481233503:web:44eddb4f5cd21732ea8bea"
};

// Evita la reinicialización en entornos de desarrollo (hot-reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Esta función asegura que la inicialización con persistencia solo ocurra una vez.
const getFirebaseAuth = (app) => {
  try {
    return getAuth(app);
  } catch (error) {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  }
};

const auth = getFirebaseAuth(app);

const database = getFirestore(app);
const storage = getStorage(app);

export { auth, database, storage };
