import { initializeApp } from "firebase/app";
import {getFirestore, collection, serverTimestamp, addDoc, query, getDocs, where, orderBy, onSnapshot, updateDoc} from 'firebase/firestore'
// https://firebase.google.com/docs/web/setup#available-libraries


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoxpP6r5iuxRBZS9eO2qmfdPPinTW-oOc",
  authDomain: "chatroom-6c054.firebaseapp.com",
  projectId: "chatroom-6c054",
  storageBucket: "chatroom-6c054.firebasestorage.app",
  messagingSenderId: "628750499109",
  appId: "1:628750499109:web:e74c36471fa93cb0f9eecc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db, collection, serverTimestamp, addDoc, query, getDocs, where, orderBy, onSnapshot, updateDoc };
