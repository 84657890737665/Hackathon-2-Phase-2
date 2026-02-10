# API Contracts: Premium Enterprise UI with Reward System

**Feature**: 3-premium-ui-rewards
**Date**: 2026-02-09

## Overview

This document defines the API contracts for the premium UI with reward system. It extends the existing API contracts with new endpoints and modifies existing ones to support the reward system functionality.

## Extended Endpoints

### 1. Task Completion with Rewards
**Endpoint**: `PATCH /api/{user_id}/tasks/{id}/complete`

**Description**: Toggle task completion status and trigger reward system

**Request**:
- Method: `PATCH`
- Path: `/api/{user_id}/tasks/{id}/complete`
- Headers:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- Parameters:
  - `user_id` (path): User ID from JWT token (validation required)
  - `id` (path): Task ID to toggle completion

**Response**:
- Success (200 OK):
```json
{
  "id": 123,
  "user_id": "user-uuid",
  "title": "Sample task",
  "description": "Sample description",
  "completed": true,
  "completed_at": "2023-10-15T10:30:00Z",
  "created_at": "2023-10-14T09:15:00Z",
  "updated_at": "2023-10-15T10:30:00Z",
  "rewards_earned": {
    "points": 10,
    "streak_updated": true,
    "achievements_unlocked": [
      {
        "id": 1,
        "name": "First Task",
        "description": "Complete your first task",
        "icon": "🎯",
        "points_reward": 50
      }
    ]
  }
}
```

- Unauthorized (401):
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

- Forbidden (403):
```json
{
  "error": "Forbidden",
  "message": "User does not have access to this task"
}
```

- Not Found (404):
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

## New Endpoints

### 1. User Reward Profile
**Endpoint**: `GET /api/{user_id}/rewards/profile`

**Description**: Get user's reward profile with points, streak, and achievements

**Request**:
- Method: `GET`
- Path: `/api/{user_id}/rewards/profile`
- Headers:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- Parameters:
  - `user_id` (path): User ID from JWT token (validation required)

**Response**:
- Success (200 OK):
```json
{
  "user_id": "user-uuid",
  "points_balance": 150,
  "lifetime_points": 250,
  "streak_count": 5,
  "longest_streak": 7,
  "last_activity_date": "2023-10-15",
  "total_tasks_completed": 15,
  "created_at": "2023-10-01T08:00:00Z",
  "updated_at": "2023-10-15T10:30:00Z"
}
```

- Unauthorized (401):
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

- Forbidden (403):
```json
{
  "error": "Forbidden",
  "message": "User does not have access to this profile"
}
```

### 2. User Achievements
**Endpoint**: `GET /api/{user_id}/achievements`

**Description**: Get user's unlocked achievements

**Request**:
- Method: `GET`
- Path: `/api/{user_id}/achievements`
- Headers:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- Parameters:
  - `user_id` (path): User ID from JWT token (validation required)

**Response**:
- Success (200 OK):
```json
{
  "user_id": "user-uuid",
  "unlocked_achievements": [
    {
      "id": 1,
      "name": "First Task",
      "description": "Complete your first task",
      "icon": "🎯",
      "requirement_type": "task_count",
      "requirement_value": 1,
      "points_reward": 50,
      "unlocked_at": "2023-10-01T09:15:00Z"
    },
    {
      "id": 2,
      "name": "Week Warrior",
      "description": "Complete tasks for 7 consecutive days",
      "icon": "🔥",
      "requirement_type": "streak",
      "requirement_value": 7,
      "points_reward": 100,
      "unlocked_at": "2023-10-08T10:30:00Z"
    }
  ]
}
```

- Unauthorized (401):
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

- Forbidden (403):
```json
{
  "error": "Forbidden",
  "message": "User does not have access to these achievements"
}
```

### 3. Available Achievements
**Endpoint**: `GET /api/{user_id}/achievements/available`

**Description**: Get achievements user can unlock with progress

**Request**:
- Method: `GET`
- Path: `/api/{user_id}/achievements/available`
- Headers:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- Parameters:
  - `user_id` (path): User ID from JWT token (validation required)

