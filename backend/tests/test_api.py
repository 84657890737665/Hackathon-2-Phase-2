import requests
import json

BASE_URL = "http://localhost:8000"

def test_api_endpoints():
    print("Testing API endpoints...")
    
    # Test root endpoint
    print("\n1. Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test health endpoint
    print("\n2. Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test signup endpoint
    print("\n3. Testing signup endpoint...")
    signup_data = {
        "email": "test@example.com",
        "password": "TestPass123!"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
    
    # Test signin endpoint
    print("\n4. Testing signin endpoint...")
    signin_data = {
        "email": "test@example.com",
        "password": "TestPass123!"
    }
    response = requests.post(f"{BASE_URL}/auth/signin", json=signin_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        auth_response = response.json()
        print(f"Response: {auth_response}")
        token = auth_response.get("token")
    else:
        print(f"Error: {response.text}")
        token = None
    
    if token:
        # Test creating a task
        print("\n5. Testing create task endpoint...")
        headers = {"Authorization": f"Bearer {token}"}
        task_data = {
            "title": "Test Task",
            "description": "This is a test task"
        }
        response = requests.post(f"{BASE_URL}/api/1/tasks/", json=task_data, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            task_response = response.json()
            print(f"Response: {task_response}")
            task_id = task_response.get("id")
        else:
            print(f"Error: {response.text}")
            task_id = None
        
        if task_id:
            # Test getting a specific task
            print("\n6. Testing get specific task endpoint...")
            response = requests.get(f"{BASE_URL}/api/1/tasks/{task_id}", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
            else:
                print(f"Error: {response.text}")
            
            # Test updating a task
            print("\n7. Testing update task endpoint...")
            update_data = {
                "title": "Updated Test Task",
                "description": "This is an updated test task"
            }
            response = requests.put(f"{BASE_URL}/api/1/tasks/{task_id}", json=update_data, headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
            else:
                print(f"Error: {response.text}")
            
            # Test toggling task completion
            print("\n8. Testing toggle task completion endpoint...")
            patch_data = {"completed": True}
            response = requests.patch(f"{BASE_URL}/api/1/tasks/{task_id}/complete", json=patch_data, headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
            else:
                print(f"Error: {response.text}")
            
            # Test getting all tasks
            print("\n9. Testing get all tasks endpoint...")
            response = requests.get(f"{BASE_URL}/api/1/tasks/", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {len(response.json())} tasks retrieved")
            else:
                print(f"Error: {response.text}")
            
            # Test deleting a task
            print("\n10. Testing delete task endpoint...")
            response = requests.delete(f"{BASE_URL}/api/1/tasks/{task_id}", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
            else:
                print(f"Error: {response.text}")
    
    print("\nAPI endpoint testing completed.")

if __name__ == "__main__":
    test_api_endpoints()