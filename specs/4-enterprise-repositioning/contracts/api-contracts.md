# API Contracts: Taskflow Enterprise Features

**Feature**: [Link to spec.md](../spec.md)
**Created**: 2026-02-14
**Status**: Draft

## Overview

This document defines the API contracts for the enterprise features while maintaining backward compatibility with existing endpoints. All existing endpoints (create task, update task, delete task, read/view task, task completion toggle) remain unchanged.

## Existing Endpoints (Preserved)

### Task Management Endpoints (Unchanged)
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks` - Get all user tasks
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion

## New Enterprise Endpoints

### Performance Metrics API

#### GET /api/{user_id}/analytics/performance
**Purpose**: Retrieve user's performance metrics
**Authentication**: JWT required
**Parameters**: 
- `period` (optional): "week", "month", "quarter", "year" (default: "month")
- `metric_types` (optional): Comma-separated list of metric types to return

**Response (200 OK)**:
```json
{
  "user_id": 123,
  "period": "month",
  "metrics": {
    "execution_velocity": {
      "value": 12.5,
      "unit": "tasks_per_week",
      "trend": "up",
      "benchmark_percentile": 78
    },
    "deadline_reliability": {
      "value": 92.3,
      "unit": "percent",
      "trend": "stable",
      "benchmark_percentile": 85
    },
    "focus_consistency": {
      "value": 4.2,
      "unit": "avg_completion_days",
      "trend": "down",
      "benchmark_percentile": 65
    },
    "collaboration_efficiency": {
      "value": 87.1,
      "unit": "percent_resolved_within_24h",
      "trend": "up",
      "benchmark_percentile": 72
    }
  },
  "calculated_at": "2026-02-14T10:30:00Z"
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden (trying to access another user's metrics)
- 404: User not found
- 500: Internal server error

---

#### GET /api/{organization_id}/analytics/performance
**Purpose**: Retrieve organization's aggregate performance metrics (Enterprise tier only)
**Authentication**: JWT required with admin privileges
**Parameters**:
- `period` (optional): "week", "month", "quarter", "year" (default: "month")
- `team_id` (optional): Filter by specific team
- `user_id` (optional): Filter by specific user

**Response (200 OK)**:
```json
{
  "organization_id": 456,
  "period": "month",
  "aggregate_metrics": {
    "team_execution_velocity": 15.2,
    "team_deadline_reliability": 89.7,
    "team_focus_consistency": 3.8,
    "team_collaboration_efficiency": 91.4
  },
  "by_team": [
    {
      "team_id": 1,
      "team_name": "Engineering",
      "metrics": {
        "execution_velocity": 18.3,
        "deadline_reliability": 94.1
      }
    }
  ],
  "calculated_at": "2026-02-14T10:30:00Z"
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden (insufficient privileges)
- 404: Organization not found
- 500: Internal server error

---

### AI Insights API

#### GET /api/{user_id}/ai/insights
**Purpose**: Retrieve AI-generated insights and recommendations for user
**Authentication**: JWT required
**Parameters**:
- `category` (optional): "prioritization", "bottlenecks", "optimization", "risks" (default: all)
- `limit` (optional): Number of insights to return (default: 10, max: 50)

**Response (200 OK)**:
```json
{
  "user_id": 123,
  "generated_at": "2026-02-14T10:30:00Z",
  "insights": [
    {
      "id": "insight_123",
      "type": "bottleneck_prediction",
      "priority": "high",  // high, medium, low
      "title": "Potential bottleneck detected",
      "description": "Task 'API Integration' is predicted to impact your project timeline",
      "recommendation": "Consider assigning additional resources to this task",
      "affected_tasks": [456],
      "predicted_impact": "2-day delay",
      "confidence_score": 0.85,
      "action_required": true,
      "resolved": false
    }
  ]
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden (trying to access another user's insights)
- 404: User not found
- 500: Internal server error

---

#### POST /api/{user_id}/ai/predict-priorities
**Purpose**: Get AI-generated task prioritization based on deadline proximity, resource availability, and historical patterns
**Authentication**: JWT required
**Request Body**:
```json
{
  "task_ids": [123, 456, 789],
  "consider_dependencies": true,
  "consider_resource_availability": true
}
```

**Response (200 OK)**:
```json
{
  "user_id": 123,
  "predicted_priorities": [
    {
      "task_id": 456,
      "task_title": "API Integration",
      "predicted_priority_score": 0.92,
      "reasoning": "High impact on project timeline, approaching deadline",
      "suggested_position": 1
    }
  ],
  "generated_at": "2026-02-14T10:30:00Z"
}
```

**Errors**:
- 400: Invalid request body
- 401: Unauthorized
- 403: Forbidden
- 404: User or tasks not found
- 500: Internal server error

---

### Enterprise Management API

#### GET /api/organizations/{org_id}/members
**Purpose**: Get list of organization members with roles and permissions
**Authentication**: JWT required with admin privileges
**Parameters**:
- `role` (optional): Filter by role ("admin", "editor", "viewer")
- `status` (optional): Filter by status ("active", "inactive")

**Response (200 OK)**:
```json
{
  "organization_id": 456,
  "members": [
    {
      "user_id": 123,
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "department": "Engineering",
      "permissions": ["read", "write", "admin"],
      "joined_at": "2026-01-15T09:00:00Z",
      "last_active_at": "2026-02-14T10:25:00Z",
      "status": "active"
    }
  ]
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden (insufficient privileges)
- 404: Organization not found
- 500: Internal server error

---

#### POST /api/organizations/{org_id}/invite
**Purpose**: Invite a new member to the organization
**Authentication**: JWT required with admin privileges
**Request Body**:
```json
{
  "email": "newmember@company.com",
  "role": "editor",
  "send_welcome_email": true
}
```

**Response (200 OK)**:
```json
{
  "invitation": {
    "id": "inv_123",
    "email": "newmember@company.com",
    "role": "editor",
    "invited_by_user_id": 123,
    "organization_id": 456,
    "status": "pending",
    "expires_at": "2026-03-14T10:30:00Z",
    "created_at": "2026-02-14T10:30:00Z"
  }
}
```

**Errors**:
- 400: Invalid request body
- 401: Unauthorized
- 403: Forbidden (insufficient privileges)
- 409: User already exists in organization
- 500: Internal server error

---

### Audit Trail API

#### GET /api/organizations/{org_id}/audit-log
**Purpose**: Retrieve audit trail for organization (Enterprise tier only)
**Authentication**: JWT required with admin privileges
**Parameters**:
- `user_id` (optional): Filter by specific user
- `action_type` (optional): Filter by action type ("task_created", "task_updated", etc.)
- `entity_type` (optional): Filter by entity type ("task", "user", "project", etc.)
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string
- `limit` (optional): Number of records to return (default: 50, max: 1000)
- `offset` (optional): Offset for pagination (default: 0)

**Response (200 OK)**:
```json
{
  "organization_id": 456,
  "total_records": 1250,
  "records": [
    {
      "id": "audit_123",
      "user_id": 123,
      "user_email": "john@example.com",
      "action_type": "task_updated",
      "entity_type": "task",
      "entity_id": 456,
      "old_values": {
        "title": "Old task title",
        "completed": false
      },
      "new_values": {
        "title": "New task title",
        "completed": true
      },
      "timestamp": "2026-02-14T10:25:30Z",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "metadata": {
        "source": "web_app",
        "device_type": "desktop"
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden (insufficient privileges)
- 404: Organization not found
- 500: Internal server error

---

### Pricing & Subscription API

#### GET /api/pricing/tiers
**Purpose**: Get available pricing tiers and their features
**Authentication**: Not required (public endpoint)
**Response (200 OK)**:
```json
{
  "tiers": [
    {
      "id": 1,
      "name": "free",
      "display_name": "Free",
      "description": "Perfect for individuals getting started",
      "monthly_price_cents": 0,
      "max_users": 1,
      "max_storage_gb": 1,
      "features": [
        "Up to 10 tasks per day",
        "Basic task management",
        "Email support"
      ],
      "is_popular": false
    },
    {
      "id": 2,
      "name": "pro",
      "display_name": "Pro",
      "description": "For professionals who need more power",
      "monthly_price_cents": 1200,
      "max_users": 1,
      "max_storage_gb": 10,
      "features": [
        "Unlimited tasks",
        "Performance metrics",
        "Priority email support",
        "Basic AI insights"
      ],
      "is_popular": false
    },
    {
      "id": 3,
      "name": "team",
      "display_name": "Team",
      "description": "For small teams collaborating on projects",
      "monthly_price_cents": 800, // per user
      "max_users": 10,
      "max_storage_gb": 50,
      "features": [
        "Everything in Pro",
        "Up to 10 users",
        "Team collaboration",
        "Advanced AI insights",
        "Chat support"
      ],
      "is_popular": true
    },
    {
      "id": 4,
      "name": "enterprise",
      "display_name": "Enterprise",
      "description": "For large organizations with security needs",
      "monthly_price_cents": 1500, // per user
      "max_users": null, // unlimited
      "max_storage_gb": null, // unlimited
      "features": [
        "Everything in Team",
        "Unlimited users",
        "SSO integration",
        "Advanced security",
        "Dedicated support",
        "Custom integrations",
        "Compliance reporting",
        "SLA guarantee"
      ],
      "is_popular": false
    }
  ]
}
```

#### GET /api/{user_id}/subscription
**Purpose**: Get user's current subscription details
**Authentication**: JWT required
**Response (200 OK)**:
```json
{
  "user_id": 123,
  "subscription": {
    "id": "sub_123",
    "tier_id": 3,
    "tier_name": "team",
    "status": "active",
    "current_period_start": "2026-02-01T00:00:00Z",
    "current_period_end": "2026-03-01T00:00:00Z",
    "trial_end": null,
    "cancel_at_period_end": false,
    "created_at": "2026-01-15T09:00:00Z",
    "updated_at": "2026-02-14T10:30:00Z"
  }
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden (trying to access another user's subscription)
- 404: User not found or no subscription
- 500: Internal server error

---

## Authentication & Authorization Contracts

### JWT Token Structure (Enhanced)
All existing JWT tokens remain compatible, with additional enterprise fields for enterprise users:

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "user_id": 123,
  "organization_id": 456,  // Added for enterprise users
  "role": "admin",         // Added for enterprise users
  "permissions": ["read", "write", "admin"],  // Added for enterprise users
  "tier": "enterprise",    // Added for subscription awareness
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Authorization Headers
All endpoints continue to use the standard Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Error Response Format (Standardized)

All API endpoints return errors in the following standardized format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional: additional error details
    },
    "timestamp": "2026-02-14T10:30:00Z",
    "request_id": "req_1234567890"
  }
}
```

## Backward Compatibility Guarantees

1. **All existing endpoints remain unchanged**:
   - Same URL patterns
   - Same request/response structures
   - Same authentication requirements
   - Same error handling

2. **No breaking changes to existing functionality**:
   - Existing clients will continue to work without modifications
   - All existing task management operations remain identical
   - All existing authentication flows remain unchanged

3. **New enterprise features are opt-in**:
   - Enterprise endpoints require appropriate permissions
   - Existing users can continue using the system as before
   - New features only activate for users with appropriate tier/permissions

## Versioning Strategy

- **Current API Version**: v1 (implicit, no version prefix)
- **Future Breaking Changes**: Will introduce /v2/ prefix
- **Non-breaking Additions**: Added to existing version
- **Deprecation Policy**: 6 months notice before removing any functionality