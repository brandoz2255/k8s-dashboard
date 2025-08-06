from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from routes.weather.weather_routes import router as weather_router
from routes.health.health_routes import router as health_router
from routes.social.social_routes import router as social_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 FastAPI backend starting up...")
    yield
    # Shutdown
    print("🛑 FastAPI backend shutting down...")


app = FastAPI(
    title="K8s Dashboard API",
    description="FastAPI backend for Kubernetes dashboard automation",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev
        "https://command.dulc3.tech",  # Production
        "http://localhost:8080"  # Local testing
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(weather_router, prefix="/api", tags=["weather"])
app.include_router(social_router, prefix="/api/social", tags=["social"])


@app.get("/")
async def root():
    return {
        "message": "K8s Dashboard FastAPI Backend",
        "version": "0.1.0",
        "status": "running"
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # nosec B104
        port=port,
        reload=True,
        log_level="info"
    )