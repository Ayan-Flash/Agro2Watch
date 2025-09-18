export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmLocation: string;
  farmSize: number;
  cropTypes: string[];
  role: 'farmer' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock user storage (in real app, this would be a database)
const users: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@kerala-agri.com',
    phone: '+91 9876543210',
    farmLocation: 'Kochi',
    farmSize: 0,
    cropTypes: [],
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

export const authService = {
  register: async (userData: Omit<User, 'id' | 'createdAt' | 'role'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: `farmer-${Date.now()}`,
      role: 'farmer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  login: async (email: string, password: string): Promise<User | null> => {
    // Mock login - in real app, verify password hash
    const user = users.find(u => u.email === email);
    if (user && (password === 'admin123' || password === 'farmer123')) {
      return user;
    }
    return null;
  },

  getAllFarmers: (): User[] => {
    return users.filter(u => u.role === 'farmer');
  },

  getFarmerById: (id: string): User | undefined => {
    return users.find(u => u.id === id);
  }
};