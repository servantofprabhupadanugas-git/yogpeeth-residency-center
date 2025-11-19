// auth.js - handles login/signup using Firebase compat SDK
(function() {
  // Ensure firebase, auth and db are available
  const firebaseGlobal = window.firebase;
  const auth = window.auth || (firebaseGlobal && firebaseGlobal.auth && firebaseGlobal.auth());
  const db = window.db || (firebaseGlobal && firebaseGlobal.firestore && firebaseGlobal.firestore());

  if (!auth || !db) {
    console.error('Firebase auth or db not available. Make sure firebase-config.js is loaded and sets window.auth/window.db');
    return;
  }

  // DOM elements
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const signInBtn = document.getElementById('sign-in');
  const signUpBtn = document.getElementById('sign-up');
  const googleBtn = document.getElementById('google-signin');
  const facebookBtn = document.getElementById('facebook-signin');

  function saveUserToFirestore(user, providerName = 'password') {
    if (!user) return Promise.resolve();
    const uid = user.uid;
    const data = {
      uid,
      email: user.email || null,
      name: user.displayName || null,
      provider: providerName,
      lastSeen: firebaseGlobal.firestore.FieldValue.serverTimestamp()
    };
    return db.collection('users').doc(uid).set(data, { merge: true });
  }

  signInBtn && signInBtn.addEventListener('click', (e) => {
    const email = (emailEl && emailEl.value) || '';
    const password = (passwordEl && passwordEl.value) || '';
    if (!email || !password) { alert('Please enter email and password.'); return; }

    auth.signInWithEmailAndPassword(email, password)
      .then((cred) => {
        saveUserToFirestore(cred.user, 'password').then(() => {
          // Redirect after successful sign-in
          window.location.href = 'index.html';
        });
      })
      .catch((err) => { alert('Sign-in failed: ' + err.message); console.error(err); });
  });

  signUpBtn && signUpBtn.addEventListener('click', (e) => {
    const email = (emailEl && emailEl.value) || '';
    const password = (passwordEl && passwordEl.value) || '';
    if (!email || !password) { alert('Please enter email and password to sign up.'); return; }

    auth.createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        // Optionally set displayName, roles, etc.
        saveUserToFirestore(cred.user, 'password').then(() => {
          window.location.href = 'index.html';
        });
      })
      .catch((err) => { alert('Sign-up failed: ' + err.message); console.error(err); });
  });

  googleBtn && googleBtn.addEventListener('click', () => {
    const provider = new firebaseGlobal.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => saveUserToFirestore(result.user, 'google'))
      .then(() => { window.location.href = 'index.html'; })
      .catch((err) => { alert('Google sign-in failed: ' + err.message); console.error(err); });
  });

  facebookBtn && facebookBtn.addEventListener('click', () => {
    const provider = new firebaseGlobal.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => saveUserToFirestore(result.user, 'facebook'))
      .then(() => { window.location.href = 'index.html'; })
      .catch((err) => { alert('Facebook sign-in failed: ' + err.message); console.error(err); });
  });

  // Optional: redirect if already signed in
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Already signed in — send to home
      // small delay to avoid interrupting sign-in flow
      setTimeout(() => { window.location.href = 'index.html'; }, 500);
    }
  });

})();
