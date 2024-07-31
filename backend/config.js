const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyDNKm71S9em0FiclHu3Mo8F1aD-FoZnEMU",
  authDomain: "my-app-4c69f.firebaseapp.com",
  projectId: "my-app-4c69f",
  storageBucket: "my-app-4c69f.appspot.com",
  messagingSenderId: "143091395672",
  appId: "1:143091395672:web:de19d79d162542680f2e2d",
  measurementId: "G-TGYLGMZZVJ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const Employee = db.collection("Employees");
const Task = db.collection("Tasks");
const Chat = db.collection("Chat");
module.exports = { Employee, Task, Chat };
