# Todo API Contract

## Overview
This document specifies the API contracts for the Todo CRUD API & Data Persistence module in the Todo Full-Stack Web Application. It defines the endpoints, request/response formats, and authentication requirements.

## Base URL
```
https://api.yourdomain.com
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
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

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied: User ID mismatch or insufficient permissions"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Request validation failed",
  "details": [
    {
      "field": "title",
      "issue": "Title is required and must be between 1 and 255 characters"
    }
  ]
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Requested resource does not exist"
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
  "tasks": [
    {
      "id": 1,
      "user_id": 123,
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
- `500 Internal Server Error`: Database connection or other server error

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
- `500 Internal Server Error`: Database connection or other server error

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
- `500 Internal Server Error`: Database connection or other server error

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
- `500 Internal Server Error`: Database connection or other server error

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
- `500 Internal Server Error`: Database connection or other server error

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
- `500 Internal Server Error`: Database connection or other server error