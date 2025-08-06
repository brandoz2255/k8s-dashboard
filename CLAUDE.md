# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Instructions

**ALWAYS create a changes.md log entry after each response** - Document every change made with:
- Timestamp
- Summary of changes
- Files modified/created
- Reasoning for changes
- Impact on system

## Project Overview

This is a personal Kubernetes dashboard and automation web app for managing homeserver infrastructure. The project follows a hybrid architecture:

- **Performance-critical components**: Go (Gin framework)
- **Main backend logic**: Python FastAPI (planned, for ML/LLM integration)
- **Frontend**: Next.js with TypeScript and Tailwind CSS

The goal is to create a scalable automation platform that can be deployed on various cloud infrastructures (Azure, AWS) while serving as an internet frontpage and K8s cluster management interface.

## Architecture

### Current Structure
```
k8s-dashboard/
├── cyber-dashboard/     # Next.js frontend application
├── gin-api/            # Go backend API (performance-critical)
├── fastapi/            # Python FastAPI backend (planned)
```

### Components
- **cyber-dashboard**: Next.js frontend with shadcn/ui components, dark theme support
- **gin-api**: Go Gin backend with JWT authentication, PostgreSQL integration, CORS enabled
- **fastapi**: Python FastAPI backend with weather API integration, modular routing structure

## Development Commands

### Frontend (Next.js)
```bash
cd cyber-dashboard
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

### Backend (Go)
```bash
cd gin-api
go run main.go       # Start development server (port 8080)
go build            # Build binary
```

### Backend (Python FastAPI)
```bash
cd fastapi
pip install -r requirements.txt    # Install dependencies
python main.py                     # Start development server (port 8000)
uvicorn main:app --reload          # Alternative development server
```

### Docker Build
```bash
# Frontend (Next.js) - from cyber-dashboard directory
sudo docker buildx build --push --platform linux/amd64,linux/arm64 -t dulc3/cyber-command-fr:0.0.x .

# FastAPI Backend - from fastapi directory
cd fastapi
docker build -t dulc3/k8s-dashboard-api:0.0.x .
```

## Key Technical Details

### Authentication
- JWT-based authentication in Go backend
- Protected routes under `/api` endpoint
- CORS configured for `https://command.dulc3.tech`

### Database
- PostgreSQL integration via pgx driver
- Database initialization in route package

### Frontend Stack
- Next.js 15 with React 19
- TypeScript configuration
- Tailwind CSS for styling
- Radix UI components via shadcn/ui
- Framer Motion for animations
- Dark theme by default

### Backend Stack
- **Go**: Gin framework with JWT auth, PostgreSQL integration, structured logging
- **Python FastAPI**: Modular routing, weather API integration, RSS feed scraping, async HTTP client
- OpenWeatherMap API integration with caching
- RSS feed aggregation from security and tech news sources
- Web scraping with BeautifulSoup and feedparser
- CORS configured for frontend integration

## Environment Variables

### Go Backend
- `PORT`: Server port (default: 8080)
- `JWT_SECRET`: Required for JWT token verification

### FastAPI Backend
- `PORT`: Server port (default: 8000)
- `ENVIRONMENT`: Environment name (development/production)
- `OPENWEATHER_API_KEY`: OpenWeatherMap API key for real weather data
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)

## API Endpoints

### FastAPI Backend (Port 8000)
- `GET /api/health` - Health check endpoint
- `GET /api/weather?city={city}&country={country}` - Current weather data
- `GET /api/weather/forecast?city={city}&country={country}&days={days}` - Weather forecast
- `GET /api/weather/cities` - List of popular cities
- `GET /api/social/feed?categories={categories}&limit={limit}` - Security and tech news feed
- `GET /api/social/feed/trending?categories={categories}` - Trending topics analysis
- `GET /api/social/feed/categories` - Available feed categories
- `GET /api/social/feed/sources` - RSS feed sources information
- `POST /api/social/feed/refresh` - Manually refresh feed cache

### Go Backend (Port 8080)
- `GET /healthz` - Health check
- `POST /db_route` - Login endpoint
- `GET /api/secure-data` - Protected endpoint (requires JWT)

## Deployment Notes
- Target stable version: 0.1.0
- Development versions: 0.0.x
- Multi-platform Docker builds supported
- CORS configured for production domain
- FastAPI includes built-in health checks and monitoring
- Weather data cached for 10 minutes to reduce API calls
- RSS feed data cached for 15 minutes for optimal performance
- Social feed aggregates from 15+ security and tech news sources

