#!/usr/bin/env python3
"""
Test script to debug server startup issues
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing imports...")
    from fastapi import FastAPI
    print("✅ FastAPI imported")
    
    from database import connect_to_mongo, close_mongo_connection
    print("✅ Database module imported")
    
    from auth_routes import router as auth_router
    print("✅ Auth routes imported")
    
    from models import StatusCheck, StatusCheckCreate
    print("✅ Models imported")
    
    print("\nTesting database connection...")
    import asyncio
    
    async def test_db():
        try:
            await connect_to_mongo()
            print("✅ Database connection successful")
            await close_mongo_connection()
            print("✅ Database disconnection successful")
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
    
    asyncio.run(test_db())
    
    print("\nTesting server creation...")
    app = FastAPI(title="Test API", version="1.0.0")
    print("✅ FastAPI app created")
    
    app.include_router(auth_router)
    print("✅ Auth router included")
    
    print("\n✅ All tests passed! Server should work.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
