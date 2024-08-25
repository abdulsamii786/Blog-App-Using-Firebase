import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwOMhXWfpPbrwqvdP8g31btlit49-SNIY",
  authDomain: "mini-hackathon-3e681.firebaseapp.com",
  projectId: "mini-hackathon-3e681",
  storageBucket: "mini-hackathon-3e681.appspot.com",
  messagingSenderId: "347074658190",
  appId: "1:347074658190:web:081eb3979e66936a71eedf",
  measurementId: "G-BXGSYYTJ9R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  provider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
};
