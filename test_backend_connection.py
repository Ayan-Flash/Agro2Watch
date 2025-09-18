#!/usr/bin/env python3
"""
Test script to check backend connectivity
"""

import requests
import sys
import json
from datetime import datetime

def test_backend_health():
    """Test backend health endpoint"""
    try:
        print("Testing backend health endpoint...")
        response = requests.get("http://127.0.0.1:8001/health", timeout=5)
        
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend - is it running?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Backend request timed out")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_weather_api():
    """Test weather API endpoint"""
    try:
        print("\nTesting weather API endpoint...")
        # Test coordinates for New York City
        response = requests.get("http://127.0.0.1:8001/api/weather/current?lat=40.7128&lon=-74.0060", timeout=10)
        
        if response.status_code == 200:
            print("✅ Weather API is working!")
            data = response.json()
            print(f"Weather data: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Weather API returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend")
        return False
    except Exception as e:
        print(f"❌ Weather API error: {e}")
        return False

def test_model_status():
    """Test model status endpoint"""
    try:
        print("\nTesting model status endpoint...")
        response = requests.get("http://127.0.0.1:8001/api/models/status", timeout=5)
        
        if response.status_code == 200:
            print("✅ Model status endpoint is working!")
            data = response.json()
            print(f"Model status: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Model status returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Model status error: {e}")
        return False

def main():
    print("=" * 50)
    print("AgroWatch Backend Connection Test")
    print(f"Test started at: {datetime.now()}")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 3
    
    # Test health endpoint
    if test_backend_health():
        tests_passed += 1
    
    # Test weather API (might fail if no API key)
    if test_weather_api():
        tests_passed += 1
    
    # Test model status
    if test_model_status():
        tests_passed += 1
    
    print("\n" + "=" * 50)
    print(f"Tests completed: {tests_passed}/{total_tests} passed")
    
    if tests_passed == total_tests:
        print("✅ All tests passed! Backend is working correctly.")
        return 0
    else:
        print("❌ Some tests failed. Check the backend configuration.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Test script to verify backend API connectivity and authentication endpoints
"""
import requests
import json
import sys

# Backend API base URL
BASE_URL = "http://localhost:8001"

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   Status: {data.get('status')}")
            print(f"   Database: {data.get('database')}")
            print(f"   Services: {data.get('services')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_send_otp():
    """Test sending OTP to a phone number"""
    try:
        # Test phone number (you can change this)
        test_phone = "+919876543210"
        
        payload = {
            "phone": test_phone,
            "purpose": "login"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/send-otp",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Send OTP test passed")
            print(f"   Message: {data.get('message')}")
            print(f"   Phone: {data.get('phone')}")
            return True
        else:
            print(f"❌ Send OTP test failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Send OTP test failed: {e}")
        return False

def test_verify_otp():
    """Test OTP verification (this will fail with invalid OTP, but tests the endpoint)"""
    try:
        test_phone = "+919876543210"
        test_otp = "123456"  # This will be invalid
        
        payload = {
            "phone": test_phone,
            "otp_code": test_otp,
            "purpose": "login"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json=payload,
            timeout=10
        )
        
        # We expect this to fail with invalid OTP, but the endpoint should be accessible
        if response.status_code in [200, 400]:
            print("✅ Verify OTP endpoint accessible")
            print(f"   Status: {response.status_code}")
            return True
        else:
            print(f"❌ Verify OTP test failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Verify OTP test failed: {e}")
        return False

def test_root_endpoint():
    """Test the root API endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Root endpoint accessible")
            print(f"   Message: {data.get('message')}")
            print(f"   Version: {data.get('version')}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Root endpoint failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Backend API Connectivity")
    print("=" * 50)
    
    tests = [
        ("Root Endpoint", test_root_endpoint),
        ("Health Check", test_health_check),
        ("Send OTP", test_send_otp),
        ("Verify OTP", test_verify_otp),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"   ⚠️  {test_name} test failed")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is ready for frontend integration.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the backend server.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
