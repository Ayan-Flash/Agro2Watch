#!/usr/bin/env python3
"""
Database connection and management module
Handles Firebase Firestore connections for AgroWatch
"""

import os
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    print("Warning: Firebase SDK not installed. Install with: pip install firebase-admin")

# Setup logging
logger = logging.getLogger(__name__)

# Global database connection
db = None

async def connect_to_firestore():
    """Create Firestore database connection"""
    global db
    
    try:
        if not FIREBASE_AVAILABLE:
            logger.warning("[WARNING] Firebase SDK not available")
            return None
            
        # Get Firebase configuration
        firebase_project_id = os.getenv('FIREBASE_PROJECT_ID')
        
        if not firebase_project_id:
            logger.warning("[WARNING] FIREBASE_PROJECT_ID not found in environment")
            return None
            
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            # Initialize Firebase (will use default credentials or service account)
            try:
                firebase_admin.initialize_app()
            except Exception as e:
                logger.warning(f"[WARNING] Firebase initialization failed: {e}")
                return None
        
        # Get Firestore client
        db = firestore.client()
        
        # Test the connection by reading from a test collection
        test_doc = db.collection('_test').limit(1).get()
        logger.info("[SUCCESS] Firestore connection successful")
        
        return db
        
    except Exception as e:
        logger.warning(f"[WARNING] Firestore connection failed: {e}")
        logger.info("[INFO] Running without database - using mock data")
        return None

async def close_firestore_connection():
    """Close Firestore database connection"""
    global db
    
    if db:
        # Firestore client doesn't need explicit closing
        db = None
        logger.info("Firestore connection closed")

def get_database():
    """Get the Firestore database instance"""
    return db

def setup_firestore_collections():
    """Setup Firestore collections (indexes are handled automatically by Firebase)"""
    try:
        if not db:
            logger.info("[INFO] Skipping collection setup - no database connection")
            return
            
        # Firestore handles indexing automatically
        # We just need to define our collection names
        collections = {
            'users': 'User profiles and authentication data',
            'crop_analyses': 'Crop health analysis results',
            'soil_analyses': 'Soil condition analysis results', 
            'alerts': 'User alerts and notifications'
        }
        
        logger.info(f"[SUCCESS] Firestore collections ready: {', '.join(collections.keys())}")
        
    except Exception as e:
        logger.warning(f"[WARNING] Collection setup failed: {e}")

# Collections mapping
class Collections:
    USERS = 'users'
    CROP_ANALYSES = 'crop_analyses'
    SOIL_ANALYSES = 'soil_analyses'
    ALERTS = 'alerts'

# Database helper functions
class DatabaseManager:
    """Firestore database operations manager"""
    
    @staticmethod
    async def save_crop_analysis(user_id: str, analysis_data: dict):
        """Save crop analysis to Firestore"""
        try:
            if not db:
                raise Exception("Database not connected")
                
            analysis_record = {
                "user_id": user_id,
                "analysis_data": analysis_data,
                "created_at": datetime.now(),
                "analysis_type": "crop_health"
            }
            
            # Add document to Firestore
            doc_ref = db.collection(Collections.CROP_ANALYSES).document()
            doc_ref.set(analysis_record)
            
            logger.info(f"Crop analysis saved with ID: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to save crop analysis: {e}")
            raise e
    
    @staticmethod
    async def save_soil_analysis(user_id: str, analysis_data: dict):
        """Save soil analysis to Firestore"""
        try:
            if not db:
                raise Exception("Database not connected")
                
            analysis_record = {
                "user_id": user_id,
                "analysis_data": analysis_data,
                "created_at": datetime.now(),
                "analysis_type": "soil_condition"
            }
            
            # Add document to Firestore
            doc_ref = db.collection(Collections.SOIL_ANALYSES).document()
            doc_ref.set(analysis_record)
            
            logger.info(f"Soil analysis saved with ID: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to save soil analysis: {e}")
            raise e
    
    @staticmethod
    async def save_alert(user_id: str, alert_data: dict):
        """Save alert to Firestore"""
        try:
            if not db:
                raise Exception("Database not connected")
                
            alert_record = {
                "user_id": user_id,
                "alert_data": alert_data,
                "created_at": datetime.now(),
                "status": "sent"
            }
            
            # Add document to Firestore
            doc_ref = db.collection(Collections.ALERTS).document()
            doc_ref.set(alert_record)
            
            logger.info(f"Alert saved with ID: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to save alert: {e}")
            raise e
    
    @staticmethod
    async def get_user_by_email(email: str):
        """Get user by email from Firestore"""
        try:
            if not db:
                raise Exception("Database not connected")
            
            # Query Firestore for user with matching email
            users_ref = db.collection(Collections.USERS)
            query = users_ref.where('email', '==', email).limit(1)
            docs = query.get()
            
            for doc in docs:
                user_data = doc.to_dict()
                user_data['id'] = doc.id
                return user_data
                
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user by email: {e}")
            raise e
    
    @staticmethod
    async def create_user(user_data: dict):
        """Create new user in Firestore"""
        try:
            if not db:
                raise Exception("Database not connected")
                
            user_record = {
                **user_data,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            # Add document to Firestore
            doc_ref = db.collection(Collections.USERS).document()
            doc_ref.set(user_record)
            
            logger.info(f"User created with ID: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to create user: {e}")
            raise e
    
    @staticmethod
    async def get_analytics_data(user_id: str):
        """Get analytics data for user from Firestore"""
        try:
            if not db:
                raise Exception("Database not connected")
            
            # Get crop analyses for user
            crop_analyses_ref = db.collection(Collections.CROP_ANALYSES)
            crop_query = crop_analyses_ref.where('user_id', '==', user_id)
            crop_docs = crop_query.get()
            
            # Get soil analyses for user
            soil_analyses_ref = db.collection(Collections.SOIL_ANALYSES)
            soil_query = soil_analyses_ref.where('user_id', '==', user_id)
            soil_docs = soil_query.get()
            
            # Get alerts for user
            alerts_ref = db.collection(Collections.ALERTS)
            alerts_query = alerts_ref.where('user_id', '==', user_id)
            alerts_docs = alerts_query.get()
            
            analytics = {
                'crop_analyses_count': len(crop_docs),
                'soil_analyses_count': len(soil_docs),
                'alerts_count': len(alerts_docs),
                'total_analyses': len(crop_docs) + len(soil_docs)
            }
            
            return analytics
            
        except Exception as e:
            logger.error(f"Failed to get analytics data: {e}")
            raise e

# Compatibility aliases for existing code
connect_to_mongo = connect_to_firestore
close_mongo_connection = close_firestore_connection
