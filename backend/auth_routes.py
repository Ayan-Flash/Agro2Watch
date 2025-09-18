#!/usr/bin/env python3
"""
Authentication routes for AgroWatch API
Handles user registration, login, and JWT token management
"""

import os
import jwt
import bcrypt
import logging
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

# Import models and database
from models import UserCreate, UserLogin, UserResponse, Token
from database import DatabaseManager, get_database
from firebase_service import get_firebase_service

# Setup logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id

@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await DatabaseManager.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Prepare user data for database
        user_record = {
            "email": user_data.email,
            "password_hash": hashed_password,
            "full_name": user_data.full_name,
            "phone_number": user_data.phone_number,
            "location": user_data.location,
            "is_active": True,
            "email_verified": False
        }
        
        # Create user in database
        user_id = await DatabaseManager.create_user(user_record)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        # Try to create user in Firebase (optional)
        firebase_service = get_firebase_service()
        firebase_uid = None
        if firebase_service and firebase_service.is_available():
            try:
                firebase_uid = await firebase_service.create_user(
                    email=user_data.email,
                    password=user_data.password,
                    display_name=user_data.full_name
                )
                logger.info(f"Firebase user created: {firebase_uid}")
            except Exception as e:
                logger.warning(f"Firebase user creation failed: {e}")
        
        # Create access token
        access_token = create_access_token(
            data={
                "sub": user_id,
                "email": user_data.email,
                "firebase_uid": firebase_uid
            }
        )
        
        logger.info(f"User registered successfully: {user_data.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": JWT_EXPIRATION_HOURS * 3600
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=Token)
async def login_user(credentials: UserLogin):
    """Authenticate user and return token"""
    try:
        # Get user from database
        user = await DatabaseManager.get_user_by_email(credentials.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Verify password
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(
            data={
                "sub": str(user["_id"]),
                "email": user["email"],
                "firebase_uid": user.get("firebase_uid")
            }
        )
        
        # Update last login time
        db = get_database()
        if db:
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": datetime.now()}}
            )
        
        logger.info(f"User logged in successfully: {credentials.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": JWT_EXPIRATION_HOURS * 3600
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    """Get current user information"""
    try:
        db = get_database()
        if not db:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database not available"
            )
        
        # Get user from database
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(current_user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "phone_number": user.get("phone_number"),
            "location": user.get("location"),
            "created_at": user.get("created_at", datetime.now())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user info failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user_id: str = Depends(get_current_user)):
    """Refresh access token"""
    try:
        # Get user from database
        db = get_database()
        if not db:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database not available"
            )
        
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(current_user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Create new access token
        access_token = create_access_token(
            data={
                "sub": current_user_id,
                "email": user["email"],
                "firebase_uid": user.get("firebase_uid")
            }
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": JWT_EXPIRATION_HOURS * 3600
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@router.post("/logout")
async def logout_user(current_user_id: str = Depends(get_current_user)):
    """Logout user (invalidate token on client side)"""
    # JWT tokens are stateless, so we just return success
    # In production, you might want to maintain a blacklist of tokens
    logger.info(f"User logged out: {current_user_id}")
    return {"message": "Successfully logged out"}

@router.post("/verify-token")
async def verify_user_token(current_user_id: str = Depends(get_current_user)):
    """Verify if token is valid"""
    return {
        "valid": True,
        "user_id": current_user_id,
        "message": "Token is valid"
    }

@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user_id: str = Depends(get_current_user)
):
    """Change user password"""
    try:
        db = get_database()
        if not db:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database not available"
            )
        
        # Get user from database
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(current_user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify old password
        if not verify_password(old_password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid current password"
            )
        
        # Hash new password
        new_password_hash = hash_password(new_password)
        
        # Update password in database
        await db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {
                "$set": {
                    "password_hash": new_password_hash,
                    "updated_at": datetime.now()
                }
            }
        )
        
        logger.info(f"Password changed for user: {current_user_id}")
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed"
        )

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import logging
from datetime import datetime, timedelta
import bcrypt
from models import (
    User, UserCreate, UserUpdate, UserResponse, 
    FarmerProfile, FarmerProfileCreate, FarmerProfileResponse,
    OTPRequest, OTPVerify, UserRole
)
from database import get_database, Collections
from twilio_service import twilio_service
from firebase_service import firebase_service
from auth_middleware import get_current_user, require_admin, require_farmer, AuthMiddleware

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Request/Response models
class LoginRequest(BaseModel):
    phone: str
    password: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserResponse] = None
    access_token: Optional[str] = None
    requires_profile_completion: bool = False

