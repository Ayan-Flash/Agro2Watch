#!/usr/bin/env python3
"""
Twilio service integration
Handles SMS notifications and communication
"""

import os
import logging
from typing import Optional, Dict, Any

try:
    from twilio.rest import Client
    from twilio.base.exceptions import TwilioException
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    print("Warning: Twilio SDK not installed. Install with: pip install twilio")

# Setup logging
logger = logging.getLogger(__name__)

class TwilioService:
    """Twilio service wrapper for SMS and communication"""
    
    def __init__(self):
        self.client = None
        self.from_phone = None
        self._initialize_twilio()
    
    def _initialize_twilio(self):
        """Initialize Twilio client"""
        try:
            if not TWILIO_AVAILABLE:
                logger.warning("Twilio SDK not available")
                return
            
            # Get Twilio configuration from environment
            account_sid = os.getenv('TWILIO_ACCOUNT_SID')
            auth_token = os.getenv('TWILIO_AUTH_TOKEN')
            self.from_phone = os.getenv('TWILIO_PHONE_NUMBER')
            
            if not account_sid or not auth_token:
                logger.warning("[WARNING] Twilio credentials not found in environment")
                return
            
            if not self.from_phone:
                logger.warning("[WARNING] Twilio phone number not configured")
                return
            
            # Initialize Twilio client
            self.client = Client(account_sid, auth_token)
            
            # Test the connection
            try:
                account = self.client.api.accounts(account_sid).fetch()
                logger.info(f"[SUCCESS] Twilio initialized successfully for account: {account.friendly_name}")
            except Exception as e:
                logger.warning(f"[WARNING] Twilio connection test failed: {e}")
                
        except Exception as e:
            logger.error(f"[ERROR] Twilio initialization failed: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Twilio service is available"""
        return self.client is not None and TWILIO_AVAILABLE
    
    async def send_sms(self, to_phone: str, message: str, from_phone: Optional[str] = None) -> Optional[str]:
        """Send SMS message"""
        try:
            if not self.is_available():
                raise Exception("Twilio service not available")
            
            # Use configured phone number if not provided
            sender_phone = from_phone or self.from_phone
            
            if not sender_phone:
                raise Exception("No sender phone number configured")
            
            # Format phone numbers (ensure they start with +)
            if not to_phone.startswith('+'):
                to_phone = '+' + to_phone.lstrip('+')
            
            if not sender_phone.startswith('+'):
                sender_phone = '+' + sender_phone.lstrip('+')
            
            # Send SMS
            message_instance = self.client.messages.create(
                body=message,
                from_=sender_phone,
                to=to_phone
            )
            
            logger.info(f"SMS sent successfully - SID: {message_instance.sid}")
            return message_instance.sid
            
        except TwilioException as e:
            logger.error(f"Twilio SMS failed: {e}")
            raise Exception(f"SMS sending failed: {str(e)}")
        except Exception as e:
            logger.error(f"SMS sending failed: {e}")
            raise e
    
    async def send_whatsapp(self, to_phone: str, message: str) -> Optional[str]:
        """Send WhatsApp message (requires WhatsApp Business API)"""
        try:
            if not self.is_available():
                raise Exception("Twilio service not available")
            
            # Format phone numbers for WhatsApp
            if not to_phone.startswith('+'):
                to_phone = '+' + to_phone.lstrip('+')
            
            whatsapp_from = f"whatsapp:{self.from_phone}"
            whatsapp_to = f"whatsapp:{to_phone}"
            
            # Send WhatsApp message
            message_instance = self.client.messages.create(
                body=message,
                from_=whatsapp_from,
                to=whatsapp_to
            )
            
            logger.info(f"WhatsApp message sent successfully - SID: {message_instance.sid}")
            return message_instance.sid
            
        except TwilioException as e:
            logger.error(f"Twilio WhatsApp failed: {e}")
            raise Exception(f"WhatsApp sending failed: {str(e)}")
        except Exception as e:
            logger.error(f"WhatsApp sending failed: {e}")
            raise e
    
    async def make_call(self, to_phone: str, message: str) -> Optional[str]:
        """Make voice call with text-to-speech"""
        try:
            if not self.is_available():
                raise Exception("Twilio service not available")
            
            # Format phone numbers
            if not to_phone.startswith('+'):
                to_phone = '+' + to_phone.lstrip('+')
            
            # Create TwiML for voice message
            twiml = f'<Response><Say>{message}</Say></Response>'
            
            # Make call
            call = self.client.calls.create(
                twiml=twiml,
                to=to_phone,
                from_=self.from_phone
            )
            
            logger.info(f"Voice call initiated successfully - SID: {call.sid}")
            return call.sid
            
        except TwilioException as e:
            logger.error(f"Twilio call failed: {e}")
            raise Exception(f"Voice call failed: {str(e)}")
        except Exception as e:
            logger.error(f"Voice call failed: {e}")
            raise e
    
    async def get_message_status(self, message_sid: str) -> Optional[Dict[str, Any]]:
        """Get message delivery status"""
        try:
            if not self.is_available():
                raise Exception("Twilio service not available")
            
            message = self.client.messages(message_sid).fetch()
            
            return {
                "sid": message.sid,
                "status": message.status,
                "direction": message.direction,
                "from": message.from_,
                "to": message.to,
                "body": message.body,
                "date_created": message.date_created,
                "date_sent": message.date_sent,
                "date_updated": message.date_updated,
                "error_code": message.error_code,
                "error_message": message.error_message
            }
            
        except TwilioException as e:
            logger.error(f"Get message status failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Get message status failed: {e}")
            return None
    
    async def get_call_status(self, call_sid: str) -> Optional[Dict[str, Any]]:
        """Get call status"""
        try:
            if not self.is_available():
                raise Exception("Twilio service not available")
            
            call = self.client.calls(call_sid).fetch()
            
            return {
                "sid": call.sid,
                "status": call.status,
                "direction": call.direction,
                "from": call.from_,
                "to": call.to,
                "duration": call.duration,
                "date_created": call.date_created,
                "date_updated": call.date_updated,
                "start_time": call.start_time,
                "end_time": call.end_time
            }
            
        except TwilioException as e:
            logger.error(f"Get call status failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Get call status failed: {e}")
            return None
    
    async def send_bulk_sms(self, recipients: list, message: str) -> Dict[str, Any]:
        """Send SMS to multiple recipients"""
        results = {
            "successful": [],
            "failed": [],
            "total": len(recipients)
        }
        
        for phone_number in recipients:
            try:
                message_sid = await self.send_sms(phone_number, message)
                results["successful"].append({
                    "phone": phone_number,
                    "message_sid": message_sid
                })
            except Exception as e:
                results["failed"].append({
                    "phone": phone_number,
                    "error": str(e)
                })
        
        logger.info(f"Bulk SMS completed - {len(results['successful'])} successful, {len(results['failed'])} failed")
        return results
    
    async def send_alert_sms(self, phone_number: str, alert_type: str, severity: str, message: str) -> Optional[str]:
        """Send formatted alert SMS"""
        formatted_message = f"[ALERT] AgroWatch Alert [{severity.upper()}]\n\n{alert_type.title()}: {message}\n\nTime: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        return await self.send_sms(phone_number, formatted_message)
    
    def validate_phone_number(self, phone_number: str) -> bool:
        """Validate phone number format"""
        try:
            if not self.is_available():
                return False
            
            # Use Twilio's lookup service to validate
            lookup = self.client.lookups.phone_numbers(phone_number).fetch()
            return lookup.phone_number is not None
            
        except Exception:
            return False
    
    def get_account_info(self) -> Optional[Dict[str, Any]]:
        """Get Twilio account information"""
        try:
            if not self.is_available():
                return None
            
            account = self.client.api.accounts(self.client.username).fetch()
            
            return {
                "sid": account.sid,
                "friendly_name": account.friendly_name,
                "status": account.status,
                "type": account.type,
                "date_created": account.date_created,
                "date_updated": account.date_updated
            }
            
        except Exception as e:
            logger.error(f"Get account info failed: {e}")
            return None

# Global Twilio service instance
twilio_service: Optional[TwilioService] = None

def get_twilio_service() -> Optional[TwilioService]:
    """Get global Twilio service instance"""
    global twilio_service
    if twilio_service is None:
        twilio_service = TwilioService()
    return twilio_service

# Import datetime here to avoid circular imports
from datetime import datetime

from twilio.rest import Client
from twilio.base.exceptions import TwilioException
import os
import logging
from typing import Optional, Dict, Any
import random
import string
from datetime import datetime, timedelta
from database import get_database, Collections
from models import OTPVerification

logger = logging.getLogger(__name__)

class TwilioService:
    def __init__(self):
        self.client = None
        self.account_sid = None
        self.auth_token = None
        self.messaging_service_sid = None
        self.phone_number = None
        self._initialized = False
        
    def _initialize(self):
        """Lazy initialization of Twilio client"""
        if self._initialized:
            return
            
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.messaging_service_sid = os.getenv('TWILIO_MESSAGING_SERVICE_SID')
        self.phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not all([self.account_sid, self.auth_token]):
            logger.warning("Twilio credentials not found in environment variables")
            return
        
        try:
            self.client = Client(self.account_sid, self.auth_token)
            self._initialized = True
            logger.info("Twilio service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {str(e)}")
    
    def is_available(self) -> bool:
        """Check if Twilio service is available"""
        self._initialize()
        return self._initialized and self.client is not None

    def generate_otp(self, length: int = 6) -> str:
        """Generate a random OTP code"""
        return ''.join(random.choices(string.digits, k=length))

    async def send_sms_otp(self, phone: str, purpose: str = "login") -> Dict[str, Any]:
        """
        Send SMS OTP to the given phone number
        
        Args:
            phone: Phone number in E.164 format (+1234567890)
            purpose: Purpose of OTP (login, registration, password_reset)
            
        Returns:
            Dict with success status and message
        """
        if not self.is_available():
            return {
                "success": False,
                "message": "Twilio service not available",
                "error_code": "SERVICE_UNAVAILABLE"
            }
            
        try:
            # Generate OTP
            otp_code = self.generate_otp()
            
            # Create OTP message
            message_body = f"Your AgroWatch verification code is: {otp_code}. Valid for 5 minutes. Do not share this code with anyone."
            
            # Send SMS using Twilio
            if self.messaging_service_sid:
                message = self.client.messages.create(
                    messaging_service_sid=self.messaging_service_sid,
                    body=message_body,
                    to=phone
                )
            else:
                message = self.client.messages.create(
                    body=message_body,
                    from_=self.phone_number,
                    to=phone
                )
            
            # Store OTP in database
            db = get_database()
            otp_doc = OTPVerification(
                phone=phone,
                otp_code=otp_code,
                purpose=purpose,
                expires_at=datetime.utcnow() + timedelta(minutes=5)
            )
            
            await db[Collections.OTP_VERIFICATIONS].insert_one(otp_doc.dict())
            
            logger.info(f"SMS OTP sent successfully to {phone}, SID: {message.sid}")
            
            return {
                "success": True,
                "message": "OTP sent successfully",
                "sid": message.sid,
                "phone": phone
            }
            
        except TwilioException as e:
            logger.error(f"Twilio error sending SMS to {phone}: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to send SMS: {e.msg}",
                "error_code": e.code
            }
        except Exception as e:
            logger.error(f"Error sending SMS OTP to {phone}: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send OTP",
                "error": str(e)
            }

    async def verify_otp(self, phone: str, otp_code: str, purpose: str = "login") -> Dict[str, Any]:
        """
        Verify the OTP code for the given phone number
        
        Args:
            phone: Phone number in E.164 format
            otp_code: OTP code to verify
            purpose: Purpose of OTP verification
            
        Returns:
            Dict with verification status and message
        """
        try:
            db = get_database()
            
            # Find the most recent unverified OTP for this phone and purpose
            otp_doc = await db[Collections.OTP_VERIFICATIONS].find_one(
                {
                    "phone": phone,
                    "purpose": purpose,
                    "is_verified": False,
                    "expires_at": {"$gt": datetime.utcnow()}
                },
                sort=[("created_at", -1)]
            )
            
            if not otp_doc:
                return {
                    "success": False,
                    "message": "OTP not found or expired",
                    "error_code": "OTP_NOT_FOUND"
                }
            
            # Check if max attempts exceeded
            if otp_doc["attempts"] >= otp_doc.get("max_attempts", 3):
                return {
                    "success": False,
                    "message": "Maximum verification attempts exceeded",
                    "error_code": "MAX_ATTEMPTS_EXCEEDED"
                }
            
            # Increment attempts
            await db[Collections.OTP_VERIFICATIONS].update_one(
                {"_id": otp_doc["_id"]},
                {"$inc": {"attempts": 1}}
            )
            
            # Verify OTP
            if otp_doc["otp_code"] == otp_code:
                # Mark as verified
                await db[Collections.OTP_VERIFICATIONS].update_one(
                    {"_id": otp_doc["_id"]},
                    {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}}
                )
                
                logger.info(f"OTP verified successfully for {phone}")
                return {
                    "success": True,
                    "message": "OTP verified successfully",
                    "phone": phone
                }
            else:
                logger.warning(f"Invalid OTP attempt for {phone}")
                return {
                    "success": False,
                    "message": "Invalid OTP code",
                    "error_code": "INVALID_OTP"
                }
                
        except Exception as e:
            logger.error(f"Error verifying OTP for {phone}: {str(e)}")
            return {
                "success": False,
                "message": "OTP verification failed",
                "error": str(e)
            }

    async def send_whatsapp_message(self, phone: str, message: str, template_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Send WhatsApp message to the given phone number
        
        Args:
            phone: Phone number in E.164 format
            message: Message content
            template_name: Optional WhatsApp template name for business messages
            
        Returns:
            Dict with success status and message
        """
        if not self.is_available():
            return {
                "success": False,
                "message": "Twilio service not available",
                "error_code": "SERVICE_UNAVAILABLE"
            }
            
        try:
            # Format phone number for WhatsApp (whatsapp:+1234567890)
            whatsapp_number = f"whatsapp:{phone}"
            from_number = f"whatsapp:{self.phone_number}"
            
            # Send WhatsApp message
            message_obj = self.client.messages.create(
                body=message,
                from_=from_number,
                to=whatsapp_number
            )
            
            logger.info(f"WhatsApp message sent successfully to {phone}, SID: {message_obj.sid}")
            
            return {
                "success": True,
                "message": "WhatsApp message sent successfully",
                "sid": message_obj.sid,
                "phone": phone
            }
            
        except TwilioException as e:
            logger.error(f"Twilio error sending WhatsApp message to {phone}: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to send WhatsApp message: {e.msg}",
                "error_code": e.code
            }
        except Exception as e:
            logger.error(f"Error sending WhatsApp message to {phone}: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send WhatsApp message",
                "error": str(e)
            }

    async def send_alert_notification(self, phone: str, alert_title: str, alert_message: str, 
                                    notification_type: str = "sms") -> Dict[str, Any]:
        """
        Send alert notifications via SMS or WhatsApp
        
        Args:
            phone: Phone number in E.164 format
            alert_title: Title of the alert
            alert_message: Alert message content
            notification_type: Type of notification (sms or whatsapp)
            
        Returns:
            Dict with success status and message
        """
        try:
            formatted_message = f"[ALERT] {alert_title}\n\n{alert_message}\n\n- AgroWatch Team"
            
            if notification_type.lower() == "whatsapp":
                result = await self.send_whatsapp_message(phone, formatted_message)
            else:
                # Default to SMS
                result = await self.send_sms_notification(phone, formatted_message)
            
            return result
            
        except Exception as e:
            logger.error(f"Error sending alert notification to {phone}: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send alert notification",
                "error": str(e)
            }

    async def send_sms_notification(self, phone: str, message: str) -> Dict[str, Any]:
        """
        Send SMS notification
        
        Args:
            phone: Phone number in E.164 format
            message: Message content
            
        Returns:
            Dict with success status and message
        """
        if not self.is_available():
            return {
                "success": False,
                "message": "Twilio service not available",
                "error_code": "SERVICE_UNAVAILABLE"
            }
            
        try:
            if self.messaging_service_sid:
                message_obj = self.client.messages.create(
                    messaging_service_sid=self.messaging_service_sid,
                    body=message,
                    to=phone
                )
            else:
                message_obj = self.client.messages.create(
                    body=message,
                    from_=self.phone_number,
                    to=phone
                )
            
            logger.info(f"SMS notification sent successfully to {phone}, SID: {message_obj.sid}")
            
            return {
                "success": True,
                "message": "SMS notification sent successfully",
                "sid": message_obj.sid,
                "phone": phone
            }
            
        except TwilioException as e:
            logger.error(f"Twilio error sending SMS notification to {phone}: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to send SMS notification: {e.msg}",
                "error_code": e.code
            }
        except Exception as e:
            logger.error(f"Error sending SMS notification to {phone}: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send SMS notification",
                "error": str(e)
            }

# Global Twilio service instance
twilio_service = TwilioService()
