import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration for SafeSpeak
const firebaseConfig = {
  apiKey: "AIzaSyB8-DkvcAr0-oUGuHfY0cowPV5ncR9mn44",
  authDomain: "safespeak-6c554.firebaseapp.com",
  databaseURL: "https://safespeak-6c554-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "safespeak-6c554",
  storageBucket: "safespeak-6c554.firebasestorage.app",
  messagingSenderId: "847458508055",
  appId: "1:847458508055:web:d954329ba43cb31ce3eb52",
  measurementId: "G-CNZWRTWKB2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