class RegisterRequest(BaseModel):
    phone: str
    name: str
    email: Optional[str] = None
    password: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class FirebaseTokenRequest(BaseModel):
    firebase_token: str

@router.post("/send-otp", response_model=Dict[str, Any])
async def send_otp(request: OTPRequest):
    """Send OTP to phone number for verification"""
    try:
        # Validate phone format
        phone = await AuthMiddleware.validate_phone_format(request.phone)
        
        # Send OTP via Twilio
        result = await twilio_service.send_sms_otp(phone, request.purpose)
        
        if result["success"]:
            logger.info(f"OTP sent successfully to {phone}")
            return {
                "success": True,
                "message": "OTP sent successfully",
                "phone": phone
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

@router.post("/verify-otp", response_model=Dict[str, Any])
async def verify_otp(request: OTPVerify):
    """Verify OTP and return authentication status"""
    try:
        # Validate phone format
        phone = await AuthMiddleware.validate_phone_format(request.phone)
        
        # Verify OTP via Twilio service
        result = await twilio_service.verify_otp(phone, request.otp_code, request.purpose)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["message"]
            )
        
        db = get_database()
        
        # Check if user exists
        user = await db[Collections.USERS].find_one({"phone": phone})
        
        if request.purpose == "registration":
            if user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User already exists"
                )
            return {
                "success": True,
                "message": "OTP verified. Proceed with registration.",
                "verified": True,
                "user_exists": False
            }
        
        elif request.purpose == "login":
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found. Please register first."
                )
            
            # Mark user as verified if not already
            if not user.get("is_verified"):
                await db[Collections.USERS].update_one(
                    {"_id": user["_id"]},
                    {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}}
                )
            
            # Update last login
            await db[Collections.USERS].update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            
            # Check if user has complete profile
            farmer_profile = await db[Collections.FARMER_PROFILES].find_one({"user_id": str(user["_id"])})
            requires_profile_completion = user.get("role") == "farmer" and (not farmer_profile or not farmer_profile.get("is_profile_complete"))
            
            # Create Firebase custom token if available
            custom_token = None
            if firebase_service.is_initialized() and user.get("firebase_uid"):
                custom_token = await firebase_service.create_custom_token(
                    user["firebase_uid"],
                    {"role": user.get("role"), "phone": phone}
                )
            
            return {
                "success": True,
                "message": "Login successful",
                "verified": True,
                "user_exists": True,
                "user": UserResponse(**user),
                "access_token": custom_token,
                "requires_profile_completion": requires_profile_completion
            }
        
        return {
            "success": True,
            "message": "OTP verified successfully",
            "verified": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying OTP: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OTP verification failed"
        )

