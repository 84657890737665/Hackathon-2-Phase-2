# Data Model: Premium Enterprise UI with Reward System

**Feature**: 3-premium-ui-rewards
**Date**: 2026-02-09

## Overview

This document defines the data models required for implementing the premium UI with reward system. It extends the existing data models from the core todo application to include reward-related entities and attributes.

## Entity Relationships

```
User (1) ---- (Many) Task
User (1) ---- (Many) Achievement
User (1) ---- (1) RewardProfile
Task (1) ---- (1) TaskCompletion
```

## Entity Definitions

### 1. User
**Extension of existing User entity**

**Fields**:
- `id` (UUID/Integer): Unique identifier
- `email` (String): User's email address
- `password_hash` (String): Hashed password
- `created_at` (DateTime): Account creation timestamp
- `updated_at` (DateTime): Last update timestamp
- `streak_count` (Integer): Current consecutive days of activity
- `last_task_completion_date` (Date): Date of last task completion
- `total_points` (Integer): Total points accumulated
- `total_tasks_completed` (Integer): Total tasks completed

**Validation Rules**:
- Email must be unique and valid
- Password must meet security requirements
- Streak count cannot be negative
- Last task completion date must be in the past

### 2. Task
**Existing entity with minor extensions**

**Fields**:
- `id` (UUID/Integer): Unique identifier
- `user_id` (UUID/Integer): Foreign key to User
- `title` (String): Task title (max 255 chars)
- `description` (Text): Task description (optional)
- `completed` (Boolean): Completion status
- `completed_at` (DateTime): Completion timestamp (nullable)
- `created_at` (DateTime): Creation timestamp
- `updated_at` (DateTime): Last update timestamp

**Validation Rules**:
- Title is required and non-empty
- User ID must reference an existing user
- Completed_at only set when completed is true

### 3. RewardProfile (New Entity)
**Stores reward system state for each user**

**Fields**:
- `id` (UUID/Integer): Unique identifier
- `user_id` (UUID/Integer): Foreign key to User
- `points_balance` (Integer): Current points available
- `lifetime_points` (Integer): Total points earned
- `streak_count` (Integer): Current streak
- `longest_streak` (Integer): Best streak achieved
- `last_activity_date` (Date): Last activity date
- `created_at` (DateTime): Creation timestamp
- `updated_at` (DateTime): Last update timestamp

**Validation Rules**:
- User ID must reference an existing user
- Points balance cannot be negative
- Streak count cannot be negative
- Last activity date must be in the past

### 4. Achievement (New Entity)
**Represents milestone badges that users can unlock**

**Fields**:
- `id` (UUID/Integer): Unique identifier
- `name` (String): Achievement name (max 100 chars)
- `description` (String): Description of how to earn (max 255 chars)
- `icon` (String): Emoji or icon identifier
- `requirement_type` (String): Type of requirement ('task_count', 'streak', 'completion_rate', etc.)
- `requirement_value` (Integer): Value needed to unlock
- `points_reward` (Integer): Points awarded when unlocked
- `created_at` (DateTime): Creation timestamp

**Validation Rules**:
- Name and description are required
- Requirement type must be valid
- Requirement value must be positive
- Points reward cannot be negative

### 5. UserAchievement (New Entity)
**Junction table linking users to achievements they've unlocked**

**Fields**:
- `id` (UUID/Integer): Unique identifier
- `user_id` (UUID/Integer): Foreign key to User
- `achievement_id` (UUID/Integer): Foreign key to Achievement
- `unlocked_at` (DateTime): Timestamp when unlocked
- `created_at` (DateTime): Creation timestamp

**Validation Rules**:
- User ID must reference an existing user
- Achievement ID must reference an existing achievement
- Unlocked at timestamp cannot be in the future

### 6. TaskCompletion (New Entity)
**Tracks task completion events for reward calculation**

**Fields**:
- `id` (UUID/Integer): Unique identifier
- `task_id` (UUID/Integer): Foreign key to Task
- `user_id` (UUID/Integer): Foreign key to User
- `points_awarded` (Integer): Points given for this completion
- `streak_incremented` (Boolean): Whether streak was increased
- `achievement_unlocked_ids` (JSON/Array): IDs of achievements unlocked
- `completed_at` (DateTime): Completion timestamp
- `created_at` (DateTime): Creation timestamp

