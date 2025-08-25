#!/usr/bin/env python3
"""
Simple test script to verify the Django backend is working
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_api_root():
    """Test the API root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ API Root: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Message: {data.get('message')}")
            print(f"   Version: {data.get('version')}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ API Root: Connection failed - is the backend running?")
        return False
    except Exception as e:
        print(f"❌ API Root: Error - {e}")
        return False

def test_register():
    """Test user registration"""
    try:
        data = {
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = requests.post(f"{BASE_URL}/api/accounts/register/", json=data)
        print(f"✅ Register: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"   User ID: {data.get('user', {}).get('id')}")
            print(f"   Email: {data.get('user', {}).get('email')}")
            return data.get('access'), data.get('refresh')
        else:
            print(f"   Error: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Register: Error - {e}")
        return None, None

def test_login():
    """Test user login"""
    try:
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{BASE_URL}/api/accounts/login/", json=data)
        print(f"✅ Login: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   User ID: {data.get('user', {}).get('id')}")
            print(f"   Email: {data.get('user', {}).get('email')}")
            return data.get('access'), data.get('refresh')
        else:
            print(f"   Error: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Login: Error - {e}")
        return None, None

def test_profile(access_token):
    """Test getting user profile"""
    if not access_token:
        print("❌ Profile: No access token")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{BASE_URL}/api/accounts/me/", headers=headers)
        print(f"✅ Profile: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   User ID: {data.get('id')}")
            print(f"   Email: {data.get('email')}")
            print(f"   Name: {data.get('first_name')} {data.get('last_name')}")
            return True
        else:
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Profile: Error - {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing NextStep Backend API")
    print("=" * 40)
    
    # Test API root
    if not test_api_root():
        print("\n❌ Backend is not accessible. Please start the Django server first:")
        print("   cd backend && python manage.py runserver")
        return
    
    print()
    
    # Test registration
    access_token, refresh_token = test_register()
    print()
    
    # Test login
    if not access_token:
        access_token, refresh_token = test_login()
    print()
    
    # Test profile
    if access_token:
        test_profile(access_token)
    
    print("\n" + "=" * 40)
    print("🎉 Backend tests completed!")
    
    if access_token:
        print("✅ Backend is working correctly")
    else:
        print("❌ Some tests failed")

if __name__ == "__main__":
    main() 