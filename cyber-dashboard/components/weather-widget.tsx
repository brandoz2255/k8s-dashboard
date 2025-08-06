"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  RefreshCw,
} from "lucide-react"

// Weather data type definition for FastAPI response
interface WeatherData {
  city: string
  country: string
  temperature: number
  feels_like: number
  humidity: number
  pressure: number
  description: string
  icon: string
  wind_speed: number
  wind_direction: number
  visibility: number
  sunrise: string
  sunset: string
  last_updated: string
  source: string
}

// Legacy format for component compatibility
interface ComponentWeatherData {
  location: string
  current: {
    temp: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDirection: string
    pressure: number
    uvIndex: number
    visibility: number
    condition: string
    icon: string
    lastUpdated: string
  }
  forecast: {
    date: string
    time: string
    temp: number
    condition: string
    icon: string
    chanceOfRain: number
  }[]
}

// Mock weather data - fallback when API is unavailable
const mockWeatherData: ComponentWeatherData = {
  location: "San Bernardino, CA",
  current: {
    temp: 78,
    feelsLike: 80,
    humidity: 45,
    windSpeed: 8,
    windDirection: "NW",
    pressure: 1012,
    uvIndex: 6,
    visibility: 10,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    lastUpdated: "10:30 AM",
  },
  forecast: [
    { date: "Today", time: "12 PM", temp: 82, condition: "Sunny", icon: "sunny", chanceOfRain: 0 },
    { date: "Today", time: "3 PM", temp: 85, condition: "Partly Cloudy", icon: "partly-cloudy", chanceOfRain: 10 },
    { date: "Today", time: "6 PM", temp: 79, condition: "Partly Cloudy", icon: "partly-cloudy", chanceOfRain: 20 },
    { date: "Today", time: "9 PM", temp: 72, condition: "Clear", icon: "clear-night", chanceOfRain: 0 },
  ],
}

