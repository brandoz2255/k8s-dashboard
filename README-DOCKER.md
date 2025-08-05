# Docker Compose Quick Start Guide

This guide helps you quickly spin up the entire K8s Dashboard stack for local development and testing.

## 🚀 Quick Start

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd k8s-dashboard
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - **Frontend**: http://localhost (nginx proxy)
   - **Direct Frontend**: http://localhost:3000
   - **Python API**: http://localhost:8000/api/health
   - **Go API**: http://localhost:8080/healthz
   - **PostgreSQL**: localhost:5432

## 📦 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **nginx** | 80, 443 | Reverse proxy and load balancer |
| **frontend** | 3000 | Next.js React application |
| **python-backend** | 8000 | FastAPI backend (weather, social feed) |
| **go-backend** | 8080 | Go Gin backend (auth, database) |
| **postgres** | 5432 | PostgreSQL database |

## 🔧 Development Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Build and start (after code changes)
docker-compose up --build

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Scale a service
docker-compose up --scale python-backend=2
```

## 🌐 API Endpoints

### Frontend Routes (via nginx)
- `/` - Main dashboard
- `/_next/` - Next.js assets

### Python FastAPI Backend (`/api/`)
- `GET /api/health` - Health check
- `GET /api/weather?city=London&country=UK` - Weather data
- `GET /api/social/feed` - Security/tech news feed

### Go Gin Backend (`/auth/`)
- `GET /healthz` - Health check
- `POST /auth/db_route` - Authentication
- `GET /auth/api/secure-data` - Protected endpoint

## 🔒 Environment Variables

Required environment variables (set in `.env`):

```bash
# Weather API
OPENWEATHER_API_KEY=your_key_here

# Authentication
JWT_SECRET=your_secure_secret

# Database
POSTGRES_PASSWORD=secure_password
```

## 🐳 Docker Images

The compose file builds local images:
- `command-frontend` (Next.js)
- `command-be-py` (FastAPI)
- `command-be-gin` (Go Gin)

## 🔍 Health Checks

All services include health checks:
- **Frontend**: Port 3000 connectivity
- **Python Backend**: `GET /api/health`
- **Go Backend**: `GET /healthz`
- **PostgreSQL**: `pg_isready`
- **Nginx**: `GET /health`

## 🛠️ Troubleshooting

### Common Issues:

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Build failures**: Run `docker-compose build --no-cache`
3. **Database connection**: Check PostgreSQL logs: `docker-compose logs postgres`
4. **Environment variables**: Verify `.env` file exists and has correct values

### Useful Debug Commands:

```bash
# Check running containers
docker ps

# Inspect a service
docker-compose exec frontend sh

# View service logs
docker-compose logs python-backend

# Check networks
docker network ls
```

## 🚀 Production Deployment

For production:
1. Update `nginx.conf` with your domain
2. Add SSL certificates to `nginx/ssl/`
3. Use proper secrets management
4. Enable HTTPS server block in nginx.conf
5. Set `ENVIRONMENT=production` in .env

## 📝 Next Steps

Once everything is running:
1. Test all endpoints
2. Verify health checks
3. Push changes to trigger GitHub Actions
4. Deploy to your K8s cluster