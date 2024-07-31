import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNKm71S9em0FiclHu3Mo8F1aD-FoZnEMU",
  authDomain: "my-app-4c69f.firebaseapp.com",
  projectId: "my-app-4c69f",
  storageBucket: "my-app-4c69f.appspot.com",
  messagingSenderId: "143091395672",
  appId: "1:143091395672:web:de19d79d162542680f2e2d",
  measurementId: "G-TGYLGMZZVJ",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