**Validation Rules**:
- Task ID must reference an existing task
- User ID must reference an existing user
- Points awarded cannot be negative
- Achievement IDs must reference existing achievements

## State Transitions

### Task State Transitions
```
INCOMPLETE (default) ←→ COMPLETED
```

**Transition Rules**:
- Task moves from INCOMPLETE to COMPLETED when user marks it complete
- When transitioning to COMPLETED:
  - Award 10 points to user
  - Check and update streak
  - Check for achievement unlocks
  - Record in TaskCompletion table

### Achievement State Transitions
```
LOCKED (default) → UNLOCKED
```

**Transition Rules**:
- Achievement moves from LOCKED to UNLOCKED when user meets requirement
- Only happens once per user per achievement
- Points are awarded when unlocked

### Streak State Transitions
```
BREAK (any gap > 1 day) → CONTINUE (consecutive days)
```

**Transition Rules**:
- Streak continues if user completes at least one task on consecutive days
- Streak resets to 1 if user misses a day
- Longest streak is preserved even when current streak breaks

## Indexes

### Required Indexes
1. `User.user_id` - Primary key
2. `User.email` - Unique index for login
3. `Task.user_id` - Index for filtering user's tasks
4. `Task.completed` - Index for filtering completed tasks
5. `RewardProfile.user_id` - Unique index (one profile per user)
6. `UserAchievement.user_id` - Index for user's achievements
7. `UserAchievement.achievement_id` - Index for achievement lookup
8. `TaskCompletion.user_id` - Index for user's completions
9. `TaskCompletion.completed_at` - Index for chronological ordering

## Relationships

### User ↔ Task
- One-to-many relationship
- User can have many tasks
- Tasks are deleted when user is deleted (cascade)

### User ↔ RewardProfile
- One-to-one relationship
- Each user has exactly one reward profile
- Profile is deleted when user is deleted (cascade)

### User ↔ Achievement ↔ UserAchievement
- Many-to-many relationship through UserAchievement junction table
- User can unlock many achievements
- Achievement can be unlocked by many users

### Task ↔ TaskCompletion
- One-to-one relationship (each completion event)
- Task can have one completion record per completion
- Multiple completion records possible if task is marked complete/incomplete multiple times

## API Considerations

### New Endpoints Required
1. `GET /api/{user_id}/rewards/profile` - Get user's reward profile
2. `GET /api/{user_id}/achievements` - Get user's unlocked achievements
3. `GET /api/{user_id}/achievements/available` - Get achievements user can unlock
4. `GET /api/{user_id}/completions/history` - Get task completion history

### Extended Endpoints
1. `POST /api/{user_id}/tasks/{id}/complete` - Now triggers reward system
2. `GET /api/{user_id}/tasks/` - Include completion statistics

## Validation Rules Summary

### Business Logic Validations
1. Users can only access their own data
2. Points can only be awarded through legitimate task completion
3. Streaks only advance with consecutive daily activity
4. Achievements can only be unlocked once per user
5. Reward profiles are automatically created when users register

### Data Integrity Validations
1. Foreign key constraints enforced at database level
2. Required fields are validated at application level
3. Data types are validated at both application and database levels
4. Unique constraints enforced where appropriate

## Performance Considerations

### Query Patterns
1. Frequent reads of user's tasks and reward profile
2. Occasional writes when tasks are completed
3. Periodic reads of achievements for display
4. Historical queries for analytics

### Optimization Strategies
1. Cache user's reward profile in memory/session
2. Index frequently queried fields
3. Batch update operations where possible
4. Denormalize frequently accessed computed values

## Security Considerations

### Access Control
1. Users can only access their own reward data
2. Admins may access aggregate statistics only
3. No direct manipulation of points/achievements allowed

### Data Protection
1. Reward data is tied to user authentication
2. Points balances are validated server-side
3. Achievement unlocking is based on server-side checks