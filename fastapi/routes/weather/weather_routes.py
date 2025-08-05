from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from .weather_service import WeatherService


router = APIRouter()
weather_service = WeatherService()


class WeatherResponse(BaseModel):
    city: str
    country: str
    temperature: int
    feels_like: int
    humidity: int
    pressure: int
    description: str
    icon: str
    wind_speed: float
    wind_direction: int
    visibility: float
    sunrise: str
    sunset: str
    last_updated: str
    source: str


class ForecastDay(BaseModel):
    date: str
    max_temp: int
    min_temp: int
    description: str
    icon: str


class ForecastResponse(BaseModel):
    city: str
    country: str
    forecasts: List[ForecastDay]
    last_updated: str
    source: str


@router.get("/weather", response_model=WeatherResponse)
async def get_current_weather(
    city: str = Query(default="London", description="City name"),
    country: str = Query(default="GB", description="Country code (ISO 3166)")
):
    """
    Get current weather data for a specific city
    
    - **city**: City name (default: London)
    - **country**: Country code in ISO 3166 format (default: GB)
    """
    try:
        weather_data = await weather_service.get_weather_data(city, country)
        return WeatherResponse(**weather_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather data: {str(e)}")


@router.get("/weather/forecast", response_model=ForecastResponse)
async def get_weather_forecast(
    city: str = Query(default="London", description="City name"),
    country: str = Query(default="GB", description="Country code (ISO 3166)"),
    days: int = Query(default=5, ge=1, le=5, description="Number of forecast days (1-5)")
):
    """
    Get weather forecast for a specific city
    
    - **city**: City name (default: London)
    - **country**: Country code in ISO 3166 format (default: GB)
    - **days**: Number of forecast days, 1-5 (default: 5)
    """
    try:
        forecast_data = await weather_service.get_forecast_data(city, country, days)
        return ForecastResponse(**forecast_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch forecast data: {str(e)}")


@router.get("/weather/cities")
async def get_popular_cities():
    """
    Get a list of popular cities for weather lookup
    """
    return {
        "cities": [
            {"name": "London", "country": "GB", "code": "london,gb"},
            {"name": "New York", "country": "US", "code": "new-york,us"},
            {"name": "Tokyo", "country": "JP", "code": "tokyo,jp"},
            {"name": "Sydney", "country": "AU", "code": "sydney,au"},
            {"name": "Berlin", "country": "DE", "code": "berlin,de"},
            {"name": "Paris", "country": "FR", "code": "paris,fr"},
            {"name": "Toronto", "country": "CA", "code": "toronto,ca"},
            {"name": "Amsterdam", "country": "NL", "code": "amsterdam,nl"}
        ]
    }