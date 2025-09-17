import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  phone: string;
  aadhar?: string;
  name?: string;
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
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  sendAadharOTP: (aadhar: string) => Promise<boolean>;
  completeProfile: (farmSize: number, cropType: 'corn' | 'vegetables' | 'both') => Promise<void>;
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

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('agrowatch_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('agrowatch_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('agrowatch_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo accounts for testing
      if (phone === '9000012345') {
        // Demo farmer account - accepts any password
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
          role: 'admin' // Add admin role
        };
        setUser(demoAdmin);
        return true;
      }
      
      const users = JSON.parse(localStorage.getItem('agrowatch_users') || '[]');
      const existingUser = users.find((u: any) => u.phone === phone && u.password === password);
      
      if (existingUser) {
        setUser(existingUser);
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
      // Simulate API call for Aadhar verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OTP verification (in real app, verify with government API)
      if (otp === '123456') {
        const users = JSON.parse(localStorage.getItem('agrowatch_users') || '[]');
        let existingUser = users.find((u: any) => u.aadhar === aadhar);
        
        if (!existingUser) {
          // Create new user with Aadhar
          existingUser = {
            id: Date.now().toString(),
            aadhar,
            phone: '', // Will be updated later
            name: 'Aadhar User',
            verified: true,
            isProfileComplete: false,
            joinedAt: new Date().toISOString()
          };
          users.push(existingUser);
          localStorage.setItem('agrowatch_users', JSON.stringify(users));
        }
        
        setUser(existingUser);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('agrowatch_users') || '[]');
      const existingUser = users.find((u: any) => u.phone === phone);
      
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User = {
        id: Date.now().toString(),
        phone,
        name,
        verified: false, // Will be verified via OTP
        isProfileComplete: false,
        joinedAt: new Date().toISOString()
      };

      users.push({ ...newUser, password });
      localStorage.setItem('agrowatch_users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // Simulate sending OTP via SMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, integrate with SMS service like Twilio, AWS SNS, etc.
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP temporarily (in real app, store server-side with expiration)
      localStorage.setItem(`otp_${phone}`, JSON.stringify({
        otp,
        timestamp: Date.now(),
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      }));
      
      console.log(`OTP for ${phone}: ${otp}`); // For testing
      return true;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const storedOTP = localStorage.getItem(`otp_${phone}`);
      if (!storedOTP) return false;
      
      const { otp: correctOTP, expires } = JSON.parse(storedOTP);
      
      if (Date.now() > expires) {
        localStorage.removeItem(`otp_${phone}`);
        return false; // OTP expired
      }
      
      if (otp === correctOTP) {
        // Mark user as verified
        const users = JSON.parse(localStorage.getItem('agrowatch_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.phone === phone);
        
        if (userIndex !== -1) {
          users[userIndex].verified = true;
          localStorage.setItem('agrowatch_users', JSON.stringify(users));
          setUser(users[userIndex]);
        }
        
        localStorage.removeItem(`otp_${phone}`);
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

  const completeProfile = async (farmSize: number, cropType: 'corn' | 'vegetables' | 'both'): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        farmSize,
        cropType,
        isProfileComplete: true
      };
      
      // Update in localStorage
      const users = JSON.parse(localStorage.getItem('agrowatch_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], farmSize, cropType, isProfileComplete: true };
        localStorage.setItem('agrowatch_users', JSON.stringify(users));
      }
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrowatch_user');
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;