from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import os


router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    environment: str


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="0.1.0",
        environment=os.getenv("ENVIRONMENT", "development")
    )