from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from auth.firebase_auth import firebase_auth
from utils.logger import logger
import re

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

class PhoneOTPRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number with country code")
    
class OTPVerificationRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number with country code")
    otp: str = Field(..., description="6-digit OTP")

class UserRegistrationRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number with country code")
    name: str = Field(..., description="Full name")
    email: Optional[str] = Field(None, description="Email address")
    address: Optional[str] = Field(None, description="Address")
    farm_size: Optional[str] = Field(None, description="Farm size")
    crop_types: Optional[list] = Field(default=[], description="Types of crops")
    aadhaar_number: Optional[str] = Field(None, description="Aadhaar number")
    aadhaar_verified: bool = Field(default=False, description="Aadhaar verification status")

class UserUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, description="Full name")
    email: Optional[str] = Field(None, description="Email address")
    address: Optional[str] = Field(None, description="Address")
    farm_size: Optional[str] = Field(None, description="Farm size")
    crop_types: Optional[list] = Field(None, description="Types of crops")
    aadhaar_number: Optional[str] = Field(None, description="Aadhaar number")
    aadhaar_verified: Optional[bool] = Field(None, description="Aadhaar verification status")

def validate_phone_number(phone: str) -> bool:
    """Validate phone number format"""
    # Basic validation for Indian phone numbers
    pattern = r'^\+91[6-9]\d{9}$'
    return bool(re.match(pattern, phone))

def validate_aadhaar_number(aadhaar: str) -> bool:
    """Validate Aadhaar number format"""
    # Basic Aadhaar validation (12 digits)
    pattern = r'^\d{12}$'
    return bool(re.match(pattern, aadhaar.replace(' ', '')))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    try:
        token = credentials.credentials
        decoded_token = await firebase_auth.verify_token(token)
        
        if not decoded_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        user_data = await firebase_auth.get_user(decoded_token['uid'])
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user_data
        
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

@router.post("/send-otp")
async def send_otp(request: PhoneOTPRequest):
    """Send OTP to phone number"""
    try:
        # Validate phone number
        if not validate_phone_number(request.phone_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number format. Use +91XXXXXXXXXX"
            )
        
        result = await firebase_auth.send_otp(request.phone_number)
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "session_info": result.get("session_info"),
                # Include OTP in development mode only
                **({"otp": result["otp"]} if "otp" in result else {})
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Send OTP error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

@router.post("/verify-otp")
async def verify_otp(request: OTPVerificationRequest):
    """Verify OTP and authenticate user"""
    try:
        # Validate phone number
        if not validate_phone_number(request.phone_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number format"
            )
        
        # Validate OTP format
        if not request.otp.isdigit() or len(request.otp) != 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP must be 6 digits"
            )
        
        result = await firebase_auth.verify_otp(request.phone_number, request.otp)
        
        if result["success"]:
            # Check if user exists
            user_data = await firebase_auth.get_user(result["uid"])
            
            return {
                "success": True,
                "message": result["message"],
                "access_token": result["custom_token"],
                "token_type": "bearer",
                "uid": result["uid"],
                "user": user_data,
                "is_new_user": user_data is None
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Verify OTP error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify OTP"
        )

@router.post("/register")
async def register_user(request: UserRegistrationRequest):
    """Register new user"""
    try:
        # Validate phone number
        if not validate_phone_number(request.phone_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number format"
            )
        
        # Validate Aadhaar if provided
        if request.aadhaar_number and not validate_aadhaar_number(request.aadhaar_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Aadhaar number format"
            )
        
        # Validate email if provided
        if request.email and "@" not in request.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )
        
        user_data = {
            "name": request.name,
            "email": request.email,
            "address": request.address,
            "farm_size": request.farm_size,
            "crop_types": request.crop_types,
            "aadhaar_number": request.aadhaar_number,
            "aadhaar_verified": request.aadhaar_verified
        }
        
        result = await firebase_auth.create_user(request.phone_number, user_data)
        
        if result["success"]:
            return {
                "success": True,
                "message": "User registered successfully",
                "uid": result["uid"],
                "user": result["user"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        )

@router.get("/profile")
async def get_user_profile(current_user: Dict = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "success": True,
        "user": current_user
    }

@router.put("/profile")
async def update_user_profile(
    request: UserUpdateRequest,
    current_user: Dict = Depends(get_current_user)
):
    """Update user profile"""
    try:
        # Validate Aadhaar if provided
        if request.aadhaar_number and not validate_aadhaar_number(request.aadhaar_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Aadhaar number format"
            )
        
        # Validate email if provided
        if request.email and "@" not in request.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )
        
        # Prepare update data (only include non-None values)
        update_data = {}
        for field, value in request.dict().items():
            if value is not None:
                update_data[field] = value
        
        success = await firebase_auth.update_user(current_user["uid"], update_data)
        
        if success:
            # Get updated user data
            updated_user = await firebase_auth.get_user(current_user["uid"])
            return {
                "success": True,
                "message": "Profile updated successfully",
                "user": updated_user
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update profile"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

@router.post("/logout")
async def logout_user(current_user: Dict = Depends(get_current_user)):
    """Logout user (invalidate token on client side)"""
    return {
        "success": True,
        "message": "Logged out successfully"
    }

@router.post("/verify-aadhaar")
async def verify_aadhaar(
    aadhaar_number: str,
    current_user: Dict = Depends(get_current_user)
):
    """Verify Aadhaar number (mock implementation)"""
    try:
        # Validate Aadhaar format
        if not validate_aadhaar_number(aadhaar_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Aadhaar number format"
            )
        
        # Mock Aadhaar verification - in production, integrate with UIDAI API
        mock_aadhaar_data = {
            "name": "राम कुमार शर्मा",
            "address": "गाँव पोस्ट - रामपुर, तहसील - सदर, जिला - मेरठ, उत्तर प्रदेश - 250001",
            "dob": "01/01/1980",
            "gender": "M",
            "verified": True
        }
        
        # Update user with Aadhaar verification
        update_data = {
            "aadhaar_number": aadhaar_number,
            "aadhaar_verified": True,
            "aadhaar_data": mock_aadhaar_data
        }
        
        success = await firebase_auth.update_user(current_user["uid"], update_data)
        
        if success:
            return {
                "success": True,
                "message": "Aadhaar verified successfully",
                "aadhaar_data": mock_aadhaar_data
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update Aadhaar verification"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Aadhaar verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify Aadhaar"
        )

@router.get("/health")
async def auth_health_check():
    """Health check for authentication service"""
    return {
        "success": True,
        "message": "Authentication service is healthy",
        "firebase_status": "connected" if firebase_auth.app else "mock_mode"
    }