// Transform FastAPI weather data to component format
const transformWeatherData = (apiData: WeatherData): ComponentWeatherData => {
  // Convert wind direction degrees to cardinal direction
  const getCardinalDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }

  // Map OpenWeatherMap icons to our icon names
  const mapWeatherIcon = (owmIcon: string): string => {
    const iconMap: { [key: string]: string } = {
      '01d': 'sunny',           // clear sky day
      '01n': 'clear-night',     // clear sky night
      '02d': 'partly-cloudy',   // few clouds day
      '02n': 'partly-cloudy',   // few clouds night
      '03d': 'cloudy',          // scattered clouds
      '03n': 'cloudy',          // scattered clouds
      '04d': 'cloudy',          // broken clouds
      '04n': 'cloudy',          // broken clouds
      '09d': 'drizzle',         // shower rain
      '09n': 'drizzle',         // shower rain
      '10d': 'rain',            // rain day
      '10n': 'rain',            // rain night
      '11d': 'thunderstorm',    // thunderstorm
      '11n': 'thunderstorm',    // thunderstorm
      '13d': 'snow',            // snow
      '13n': 'snow',            // snow
      '50d': 'cloudy',          // mist
      '50n': 'cloudy',          // mist
    }
    return iconMap[owmIcon] || 'partly-cloudy'
  }

  return {
    location: `${apiData.city}, ${apiData.country}`,
    current: {
      temp: Math.round(apiData.temperature * 9/5 + 32), // Convert C to F
      feelsLike: Math.round(apiData.feels_like * 9/5 + 32), // Convert C to F
      humidity: apiData.humidity,
      windSpeed: Math.round(apiData.wind_speed * 2.237), // Convert m/s to mph
      windDirection: getCardinalDirection(apiData.wind_direction),
      pressure: apiData.pressure,
      uvIndex: 6, // Not provided by OpenWeatherMap basic plan
      visibility: apiData.visibility,
      condition: apiData.description,
      icon: mapWeatherIcon(apiData.icon),
      lastUpdated: new Date(apiData.last_updated).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    },
    forecast: [
      { date: "Today", time: "12 PM", temp: 82, condition: "Sunny", icon: "sunny", chanceOfRain: 0 },
      { date: "Today", time: "3 PM", temp: 85, condition: "Partly Cloudy", icon: "partly-cloudy", chanceOfRain: 10 },
      { date: "Today", time: "6 PM", temp: 79, condition: "Partly Cloudy", icon: "partly-cloudy", chanceOfRain: 20 },
      { date: "Today", time: "9 PM", temp: 72, condition: "Clear", icon: "clear-night", chanceOfRain: 0 },
    ],
  }
}

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<ComponentWeatherData>(mockWeatherData)
  const [isLoading, setIsLoading] = useState(false)

  // Function to fetch weather data from FastAPI backend
  const fetchWeatherData = async () => {
    setIsLoading(true)

    try {
      // Fetch from FastAPI backend
      const fastApiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api.command.dulc3.tech'  // Production FastAPI URL
        : 'http://localhost:8000'           // Development FastAPI URL
      
      const response = await fetch(`${fastApiUrl}/api/weather?city=London&country=GB`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiData: WeatherData = await response.json()
      
      // Transform API data to component format
      const transformedData = transformWeatherData(apiData)
      setWeatherData(transformedData)
      
      console.log('Weather data fetched successfully from FastAPI:', apiData.source)
      
    } catch (error) {
      console.error('Error fetching weather data from FastAPI:', error)
      
      // Fallback to mock data if API fails
      setWeatherData(mockWeatherData)
      console.log('Using fallback mock weather data')
      
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeatherData()

    // Set up interval to refresh weather data (every 30 minutes)
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Function to get the appropriate weather icon
  const getWeatherIcon = (iconName: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeMap = {
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-16 w-16",
    }

    const iconSize = sizeMap[size]

    switch (iconName) {
      case "sunny":
        return <Sun className={`${iconSize} text-yellow-400`} />
      case "clear-night":
        return <Moon className={`${iconSize} text-cyan-400`} />
      case "partly-cloudy":
        return <Cloud className={`${iconSize} text-gray-400`} />
      case "cloudy":
        return <Cloud className={`${iconSize} text-gray-500`} />
      case "rain":
        return <CloudRain className={`${iconSize} text-blue-400`} />
      case "drizzle":
        return <CloudDrizzle className={`${iconSize} text-blue-300`} />
      case "snow":
        return <CloudSnow className={`${iconSize} text-cyan-200`} />
      case "thunderstorm":
        return <CloudLightning className={`${iconSize} text-yellow-300`} />
      default:
        return <Sun className={`${iconSize} text-yellow-400`} />
    }
  }

  // Get background gradient based on weather and time
  const getWeatherBackground = (condition: string) => {
    switch (condition) {
      case "Sunny":
        return "bg-gradient-to-br from-cyan-900/40 via-cyan-900/20 to-yellow-900/30"
      case "Clear":
        return "bg-gradient-to-br from-cyan-900/40 via-cyan-900/20 to-indigo-900/30"
      case "Partly Cloudy":
        return "bg-gradient-to-br from-cyan-900/40 via-cyan-900/20 to-gray-900/30"
      case "Cloudy":
        return "bg-gradient-to-br from-cyan-900/40 via-gray-900/20 to-gray-900/30"
      case "Rain":
        return "bg-gradient-to-br from-cyan-900/40 via-blue-900/20 to-gray-900/30"
      case "Snow":
        return "bg-gradient-to-br from-cyan-900/40 via-cyan-900/20 to-white/10"
      default:
        return "bg-gradient-to-br from-cyan-900/40 via-cyan-900/20 to-cyan-900/10"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow h-full"
    >
      <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
        <h2 className="text-lg font-medium text-cyan-400">Weather</h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Last updated: {weatherData.current.lastUpdated}</span>
          <button
            onClick={fetchWeatherData}
            disabled={isLoading}
            className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`p-0 h-full flex flex-col`}>
        {/* Current Weather - with dynamic background */}
        <div className={`p-4 ${getWeatherBackground(weatherData.current.condition)} border-b border-cyan-950/50`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">{weatherData.location}</h3>
              <div className="text-sm text-cyan-300">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-4xl font-bold text-white">{weatherData.current.temp}°F</div>
              <div className="text-sm text-cyan-300">Feels like {weatherData.current.feelsLike}°F</div>
            </div>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="flex flex-col items-center">
              {getWeatherIcon(weatherData.current.icon, "lg")}
              <div className="mt-2 text-lg font-medium text-white">{weatherData.current.condition}</div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-0 border-b border-cyan-950/50">
          <div className="flex items-center p-3 border-r border-cyan-950/50">
            <Wind className="h-5 w-5 text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-gray-400">Wind</div>
              <div className="text-sm font-medium">
                {weatherData.current.windSpeed} mph {weatherData.current.windDirection}
              </div>
            </div>
          </div>
          <div className="flex items-center p-3">
            <Droplets className="h-5 w-5 text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-gray-400">Humidity</div>
              <div className="text-sm font-medium">{weatherData.current.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center p-3 border-r border-t border-cyan-950/50">
            <Thermometer className="h-5 w-5 text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-gray-400">Pressure</div>
              <div className="text-sm font-medium">{weatherData.current.pressure} hPa</div>
            </div>
          </div>
          <div className="flex items-center p-3 border-t border-cyan-950/50">
            <Compass className="h-5 w-5 text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-gray-400">UV Index</div>
              <div className="text-sm font-medium">{weatherData.current.uvIndex}</div>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="p-3 flex-1">
          <h4 className="text-sm font-medium text-cyan-400 mb-2">Today&apos;s Forecast</h4>
          <div className="flex justify-between">
            {weatherData.forecast.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-400">{item.time}</div>
                <div className="my-2">{getWeatherIcon(item.icon, "sm")}</div>
                <div className="text-sm font-medium">{item.temp}°F</div>
                {item.chanceOfRain > 0 && (
                  <div className="mt-1 flex items-center">
                    <CloudRain className="h-3 w-3 text-cyan-400 mr-1" />
                    <span className="text-xs text-cyan-400">{item.chanceOfRain}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

