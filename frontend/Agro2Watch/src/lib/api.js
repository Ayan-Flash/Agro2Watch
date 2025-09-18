// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// API utilities
const api = {
  // Generic request handler
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  },

  // Authentication API calls
  auth: {
    // Send OTP to phone number
    async sendOTP(phone, purpose = 'login') {
      return api.request('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, purpose }),
      });
    },

    // Verify OTP
    async verifyOTP(phone, otp_code, purpose = 'login') {
      return api.request('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp_code, purpose }),
      });
    },

    // Register new user
    async register(userData) {
      return api.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    // Login with phone/password
    async login(phone, password) {
      return api.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });
    },

    // Login with Firebase token
    async firebaseLogin(firebase_token) {
      return api.request('/api/auth/firebase-login', {
        method: 'POST',
        body: JSON.stringify({ firebase_token }),
      });
    },

    // Get user profile
    async getProfile(token) {
      return api.request('/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    // Update user profile
    async updateProfile(userData, token) {
      return api.request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    // Create farmer profile
    async createFarmerProfile(profileData, token) {
      return api.request('/api/auth/farmer-profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    // Get farmer profile
    async getFarmerProfile(token) {
      return api.request('/api/auth/farmer-profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    // Change password
    async changePassword(oldPassword, newPassword, token) {
      return api.request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    // Logout
    async logout() {
      return api.request('/api/auth/logout', {
        method: 'POST',
      });
    },
  },

  // Health check
  async healthCheck() {
    return api.request('/api/health');
  },

  // Legacy status endpoints
  async getStatus() {
    return api.request('/api/status');
  },

  async createStatus(clientName) {
    return api.request('/api/status', {
      method: 'POST',
      body: JSON.stringify({ client_name: clientName }),
    });
  },
};

export default api;