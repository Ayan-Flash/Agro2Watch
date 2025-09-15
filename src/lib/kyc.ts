import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export interface AadhaarInitRequest {
  vid: string;
  consent: boolean;
}

export interface AadhaarInitResponse {
  txnId: string;
  success: boolean;
  message?: string;
}

export interface AadhaarVerifyRequest {
  txnId: string;
  otp: string;
}

export interface AadhaarVerifyResponse {
  success: boolean;
  profile?: {
    name: string;
    maskedMobile: string;
    address: {
      district: string;
      state: string;
    };
  };
  message?: string;
}

const aadhaarInit = httpsCallable<AadhaarInitRequest, AadhaarInitResponse>(functions, "aadhaarInit");
const aadhaarVerify = httpsCallable<AadhaarVerifyRequest, AadhaarVerifyResponse>(functions, "aadhaarVerify");

export const kycService = {
  async initAadhaarVerification(vid: string): Promise<AadhaarInitResponse> {
    const result = await aadhaarInit({ vid, consent: true });
    return result.data;
  },

  async verifyAadhaarOTP(txnId: string, otp: string): Promise<AadhaarVerifyResponse> {
    const result = await aadhaarVerify({ txnId, otp });
    return result.data;
  },
};
