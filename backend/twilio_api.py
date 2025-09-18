"""
Twilio API endpoints for OTP sending and verification
"""
import os
import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from typing import Optional

logger = logging.getLogger(__name__)

# Initialize Twilio client
def get_twilio_client():
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    
    if not account_sid or not auth_token:
        raise HTTPException(status_code=500, detail="Twilio credentials not configured")
    
    return Client(account_sid, auth_token)

# Pydantic models
class SendSMSRequest(BaseModel):
    to: str
    message: str
    otpCode: Optional[str] = None

class TwilioVerifySendRequest(BaseModel):
    to: str
    serviceSid: str

class TwilioVerifyCheckRequest(BaseModel):
    to: str
    code: str
    serviceSid: str

# Create router
router = APIRouter(prefix="/api/twilio", tags=["twilio"])

@router.post("/send-sms")
async def send_sms(request: SendSMSRequest):
    """Send SMS via Twilio"""
    try:
        client = get_twilio_client()
        
        # Get messaging service SID or from number
        messaging_service_sid = os.getenv('TWILIO_MESSAGING_SERVICE_SID')
        from_number = os.getenv('TWILIO_FROM_NUMBER')
        
        if messaging_service_sid:
            message = client.messages.create(
                body=request.message,
                messaging_service_sid=messaging_service_sid,
                to=request.to
            )
        elif from_number:
            message = client.messages.create(
                body=request.message,
                from_=from_number,
                to=request.to
            )
        else:
            raise HTTPException(status_code=500, detail="No messaging service or from number configured")
        
        logger.info(f"SMS sent successfully to {request.to}, SID: {message.sid}")
        
        return {
            "success": True,
            "messageId": message.sid,
            "sid": message.sid,
            "status": message.status
        }
        
    except TwilioException as e:
        logger.error(f"Twilio SMS error: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to send SMS: {str(e)}")
    except Exception as e:
        logger.error(f"SMS send error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/verify/send")
async def send_verify_otp(request: TwilioVerifySendRequest):
    """Send OTP using Twilio Verify service"""
    try:
        client = get_twilio_client()
        
        verification = client.verify.v2.services(request.serviceSid).verifications.create(
            to=request.to,
            channel='sms'
        )
        
        logger.info(f"Verify OTP sent to {request.to}, SID: {verification.sid}")
        
        return {
            "success": True,
            "sid": verification.sid,
            "status": verification.status,
            "to": verification.to
        }
        
    except TwilioException as e:
        logger.error(f"Twilio Verify send error: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to send verification: {str(e)}")
    except Exception as e:
        logger.error(f"Verify send error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/verify/check")
async def check_verify_otp(request: TwilioVerifyCheckRequest):
    """Verify OTP using Twilio Verify service"""
    try:
        client = get_twilio_client()
        
        verification_check = client.verify.v2.services(request.serviceSid).verification_checks.create(
            to=request.to,
            code=request.code
        )
        
        logger.info(f"Verify OTP check for {request.to}, Status: {verification_check.status}")
        
        return {
            "success": verification_check.status == 'approved',
            "status": verification_check.status,
            "valid": verification_check.valid
        }
        
    except TwilioException as e:
        logger.error(f"Twilio Verify check error: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to verify code: {str(e)}")
    except Exception as e:
        logger.error(f"Verify check error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/status")
async def get_twilio_status():
    """Get Twilio configuration status"""
    try:
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        messaging_service_sid = os.getenv('TWILIO_MESSAGING_SERVICE_SID')
        from_number = os.getenv('TWILIO_FROM_NUMBER')
        verify_service_sid = os.getenv('TWILIO_VERIFY_SERVICE_SID')
        
        return {
            "configured": bool(account_sid and auth_token),
            "hasAccountSid": bool(account_sid),
            "hasAuthToken": bool(auth_token),
            "hasMessagingService": bool(messaging_service_sid),
            "hasFromNumber": bool(from_number),
            "hasVerifyService": bool(verify_service_sid),
            "services": {
                "sms": bool(messaging_service_sid or from_number),
                "verify": bool(verify_service_sid)
            }
        }
        
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
