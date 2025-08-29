// Debug Firebase connection
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBmYy3C1hZuuViQ9w6jr3NJedszTVyzSO4",
  authDomain: "forecasting-548b7.firebaseapp.com", 
  projectId: "forecasting-548b7",
  storageBucket: "forecasting-548b7.firebasestorage.app",
  messagingSenderId: "831093641890",
  appId: "1:831093641890:web:77a21d2eb9567587a07dfb"
};

console.log('Testing Firebase config...');
console.log('API Key length:', firebaseConfig.apiKey.length);
console.log('API Key starts with:', firebaseConfig.apiKey.substring(0, 10));

try {
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}