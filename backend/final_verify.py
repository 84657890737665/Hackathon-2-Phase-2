import requests
import json
import random
import string

BASE_URL = "http://127.0.0.1:8000"

def get_random_string(length):
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

def run_final_test():
    email = f"user_{get_random_string(5)}@example.com"
    password = "Password123!"
    name = "Verified User"
    
    print(f"--- Testing with: {email} ---")
    
    # 1. Signup
    signup_payload = {"email": email, "password": password, "name": name}
    signup_res = requests.post(f"{BASE_URL}/auth/signup", json=signup_payload, allow_redirects=False)
    print(f"Signup: {signup_res.status_code} | Headers: {signup_res.headers.get('Location')}")
    if signup_res.status_code in [301, 302, 307, 308]:
        print(f"Redirected to: {signup_res.headers.get('Location')}")
        # Try follows with same method
        signup_res = requests.post(signup_res.headers.get('Location'), json=signup_payload)
        print(f"Followed Signup: {signup_res.status_code} | Response: {signup_res.json()}")
    else:
        print(f"Response: {signup_res.json()}")
    
    if signup_res.status_code != 201:
        print("Final Test FAILED at Signup step.")
        return

    # 2. Signin
    signin_payload = {"email": email, "password": password}
    signin_res = requests.post(f"{BASE_URL}/auth/signin", json=signin_payload)
    print(f"Signin: {signin_res.status_code} | Response: {signin_res.json()}")
    
    if signin_res.status_code == 200:
        data = signin_res.json()
        if data.get("success") and "token" in data and data["user"]["full_name"] == name:
            print("\n★★★ AUTH SYSTEM FULLY FUNCTIONAL ★★★")
        else:
            print("\n!!! AUTH SYSTEM PARTIALLY FUNCTIONAL (missing data) !!!")
    else:
        print("\n!!! AUTH SYSTEM STILL BROKEN !!!")

if __name__ == "__main__":
    run_final_test()
