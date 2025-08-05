import httpx
import os
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import asyncio


class WeatherService:
    def __init__(self):
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self._cache = {}
        self._cache_duration = timedelta(minutes=10)  # Cache for 10 minutes
    
    def _is_cache_valid(self, city: str) -> bool:
        """Check if cached data is still valid"""
        if city not in self._cache:
            return False
        
        cached_time = self._cache[city].get("timestamp")
        if not cached_time:
            return False
            
        return datetime.utcnow() - cached_time < self._cache_duration
    
    async def get_weather_data(self, city: str = "London", country_code: str = "GB") -> Dict[str, Any]:
        """
        Get current weather data for a city
        Uses OpenWeatherMap API with caching
        """
        cache_key = f"{city},{country_code}"
        
        # Return cached data if valid
        if self._is_cache_valid(cache_key):
            return self._cache[cache_key]["data"]
        
        # If no API key, return mock data
        if not self.api_key:
            return self._get_mock_weather_data(city)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "q": f"{city},{country_code}",
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                # Transform API response to our format
                weather_data = self._transform_weather_data(data)
                
                # Cache the result
                self._cache[cache_key] = {
                    "data": weather_data,
                    "timestamp": datetime.utcnow()
                }
                
                return weather_data
                
        except httpx.HTTPError as e:
            print(f"HTTP error fetching weather data: {e}")
            return self._get_mock_weather_data(city)
        except Exception as e:
            print(f"Error fetching weather data: {e}")
            return self._get_mock_weather_data(city)
    
    def _transform_weather_data(self, api_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform OpenWeatherMap API response to our format"""
        return {
            "city": api_data["name"],
            "country": api_data["sys"]["country"],
            "temperature": round(api_data["main"]["temp"]),
            "feels_like": round(api_data["main"]["feels_like"]),
            "humidity": api_data["main"]["humidity"],
            "pressure": api_data["main"]["pressure"],
            "description": api_data["weather"][0]["description"].title(),
            "icon": api_data["weather"][0]["icon"],
            "wind_speed": api_data["wind"]["speed"],
            "wind_direction": api_data["wind"].get("deg", 0),
            "visibility": api_data.get("visibility", 10000) / 1000,  # Convert to km
            "sunrise": datetime.fromtimestamp(api_data["sys"]["sunrise"]).strftime("%H:%M"),
            "sunset": datetime.fromtimestamp(api_data["sys"]["sunset"]).strftime("%H:%M"),
            "last_updated": datetime.utcnow().isoformat(),
            "source": "openweathermap"
        }
    
    def _get_mock_weather_data(self, city: str) -> Dict[str, Any]:
        """Return mock weather data when API is unavailable"""
        return {
            "city": city,
            "country": "GB",
            "temperature": 18,
            "feels_like": 16,
            "humidity": 65,
            "pressure": 1013,
            "description": "Partly Cloudy",
            "icon": "02d",
            "wind_speed": 3.2,
            "wind_direction": 225,
            "visibility": 10.0,
            "sunrise": "07:30",
            "sunset": "18:45",
            "last_updated": datetime.utcnow().isoformat(),
            "source": "mock"
        }
    
    async def get_forecast_data(self, city: str = "London", country_code: str = "GB", days: int = 5) -> Dict[str, Any]:
        """
        Get weather forecast data
        """
        cache_key = f"forecast_{city},{country_code}"
        
        # Return cached data if valid
        if self._is_cache_valid(cache_key):
            return self._cache[cache_key]["data"]
        
        # If no API key, return mock data
        if not self.api_key:
            return self._get_mock_forecast_data(city, days)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/forecast",
                    params={
                        "q": f"{city},{country_code}",
                        "appid": self.api_key,
                        "units": "metric",
                        "cnt": days * 8  # 8 forecasts per day (3-hour intervals)
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                # Transform forecast data
                forecast_data = self._transform_forecast_data(data, days)
                
                # Cache the result
                self._cache[cache_key] = {
                    "data": forecast_data,
                    "timestamp": datetime.utcnow()
                }
                
                return forecast_data
                
        except httpx.HTTPError as e:
            print(f"HTTP error fetching forecast data: {e}")
            return self._get_mock_forecast_data(city, days)
        except Exception as e:
            print(f"Error fetching forecast data: {e}")
            return self._get_mock_forecast_data(city, days)
    
    def _transform_forecast_data(self, api_data: Dict[str, Any], days: int) -> Dict[str, Any]:
        """Transform forecast API response"""
        daily_forecasts = []
        current_date = None
        daily_temps = []
        
        for item in api_data["list"][:days * 8]:
            forecast_date = datetime.fromtimestamp(item["dt"]).date()
            
            if current_date != forecast_date:
                if daily_temps:  # Save previous day
                    daily_forecasts.append({
                        "date": current_date.isoformat(),
                        "max_temp": max(daily_temps),
                        "min_temp": min(daily_temps),
                        "description": item["weather"][0]["description"].title(),
                        "icon": item["weather"][0]["icon"]
                    })
                current_date = forecast_date
                daily_temps = []
            
            daily_temps.append(item["main"]["temp"])
        
        # Add the last day
        if daily_temps:
            daily_forecasts.append({
                "date": current_date.isoformat(),
                "max_temp": max(daily_temps),
                "min_temp": min(daily_temps),
                "description": api_data["list"][-1]["weather"][0]["description"].title(),
                "icon": api_data["list"][-1]["weather"][0]["icon"]
            })
        
        return {
            "city": api_data["city"]["name"],
            "country": api_data["city"]["country"],
            "forecasts": daily_forecasts[:days],
            "last_updated": datetime.utcnow().isoformat(),
            "source": "openweathermap"
        }
    
    def _get_mock_forecast_data(self, city: str, days: int) -> Dict[str, Any]:
        """Return mock forecast data"""
        forecasts = []
        base_date = datetime.now().date()
        
        for i in range(days):
            forecast_date = base_date + timedelta(days=i)
            forecasts.append({
                "date": forecast_date.isoformat(),
                "max_temp": 20 + i,
                "min_temp": 12 + i,
                "description": "Partly Cloudy",
                "icon": "02d"
            })
        
        return {
            "city": city,
            "country": "GB",
            "forecasts": forecasts,
            "last_updated": datetime.utcnow().isoformat(),
            "source": "mock"
        }