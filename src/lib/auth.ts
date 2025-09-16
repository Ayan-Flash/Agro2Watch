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
  async registerWithMobilePassword(mobile: string, password: string): Promise<User> {
    // In production, hash and store password securely server-side
    const existing = mockFarmers.find(f => f.phone === mobile);
    if (existing) return existing;
    const newUser: User = {
      id: String(Date.now()),
      role: 'farmer',
      name: `Farmer ${mobile.slice(-4)}`,
      email: `farmer${mobile.slice(-4)}@agro.watch`,
      phone: mobile,
      farmLocation: 'Kerala',
      farmSize: 1.0,
      cropTypes: ['rice']
    };
    mockFarmers.push(newUser);
    return newUser;
  },
  async loginWithMobile(mobile: string, otp: string): Promise<User | null> {
    // Demo mobiles
    const ADMIN_MOBILE = '9999912345';
    const FARMER_MOBILE = '9000012345';
    const VALID_OTP = '123456';

    if (otp !== VALID_OTP) return null;

    if (mobile === ADMIN_MOBILE) {
      return { id: 'admin-1', name: 'Administrator', email: 'admin@agro.watch', role: 'admin', phone: ADMIN_MOBILE };
    }

    if (mobile === FARMER_MOBILE) {
      return {
        id: 'farmer-demo',
        name: 'Demo Farmer',
        email: 'farmer@agro.watch',
        role: 'farmer',
        phone: FARMER_MOBILE,
        farmLocation: 'Ernakulam, Kerala',
        farmSize: 2.5,
        cropTypes: ['rice', 'coconut']
      };
    }

    // fallback by searching mock farmers by phone
    const found = mockFarmers.find(f => f.phone === mobile);
    if (found) return found;
    return null;
  },
};


