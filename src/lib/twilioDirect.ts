// Direct Twilio integration for frontend (works without backend)
// This uses Twilio's client-side SDK for direct integration

export interface TwilioDirectConfig {
  accountSid: string;
  authToken: string;
  messagingServiceSid?: string;
  fromNumber?: string;
  verifyServiceSid?: string;
}

export interface TwilioDirectResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  sid?: string;
}

class TwilioDirectService {
  private config: TwilioDirectConfig;
  private isConfigured: boolean;

  constructor() {
    this.config = {
      accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
      authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
      messagingServiceSid: import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID || '',
      fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || '',
      verifyServiceSid: import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID || ''
    };
    
    this.isConfigured = !!(this.config.accountSid && this.config.authToken);
    
    // Debug logging
    console.log('🔧 TwilioDirect Configuration:', {
      hasAccountSid: !!this.config.accountSid,
      hasAuthToken: !!this.config.authToken,
      hasMessagingService: !!this.config.messagingServiceSid,
      hasFromNumber: !!this.config.fromNumber,
      hasVerifyService: !!this.config.verifyServiceSid,
      isConfigured: this.isConfigured
    });
  }

  /**
   * Send OTP using Twilio's REST API directly from frontend
   * Note: This exposes credentials to frontend - use only for development/testing
   */
  async sendOTPDirect(phoneNumber: string, otpCode: string, message?: string): Promise<TwilioDirectResponse> {
    console.log('📱 TwilioDirect sendOTPDirect called with:', { phoneNumber, otpCode, isConfigured: this.isConfigured });
    
    if (!this.isConfigured) {
      console.error('❌ Twilio not configured. Missing credentials.');
      return {
        success: false,
        error: 'Twilio not configured. Please set environment variables.'
      };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const defaultMessage = `Your AgroWatch verification code is: ${otpCode}. This code will expire in 10 minutes.`;
      const smsMessage = message || defaultMessage;

      console.log('📲 Sending SMS to:', formattedPhone);
      console.log('📝 Message:', smsMessage);
      console.log('🔧 Using config:', {
        accountSid: this.config.accountSid.substring(0, 8) + '...',
        hasMessagingService: !!this.config.messagingServiceSid,
        hasFromNumber: !!this.config.fromNumber
      });

      // Use Twilio's REST API directly
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`;
      const auth = btoa(`${this.config.accountSid}:${this.config.authToken}`);
      
      const body = new URLSearchParams({
        To: formattedPhone,
        Body: smsMessage,
        ...(this.config.messagingServiceSid 
          ? { MessagingServiceSid: this.config.messagingServiceSid }
          : { From: this.config.fromNumber || this.config.accountSid }
        )
      });

      console.log('🌐 Making request to:', url);
      console.log('📦 Request body:', Object.fromEntries(body));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        },
        body: body
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Twilio API error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Twilio SMS sent successfully:', result);
      
      return {
        success: true,
        messageId: result.sid,
        sid: result.sid
      };

    } catch (error: any) {
      console.error('❌ Direct Twilio OTP send error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  /**
   * Send OTP using Twilio Verify service directly
   */
  async sendOTPVerifyDirect(phoneNumber: string, serviceSid?: string): Promise<TwilioDirectResponse> {
    console.log('📱 TwilioDirect sendOTPVerifyDirect called with:', { phoneNumber, serviceSid, isConfigured: this.isConfigured });
    
    if (!this.isConfigured) {
      console.error('❌ Twilio not configured. Missing credentials.');
      return {
        success: false,
        error: 'Twilio not configured. Please set environment variables.'
      };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const verifyServiceSid = serviceSid || this.config.verifyServiceSid;

      console.log('🔧 Verify Service SID:', verifyServiceSid ? 'Configured' : 'Not configured');

      if (!verifyServiceSid) {
        throw new Error('Twilio Verify Service SID not configured');
      }

      // Use Twilio Verify API directly
      const url = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`;
      const auth = btoa(`${this.config.accountSid}:${this.config.authToken}`);
      
      const body = new URLSearchParams({
        To: formattedPhone,
        Channel: 'sms'
      });

      console.log('🌐 Making Verify request to:', url);
      console.log('📦 Request body:', Object.fromEntries(body));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        },
        body: body
      });

      console.log('📊 Verify response status:', response.status);
      console.log('📊 Verify response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Twilio Verify API error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Twilio Verify sent successfully:', result);
      
      return {
        success: true,
        sid: result.sid
      };

    } catch (error: any) {
      console.error('❌ Direct Twilio Verify send error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification'
      };
    }
  }

  /**
   * Verify OTP using Twilio Verify service directly
   */
  async verifyOTPDirect(phoneNumber: string, otpCode: string, serviceSid?: string): Promise<TwilioDirectResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Twilio not configured. Please set environment variables.'
      };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const verifyServiceSid = serviceSid || this.config.verifyServiceSid;

      if (!verifyServiceSid) {
        throw new Error('Twilio Verify Service SID not configured');
      }

      // Use Twilio Verify API directly
      const response = await fetch(`https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`
        },
        body: new URLSearchParams({
          To: formattedPhone,
          Code: otpCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.status === 'approved',
        sid: result.sid
      };

    } catch (error: any) {
      console.error('Direct Twilio Verify check error:', error);
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
  isTwilioConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): {
    hasAccountSid: boolean;
    hasAuthToken: boolean;
    hasMessagingService: boolean;
    hasFromNumber: boolean;
    hasVerifyService: boolean;
    isConfigured: boolean;
  } {
    return {
      hasAccountSid: !!this.config.accountSid,
      hasAuthToken: !!this.config.authToken,
      hasMessagingService: !!this.config.messagingServiceSid,
      hasFromNumber: !!this.config.fromNumber,
      hasVerifyService: !!this.config.verifyServiceSid,
      isConfigured: this.isConfigured
    };
  }
}

// Create singleton instance
export const twilioDirectService = new TwilioDirectService();

// Export individual functions for easier usage
export const sendTwilioOTPDirect = (phoneNumber: string, otpCode: string, message?: string) => 
  twilioDirectService.sendOTPDirect(phoneNumber, otpCode, message);

export const sendTwilioOTPVerifyDirect = (phoneNumber: string, serviceSid?: string) => 
  twilioDirectService.sendOTPVerifyDirect(phoneNumber, serviceSid);

export const verifyTwilioOTPDirect = (phoneNumber: string, otpCode: string, serviceSid?: string) => 
  twilioDirectService.verifyOTPDirect(phoneNumber, otpCode, serviceSid);

export const generateOTPDirect = () => twilioDirectService.generateOTP();
export const validatePhoneNumberDirect = (phoneNumber: string) => twilioDirectService.validatePhoneNumber(phoneNumber);
export const isTwilioConfiguredDirect = () => twilioDirectService.isTwilioConfigured();
export const getTwilioConfigStatusDirect = () => twilioDirectService.getConfigStatus();
