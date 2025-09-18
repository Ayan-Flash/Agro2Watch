#!/usr/bin/env python3
"""
Test script to check server imports
"""
try:
    import server
    print("✅ Server imports OK")
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
