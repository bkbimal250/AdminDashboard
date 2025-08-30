#!/usr/bin/env python3
"""
Test script to check the login API
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_login():
    """Test the login API"""
    
    print("🔐 Testing Login API")
    print("=" * 30)
    
    # Test 1: Try with admin/admin123
    print("\n1. Testing with admin/admin123...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            token = data.get('token', 'N/A')
            print(f"Token: {token}")
            print(f"Token length: {len(token)}")
            print(f"Token contains dots: {'.' in token}")
            print(f"User ID: {data.get('user_id', 'N/A')}")
            print(f"Username: {data.get('username', 'N/A')}")
            print(f"Email: {data.get('email', 'N/A')}")
            print(f"Role: {data.get('role', 'N/A')}")
            
            # Test if it's a JWT token
            if '.' in token and len(token) > 100:
                print("🔍 This appears to be a JWT token")
                # Try to decode the JWT (without verification)
                import base64
                try:
                    parts = token.split('.')
                    if len(parts) == 3:
                        header = base64.b64decode(parts[0] + '==').decode('utf-8')
                        payload = base64.b64decode(parts[1] + '==').decode('utf-8')
                        print(f"JWT Header: {header}")
                        print(f"JWT Payload: {payload}")
                except:
                    print("Could not decode JWT parts")
            else:
                print("🔍 This appears to be a simple token")
        else:
            print("❌ Login failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the server is running.")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Try with test credentials
    print("\n2. Testing with test/test...")
    login_data = {
        "username": "test",
        "password": "test"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
