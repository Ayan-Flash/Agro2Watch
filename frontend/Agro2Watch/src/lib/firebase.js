import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCCziqCGhoe3PgvMmRKIBn43gs0Kb7XOdI",
  authDomain: "agrowatch-3e97f.firebaseapp.com",
  projectId: "agrowatch-3e97f",
  storageBucket: "agrowatch-3e97f.firebasestorage.app",
  messagingSenderId: "1002091625586",
  appId: "1:1002091625586:web:8fee6d23e3311edc0d96eb",
  measurementId: "G-LBP7FDSLSF"
};

// Initialize Firebase
function getFirebase() {
  return getApps()[0] || initializeApp(firebaseConfig);
}

// Initialize Firebase Auth
const app = getFirebase();
const auth = getAuth(app);

// Firebase Auth utilities
export const firebaseAuth = {
  // Sign in with custom token from backend
  async signInWithCustomToken(customToken) {
    try {
      const userCredential = await signInWithCustomToken(auth, customToken);
      return {
        success: true,
        user: userCredential.user,
        idToken: await userCredential.user.getIdToken()
      };
    } catch (error) {
      console.error('Firebase custom token sign in error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get current user's ID token
  async getCurrentUserToken() {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Firebase sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};

export { auth };
export default app;