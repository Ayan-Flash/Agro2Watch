const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Mock Aadhaar eKYC provider integration
// In production, replace with actual KUA/ASP provider API calls

exports.aadhaarInit = functions.https.onCall(async (data, context) => {
  const { vid, consent } = data;
  
  if (!consent) {
    throw new functions.https.HttpsError('failed-precondition', 'User consent required');
  }
  
  if (!/^\d{12}$/.test(vid)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid VID format');
  }
  
  try {
    // Mock: In production, call KUA/ASP provider's OTP init API
    // const response = await fetch(PROVIDER_URL + '/ekyc/otp-init', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ vid })
    // });
    
    // Mock response
    const txnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      txnId,
      message: 'OTP sent to registered mobile number'
    };
  } catch (error) {
    console.error('Aadhaar init error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to initiate Aadhaar verification');
  }
});

exports.aadhaarVerify = functions.https.onCall(async (data, context) => {
  const { txnId, otp } = data;
  
  if (!/^\d{6}$/.test(otp)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid OTP format');
  }
  
  try {
    // Mock: In production, call KUA/ASP provider's OTP verify API
    // const response = await fetch(PROVIDER_URL + '/ekyc/otp-verify', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ txnId, otp })
    // });
    
    // Mock successful verification
    if (otp === '123456') { // Demo OTP
      return {
        success: true,
        profile: {
          name: 'John Doe',
          maskedMobile: '******1234',
          address: {
            district: 'Ernakulam',
            state: 'Kerala'
          }
        },
        message: 'Aadhaar verification successful'
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }
  } catch (error) {
    console.error('Aadhaar verify error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to verify Aadhaar OTP');
  }
});