@router.post("/register", response_model=LoginResponse)
async def register(request: RegisterRequest):
    """Register new user after OTP verification"""
    try:
        # Validate phone format
        phone = await AuthMiddleware.validate_phone_format(request.phone)
        
        db = get_database()
        
        # Check if user already exists
        existing_user = await db[Collections.USERS].find_one({"phone": phone})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        
        # Create Firebase user if available
        firebase_uid = None
        if firebase_service.is_initialized():
            firebase_user = await firebase_service.create_user(
                phone=phone,
                email=request.email,
                display_name=request.name
            )
            if firebase_user:
                firebase_uid = firebase_user["uid"]
        
        # Hash password if provided
        password_hash = None
        if request.password:
            password_hash = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        user_data = User(
            phone=phone,
            name=request.name,
            email=request.email,
            is_verified=True,  # Already verified via OTP
            firebase_uid=firebase_uid
        )
        
        # Insert user into database
        result = await db[Collections.USERS].insert_one(user_data.dict())
        user_data.id = str(result.inserted_id)
        
        # Create Firebase custom token
        custom_token = None
        if firebase_uid:
            custom_token = await firebase_service.create_custom_token(
                firebase_uid,
                {"role": user_data.role, "phone": phone}
            )
        
        logger.info(f"User registered successfully: {phone}")
        
        return LoginResponse(
            success=True,
            message="Registration successful",
            user=UserResponse(**user_data.dict()),
            access_token=custom_token,
            requires_profile_completion=user_data.role == UserRole.FARMER
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login user with phone and password (fallback method)"""
    try:
        # Validate phone format
        phone = await AuthMiddleware.validate_phone_format(request.phone)
        
        db = get_database()
        
        # Find user
        user = await db[Collections.USERS].find_one({"phone": phone})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user is active
        await AuthMiddleware.check_user_active(user)
        
        # If password provided, verify it
        if request.password and user.get("password_hash"):
            if not bcrypt.checkpw(request.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid password"
                )
        
        # Update last login
        await db[Collections.USERS].update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Check profile completion status
        farmer_profile = await db[Collections.FARMER_PROFILES].find_one({"user_id": str(user["_id"])})
        requires_profile_completion = user.get("role") == "farmer" and (not farmer_profile or not farmer_profile.get("is_profile_complete"))
        
        # Create Firebase custom token
        custom_token = None
        if firebase_service.is_initialized() and user.get("firebase_uid"):
            custom_token = await firebase_service.create_custom_token(
                user["firebase_uid"],
                {"role": user.get("role"), "phone": phone}
            )
        
        logger.info(f"User logged in successfully: {phone}")
        
        return LoginResponse(
            success=True,
            message="Login successful",
            user=UserResponse(**user),
            access_token=custom_token,
            requires_profile_completion=requires_profile_completion
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/firebase-login", response_model=LoginResponse)
async def firebase_login(request: FirebaseTokenRequest):
    """Login user with Firebase token"""
    try:
        # Verify Firebase token
        token_data = await firebase_service.verify_id_token(request.firebase_token)
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase token"
            )
        
        db = get_database()
        
        # Find user by Firebase UID
        user = await db[Collections.USERS].find_one({"firebase_uid": token_data["uid"]})
        
        if not user:
            # Create user if doesn't exist
            user_data = User(
                phone=token_data.get("phone_number", ""),
                name=token_data.get("name", ""),
                email=token_data.get("email", ""),
                firebase_uid=token_data["uid"],
                is_verified=token_data.get("phone_number") is not None
            )
            
            result = await db[Collections.USERS].insert_one(user_data.dict())
            user = user_data.dict()
            user["_id"] = result.inserted_id
        
        # Update last login
        await db[Collections.USERS].update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Check profile completion
        farmer_profile = await db[Collections.FARMER_PROFILES].find_one({"user_id": str(user["_id"])})
        requires_profile_completion = user.get("role") == "farmer" and (not farmer_profile or not farmer_profile.get("is_profile_complete"))
        
        return LoginResponse(
            success=True,
            message="Firebase login successful",
            user=UserResponse(**user),
            access_token=request.firebase_token,
            requires_profile_completion=requires_profile_completion
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error with Firebase login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Firebase login failed"
        )

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(**current_user)

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        db = get_database()
        
        # Prepare update data
        update_fields = {}
        if update_data.name is not None:
            update_fields["name"] = update_data.name
        if update_data.email is not None:
            update_fields["email"] = update_data.email
        if update_data.aadhar is not None:
            update_fields["aadhar"] = update_data.aadhar
        
        update_fields["updated_at"] = datetime.utcnow()
        
        # Update user in database
        await db[Collections.USERS].update_one(
            {"_id": current_user["_id"]},
            {"$set": update_fields}
        )
        
        # Update Firebase user if available
        if firebase_service.is_initialized() and current_user.get("firebase_uid"):
            await firebase_service.update_user(
                current_user["firebase_uid"],
                email=update_data.email,
                display_name=update_data.name
            )
        
        # Get updated user
        updated_user = await db[Collections.USERS].find_one({"_id": current_user["_id"]})
        
        logger.info(f"Profile updated for user: {current_user['phone']}")
        return UserResponse(**updated_user)
        
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed"
        )

@router.post("/farmer-profile", response_model=FarmerProfileResponse)
async def create_farmer_profile(
    profile_data: FarmerProfileCreate,
    current_user: Dict[str, Any] = Depends(require_farmer)
):
    """Create or update farmer profile"""
    try:
        db = get_database()
        
        # Check if profile already exists
        existing_profile = await db[Collections.FARMER_PROFILES].find_one({"user_id": str(current_user["_id"])})
        
        if existing_profile:
            # Update existing profile
            update_fields = profile_data.dict(exclude_unset=True)
            update_fields["updated_at"] = datetime.utcnow()
            update_fields["is_profile_complete"] = True
            
            await db[Collections.FARMER_PROFILES].update_one(
                {"user_id": str(current_user["_id"])},
                {"$set": update_fields}
            )
            
            updated_profile = await db[Collections.FARMER_PROFILES].find_one({"user_id": str(current_user["_id"])})
            return FarmerProfileResponse(**updated_profile)
        
        else:
            # Create new profile
            farmer_profile = FarmerProfile(
                user_id=str(current_user["_id"]),
                farm_size=profile_data.farm_size,
                location=profile_data.location,
                soil_type=profile_data.soil_type,
                irrigation_type=profile_data.irrigation_type,
                experience_years=profile_data.experience_years,
                is_profile_complete=True
            )
            
            result = await db[Collections.FARMER_PROFILES].insert_one(farmer_profile.dict())
            farmer_profile.id = str(result.inserted_id)
            
            logger.info(f"Farmer profile created for user: {current_user['phone']}")
            return FarmerProfileResponse(**farmer_profile.dict())
        
    except Exception as e:
        logger.error(f"Error creating farmer profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create farmer profile"
        )

@router.get("/farmer-profile", response_model=Optional[FarmerProfileResponse])
async def get_farmer_profile(current_user: Dict[str, Any] = Depends(require_farmer)):
    """Get current user's farmer profile"""
    try:
        db = get_database()
        
        profile = await db[Collections.FARMER_PROFILES].find_one({"user_id": str(current_user["_id"])})
        
        if profile:
            return FarmerProfileResponse(**profile)
        
        return None
        
    except Exception as e:
        logger.error(f"Error getting farmer profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get farmer profile"
        )

@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Change user password"""
    try:
        db = get_database()
        
        # Verify old password
        if current_user.get("password_hash"):
            if not bcrypt.checkpw(request.old_password.encode('utf-8'), current_user["password_hash"].encode('utf-8')):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid old password"
                )
        
        # Hash new password
        new_password_hash = bcrypt.hashpw(request.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Update password
        await db[Collections.USERS].update_one(
            {"_id": current_user["_id"]},
            {"$set": {"password_hash": new_password_hash, "updated_at": datetime.utcnow()}}
        )
        
        logger.info(f"Password changed for user: {current_user['phone']}")
        return {"success": True, "message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed"
        )

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"success": True, "message": "Logged out successfully"}

# Admin endpoints
@router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Get all users (admin only)"""
    try:
        db = get_database()
        
        users = await db[Collections.USERS].find().skip(skip).limit(limit).to_list(length=limit)
        
        return [UserResponse(**user) for user in users]
        
    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get users"
        )