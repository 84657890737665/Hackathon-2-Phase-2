# Authentication API Contract

## Overview
This document specifies the API contracts for the authentication system in the Todo Full-Stack Web Application. It defines the endpoints, request/response formats, and authentication requirements.

## Base URL
```
https://api.yourdomain.com
```

## Authentication
All endpoints except `/auth/signup` and `/auth/signin` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Headers
- `Content-Type: application/json`
- `Accept: application/json`

## Common Error Responses
All endpoints may return these common error responses:

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Request validation failed",
  "details": [
    {
      "field": "email",
      "issue": "Invalid email format"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Endpoints

### POST /auth/signup
Create a new user account.

#### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Request Validation
- `email`: Required, valid email format, 5-255 characters
- `password`: Required, minimum 8 characters with mixed case, numbers, and special characters

#### Successful Response (201 Created)
```json
{
  "success": true,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "created_at": "2023-01-01T10:00:00Z"
  },
  "message": "Account created successfully"
}
```

#### Error Responses
- `400 Bad Request`: Validation failed
- `409 Conflict`: Email already exists

---

### POST /auth/signin
Authenticate user and return JWT token.

#### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Request Validation
- `email`: Required, valid email format
- `password`: Required

#### Successful Response (200 OK)
```json
{
  "success": true,
  "user": {
    "id": 123,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 604800
}
```

#### Error Responses
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid credentials

---

### POST /auth/signout
Invalidate the current session/token.

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

#### Error Responses
- `401 Unauthorized`: Invalid or expired token

---

### GET /api/{user_id}/tasks
Retrieve all tasks for the specified user.

#### Path Parameters
- `user_id`: Integer, required - The ID of the user whose tasks to retrieve

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Successful Response (200 OK)
```json
{
  "user_id": 123,
  "tasks": [
    {
      "id": 1,
      "title": "Sample Task",
      "description": "Task description",
      "completed": false,
      "created_at": "2023-01-01T10:00:00Z",
      "updated_at": "2023-01-01T10:00:00Z"
    }
  ]
}
```

#### Error Responses
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Token user_id does not match URL user_id
- `404 Not Found`: User does not exist

---

### POST /api/{user_id}/tasks
Create a new task for the specified user.

#### Path Parameters
- `user_id`: Integer, required - The ID of the user creating the task

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Request Body
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false
}
```

#### Request Validation
- `title`: Required, 1-255 characters
- `description`: Optional, up to 1000 characters
- `completed`: Optional, defaults to false

#### Successful Response (201 Created)
```json
{
  "id": 123,
  "user_id": 123,
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-01-01T10:00:00Z",
  "updated_at": "2023-01-01T10:00:00Z"
}
```

#### Error Responses
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Token user_id does not match URL user_id

---

### GET /api/{user_id}/tasks/{id}
Get details of a specific task.

#### Path Parameters
- `user_id`: Integer, required - The ID of the user whose task to retrieve
- `id`: Integer, required - The ID of the task to retrieve

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Successful Response (200 OK)
```json
{
  "id": 123,
  "user_id": 123,
  "title": "Sample Task",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-01-01T10:00:00Z",
  "updated_at": "2023-01-01T10:00:00Z"
}
```

#### Error Responses
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Token user_id does not match URL user_id
- `404 Not Found`: Task does not exist

---

### PUT /api/{user_id}/tasks/{id}
Update a specific task.

#### Path Parameters
- `user_id`: Integer, required - The ID of the user whose task to update
- `id`: Integer, required - The ID of the task to update

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Request Body
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```

#### Request Validation
- `title`: Required, 1-255 characters
- `description`: Optional, up to 1000 characters
- `completed`: Optional, boolean

#### Successful Response (200 OK)
```json
{
  "id": 123,
  "user_id": 123,
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "created_at": "2023-01-01T10:00:00Z",
  "updated_at": "2023-01-02T10:00:00Z"
}
```

#### Error Responses
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Token user_id does not match URL user_id
- `404 Not Found`: Task does not exist

---

### DELETE /api/{user_id}/tasks/{id}
Delete a specific task.

#### Path Parameters
- `user_id`: Integer, required - The ID of the user whose task to delete
- `id`: Integer, required - The ID of the task to delete

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Error Responses
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Token user_id does not match URL user_id
- `404 Not Found`: Task does not exist

---

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a specific task.

#### Path Parameters
- `user_id`: Integer, required - The ID of the user whose task to update
- `id`: Integer, required - The ID of the task to update

#### Headers
```
Authorization: Bearer <valid_jwt_token>
```

#### Request Body
```json
{
  "completed": true
}
```

#### Request Validation
- `completed`: Required, boolean

#### Successful Response (200 OK)
```json
{
  "id": 123,
  "user_id": 123,
  "title": "Sample Task",
  "description": "Task description",
  "completed": true,
  "created_at": "2023-01-01T10:00:00Z",
  "updated_at": "2023-01-02T10:00:00Z"
}
```

#### Error Responses
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Token user_id does not match URL user_id
- `404 Not Found`: Task does not exist