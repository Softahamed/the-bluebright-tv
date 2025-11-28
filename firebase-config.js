// Firebase config placeholder.
// You provided a database URL: https://the-bluebright-tv-default-rtdb.asia-southeast1.firebasedatabase.app/
// To enable remote user storage and notifications across devices, paste your full
// Firebase Web app config below (found in Project Settings → General → Your apps → SDK snippet).
// Example - replace the placeholders with your actual values:

// Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyCwBxDod1lW9fteELwzCeOlYag2Ft49LGM",
  authDomain: "the-bluebright-tv.firebaseapp.com",
  databaseURL: "https://the-bluebright-tv-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "the-bluebright-tv",
  storageBucket: "the-bluebright-tv.firebasestorage.app",
  messagingSenderId: "485320680464",
  appId: "1:485320680464:web:439e3d622704f40b10d695",
  measurementId: "G-98Q031MZ9L"
};

// Initialize Firebase
try {
	if (typeof firebase !== 'undefined') {
		firebase.initializeApp(firebaseConfig);
		console.log('Firebase initialized. Realtime DB URL:', firebaseConfig.databaseURL);
	} else {
		console.warn('Firebase SDK not loaded yet. Ensure firebase-app.js and firebase-database.js are included.');
	}
} catch (e) {
	console.error('Error initializing Firebase:', e);
}

/* Important:
 - After pasting full config, ensure your Realtime Database rules permit reads/writes for your testing scenario.
 - For production, secure rules and consider Firebase Authentication to restrict writes.
*/
