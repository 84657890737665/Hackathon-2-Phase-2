# Quickstart Guide: Todo CRUD API & Data Persistence

## Overview
This guide provides instructions for setting up and running the Todo CRUD API & Data Persistence module for the Todo Full-Stack Web Application. It covers the installation, configuration, and initial run of the backend service that manages task data with proper user isolation.

## Prerequisites
- Python 3.11+ (for FastAPI backend)
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
- Node.js 18+ (for frontend, if developing full stack)
- Git

## Setting Up the Backend (FastAPI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
cd backend
```

### 2. Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the backend root directory:
```bash
cp .env.example .env
```

Edit the `.env` file and set:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Shared secret for JWT tokens (must match frontend)

### 5. Initialize the Database
```bash
python -c "from src.db.init_db import create_db_and_tables; create_db_and_tables()"
```

### 6. Run the Backend Server
```bash
uvicorn src.main:app --reload
```

The backend will be available at `http://localhost:8000`.

## Setting Up the Frontend (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd frontend  # From repository root
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the frontend root directory:
```bash
cp .env.example .env.local
```

Edit the `.env.local` file and set:
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Your Better Auth URL (e.g., http://localhost:8000)
- `BETTER_AUTH_SECRET`: Shared secret for JWT tokens (must match backend)

### 4. Run the Frontend Development Server
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

## Running Both Services Together

For development, you'll need both services running simultaneously:

### Terminal 1 (Backend):
```bash
cd backend
# Activate virtual environment
uvicorn src.main:app --reload
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Testing the Task Management API

### 1. User Authentication
1. Navigate to `http://localhost:3000/signup` to create an account
2. Sign in at `http://localhost:3000/signin` to obtain a JWT token
3. The token will be automatically included in API requests

### 2. Creating Tasks
1. Once authenticated, navigate to the tasks page
2. Use the task creation form to add new tasks
3. Verify that tasks appear in your task list

### 3. Managing Tasks
1. View your task list at `/api/{your_user_id}/tasks`
2. Update task details using the edit functionality
3. Toggle completion status with the completion toggle
4. Delete tasks you no longer need

### 4. Verifying User Isolation
1. Create two different user accounts
2. Log in as User A and create some tasks
3. Log in as User B and verify you cannot see User A's tasks
4. Confirm that each user only sees their own tasks

## API Endpoints

### Task Management Endpoints
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` in the backend `.env` file
   - Ensure your Neon PostgreSQL database is accessible

2. **JWT Secret Mismatch**
   - Confirm that `BETTER_AUTH_SECRET` is identical in both frontend and backend `.env` files

3. **CORS Errors**
   - Check that your frontend URL is included in the backend's CORS settings

4. **API 401/403 Errors**
   - Verify that JWT tokens are being properly included in requests
   - Check that tokens haven't expired (7-day expiry)

5. **User Isolation Not Working**
   - Verify that the middleware correctly validates token user_id matches URL user_id
   - Check that all database queries filter by authenticated user_id

### Verification Steps

1. Confirm backend is running at `http://localhost:8000`
2. Confirm frontend is running at `http://localhost:3000`
3. Check that both `.env` files have the same `BETTER_AUTH_SECRET`
4. Verify database connection with the provided `DATABASE_URL`
5. Test user isolation by creating tasks with different accounts
6. Verify all 6 API endpoints return appropriate responses

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for the `BETTER_AUTH_SECRET`
- Ensure HTTPS is used in production
- Regularly rotate the JWT secret in production
- Monitor for suspicious authentication attempts
- Verify that users cannot access other users' tasks through URL manipulation