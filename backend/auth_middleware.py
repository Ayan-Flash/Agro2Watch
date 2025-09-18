#!/usr/bin/env python3
"""
Simple authentication middleware for AgroWatch API
"""

from fastapi import HTTPException, status
from fastapi.security import HTTPBearer
from typing import Optional

security = HTTPBearer()

def get_current_user_mock():
    """Mock authentication function when full auth is not available"""
    return "mock_user_id"

class AuthMiddleware:
    """Simple authentication middleware"""
    
    @staticmethod
    def verify_token(token: str) -> Optional[str]:
        """Mock token verification"""
        if token:
            return "mock_user_id"
        return None
    
    @staticmethod
    def require_auth(allow_mock: bool = True) -> str:
        """Require authentication"""
        if allow_mock:
            return "mock_user_id"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import logging
from firebase_service import firebase_service
from database import get_database, Collections

logger = logging.getLogger(__name__)

# HTTP Bearer token security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user from Firebase token
    
    Args:
        credentials: HTTP Bearer credentials with Firebase ID token
        
    Returns:
        Dict with user information
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        # Verify Firebase ID token
        token_data = await firebase_service.verify_id_token(credentials.credentials)
        
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database
        db = get_database()
        user = await db[Collections.USERS].find_one({"firebase_uid": token_data["uid"]})
        
        if not user:
            # If Firebase user exists but not in our database, create a new user record
            logger.warning(f"Firebase user {token_data['uid']} not found in database")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found in database",
            )
        
        # Add Firebase token data to user info
        user["firebase_data"] = token_data
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in authentication middleware: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[Dict[str, Any]]:
    """
    Optional dependency to get current authenticated user
    Returns None if no valid token is provided
    
    Args:
        credentials: Optional HTTP Bearer credentials
        
    Returns:
        Dict with user information or None
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

async def require_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Dependency to require admin role
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Dict with admin user information
        
    Raises:
        HTTPException: If user is not admin
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user

async def require_farmer(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Dependency to require farmer role
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Dict with farmer user information
        
    Raises:
        HTTPException: If user is not farmer
    """
    if current_user.get("role") not in ["farmer", "admin"]:  # Admin can access farmer endpoints
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer access required"
        )
    
    return current_user

async def require_verified_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Dependency to require verified user
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Dict with verified user information
        
    Raises:
        HTTPException: If user is not verified
    """
    if not current_user.get("is_verified"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Phone verification required"
        )
    
    return current_user

class AuthMiddleware:
    """Authentication middleware class for additional functionality"""
    
    @staticmethod
    async def validate_phone_format(phone: str) -> str:
        """
        Validate and format phone number
        
        Args:
            phone: Phone number to validate
            
        Returns:
            Formatted phone number in E.164 format
            
        Raises:
            HTTPException: If phone format is invalid
        """
        # Remove any spaces or special characters except +
        cleaned_phone = ''.join(char for char in phone if char.isdigit() or char == '+')
        
        # Check if it starts with +
        if not cleaned_phone.startswith('+'):
            # Assume Indian number if no country code
            if len(cleaned_phone) == 10:
                cleaned_phone = '+91' + cleaned_phone
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid phone number format. Use E.164 format (+1234567890)"
                )
        
        # Basic validation for phone number length
        if len(cleaned_phone) < 10 or len(cleaned_phone) > 16:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number length"
            )
        
        return cleaned_phone
    
    @staticmethod
    async def check_user_active(user: Dict[str, Any]) -> None:
        """
        Check if user account is active
        
        Args:
            user: User dictionary
            
        Raises:
            HTTPException: If user account is inactive
        """
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )