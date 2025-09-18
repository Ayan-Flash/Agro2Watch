import { initializeApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Phone Auth Provider
export const phoneAuthProvider = new PhoneAuthProvider(auth);

// ReCAPTCHA verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (elementId: string = 'recaptcha-container') => {
  console.log('🔧 Setting up reCAPTCHA for element:', elementId);
  
  // Clear existing verifier if any
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (error) {
      console.warn('⚠️ Error clearing existing reCAPTCHA:', error);
    }
    recaptchaVerifier = null;
  }

  // Check if element exists
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('❌ reCAPTCHA container element not found:', elementId);
    throw new Error(`reCAPTCHA container element '${elementId}' not found`);
  }

  try {
    recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('✅ reCAPTCHA solved successfully', response);
      },
      'expired-callback': () => {
        console.warn('⚠️ reCAPTCHA expired, please try again');
        // Clear the verifier so it can be recreated
        if (recaptchaVerifier) {
          try {
            recaptchaVerifier.clear();
          } catch (error) {
            console.warn('⚠️ Error clearing expired reCAPTCHA:', error);
          }
          recaptchaVerifier = null;
        }
      },
      'error-callback': (error: any) => {
        console.error('❌ reCAPTCHA error:', error);
        // Clear the verifier so it can be recreated
        if (recaptchaVerifier) {
          try {
            recaptchaVerifier.clear();
          } catch (clearError) {
            console.warn('⚠️ Error clearing error reCAPTCHA:', clearError);
          }
          recaptchaVerifier = null;
        }
      }
    });

    console.log('✅ reCAPTCHA verifier created successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('❌ Error creating reCAPTCHA verifier:', error);
    recaptchaVerifier = null;
    throw error;
  }
};

export const getRecaptchaVerifier = (elementId: string = 'recaptcha-container') => {
  if (!recaptchaVerifier) {
    console.log('🔄 Creating new reCAPTCHA verifier');
    return setupRecaptcha(elementId);
  }
  return recaptchaVerifier;
};

export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
      console.log('✅ reCAPTCHA cleared successfully');
    } catch (error) {
      console.warn('⚠️ Error clearing reCAPTCHA:', error);
    }
    recaptchaVerifier = null;
  }
};

// Phone number authentication functions
export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; verificationId?: string; error?: string }> => {
  try {
    console.log('📱 Firebase sendOTP called for:', phoneNumber);
    
    // Ensure reCAPTCHA is properly set up
    const appVerifier = getRecaptchaVerifier();
    console.log('🔧 reCAPTCHA verifier obtained:', !!appVerifier);
    
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneNumber, appVerifier);
    console.log('✅ Firebase OTP sent successfully, verification ID:', verificationId);
    
    return {
      success: true,
      verificationId: verificationId
    };
  } catch (error: any) {
    console.error('❌ Firebase sendOTP error:', error);
    
    // Clear reCAPTCHA on error so it can be recreated
    clearRecaptcha();
    
    return {
      success: false,
      error: error.message || 'Failed to send OTP'
    };
  }
};

export const verifyOTP = async (verificationId: string, otp: string): Promise<{ success: boolean; user?: any; error?: string }> => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify OTP'
    };
  }
};

// User management functions
export const createUserProfile = async (user: any, additionalData: any) => {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', user.uid);
    
    const userData = {
      uid: user.uid,
      phone: user.phoneNumber,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      ...additionalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userRef, userData);
    return { success: true, userData };
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid: string, updates: any) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', uid);
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updateData);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

export default app;
