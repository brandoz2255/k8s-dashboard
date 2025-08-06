import httpx
import os
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import asyncio


class WeatherClient:
    """OOP-based client for Open-Meteo API weather data"""
    
    def __init__(self, latitude: float, longitude: float, location_name: str = "Unknown"):
        self.latitude = latitude
        self.longitude = longitude
        self.location_name = location_name
        self.api_url = "https://api.open-meteo.com/v1/forecast"
        self._cache = {}
        self._cache_duration = timedelta(minutes=10)

    async def get_current_weather(self) -> Dict[str, Any]:
        """Fetch current weather data from Open-Meteo API"""
        params = {
            "latitude": self.latitude,
            "longitude": self.longitude,
            "current_weather": True,
            "temperature_unit": "fahrenheit",
            "windspeed_unit": "kmh",
            "timezone": "auto"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(self.api_url, params=params)
            response.raise_for_status()
            data = response.json()
            return self._transform_current_weather(data.get("current_weather", {}))

    def _transform_current_weather(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform Open-Meteo response to standardized format"""
        return {
            "location": self.location_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "temperature": weather_data.get("temperature"),
            "wind_speed": weather_data.get("windspeed"),
            "wind_direction": weather_data.get("winddirection"),
            "weather_code": weather_data.get("weathercode"),
            "time": weather_data.get("time"),
            "last_updated": datetime.utcnow().isoformat(),
            "source": "open-meteo"
        }

    async def display_weather(self) -> str:
        """Get formatted weather string for display"""
        try:
            weather = await self.get_current_weather()
            return (
                f"{weather['location']} Weather:\n"
                f"  Temperature: {weather['temperature']}°F\n"
                f"  Wind Speed: {weather['wind_speed']} km/h\n"
                f"  Wind Direction: {weather['wind_direction']}°\n"
                f"  Weather Code: {weather['weather_code']}\n"
                f"  Time: {weather['time']}"
            )
        except Exception as e:
            return f"Error fetching weather for {self.location_name}: {str(e)}"


class WeatherService:
    """Enhanced weather service with multiple city support and caching"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.openweather_base_url = "https://api.openweathermap.org/data/2.5"
        self._cache = {}
        self._cache_duration = timedelta(minutes=10)
        
        # Predefined locations for San Bernardino and Hesperia
        self.locations = {
            "san_bernardino": {
                "name": "San Bernardino, CA",
                "latitude": 34.1083,
                "longitude": -117.2898
            },
            "hesperia": {
                "name": "Hesperia, CA", 
                "latitude": 34.4264,
                "longitude": -117.3001
            }
        }

    def get_weather_client(self, location_key: str) -> Optional[WeatherClient]:
        """Get a weather client for a predefined location"""
        if location_key not in self.locations:
            return None
        
        loc = self.locations[location_key]
        return WeatherClient(
            latitude=loc["latitude"],
            longitude=loc["longitude"],
            location_name=loc["name"]
        )

    async def get_local_weather(self, location_key: str) -> Dict[str, Any]:
        """Get weather for predefined local locations using Open-Meteo"""
        client = self.get_weather_client(location_key)
        if not client:
            raise ValueError(f"Unknown location: {location_key}")
        
        cache_key = f"local_{location_key}"
        if self._is_cache_valid(cache_key):
            return self._cache[cache_key]["data"]
        
        try:
            weather_data = await client.get_current_weather()
            
            # Cache the result
            self._cache[cache_key] = {
                "data": weather_data,
                "timestamp": datetime.utcnow()
            }
            
            return weather_data
        except Exception as e:
            return self._get_mock_weather_data(location_key)

    def _get_mock_weather_data(self, location_key: str) -> Dict[str, Any]:
        """Return mock weather data when API is unavailable"""
        location_name = self.locations.get(location_key, {}).get("name", location_key)
        return {
            "location": location_name,
            "latitude": self.locations.get(location_key, {}).get("latitude", 0),
            "longitude": self.locations.get(location_key, {}).get("longitude", 0),
            "temperature": 72,
            "wind_speed": 5.0,
            "wind_direction": 225,
            "weather_code": 1,
            "time": datetime.utcnow().isoformat(),
            "last_updated": datetime.utcnow().isoformat(),
            "source": "mock"
        }

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
