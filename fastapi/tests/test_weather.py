#!/usr/bin/env python3
"""
Test script for the Open-Meteo weather client implementation
"""
import asyncio
from routes.weather.weather_service import WeatherClient, WeatherService


async def test_weather_client():
    """Test the WeatherClient class directly"""
    print("=== Testing WeatherClient ===")
    
    # Test San Bernardino
    san_bernardino = WeatherClient(34.1083, -117.2898, "San Bernardino, CA")
    print(await san_bernardino.display_weather())
    print()
    
    # Test Hesperia
    hesperia = WeatherClient(34.4264, -117.3001, "Hesperia, CA")
    print(await hesperia.display_weather())
    print()


async def test_weather_service():
    """Test the WeatherService class"""
    print("=== Testing WeatherService ===")
    
    service = WeatherService()
    
    # Test individual locations
    print("San Bernardino weather:")
    san_weather = await service.get_local_weather("san_bernardino")
    print(f"  {san_weather['location']}: {san_weather['temperature']}°F")
    print()
    
    print("Hesperia weather:")
    hesperia_weather = await service.get_local_weather("hesperia")
    print(f"  {hesperia_weather['location']}: {hesperia_weather['temperature']}°F")
    print()


async def main():
    """Run all tests"""
    try:
        await test_weather_client()
        await test_weather_service()
        print("✅ All tests completed successfully!")
    except Exception as e:
        print(f"❌ Test failed: {e}")


if __name__ == "__main__":
    asyncio.run(main())