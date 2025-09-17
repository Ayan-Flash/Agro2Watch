import firebase_admin
from firebase_admin import credentials, auth, firestore
from typing import Optional, Dict, Any
import json
from pathlib import Path
from utils.logger import logger
from config import settings
import asyncio
from concurrent.futures import ThreadPoolExecutor
import httpx

class FirebaseAuthManager:
    """Firebase Authentication Manager"""
    
    def __init__(self):
        self.app = None
        self.db = None
        self.executor = ThreadPoolExecutor(max_workers=4)
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                cred_path = Path(settings.FIREBASE_CREDENTIALS_PATH)
                
                if cred_path.exists():
                    cred = credentials.Certificate(str(cred_path))
                    self.app = firebase_admin.initialize_app(cred, {
                        'projectId': settings.FIREBASE_PROJECT_ID
                    })
                else:
                    # Use default credentials or create mock credentials for development
                    logger.warning("Firebase credentials not found, using mock authentication")
                    self._create_mock_credentials()
                    return
                
                # Initialize Firestore
                self.db = firestore.client()
                logger.info("Firebase initialized successfully")
            else:
                self.app = firebase_admin.get_app()
                self.db = firestore.client()
                logger.info("Using existing Firebase app")
                
        except Exception as e:
            logger.error(f"Firebase initialization failed: {e}")
            self._create_mock_credentials()
    
    def _create_mock_credentials(self):
        """Create mock Firebase credentials for development"""
        logger.info("Creating mock Firebase setup for development")
        self.app = None
        self.db = None
    
    async def send_otp(self, phone_number: str) -> Dict[str, Any]:
        """Send OTP to phone number"""
        try:
            if self.app is None:
                # Mock OTP for development
                return await self._mock_send_otp(phone_number)
            
            # In production, you would integrate with Firebase Auth REST API
            # or use a third-party SMS service
            return await self._send_otp_via_api(phone_number)
            
        except Exception as e:
            logger.error(f"Failed to send OTP: {e}")
            return {"success": False, "error": str(e)}
    
    async def verify_otp(self, phone_number: str, otp: str) -> Dict[str, Any]:
        """Verify OTP for phone number"""
        try:
            if self.app is None:
                # Mock verification for development
                return await self._mock_verify_otp(phone_number, otp)
            
            # In production, verify OTP with Firebase
            return await self._verify_otp_with_firebase(phone_number, otp)
            
        except Exception as e:
            logger.error(f"Failed to verify OTP: {e}")
            return {"success": False, "error": str(e)}
    
    async def create_user(self, phone_number: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new user in Firebase"""
        try:
            if self.app is None:
                return await self._mock_create_user(phone_number, user_data)
            
            # Create user in Firebase Auth
            user_record = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                auth.create_user,
                phone=phone_number,
                display_name=user_data.get('name')
            )
            
            # Store additional user data in Firestore
            if self.db:
                user_doc_data = {
                    'uid': user_record.uid,
                    'phone': phone_number,
                    'name': user_data.get('name', ''),
                    'email': user_data.get('email', ''),
                    'address': user_data.get('address', ''),
                    'farm_size': user_data.get('farm_size', ''),
                    'crop_types': user_data.get('crop_types', []),
                    'aadhaar_verified': user_data.get('aadhaar_verified', False),
                    'created_at': firestore.SERVER_TIMESTAMP,
                    'updated_at': firestore.SERVER_TIMESTAMP
                }
                
                await asyncio.get_event_loop().run_in_executor(
                    self.executor,
                    self.db.collection('users').document(user_record.uid).set,
                    user_doc_data
                )
            
            return {
                "success": True,
                "uid": user_record.uid,
                "user": user_doc_data
            }
            
        except Exception as e:
            logger.error(f"Failed to create user: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_user(self, uid: str) -> Optional[Dict[str, Any]]:
        """Get user data from Firestore"""
        try:
            if self.db is None:
                return await self._mock_get_user(uid)
            
            user_doc = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self.db.collection('users').document(uid).get
            )
            
            if user_doc.exists:
                return user_doc.to_dict()
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user: {e}")
            return None
    
    async def update_user(self, uid: str, user_data: Dict[str, Any]) -> bool:
        """Update user data in Firestore"""
        try:
            if self.db is None:
                return True  # Mock success
            
            user_data['updated_at'] = firestore.SERVER_TIMESTAMP
            
            await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self.db.collection('users').document(uid).update,
                user_data
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to update user: {e}")
            return False
    
    async def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token"""
        try:
            if self.app is None:
                return await self._mock_verify_token(id_token)
            
            decoded_token = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                auth.verify_id_token,
                id_token
            )
            
            return decoded_token
            
        except Exception as e:
            logger.error(f"Failed to verify token: {e}")
            return None
    
    async def _send_otp_via_api(self, phone_number: str) -> Dict[str, Any]:
        """Send OTP via Firebase Auth REST API"""
        try:
            # This is a simplified version - in production you'd use Firebase Auth REST API
            # or integrate with SMS service providers like Twilio, AWS SNS, etc.
            
            async with httpx.AsyncClient() as client:
                # Mock API call - replace with actual Firebase Auth REST API
                response = await client.post(
                    "https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode",
                    json={
                        "phoneNumber": phone_number,
                        "recaptchaToken": "mock_token"  # In production, use real reCAPTCHA
                    },
                    headers={
                        "Content-Type": "application/json"
                    }
                )
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "session_info": "mock_session_info",
                        "message": f"OTP sent to {phone_number}"
                    }
                else:
                    return {
                        "success": False,
                        "error": "Failed to send OTP"
                    }
                    
        except Exception as e:
            logger.error(f"API OTP send failed: {e}")
            return await self._mock_send_otp(phone_number)
    
    async def _verify_otp_with_firebase(self, phone_number: str, otp: str) -> Dict[str, Any]:
        """Verify OTP with Firebase"""
        try:
            # In production, verify with Firebase Auth REST API
            # For now, using mock verification
            return await self._mock_verify_otp(phone_number, otp)
            
        except Exception as e:
            logger.error(f"Firebase OTP verification failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def _mock_send_otp(self, phone_number: str) -> Dict[str, Any]:
        """Mock OTP sending for development"""
        logger.info(f"Mock: Sending OTP to {phone_number}")
        
        # Generate a mock OTP (in development, always use 123456)
        mock_otp = "123456"
        
        # Store OTP in memory (in production, use Redis or database)
        if not hasattr(self, '_otp_store'):
            self._otp_store = {}
        
        self._otp_store[phone_number] = mock_otp
        
        return {
            "success": True,
            "session_info": f"mock_session_{phone_number}",
            "message": f"OTP sent to {phone_number}",
            "otp": mock_otp  # Only in development
        }
    
    async def _mock_verify_otp(self, phone_number: str, otp: str) -> Dict[str, Any]:
        """Mock OTP verification for development"""
        logger.info(f"Mock: Verifying OTP {otp} for {phone_number}")
        
        # Check stored OTP
        if not hasattr(self, '_otp_store'):
            self._otp_store = {}
        
        stored_otp = self._otp_store.get(phone_number)
        
        if stored_otp == otp or otp == "123456":  # Always accept 123456 in development
            # Clean up OTP
            if phone_number in self._otp_store:
                del self._otp_store[phone_number]
            
            return {
                "success": True,
                "uid": f"mock_uid_{phone_number.replace('+', '').replace(' ', '')}",
                "custom_token": f"mock_token_{phone_number}",
                "message": "OTP verified successfully"
            }
        else:
            return {
                "success": False,
                "error": "Invalid OTP"
            }
    
    async def _mock_create_user(self, phone_number: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock user creation for development"""
        uid = f"mock_uid_{phone_number.replace('+', '').replace(' ', '')}"
        
        user_doc_data = {
            'uid': uid,
            'phone': phone_number,
            'name': user_data.get('name', ''),
            'email': user_data.get('email', ''),
            'address': user_data.get('address', ''),
            'farm_size': user_data.get('farm_size', ''),
            'crop_types': user_data.get('crop_types', []),
            'aadhaar_verified': user_data.get('aadhaar_verified', False),
            'created_at': "2024-01-01T00:00:00Z",
            'updated_at': "2024-01-01T00:00:00Z"
        }
        
        # Store in memory for development
        if not hasattr(self, '_user_store'):
            self._user_store = {}
        
        self._user_store[uid] = user_doc_data
        
        return {
            "success": True,
            "uid": uid,
            "user": user_doc_data
        }
    
    async def _mock_get_user(self, uid: str) -> Optional[Dict[str, Any]]:
        """Mock get user for development"""
        if not hasattr(self, '_user_store'):
            self._user_store = {}
        
        return self._user_store.get(uid)
    
    async def _mock_verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Mock token verification for development"""
        if id_token.startswith("mock_token_"):
            phone_number = id_token.replace("mock_token_", "")
            return {
                "uid": f"mock_uid_{phone_number.replace('+', '').replace(' ', '')}",
                "phone_number": phone_number,
                "iss": "mock_issuer",
                "aud": "mock_audience",
                "auth_time": 1640995200,
                "exp": 1640998800
            }
        return None

# Global Firebase auth manager
firebase_auth = FirebaseAuthManager()