**Response**:
- Success (200 OK):
```json
{
  "user_id": "user-123",
  "available_achievements": [
    {
      "id": 3,
      "name": "Productivity Master",
      "description": "Complete 50 tasks",
      "icon": "👑",
      "requirement_type": "task_count",
      "requirement_value": 50,
      "points_reward": 200,
      "current_progress": 15,
      "percentage_complete": 30,
      "unlocked": false
    },
    {
      "id": 4,
      "name": "Habit Builder",
      "description": "Maintain 30-day streak",
      "icon": "💯",
      "requirement_type": "streak",
      "requirement_value": 30,
      "points_reward": 300,
      "current_progress": 5,
      "percentage_complete": 16.67,
      "unlocked": false
    }
  ]
}
```

- Unauthorized (401):
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

- Forbidden (403):
```json
{
  "error": "Forbidden",
  "message": "User does not have access to this data"
}
```

### 4. Task Completion History
**Endpoint**: `GET /api/{user_id}/completions/history`

**Description**: Get user's task completion history with rewards earned

**Request**:
- Method: `GET`
- Path: `/api/{user_id}/completions/history`
- Headers:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- Parameters:
  - `user_id` (path): User ID from JWT token (validation required)
  - `limit` (query, optional): Number of records to return (default: 20, max: 100)
  - `offset` (query, optional): Number of records to skip (default: 0)

**Response**:
- Success (200 OK):
```json
{
  "user_id": "user-uuid",
  "completions": [
    {
      "id": 123,
      "task_id": 456,
      "task_title": "Complete project proposal",
      "points_awarded": 10,
      "streak_incremented": true,
      "achievement_unlocked_ids": [1],
      "completed_at": "2023-10-15T10:30:00Z",
      "created_at": "2023-10-15T10:30:00Z"
    },
    {
      "id": 122,
      "task_id": 455,
      "task_title": "Review documentation",
      "points_awarded": 10,
      "streak_incremented": false,
      "achievement_unlocked_ids": [],
      "completed_at": "2023-10-14T09:45:00Z",
      "created_at": "2023-10-14T09:45:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 15,
    "has_more": false
  }
}
```

- Unauthorized (401):
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

- Forbidden (403):
```json
{
  "error": "Forbidden",
  "message": "User does not have access to this history"
}
```

## Modified Existing Endpoints

### 1. Get All Tasks (Extended Response)
**Endpoint**: `GET /api/{user_id}/tasks/`

**Description**: Get all tasks for the user with additional reward information

**Request**:
- Method: `GET`
- Path: `/api/{user_id}/tasks/`
- Headers:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: application/json`
- Parameters:
  - `user_id` (path): User ID from JWT token (validation required)
  - `completed` (query, optional): Filter by completion status (true/false)
  - `limit` (query, optional): Number of records to return (default: 20, max: 100)
  - `offset` (query, optional): Number of records to skip (default: 0)

**Response**:
- Success (200 OK):
```json
{
  "user_id": "user-uuid",
  "tasks": [
    {
      "id": 123,
      "title": "Complete project proposal",
      "description": "Finish the Q3 project proposal document",
      "completed": true,
      "completed_at": "2023-10-15T10:30:00Z",
      "created_at": "2023-10-14T09:15:00Z",
      "updated_at": "2023-10-15T10:30:00Z"
    },
    {
      "id": 124,
      "title": "Team meeting",
      "description": "Attend weekly team sync",
      "completed": false,
      "created_at": "2023-10-15T08:00:00Z",
      "updated_at": "2023-10-15T08:00:00Z"
    }
  ],
  "stats": {
    "total": 25,
    "completed": 15,
    "pending": 10,
    "points_earned_today": 10,
    "current_streak": 5
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 25,
    "has_more": false
  }
}
```

## Error Response Format

All error responses follow this standard format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "ISO 8601 timestamp",
  "request_id": "Unique request identifier for debugging"
}
```

## Authentication Requirements

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The token must:
- Be properly formatted JWT
- Not be expired
- Contain the user ID that matches the `{user_id}` path parameter
- Have appropriate permissions for the requested resource

## Rate Limiting

All endpoints are subject to rate limiting:
- General requests: 100 requests per minute per IP
- Authentication requests: 10 requests per minute per IP
- Requests with exceeded limits return 429 status code

## Validation Rules

### Input Validation
- All string inputs are trimmed of leading/trailing whitespace
- String lengths are validated against defined maximums
- Numeric inputs are validated for appropriate ranges
- Date/time formats must conform to ISO 8601

### Business Logic Validation
- Users can only access their own data
- Task completion can only be performed on user's own tasks
- Achievement unlocking is validated server-side
- Streak calculations happen server-side to prevent tampering