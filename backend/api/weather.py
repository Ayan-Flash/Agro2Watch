from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
import httpx
from utils.logger import logger
from config import settings
import asyncio
from datetime import datetime, timedelta

router = APIRouter(prefix="/weather", tags=["weather"])

class WeatherService:
    """Weather service using OpenWeatherMap API"""
    
    def __init__(self):
        self.base_url = getattr(settings, 'OPENWEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5')
        self.api_key = getattr(settings, 'OPENWEATHER_API_KEY', None)
        self.cache = {}
        self.cache_duration = timedelta(minutes=10)  # Cache for 10 minutes
    
    def _get_cache_key(self, lat: float, lon: float) -> str:
        """Generate cache key for coordinates"""
        return f"{lat:.2f},{lon:.2f}"
    
    def _is_cache_valid(self, timestamp: datetime) -> bool:
        """Check if cache is still valid"""
        return datetime.now() - timestamp < self.cache_duration
    
    async def get_weather_by_coordinates(self, lat: float, lon: float) -> Dict[str, Any]:
        """Get weather data by coordinates"""
        try:
            # Check cache first
            cache_key = self._get_cache_key(lat, lon)
            if cache_key in self.cache:
                cached_data, timestamp = self.cache[cache_key]
                if self._is_cache_valid(timestamp):
                    logger.info(f"Returning cached weather data for {lat}, {lon}")
                    return cached_data
            
            # Make API request
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    weather_data = self._format_weather_data(data)
                    
                    # Cache the result
                    self.cache[cache_key] = (weather_data, datetime.now())
                    
                    return weather_data
                else:
                    logger.error(f"Weather API error: {response.status_code}")
                    return self._get_fallback_weather_data(lat, lon)
                    
        except Exception as e:
            logger.error(f"Weather API request failed: {e}")
            return self._get_fallback_weather_data(lat, lon)
    
    async def get_weather_by_city(self, city: str) -> Dict[str, Any]:
        """Get weather data by city name"""
        try:
            # Check cache first
            cache_key = city.lower()
            if cache_key in self.cache:
                cached_data, timestamp = self.cache[cache_key]
                if self._is_cache_valid(timestamp):
                    logger.info(f"Returning cached weather data for {city}")
                    return cached_data
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "q": city,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    weather_data = self._format_weather_data(data)
                    
                    # Cache the result
                    self.cache[cache_key] = (weather_data, datetime.now())
                    
                    return weather_data
                else:
                    logger.error(f"Weather API error for city {city}: {response.status_code}")
                    return self._get_fallback_weather_data_by_city(city)
                    
        except Exception as e:
            logger.error(f"Weather API request failed for city {city}: {e}")
            return self._get_fallback_weather_data_by_city(city)
    
    async def get_weather_forecast(self, lat: float, lon: float, days: int = 5) -> Dict[str, Any]:
        """Get weather forecast by coordinates"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/forecast",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.api_key,
                        "units": "metric",
                        "cnt": days * 8  # 8 forecasts per day (3-hour intervals)
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_forecast_data(data, days)
                else:
                    return self._get_fallback_forecast_data(days)
                    
        except Exception as e:
            logger.error(f"Forecast API request failed: {e}")
            return self._get_fallback_forecast_data(days)
    
    def _format_weather_data(self, data: Dict) -> Dict[str, Any]:
        """Format OpenWeatherMap data to our standard format"""
        try:
            return {
                "temperature": round(data["main"]["temp"]),
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "wind_speed": round(data.get("wind", {}).get("speed", 0) * 3.6, 1),  # Convert m/s to km/h
                "wind_direction": data.get("wind", {}).get("deg", 0),
                "description": data["weather"][0]["description"].title(),
                "icon": data["weather"][0]["icon"],
                "location": data["name"],
                "country": data["sys"]["country"],
                "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
                "uv_index": None,  # Not available in current weather API
                "timestamp": datetime.now().isoformat(),
                "coordinates": {
                    "lat": data["coord"]["lat"],
                    "lon": data["coord"]["lon"]
                }
            }
        except KeyError as e:
            logger.error(f"Error formatting weather data: {e}")
            raise ValueError(f"Invalid weather data format: {e}")
    
    def _format_forecast_data(self, data: Dict, days: int) -> Dict[str, Any]:
        """Format forecast data"""
        try:
            forecasts = []
            for item in data["list"][:days * 8]:
                forecasts.append({
                    "datetime": item["dt_txt"],
                    "temperature": round(item["main"]["temp"]),
                    "humidity": item["main"]["humidity"],
                    "description": item["weather"][0]["description"].title(),
                    "icon": item["weather"][0]["icon"],
                    "wind_speed": round(item.get("wind", {}).get("speed", 0) * 3.6, 1),
                    "precipitation": item.get("rain", {}).get("3h", 0) + item.get("snow", {}).get("3h", 0)
                })
            
            return {
                "location": data["city"]["name"],
                "country": data["city"]["country"],
                "forecasts": forecasts,
                "timestamp": datetime.now().isoformat()
            }
        except KeyError as e:
            logger.error(f"Error formatting forecast data: {e}")
            raise ValueError(f"Invalid forecast data format: {e}")
    
    def _get_fallback_weather_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Provide fallback weather data when API fails"""
        return {
            "temperature": 28,
            "humidity": 65,
            "pressure": 1013,
            "wind_speed": 5.2,
            "wind_direction": 180,
            "description": "Partly Cloudy",
            "icon": "02d",
            "location": "India",
            "country": "IN",
            "visibility": 10,
            "uv_index": None,
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": lat, "lon": lon},
            "fallback": True
        }
    
    def _get_fallback_weather_data_by_city(self, city: str) -> Dict[str, Any]:
        """Provide fallback weather data by city when API fails"""
        # Default coordinates for major Indian cities
        city_coords = {
            "delhi": (28.6139, 77.2090),
            "mumbai": (19.0760, 72.8777),
            "bangalore": (12.9716, 77.5946),
            "chennai": (13.0827, 80.2707),
            "kolkata": (22.5726, 88.3639)
        }
        
        coords = city_coords.get(city.lower(), (28.6139, 77.2090))  # Default to Delhi
        
        return {
            "temperature": 28,
            "humidity": 65,
            "pressure": 1013,
            "wind_speed": 5.2,
            "wind_direction": 180,
            "description": "Partly Cloudy",
            "icon": "02d",
            "location": city.title(),
            "country": "IN",
            "visibility": 10,
            "uv_index": None,
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": coords[0], "lon": coords[1]},
            "fallback": True
        }
    
    def _get_fallback_forecast_data(self, days: int) -> Dict[str, Any]:
        """Provide fallback forecast data when API fails"""
        forecasts = []
        base_time = datetime.now()
        
        for i in range(days * 8):  # 8 forecasts per day
            forecast_time = base_time + timedelta(hours=i * 3)
            forecasts.append({
                "datetime": forecast_time.strftime("%Y-%m-%d %H:%M:%S"),
                "temperature": 28 + (i % 8 - 4),  # Simulate daily temperature variation
                "humidity": 65 + (i % 6 - 3),
                "description": "Partly Cloudy",
                "icon": "02d" if 6 <= (forecast_time.hour) <= 18 else "02n",
                "wind_speed": 5.2,
                "precipitation": 0
            })
        
        return {
            "location": "India",
            "country": "IN",
            "forecasts": forecasts,
            "timestamp": datetime.now().isoformat(),
            "fallback": True
        }

