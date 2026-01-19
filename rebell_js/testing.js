let products = []

// Funksjon for å legge til nye elementer
function addItem(name, category, price) {
  const newItem = {
    id: items.length + 1, // enkel id
    name,
    category,
    price
  };
  items.push(newItem);
  console.log(`Lagt til:`, newItem);
}

// Test firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBUtgDsI6KtuQuHhVGg-NnAW0LpahsDAfk",
    authDomain: "rebell-ub.firebaseapp.com",
    projectId: "rebell-ub",
    storageBucket: "rebell-ub.firebasestorage.app",
    messagingSenderId: "137665480014",
    appId: "1:137665480014:web:c163f97f817af427af4a1f",
    measurementId: "G-WYZEPSZZK6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const productRef = ref(db, 'currentProduct');

const inputField = document.getElementById('prduct-input')