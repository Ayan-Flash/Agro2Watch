import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, sendOTP as firebaseSendOTP, verifyOTP as firebaseVerifyOTP, createUserProfile, getUserProfile, updateUserProfile } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { sendTwilioOTP, sendTwilioOTPVerify, verifyTwilioOTP, generateOTP, validatePhoneNumber, isTwilioConfigured } from '@/lib/twilioService';
import { sendTwilioOTPDirect, sendTwilioOTPVerifyDirect, verifyTwilioOTPDirect, generateOTPDirect, validatePhoneNumberDirect, isTwilioConfiguredDirect } from '@/lib/twilioDirect';

interface User {
  id: string;
  phone: string;
  aadhar?: string;
  name?: string;
  location?: string;
  farmSize?: number;
  cropType?: 'corn' | 'vegetables' | 'both';
  isProfileComplete: boolean;
  verified: boolean;
  joinedAt: string;
  role?: 'admin' | 'farmer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  loginWithAadhar: (aadhar: string, otp: string) => Promise<boolean>;
  signup: (phone: string, password: string, name: string) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<{ success: boolean; verificationId?: string; error?: string }>;
  verifyOTP: (phone: string, otp: string, verificationId?: string) => Promise<boolean>;
  sendAadharOTP: (aadhar: string) => Promise<boolean>;
  completeProfile: (farmSize: number, cropType: 'corn' | 'vegetables' | 'both') => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    aadhar?: string;
    location?: string;
    farmSize?: number;
    cropType?: 'corn' | 'vegetables' | 'both';
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const profileResult = await getUserProfile(firebaseUser.uid);
          if (profileResult.success && profileResult.data) {
            const userData = profileResult.data;
            setUser({
              id: userData.uid,
              phone: userData.phone || firebaseUser.phoneNumber || '',
              name: userData.name || userData.displayName || '',
              location: userData.location || '',
              farmSize: userData.farmSize || 0,
              cropType: userData.cropType || 'corn',
              isProfileComplete: userData.isProfileComplete || false,
              verified: true,
              joinedAt: userData.createdAt || new Date().toISOString(),
              role: userData.role || 'farmer'
            });
          } else {
            // Create basic user profile if not exists
            const basicUser: User = {
              id: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || '',
              name: firebaseUser.displayName || '',
              isProfileComplete: false,
              verified: true,
              joinedAt: new Date().toISOString(),
              role: 'farmer'
            };
            setUser(basicUser);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to basic user data
          const basicUser: User = {
            id: firebaseUser.uid,
            phone: firebaseUser.phoneNumber || '',
            name: firebaseUser.displayName || '',
            isProfileComplete: false,
            verified: true,
            joinedAt: new Date().toISOString(),
            role: 'farmer'
          };
          setUser(basicUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For demo purposes, allow specific phone numbers
      if (phone === '9000012345') {
        // Demo farmer account
        const demoFarmer: User = {
          id: 'demo_farmer_001',
          phone: '9000012345',
          name: 'Demo Farmer',
          farmSize: 5,
          cropType: 'both',
          isProfileComplete: true,
          verified: true,
          joinedAt: new Date().toISOString()
        };
        setUser(demoFarmer);
        return true;
      }
      
      if (phone === '9999912345' && password === 'admin123') {
        // Demo admin account
        const demoAdmin: User = {
          id: 'demo_admin_001',
          phone: '9999912345',
          name: 'Demo Admin',
          farmSize: 0,
          cropType: 'corn',
          isProfileComplete: true,
          verified: true,
          joinedAt: new Date().toISOString(),
          role: 'admin'
        };
        setUser(demoAdmin);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithAadhar = async (aadhar: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate Aadhar verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === '123456') {
        const aadharUser: User = {
          id: `aadhar_${aadhar}`,
          aadhar,
          phone: '',
          name: 'Aadhar User',
          verified: true,
          isProfileComplete: false,
          joinedAt: new Date().toISOString()
        };
        setUser(aadharUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Aadhar login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (phone: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This would typically create a user in Firebase
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        phone,
        name,
        verified: false,
        isProfileComplete: false,
        joinedAt: new Date().toISOString()
      };
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<{ success: boolean; verificationId?: string; error?: string }> => {
    try {
      console.log('🔍 Starting OTP send process for:', phone);
      
      // Validate phone number
      if (!validatePhoneNumber(phone)) {
        console.error('❌ Invalid phone number format:', phone);
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      // Check Twilio configuration
      const hasTwilioConfig = isTwilioConfigured() || isTwilioConfiguredDirect();
      console.log('🔧 Twilio configured:', hasTwilioConfig);
      
      if (hasTwilioConfig) {
        console.log('📱 Using Twilio for OTP sending');
        
        try {
          // Try Twilio Verify service first (recommended)
          console.log('🔄 Attempting Twilio Verify...');
          const twilioVerifyResult = await sendTwilioOTPVerifyDirect(phone);
          console.log('📊 Twilio Verify result:', twilioVerifyResult);
          
          if (twilioVerifyResult.success) {
            setVerificationId(twilioVerifyResult.sid || '');
            console.log('✅ Twilio Verify OTP sent successfully');
            return {
              success: true,
              verificationId: twilioVerifyResult.sid
            };
          }
        } catch (verifyError) {
          console.warn('⚠️ Twilio Verify failed, trying direct SMS:', verifyError);
        }
        
        try {
          // Fallback to direct SMS
          console.log('📲 Attempting direct Twilio SMS...');
          const otpCode = generateOTPDirect();
          console.log('🔢 Generated OTP:', otpCode);
          
          const twilioResult = await sendTwilioOTPDirect(phone, otpCode);
          console.log('📊 Direct SMS result:', twilioResult);
          
          if (twilioResult.success) {
            setVerificationId(otpCode); // Store OTP for verification
            console.log('✅ Direct SMS OTP sent successfully');
            return {
              success: true,
              verificationId: otpCode
            };
          } else {
            console.error('❌ Direct SMS failed:', twilioResult.error);
          }
        } catch (smsError) {
          console.error('❌ Direct SMS error:', smsError);
        }
      }

      // Fallback to Firebase if Twilio not configured or fails
      console.log('🔥 Using Firebase for OTP sending (fallback)');
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      const result = await firebaseSendOTP(formattedPhone);
      console.log('📊 Firebase result:', result);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        console.log('✅ Firebase OTP sent successfully');
      }
      return result;
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  };

  const verifyOTP = async (phone: string, otp: string, verificationId?: string): Promise<boolean> => {
    try {
      console.log('🔍 Starting OTP verification for:', phone, 'OTP:', otp);
      
      // Check Twilio configuration
      const hasTwilioConfig = isTwilioConfigured() || isTwilioConfiguredDirect();
      console.log('🔧 Twilio configured for verification:', hasTwilioConfig);
      
      if (hasTwilioConfig) {
        console.log('📱 Using Twilio for OTP verification');
        
        try {
          // Try Twilio Verify service first
          console.log('🔄 Attempting Twilio Verify...');
          const twilioResult = await verifyTwilioOTPDirect(phone, otp);
          console.log('📊 Twilio Verify result:', twilioResult);
          
          if (twilioResult.success) {
            // Create a mock user session for Twilio verification
            const mockUser: User = {
              id: `twilio_${Date.now()}`,
              phone: phone,
              name: '',
              isProfileComplete: false,
              verified: true,
              joinedAt: new Date().toISOString(),
              role: 'farmer'
            };
            setUser(mockUser);
            console.log('✅ Twilio Verify OTP verified successfully');
            return true;
          } else {
            console.error('❌ Twilio Verify failed:', twilioResult.error);
          }
        } catch (verifyError) {
          console.error('❌ Twilio Verify error:', verifyError);
        }
      }

      // Fallback to Firebase verification
      console.log('🔥 Using Firebase for OTP verification (fallback)');
      const vid = verificationId || verificationId;
      if (!vid) {
        console.error('❌ No verification ID available');
        return false;
      }

      const result = await firebaseVerifyOTP(vid, otp);
      console.log('📊 Firebase verification result:', result);
      
      if (result.success && result.user) {
        console.log('✅ Firebase OTP verified successfully');
        // User is now authenticated via Firebase
        // The onAuthStateChanged listener will handle setting the user state
        return true;
      }
      
      console.error('❌ OTP verification failed');
      return false;
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      return false;
    }
  };

  const sendAadharOTP = async (aadhar: string): Promise<boolean> => {
    try {
      // Simulate Aadhar OTP request to UIDAI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, integrate with UIDAI API
      console.log(`Aadhar OTP sent to registered mobile for: ${aadhar}`);
      return true;
    } catch (error) {
      console.error('Send Aadhar OTP error:', error);
      return false;
    }
  };

  const completeProfile = async (farmSize: number, cropType: 'corn' | 'vegetables' | 'both'): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        farmSize,
        cropType,
        isProfileComplete: true
      };
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: {
    name?: string;
    aadhar?: string;
    location?: string;
    farmSize?: number;
    cropType?: 'corn' | 'vegetables' | 'both';
  }): Promise<void> => {
    if (!user) return;
    try {
      const updatedUser: User = {
        ...user,
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.aadhar !== undefined ? { aadhar: updates.aadhar } : {}),
        ...(updates.location !== undefined ? { location: updates.location } : {}),
        ...(updates.farmSize !== undefined ? { farmSize: updates.farmSize } : {}),
        ...(updates.cropType !== undefined ? { cropType: updates.cropType } : {}),
        isProfileComplete: updates.farmSize !== undefined || updates.cropType !== undefined ? true : user.isProfileComplete
      };

      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear local state
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithAadhar,
    signup,
    sendOTP,
    verifyOTP,
    sendAadharOTP,
    completeProfile,
    updateProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
