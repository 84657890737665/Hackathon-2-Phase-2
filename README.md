# Todo Full-Stack Web Application

A premium, deployment-ready multi-user todo manager with persistent PostgreSQL storage, built with Next.js 16, FastAPI, and Neon Serverless PostgreSQL.

## ✨ Features

- 🔐 **Secure Authentication** - User signup/signin with custom JWT implementation
- ✅ **Full CRUD Operations** - Create, read, update, delete, and toggle completion of tasks
- 🔒 **Multi-User Isolation** - Each user only sees their own tasks with secure API validation
- 📱 **Responsive Design** - Beautiful, premium UI that works on mobile, tablet, and desktop
- 🎨 **Premium Visual Design** - Sophisticated gradient backgrounds, not plain white pages, with depth through shadows and subtle animations
- 🎉 **Reward System** - Persistent server-side points and streaks with celebratory UI
- 🔥 **Streak Tracking** - Daily streak counter with fire emoji in header
- 🏆 **Achievement Badges** - Unlock badges at milestones (1, 10, 50, 100 tasks)
- ⭐ **Points System** - Visible point counter in header (10 points per task)
- 🚀 **Production Ready** - Docker configuration and deployment guides included
- 🗄️ **PostgreSQL Database** - Persistent storage with Neon Serverless PostgreSQL
- ⚡ **Fast & Optimized** - Next.js 16 with standalone mode and optimized Docker images

## 🚀 Quick Start with Docker
... (same as before) ...

## 🛠️ Tech Stack

- **Frontend**: Next.js 16+ (App Router), React 19, TypeScript, TailwindCSS 3.4
- **UI Components**: Custom components with Radix UI primitives
- **Backend**: Python 3.11, FastAPI, Uvicorn, SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Custom JWT (PyJWT) with secure password hashing (Passlib)
- **Deployment**: Docker & Docker Compose



### Prerequisites

- Node.js 18+ 
- Python 3.9+
- npm or yarn
- PostgreSQL (or Neon Serverless PostgreSQL account)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the environment example file and configure your settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to add your database connection string and auth secret.

5. Start the backend server:
   ```bash
   python -m uvicorn src.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file and configure your settings:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` to match your backend configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

The backend provides the following API endpoints:

- `POST /auth/signup` - Create a new user account
- `POST /auth/signin` - Authenticate user and return JWT token
- `POST /auth/signout` - Invalidate the current session
- `GET /api/{user_id}/tasks/` - Retrieve all tasks for the specified user
- `POST /api/{user_id}/tasks/` - Create a new task for the specified user
- `GET /api/{user_id}/tasks/{task_id}` - Retrieve details of a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a specific task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion status of a task
- `GET /api/{user_id}/gamification/stats` - Retrieve user points, streak, and achievements

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string (defaults to Neon Serverless)
- `BETTER_AUTH_SECRET` - Secret key for JWT signing

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - URL of the backend API
- `NEXT_PUBLIC_BASE_URL` - Base URL of the frontend application
- `BETTER_AUTH_SECRET` - Should match the backend secret

## Database Setup

This application uses Neon Serverless PostgreSQL. To set up your Neon database:

1. Create an account at https://neon.tech
2. Create a new project
3. Get the connection string from the Neon dashboard
4. Update the `DATABASE_URL` in your backend `.env` file

For development, the application defaults to SQLite, but for production, it's recommended to use PostgreSQL.

## Authentication Flow

1. User registers via `/auth/signup` endpoint
2. User authenticates via `/auth/signin` endpoint, receiving a JWT token
3. JWT token is included in the Authorization header for all protected API requests
4. Backend validates the token and ensures user can only access their own data
5. Token expires after 7 days

## Security Features

- JWT-based authentication with proper token validation
- User isolation - users can only access their own tasks
- Passwords are securely hashed using bcrypt
- Input validation on all endpoints
- HTTPS enforcement in production

## Running Tests

To run backend tests:
```bash
cd backend
pytest
```


## 🚢 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment

The application is ready to deploy to:
- **Vercel** (Frontend) + **Railway/Render** (Backend)
- **AWS** (ECS Fargate, App Runner)
- **GCP** (Cloud Run)
- **DigitalOcean** (App Platform)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Comprehensive deployment instructions
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when backend is running)
- [Neon Setup Guide](NEON_SETUP.md) - Database configuration

## 🎯 Project Structure

```
Phase-2/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── api/            # API routes and dependencies
│   │   ├── db/             # Database configuration
│   │   ├── models/         # SQLModel data models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities (JWT, etc.)
│   ├── Dockerfile          # Backend container
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js 16 App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and helpers
│   │   └── types/         # TypeScript types
│   └── Dockerfile         # Frontend container
├── docker-compose.yml     # Docker orchestration
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### API Testing

A test script is provided to verify all API endpoints:

```bash
python test_api.py
```

## 🔒 Security Features

- ✅ JWT-based authentication with proper token validation
- ✅ User isolation -users can only access their own tasks
- ✅ Passwords securely hashed using bcrypt
- ✅ Input validation on all endpoints
- ✅ HTTPS enforcement in production
- ✅ Protected routes with authentication middleware

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for a professional, production-ready application.

---

For production deployment:

1. Configure environment variables properly
2. Use a production-ready PostgreSQL database (Neon Serverless recommended)
3. Set up proper domain names and SSL certificates
4. Review [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

**Ready to deploy!** 🚀