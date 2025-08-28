import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmYy3C1hZuuViQ9w6jr3NJedszTVyzSO4",
  authDomain: "forecasting-548b7.firebaseapp.com",
  projectId: "forecasting-548b7",
  storageBucket: "forecasting-548b7.firebasestorage.app",
  messagingSenderId: "831093641890",
  appId: "1:831093641890:web:77a21d2eb9567587a07dfb",
  measurementId: "G-NLFE7QTLSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;