import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000/api"

def test_api_endpoints():
    """Test various API endpoints to check data structure"""
    
    print("🔍 Testing API Endpoints...")
    print("=" * 50)
    
    # Test endpoints that don't require authentication first
    public_endpoints = [
        "/token/",
        "/auth/login/",
    ]
    
    for endpoint in public_endpoints:
        print(f"\n📡 Testing: {endpoint}")
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
        except Exception as e:
            print(f"Error: {e}")
    
    # Test with authentication
    print("\n🔐 Testing with authentication...")
    
    # First, try to login to get a token
    login_data = {
        "username": "admin",  # Try common admin username
        "password": "admin123"  # Try common password
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"Login Status: {login_response.status_code}")
        print(f"Login Response: {login_response.text}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data.get('token')
            
            if token:
                headers = {
                    'Authorization': f'Token {token}',
                    'Content-Type': 'application/json'
                }
                
                # Test authenticated endpoints
                auth_endpoints = [
                    "/dashboard/stats/",
                    "/users/",
                    "/attendance/",
                    "/leaves/",
                    "/notifications/",
                    "/departments/",
                    "/documents/",
                    "/chat-rooms/",
                ]
                
                for endpoint in auth_endpoints:
                    print(f"\n🔍 Testing: {endpoint}")
                    try:
                        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                        print(f"Status: {response.status_code}")
                        
                        if response.status_code == 200:
                            data = response.json()
                            print(f"Data Type: {type(data)}")
                            if isinstance(data, list):
                                print(f"Array Length: {len(data)}")
                                if len(data) > 0:
                                    print(f"First Item Keys: {list(data[0].keys())}")
                            elif isinstance(data, dict):
                                print(f"Keys: {list(data.keys())}")
                            print(f"Response Preview: {json.dumps(data, indent=2)[:500]}...")
                        else:
                            print(f"Error Response: {response.text}")
                            
                    except Exception as e:
                        print(f"Error: {e}")
            else:
                print("❌ No token received from login")
        else:
            print("❌ Login failed")
            
    except Exception as e:
        print(f"❌ Login error: {e}")

if __name__ == "__main__":
    test_api_endpoints()
