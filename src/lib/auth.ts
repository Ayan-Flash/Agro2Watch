export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  farmLocation?: string;
  farmSize?: number;
  cropTypes?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const mockFarmers: User[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    role: 'farmer',
    phone: '9876543210',
    farmLocation: 'Ernakulam',
    farmSize: 2.5,
    cropTypes: ['rice', 'coconut'],
  },
  {
    id: '2',
    name: 'Anita Nair',
    email: 'anita@example.com',
    role: 'farmer',
    phone: '9123456780',
    farmLocation: 'Kottayam',
    farmSize: 1.8,
    cropTypes: ['pepper', 'banana'],
  },
];

export const authService = {
  getAllFarmers(): User[] {
    return mockFarmers;
  },
  async fetchAadhaarProfile(aadhaarNumber: string): Promise<Omit<User, 'id' | 'role'>> {
    // MOCK: Simulate Aadhaar lookup. In production, call a secure backend/KYC provider.
    const last4 = aadhaarNumber.slice(-4) || '0000';
    return Promise.resolve({
      name: `Farmer ${last4}`,
      email: `farmer${last4}@example.com`,
      phone: `90000${last4}`,
      farmLocation: 'Kerala',
      farmSize: 2.0,
      cropTypes: ['rice'],
    });
  },
  async registerFromAadhaar(aadhaarNumber: string, profile?: any): Promise<User> {
    const userProfile = profile || await this.fetchAadhaarProfile(aadhaarNumber);
    const newUser: User = { 
      id: String(Date.now()), 
      role: 'farmer', 
      name: profile?.name || userProfile.name,
      email: userProfile.email,
      phone: profile?.maskedMobile || userProfile.phone,
      farmLocation: profile?.address?.district || userProfile.farmLocation,
      farmSize: userProfile.farmSize,
      cropTypes: userProfile.cropTypes
    };
    mockFarmers.push(newUser);
    return newUser;
  },
  async register(userInput: Omit<User, 'id' | 'role'>): Promise<User> {
    const newUser: User = { id: String(Date.now()), role: 'farmer', ...userInput };
    mockFarmers.push(newUser);
    return Promise.resolve(newUser);
  },
  async login(email: string, password: string): Promise<User | null> {
    const ADMIN_EMAIL = 'admin@kerala-agri.com';
    const ADMIN_PASS = 'admin123';
    const DEMO_FARMER_EMAIL = 'farmer@demo.com';
    const DEMO_FARMER_PASS = 'farmer123';
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      return { id: 'admin-1', name: 'Administrator', email: ADMIN_EMAIL, role: 'admin' };
    }
    
    if (email === DEMO_FARMER_EMAIL && password === DEMO_FARMER_PASS) {
      return { 
        id: 'farmer-demo', 
        name: 'Demo Farmer', 
        email: DEMO_FARMER_EMAIL, 
        role: 'farmer',
        phone: '9876543210',
        farmLocation: 'Ernakulam, Kerala',
        farmSize: 2.5,
        cropTypes: ['rice', 'coconut']
      };
    }
    
    return null;
  },
};


