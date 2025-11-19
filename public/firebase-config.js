// Firebase configuration (compatible with the <script> compat SDKs included in index.html)
// This file intentionally uses the compat/global API so it works when loaded
// via a plain <script> tag (no bundler / ES modules required).

const firebaseConfig = {
  apiKey: "AIzaSyCQ86V6o__dLEiaPdexQPBOyl8s_RC6GfM",
  authDomain: "yogpeeth-residency.firebaseapp.com",
  projectId: "yogpeeth-residency",
  storageBucket: "yogpeeth-residency.firebasestorage.app",
  messagingSenderId: "595375657805",
  appId: "1:595375657805:web:e361842b62d98898931d04",
  measurementId: "G-E5K6YPJTZJ"
};

// Initialize Firebase (compat)
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK not found. Make sure you include the compat scripts in your HTML before firebase-config.js');
} else {
  firebase.initializeApp(firebaseConfig);
  try { firebase.analytics && firebase.analytics(); } catch (e) { /* ignore */ }

  // Expose auth and db on window so other scripts (like app.js) can use them
  window.auth = firebase.auth();
  window.db = firebase.firestore();
  // window.storage = firebase.storage(); // Uncomment if needed
}
