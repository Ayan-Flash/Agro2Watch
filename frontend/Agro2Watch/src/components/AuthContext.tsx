import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { firebaseAuth } from '../lib/firebase';

interface User {
  id: string;
  phone: string;
  aadhar?: string;
  name?: string;
  email?: string;
  location?: string;
  farmSize?: number;
  cropType?: 'corn' | 'vegetables' | 'both';
  isProfileComplete: boolean;
  verified: boolean;
  joinedAt: string;
  role?: 'admin' | 'farmer';
  firebase_uid?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<boolean>;
  loginWithAadhar: (aadhar: string, otp: string) => Promise<boolean>;
  signup: (phone: string, name: string, email?: string, password?: string) => Promise<boolean>;
  sendOTP: (phone: string, purpose?: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string, purpose?: string) => Promise<boolean>;
  sendAadharOTP: (aadhar: string) => Promise<boolean>;
  completeProfile: (farmSize: number, location: string, soilType?: string, irrigationType?: string, experienceYears?: number) => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    aadhar?: string;
    email?: string;
    location?: string;
    farmSize?: number;
    cropType?: 'corn' | 'vegetables' | 'both';
  }) => Promise<void>;
  logout: () => void;
  firebaseLogin: (firebaseToken: string) => Promise<boolean>;
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
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('agrowatch_user');
      const savedToken = localStorage.getItem('agrowatch_token');
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setAuthToken(savedToken);
          
          // Verify token is still valid by fetching profile
          try {
            const profile = await api.auth.getProfile(savedToken);
            setUser(profile);
          } catch (error) {
            console.error('Token validation failed:', error);
            // Clear invalid session
            localStorage.removeItem('agrowatch_user');
            localStorage.removeItem('agrowatch_token');
            setUser(null);
            setAuthToken(null);
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('agrowatch_user');
          localStorage.removeItem('agrowatch_token');
        }
      }
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Save user and token to localStorage whenever they change
  useEffect(() => {
    if (user && authToken) {
      localStorage.setItem('agrowatch_user', JSON.stringify(user));
      localStorage.setItem('agrowatch_token', authToken);
    }
  }, [user, authToken]);

  const login = async (phone: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(phone, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        if (response.access_token) {
          setAuthToken(response.access_token);
          // Sign in with Firebase if token is available
          const firebaseResult = await firebaseAuth.signInWithCustomToken(response.access_token);
          if (!firebaseResult.success) {
            console.warn('Firebase sign-in failed:', firebaseResult.error);
          }
        }
        
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
      // For now, this is a placeholder for Aadhar-based login
      // In future, this could integrate with government APIs
      console.log(`Aadhar login attempted for: ${aadhar} with OTP: ${otp}`);
      
      // Demo implementation
      if (otp === '123456') {
        // Create or find user with Aadhar
        const demoUser: User = {
          id: `aadhar_${Date.now()}`,
          aadhar,
          phone: '', 
          name: 'Aadhar User',
          verified: true,
          isProfileComplete: false,
          joinedAt: new Date().toISOString()
        };
        
        setUser(demoUser);
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

  const signup = async (phone: string, name: string, email?: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.auth.register({
        phone,
        name,
        email,
        password
      });
      
      if (response.success && response.user) {
        setUser(response.user);
        
        if (response.access_token) {
          setAuthToken(response.access_token);
          // Sign in with Firebase if token is available
          const firebaseResult = await firebaseAuth.signInWithCustomToken(response.access_token);
          if (!firebaseResult.success) {
            console.warn('Firebase sign-in failed:', firebaseResult.error);
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string, purpose: string = 'login'): Promise<boolean> => {
    try {
      const response = await api.auth.sendOTP(phone, purpose);
      return response.success;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  const verifyOTP = async (phone: string, otp: string, purpose: string = 'login'): Promise<boolean> => {
    try {
      const response = await api.auth.verifyOTP(phone, otp, purpose);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        if (response.access_token) {
          setAuthToken(response.access_token);
          // Sign in with Firebase if token is available
          const firebaseResult = await firebaseAuth.signInWithCustomToken(response.access_token);
          if (!firebaseResult.success) {
            console.warn('Firebase sign-in failed:', firebaseResult.error);
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Verify OTP error:', error);
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

  const completeProfile = async (farmSize: number, location: string, soilType?: string, irrigationType?: string, experienceYears?: number): Promise<void> => {
    if (!user || !authToken) return;
    
    try {
      const profileData = {
        farm_size: farmSize,
        location,
        soil_type: soilType,
        irrigation_type: irrigationType,
        experience_years: experienceYears
      };
      
      const response = await api.auth.createFarmerProfile(profileData, authToken);
      
      if (response) {
        // Update user state to reflect profile completion
        const updatedUser = {
          ...user,
          isProfileComplete: true,
          location
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: {
    name?: string;
    aadhar?: string;
    email?: string;
    location?: string;
    farmSize?: number;
    cropType?: 'corn' | 'vegetables' | 'both';
  }): Promise<void> => {
    if (!user || !authToken) return;
    try {
      const response = await api.auth.updateProfile(updates, authToken);
      
      if (response) {
        setUser(response);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (authToken) {
        await api.auth.logout();
      }
      await firebaseAuth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('agrowatch_user');
      localStorage.removeItem('agrowatch_token');
    }
  };

  const firebaseLogin = async (firebaseToken: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.auth.firebaseLogin(firebaseToken);
      
      if (response.success && response.user) {
        setUser(response.user);
        setAuthToken(firebaseToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Firebase login error:', error);
      return false;
    } finally {
      setIsLoading(false);
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
    logout,
    firebaseLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;