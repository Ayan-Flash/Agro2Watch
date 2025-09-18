// Twilio OTP Service for sending SMS verification codes
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  messagingServiceSid?: string;
  fromNumber?: string;
}

export interface TwilioResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  sid?: string;
}

export interface TwilioOTPResponse {
  success: boolean;
  verificationId?: string;
  error?: string;
  message?: string;
}

class TwilioOTPService {
  private config: TwilioConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
      authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
      messagingServiceSid: import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID || '',
      fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || ''
    };
    
    // Use Vercel API routes for production, local backend for development
    const isProduction = import.meta.env.PROD;
    this.baseUrl = isProduction 
      ? '' // Use relative URLs for Vercel API routes
      : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001');
  }

  /**
   * Send OTP via Twilio SMS
   */
  async sendOTP(phoneNumber: string, otpCode: string, message?: string): Promise<TwilioResponse> {
    try {
      // Format phone number (ensure it starts with +)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Default message if not provided
      const defaultMessage = `Your AgroWatch verification code is: ${otpCode}. This code will expire in 10 minutes.`;
      const smsMessage = message || defaultMessage;

      // Call Vercel API route to send SMS via Twilio
      const response = await fetch(`${this.baseUrl}/api/twilio/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhone,
          message: smsMessage,
          otpCode: otpCode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        messageId: result.messageId,
        sid: result.sid
      };

    } catch (error: any) {
      console.error('Twilio OTP send error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  /**
   * Send OTP using Twilio Verify service (recommended for production)
   */
  async sendOTPVerify(phoneNumber: string, serviceSid?: string): Promise<TwilioOTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const verifyServiceSid = serviceSid || import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID;

      if (!verifyServiceSid) {
        throw new Error('Twilio Verify Service SID not configured');
      }

      const response = await fetch(`${this.baseUrl}/api/twilio/verify/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhone,
          serviceSid: verifyServiceSid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        verificationId: result.sid,
        message: 'OTP sent successfully'
      };

    } catch (error: any) {
      console.error('Twilio Verify OTP send error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP using Twilio Verify service
   */
  async verifyOTP(phoneNumber: string, otpCode: string, serviceSid?: string): Promise<TwilioOTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const verifyServiceSid = serviceSid || import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID;

      if (!verifyServiceSid) {
        throw new Error('Twilio Verify Service SID not configured');
      }

      const response = await fetch(`${this.baseUrl}/api/twilio/verify/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhone,
          code: otpCode,
          serviceSid: verifyServiceSid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.status === 'approved',
        message: result.status === 'approved' ? 'OTP verified successfully' : 'Invalid OTP'
      };

    } catch (error: any) {
      console.error('Twilio Verify OTP check error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP'
      };
    }
  }

  /**
   * Generate a random 6-digit OTP
   */
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Format phone number to international format
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with country code, return as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    
    // If it's a 10-digit Indian number, add +91
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it already has +, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // Default: add +91 for Indian numbers
    return `+91${cleaned}`;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Basic international phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(formatted);
  }

  /**
   * Check if Twilio is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.accountSid && this.config.authToken);
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): {
    hasAccountSid: boolean;
    hasAuthToken: boolean;
    hasMessagingService: boolean;
    hasFromNumber: boolean;
    isConfigured: boolean;
  } {
    return {
      hasAccountSid: !!this.config.accountSid,
      hasAuthToken: !!this.config.authToken,
      hasMessagingService: !!this.config.messagingServiceSid,
      hasFromNumber: !!this.config.fromNumber,
      isConfigured: this.isConfigured()
    };
  }
}

// Create singleton instance
export const twilioService = new TwilioOTPService();

// Export individual functions for easier usage
export const sendTwilioOTP = (phoneNumber: string, otpCode: string, message?: string) => 
  twilioService.sendOTP(phoneNumber, otpCode, message);

export const sendTwilioOTPVerify = (phoneNumber: string, serviceSid?: string) => 
  twilioService.sendOTPVerify(phoneNumber, serviceSid);

export const verifyTwilioOTP = (phoneNumber: string, otpCode: string, serviceSid?: string) => 
  twilioService.verifyOTP(phoneNumber, otpCode, serviceSid);

export const generateOTP = () => twilioService.generateOTP();
export const validatePhoneNumber = (phoneNumber: string) => twilioService.validatePhoneNumber(phoneNumber);
export const isTwilioConfigured = () => twilioService.isConfigured();
export const getTwilioConfigStatus = () => twilioService.getConfigStatus();
