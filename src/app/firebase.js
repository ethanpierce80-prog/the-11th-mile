import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR FIREBASE CONFIG KEYS BELOW THIS LINE ---
const firebaseConfig = {
  apiKey: "AIzaSyBiZaNu_XIJFIz49aq4Du8tBvX4Azgv0VM",
  authDomain: "the-11th-mile.firebaseapp.com",
  projectId: "the-11th-mile",
  storageBucket: "the-11th-mile.firebasestorage.app",
  messagingSenderId: "777872637255",
  appId: "1:777872637255:web:9ca96ad9c74fbbc393e062",
  measurementId: "G-D2Q8YP1ZNX"
};
// --- PASTE YOUR FIREBASE CONFIG KEYS ABOVE THIS LINE ---

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const logInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);