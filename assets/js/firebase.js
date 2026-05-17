// Firebase initialization + Firestore helpers
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs,
    doc, deleteDoc, updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { firebaseConfig } from "./config.local.js";

const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// Re-export Firebase APIs so other modules import from one place
export { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where };
export { signInWithEmailAndPassword, signOut, onAuthStateChanged };
