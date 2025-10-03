import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC178eWMFdsEiXKyRvOhTuSc6yoED3npgE",
  authDomain: "projectgroup3-aa58b.firebaseapp.com",
  projectId: "projectgroup3-aa58b",
  storageBucket: "projectgroup3-aa58b.firebasestorage.app",
  messagingSenderId: "1031481233503",
  appId: "1:1031481233503:web:44eddb4f5cd21732ea8bea"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };

