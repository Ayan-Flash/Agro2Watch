#!/usr/bin/env python3
"""
Server runner with error handling
"""
import sys
import os
import asyncio
import uvicorn

# Load environment variables first
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("[INFO] Environment variables loaded from .env")
except ImportError:
    print("[WARNING] dotenv not available, environment variables not loaded")

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Starting AgroWatch API Server...")
    
    # Import and run the server
    from server import app
    
    print("[SUCCESS] Server app loaded successfully")
    
    # Run the server
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001,
        log_level="info",
        reload=False
    )
    
except Exception as e:
    print(f"[ERROR] Server startup failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
