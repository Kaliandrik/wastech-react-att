// Verifique se o firebase/config.ts está EXATAMENTE assim:
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCp2xHQUeMipoA44g_QyZ71dnaRHnpGJtQ",
  authDomain: "wastech-8d384.firebaseapp.com",
  projectId: "wastech-8d384",
  storageBucket: "wastech-8d384.appspot.com",
  messagingSenderId: "957838233480",
  appId: "1:957838233480:web:576ae21101e425ed0d343d",
  measurementId: "G-9N582ETX68"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);