# Create weather service instance
weather_service = WeatherService()

@router.get("/current")
async def get_current_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """Get current weather by coordinates"""
    try:
        weather_data = await weather_service.get_weather_by_coordinates(lat, lon)
        return {"success": True, "data": weather_data}
    except Exception as e:
        logger.error(f"Weather endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/city/{city_name}")
async def get_weather_by_city_name(city_name: str):
    """Get current weather by city name"""
    try:
        weather_data = await weather_service.get_weather_by_city(city_name)
        return {"success": True, "data": weather_data}
    except Exception as e:
        logger.error(f"Weather by city endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forecast")
async def get_weather_forecast_endpoint(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    days: int = Query(5, description="Number of forecast days", ge=1, le=7)
):
    """Get weather forecast by coordinates"""
    try:
        forecast_data = await weather_service.get_weather_forecast(lat, lon, days)
        return {"success": True, "data": forecast_data}
    except Exception as e:
        logger.error(f"Forecast endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts")
async def get_weather_alerts(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """Get weather alerts for location"""
    try:
        # Mock weather alerts - in production, integrate with weather alert services
        alerts = [
            {
                "id": "alert_001",
                "type": "heavy_rain",
                "severity": "moderate",
                "title": "Heavy Rain Expected",
                "description": "Heavy rainfall expected in the next 24 hours. Take necessary precautions for crops.",
                "start_time": datetime.now().isoformat(),
                "end_time": (datetime.now() + timedelta(hours=24)).isoformat(),
                "affected_areas": ["Current Location"]
            }
        ]
        
        return {"success": True, "data": {"alerts": alerts}}
    except Exception as e:
        logger.error(f"Weather alerts endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))