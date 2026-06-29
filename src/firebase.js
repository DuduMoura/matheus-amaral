import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Substitua estas configurações pelas chaves do seu projeto no Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZFfVnLJZLCbKTGfrwNe-3WYIykkIRYPs",
  authDomain: "bread-pitt-8d76e.firebaseapp.com",
  projectId: "bread-pitt-8d76e",
  storageBucket: "bread-pitt-8d76e.firebasestorage.app",
  messagingSenderId: "933861074448",
  appId: "1:933861074448:web:9edd11ebc979669f92cc95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);