#!/usr/bin/env python3
"""
Firebase service integration
Handles Firebase Authentication and Storage operations
"""

import os
import json
import logging
from typing import Optional, Dict, Any
from fastapi import UploadFile, HTTPException

try:
    import firebase_admin
    from firebase_admin import credentials, auth, storage
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    print("Warning: Firebase SDK not installed. Install with: pip install firebase-admin")

# Setup logging
logger = logging.getLogger(__name__)

class FirebaseService:
    """Firebase service wrapper"""
    
    def __init__(self):
        self.app = None
        self.bucket = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            if not FIREBASE_AVAILABLE:
                logger.warning("Firebase SDK not available")
                return
                
            # Get Firebase configuration from environment
            firebase_config_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY')
            firebase_project_id = os.getenv('FIREBASE_PROJECT_ID')
            firebase_storage_bucket = os.getenv('FIREBASE_STORAGE_BUCKET')
            
            if firebase_config_path and os.path.exists(firebase_config_path):
                # Initialize with service account key file
                cred = credentials.Certificate(firebase_config_path)
                self.app = firebase_admin.initialize_app(cred, {
                    'storageBucket': firebase_storage_bucket or f"{firebase_project_id}.appspot.com"
                })
                logger.info("[SUCCESS] Firebase initialized with service account")
                
            elif firebase_project_id:
                # Try to initialize with default credentials (for cloud deployment)
                try:
                    self.app = firebase_admin.initialize_app({
                        'projectId': firebase_project_id,
                        'storageBucket': firebase_storage_bucket or f"{firebase_project_id}.appspot.com"
                    })
                    logger.info("[SUCCESS] Firebase initialized with default credentials")
                except Exception as e:
                    logger.warning(f"[WARNING] Firebase default initialization failed: {e}")
                    
            else:
                logger.warning("[WARNING] Firebase configuration not found")
                return
            
            # Initialize storage bucket
            if firebase_storage_bucket:
                self.bucket = storage.bucket(firebase_storage_bucket)
            else:
                self.bucket = storage.bucket()
                
            logger.info("[SUCCESS] Firebase service initialized successfully")
            
        except Exception as e:
            logger.error(f"[ERROR] Firebase initialization failed: {e}")
            self.app = None
            self.bucket = None
    
    def is_available(self) -> bool:
        """Check if Firebase service is available"""
        return self.app is not None and FIREBASE_AVAILABLE
    
    async def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token"""
        try:
            if not self.is_available():
                raise Exception("Firebase not available")
                
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
            
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None
    
    async def create_user(self, email: str, password: str, **kwargs) -> Optional[str]:
        """Create a new Firebase user"""
        try:
            if not self.is_available():
                raise Exception("Firebase not available")
                
            user = auth.create_user(
                email=email,
                password=password,
                **kwargs
            )
            
            logger.info(f"Created Firebase user: {user.uid}")
            return user.uid
            
        except Exception as e:
            logger.error(f"User creation failed: {e}")
            return None
    
    async def get_user(self, uid: str) -> Optional[Dict[str, Any]]:
        """Get Firebase user by UID"""
        try:
            if not self.is_available():
                raise Exception("Firebase not available")
                
            user = auth.get_user(uid)
            return {
                "uid": user.uid,
                "email": user.email,
                "email_verified": user.email_verified,
                "display_name": user.display_name,
                "phone_number": user.phone_number,
                "created_at": user.user_metadata.creation_timestamp,
                "last_sign_in": user.user_metadata.last_sign_in_timestamp
            }
            
        except Exception as e:
            logger.error(f"Get user failed: {e}")
            return None
    
    async def update_user(self, uid: str, **kwargs) -> bool:
        """Update Firebase user"""
        try:
            if not self.is_available():
                raise Exception("Firebase not available")
                
            auth.update_user(uid, **kwargs)
            logger.info(f"Updated Firebase user: {uid}")
            return True
            
        except Exception as e:
            logger.error(f"User update failed: {e}")
            return False
    
    async def delete_user(self, uid: str) -> bool:
        """Delete Firebase user"""
        try:
            if not self.is_available():
                raise Exception("Firebase not available")
                
            auth.delete_user(uid)
            logger.info(f"Deleted Firebase user: {uid}")
            return True
            
        except Exception as e:
            logger.error(f"User deletion failed: {e}")
            return False
    
    async def upload_file(self, file: UploadFile, folder: str = "uploads") -> str:
        """Upload file to Firebase Storage"""
        try:
            if not self.is_available() or not self.bucket:
                raise Exception("Firebase Storage not available")
            
            # Generate unique filename
            import uuid
            from datetime import datetime
            
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            unique_filename = f"{folder}/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{file_extension}"
            
            # Upload file
            blob = self.bucket.blob(unique_filename)
            
            # Read file content
            file_content = await file.read()
            
            # Upload to Firebase Storage
            blob.upload_from_string(
                file_content,
                content_type=file.content_type or 'image/jpeg'
            )
            
            # Make the file publicly accessible
            blob.make_public()
            
            # Return public URL
            download_url = blob.public_url
            logger.info(f"File uploaded successfully: {download_url}")
            
            return download_url
            
        except Exception as e:
            logger.error(f"File upload failed: {e}")
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from Firebase Storage"""
        try:
            if not self.is_available() or not self.bucket:
                raise Exception("Firebase Storage not available")
            
            blob = self.bucket.blob(file_path)
            blob.delete()
            
            logger.info(f"File deleted successfully: {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"File deletion failed: {e}")
            return False
    
    async def get_file_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """Get signed URL for file access"""
        try:
            if not self.is_available() or not self.bucket:
                raise Exception("Firebase Storage not available")
            
            blob = self.bucket.blob(file_path)
            url = blob.generate_signed_url(
                expiration=expires_in,
                method='GET'
            )
            
            return url
            
        except Exception as e:
            logger.error(f"Get file URL failed: {e}")
            return None
    
    async def list_files(self, folder: str = "", limit: int = 100) -> list:
        """List files in Firebase Storage"""
        try:
            if not self.is_available() or not self.bucket:
                raise Exception("Firebase Storage not available")
            
            blobs = self.bucket.list_blobs(prefix=folder, max_results=limit)
            
            files = []
            for blob in blobs:
                files.append({
                    "name": blob.name,
                    "size": blob.size,
                    "created": blob.time_created,
                    "updated": blob.updated,
                    "content_type": blob.content_type,
                    "public_url": blob.public_url if blob.public_url_set else None
                })
            
            return files
            
        except Exception as e:
            logger.error(f"List files failed: {e}")
            return []
    
    def get_auth_url(self) -> str:
        """Get Firebase Auth URL for frontend"""
        firebase_project_id = os.getenv('FIREBASE_PROJECT_ID')
        if firebase_project_id:
            return f"https://{firebase_project_id}.firebaseapp.com"
        return ""
    
    def get_config(self) -> Dict[str, Any]:
        """Get Firebase config for frontend"""
        return {
            "apiKey": os.getenv('FIREBASE_API_KEY', ''),
            "authDomain": os.getenv('FIREBASE_AUTH_DOMAIN', ''),
            "projectId": os.getenv('FIREBASE_PROJECT_ID', ''),
            "storageBucket": os.getenv('FIREBASE_STORAGE_BUCKET', ''),
            "messagingSenderId": os.getenv('FIREBASE_MESSAGING_SENDER_ID', ''),
            "appId": os.getenv('FIREBASE_APP_ID', '')
        }

# Global Firebase service instance
firebase_service: Optional[FirebaseService] = None

def get_firebase_service() -> Optional[FirebaseService]:
    """Get global Firebase service instance"""
    global firebase_service
    if firebase_service is None:
        firebase_service = FirebaseService()
    return firebase_service

import firebase_admin
from firebase_admin import credentials, auth
import os
import logging
from typing import Optional, Dict, Any
import json
import tempfile

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):
        self.app = None
        self.initialize_firebase()

    def initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # For Firebase Admin SDK, we'll use environment variables for service account
            # In production, you would store the service account JSON file securely
            
            # Create a temporary service account configuration
            service_account_info = {
                "type": "service_account",
                "project_id": os.getenv('FIREBASE_PROJECT_ID', 'agrowatch-3e97f'),
                "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID', ''),
                "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                "client_email": os.getenv('FIREBASE_CLIENT_EMAIL', ''),
                "client_id": os.getenv('FIREBASE_CLIENT_ID', ''),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_CERT_URL', '')
            }
            
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                # For now, we'll initialize without service account for basic functionality
                # In production, you should provide proper service account credentials
                self.app = firebase_admin.initialize_app()
                logger.info("Firebase Admin SDK initialized successfully")
            else:
                self.app = firebase_admin.get_app()
                logger.info("Firebase Admin SDK already initialized")
                
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
            # Continue without Firebase for now
            self.app = None

    async def verify_id_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Firebase ID token and return decoded claims
        
        Args:
            id_token: Firebase ID token from client
            
        Returns:
            Dict with user claims or None if verification fails
        """
        if not self.app:
            logger.warning("Firebase not initialized, cannot verify token")
            return None
            
        try:
            # Verify the ID token
            decoded_token = auth.verify_id_token(id_token)
            
            logger.info(f"Token verified successfully for user: {decoded_token.get('uid')}")
            return decoded_token
            
        except auth.InvalidIdTokenError:
            logger.error("Invalid ID token")
            return None
        except auth.ExpiredIdTokenError:
            logger.error("Expired ID token")
            return None
        except Exception as e:
            logger.error(f"Error verifying ID token: {str(e)}")
            return None

    async def create_custom_token(self, uid: str, additional_claims: Optional[Dict] = None) -> Optional[str]:
        """
        Create a custom token for the given user
        
        Args:
            uid: User ID
            additional_claims: Additional claims to include in token
            
        Returns:
            Custom token string or None if creation fails
        """
        if not self.app:
            logger.warning("Firebase not initialized, cannot create custom token")
            return None
            
        try:
            custom_token = auth.create_custom_token(uid, additional_claims)
            logger.info(f"Custom token created successfully for user: {uid}")
            return custom_token.decode('utf-8')
            
        except Exception as e:
            logger.error(f"Error creating custom token for user {uid}: {str(e)}")
            return None

    async def get_user_by_uid(self, uid: str) -> Optional[Dict[str, Any]]:
        """
        Get user information by Firebase UID
        
        Args:
            uid: Firebase user UID
            
        Returns:
            Dict with user information or None if not found
        """
        if not self.app:
            logger.warning("Firebase not initialized, cannot get user")
            return None
            
        try:
            user_record = auth.get_user(uid)
            
            user_info = {
                "uid": user_record.uid,
                "email": user_record.email,
                "phone_number": user_record.phone_number,
                "display_name": user_record.display_name,
                "email_verified": user_record.email_verified,
                "disabled": user_record.disabled,
                "creation_timestamp": user_record.user_metadata.creation_timestamp,
                "last_sign_in_timestamp": user_record.user_metadata.last_sign_in_timestamp,
            }
            
            logger.info(f"User information retrieved for UID: {uid}")
            return user_info
            
        except auth.UserNotFoundError:
            logger.error(f"User not found with UID: {uid}")
            return None
        except Exception as e:
            logger.error(f"Error getting user by UID {uid}: {str(e)}")
            return None

    async def create_user(self, phone: str, email: Optional[str] = None, 
                         display_name: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Create a new Firebase user
        
        Args:
            phone: Phone number in E.164 format
            email: Optional email address
            display_name: Optional display name
            
        Returns:
            Dict with created user information or None if creation fails
        """
        if not self.app:
            logger.warning("Firebase not initialized, cannot create user")
            return None
            
        try:
            user_creation_request = {
                "phone_number": phone,
            }
            
            if email:
                user_creation_request["email"] = email
            if display_name:
                user_creation_request["display_name"] = display_name
                
            user_record = auth.create_user(**user_creation_request)
            
            user_info = {
                "uid": user_record.uid,
                "email": user_record.email,
                "phone_number": user_record.phone_number,
                "display_name": user_record.display_name,
                "email_verified": user_record.email_verified,
                "creation_timestamp": user_record.user_metadata.creation_timestamp,
            }
            
            logger.info(f"User created successfully with UID: {user_record.uid}")
            return user_info
            
        except auth.PhoneNumberAlreadyExistsError:
            logger.error(f"Phone number already exists: {phone}")
            return None
        except auth.EmailAlreadyExistsError:
            logger.error(f"Email already exists: {email}")
            return None
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return None

    async def update_user(self, uid: str, phone: Optional[str] = None, 
                         email: Optional[str] = None, display_name: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Update Firebase user information
        
        Args:
            uid: Firebase user UID
            phone: Optional new phone number
            email: Optional new email
            display_name: Optional new display name
            
        Returns:
            Dict with updated user information or None if update fails
        """
        if not self.app:
            logger.warning("Firebase not initialized, cannot update user")
            return None
            
        try:
            update_request = {}
            
            if phone:
                update_request["phone_number"] = phone
            if email:
                update_request["email"] = email
            if display_name:
                update_request["display_name"] = display_name
                
            user_record = auth.update_user(uid, **update_request)
            
            user_info = {
                "uid": user_record.uid,
                "email": user_record.email,
                "phone_number": user_record.phone_number,
                "display_name": user_record.display_name,
                "email_verified": user_record.email_verified,
            }
            
            logger.info(f"User updated successfully with UID: {uid}")
            return user_info
            
        except auth.UserNotFoundError:
            logger.error(f"User not found with UID: {uid}")
            return None
        except Exception as e:
            logger.error(f"Error updating user {uid}: {str(e)}")
            return None

    async def delete_user(self, uid: str) -> bool:
        """
        Delete Firebase user
        
        Args:
            uid: Firebase user UID
            
        Returns:
            True if deletion successful, False otherwise
        """
        if not self.app:
            logger.warning("Firebase not initialized, cannot delete user")
            return False
            
        try:
            auth.delete_user(uid)
            logger.info(f"User deleted successfully with UID: {uid}")
            return True
            
        except auth.UserNotFoundError:
            logger.error(f"User not found with UID: {uid}")
            return False
        except Exception as e:
            logger.error(f"Error deleting user {uid}: {str(e)}")
            return False

    def is_initialized(self) -> bool:
        """Check if Firebase is properly initialized"""
        return self.app is not None

# Global Firebase service instance
firebase_service = FirebaseService()
