# Quickstart Guide: Authentication & User Management System

## Overview
This guide provides instructions for setting up and running the authentication system for the Todo Full-Stack Web Application. It covers the installation, configuration, and initial run of both the frontend and backend components.

## Prerequisites
- Node.js 18+ (for Next.js frontend)
- Python 3.11+ (for FastAPI backend)
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
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

## Testing the Authentication Flow

### 1. User Registration
1. Navigate to `http://localhost:3000/signup`
2. Enter a valid email and secure password
3. Submit the form to create an account

### 2. User Login
1. Navigate to `http://localhost:3000/signin`
2. Enter your registered email and password
3. Submit the form to authenticate
4. You should receive a JWT token and be redirected to the dashboard

### 3. Making Authenticated Requests
1. Once logged in, the JWT token will be automatically included in API requests
2. Try accessing your tasks at `/api/{your_user_id}/tasks`
3. Verify that you can only access your own data

## API Endpoints

### Authentication Endpoints
- `POST /auth/signup` - Create a new user account
- `POST /auth/signin` - Authenticate user and get JWT token
- `POST /auth/signout` - Invalidate current session

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

4. **API 401 Errors**
   - Verify that JWT tokens are being properly included in requests
   - Check that tokens haven't expired (7-day expiry)

### Verification Steps

1. Confirm backend is running at `http://localhost:8000`
2. Confirm frontend is running at `http://localhost:3000`
3. Check that both `.env` files have the same `BETTER_AUTH_SECRET`
4. Verify database connection with the provided `DATABASE_URL`
5. Test the signup and signin flow to ensure JWT tokens are issued and validated correctly

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for the `BETTER_AUTH_SECRET`
- Ensure HTTPS is used in production
- Regularly rotate the JWT secret in production
- Monitor for suspicious authentication attempts