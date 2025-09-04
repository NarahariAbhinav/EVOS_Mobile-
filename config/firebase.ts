import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCys5vhV1TfdOeMs5gz48pefCsTewkO-hQ",
  authDomain: "evos-a384b.firebaseapp.com",
  projectId: "evos-a384b",
  storageBucket: "evos-a384b.firebasestorage.app",
  messagingSenderId: "466965235814",
  appId: "1:466965235814:web:85f69beffb21e029cac5a7",
  measurementId: "G-SEZRJN40DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;