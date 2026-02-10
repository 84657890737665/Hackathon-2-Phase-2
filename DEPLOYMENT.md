# Deployment Guide - Todo Full-Stack Web Application

## Overview

This guide provides comprehensive instructions for deploying the Todo application in various environments, from local development to cloud production deployments.

## Table of Contents

1. [Quick Start with Docker](#quick-start-with-docker)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Production Deployment](#production-deployment)
5. [Database Setup (Neon PostgreSQL)](#database-setup)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start with Docker

The fastest way to get the application running is with Docker Compose.

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Phase-2
   ```

2. **Configure environment variables**
   ```bash
   # Copy example files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

3. **Edit environment files** (see [Environment Configuration](#environment-configuration))

4. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

6. **Stop the application**
   ```bash
   docker-compose down
   ```

---

## Local Development Setup

For development without Docker:

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the backend server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000

---

## Environment Configuration

### Backend Environment Variables (`backend/.env`)

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Authentication Secret (MUST match frontend)
BETTER_AUTH_SECRET="your-super-secret-jwt-signing-key-change-in-production"

# API Configuration
API_HOST="0.0.0.0"
API_PORT=8000
```

**Important Notes:**
- Use a strong, random string for `BETTER_AUTH_SECRET` (minimum 32 characters)
- For production, use Neon PostgreSQL or another PostgreSQL provider
- Never commit the `.env` file to version control

### Frontend Environment Variables (`frontend/.env.local`)

```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Frontend Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Better Auth Secret (MUST match backend)
BETTER_AUTH_SECRET=your-super-secret-jwt-signing-key-change-in-production
```

**Important Notes:**
- In production, update `NEXT_PUBLIC_API_BASE_URL` to your backend domain
- Update `NEXT_PUBLIC_BASE_URL` to your frontend domain
- The `BETTER_AUTH_SECRET` must match the backend exactly

---

## Database Setup

### Using Neon Serverless PostgreSQL (Recommended)

1. **Create a Neon account**
   - Visit https://neon.tech
   - Sign up for a free account

2. **Create a new project**
   - Click "New Project"
   - Choose your region
   - Select PostgreSQL version (14+ recommended)
   - Set a project name (e.g., "todo-app")

3. **Get connection string**
   - After project creation, copy the connection string
   - It will look like:
     ```
     postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
     ```

4. **Update backend `.env`**
   ```env
   DATABASE_URL="<your-neon-connection-string>"
   ```

5. **Database tables are created automatically** when the backend starts

### Using Local PostgreSQL

1. **Install PostgreSQL** locally

2. **Create a database**
   ```bash
   createdb todo_app
   ```

3. **Update `.env`**
   ```env
   DATABASE_URL="postgresql://username:password@localhost/todo_app"
   ```

---

## Production Deployment

### Docker Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.yml build
   ```

2. **Run in detached mode**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Scale services** (if needed)
   ```bash
   docker-compose up -d --scale backend=3
   ```

### Cloud Deployment Options

#### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Backend on Railway:**
1. Create new project in Railway
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

#### Option 2: Deploy to AWS/GCP/Azure

Use the Docker images with:
- **AWS**: ECS Fargate or App Runner
- **GCP**: Cloud Run or GKE
- **Azure**: Container Instances or AKS

#### Option 3: Deploy to DigitalOcean App Platform

1. Create new app
2. Select GitHub repository
3. Configure two components:
   - Backend (Dockerfile: `backend/Dockerfile`)
   - Frontend (Dockerfile: `frontend/Dockerfile`)
4. Add environment variables
5. Deploy

---

## Security Best Practices

### Production Checklist

- [ ] Use strong, unique `BETTER_AUTH_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS/SSL for both frontend and backend
- [ ] Use environment-specific configuration files
- [ ] Configure CORS properly (don't use `allow_origins=["*"]` in production)
- [ ] Use secure password hashing (already implemented with bcrypt)
- [ ] Implement rate limiting on API endpoints
- [ ] Regular security updates for dependencies
- [ ] Use PostgreSQL (not SQLite) in production
- [ ] Enable database connection pooling
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database

### CORS Configuration for Production

Edit `backend/src/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.com",
        "https://www.your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Symptom:** Backend fails to start with database connection error

**Solution:**
- Verify `DATABASE_URL` is correct
- Check network connectivity
- For Neon, ensure `sslmode=require` is in connection string
- Check firewall settings

#### 2. JWT Token Errors

**Symptom:** Authentication fails or "Invalid token" errors

**Solution:**
- Ensure `BETTER_AUTH_SECRET` matches in both backend and frontend
- Clear browser local storage
- Verify token is being sent in Authorization header

#### 3. CORS Errors

**Symptom:** Frontend cannot reach backend API

**Solution:**
- Check `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local`
- Verify CORS configuration in `backend/src/main.py`
- Ensure backend is running and accessible

#### 4. Docker Build Failures

**Symptom:** Docker images fail to build

**Solution:**
- Check Docker is running
- Ensure all dependency files exist (`requirements.txt`, `package.json`)
- Clear Docker cache: `docker system prune -a`
- Check for port conflicts

#### 5. Frontend Build Errors

**Symptom:** Next.js build fails with missing dependencies

**Solution:**
- Delete `node_modules` and `.next` directories
- Run `npm install` again
- Check for TypeScript errors
- Ensure all imports are correct

---

## Monitoring and Maintenance

### Health Checks

- **Backend Health**: `GET http://your-backend/health`
- **Frontend Health**: Access homepage `http://your-frontend/`

### Logs

```bash
# Docker logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Database Backups

For Neon PostgreSQL:
- Automatic backups are included
- Configure retention period in Neon dashboard

For self-hosted PostgreSQL:
```bash
pg_dump -U username dbname > backup.sql
```

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation at `/docs` endpoint
3. Check GitHub Issues
4. Contact support team

---

**Last Updated:** February 2026  
**Version:** 1.0.0
