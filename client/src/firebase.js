// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZXYgBSxqECkt4URmjvYq1lutBkmOC0aU",
  authDomain: "aems-d71f2.firebaseapp.com",
  projectId: "aems-d71f2",
  storageBucket: "aems-d71f2.appspot.com",
  messagingSenderId: "489314976801",
  appId: "1:489314976801:web:1c4e2c4a890549eb374f60",
  measurementId: "G-DM6YJLNME9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ export only auth
