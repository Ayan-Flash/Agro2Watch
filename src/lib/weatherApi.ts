// Weather API integration for environmental data
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_openweathermap_api_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  location: string;
  timestamp: Date;
}

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // Try direct OpenWeatherMap API call first
    if (WEATHER_API_KEY && WEATHER_API_KEY !== 'your_openweathermap_api_key') {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: Math.round(data.wind.speed * 10) / 10,
          windDirection: data.wind.deg,
          description: data.weather[0].description,
          location: data.name,
          timestamp: new Date()
        };
      }
    }
  } catch (error) {
    console.log('OpenWeatherMap API not available, using location-specific mock data');
  }

  // Return location-specific mock data
  const lat_factor = Math.abs(lat) % 10;
  const lon_factor = Math.abs(lon) % 10;
  const time_factor = new Date().getHours();
  const minute_factor = new Date().getMinutes();
  
  // Temperature varies by latitude and time
  const base_temp = 20 + (lat_factor * 2); // Colder at higher latitudes
  const temp_variation = (time_factor - 12) * 2; // Warmer during day
  const temperature = Math.round(base_temp + temp_variation + (minute_factor % 5 - 2));
  
  // Humidity varies by longitude and time
  const base_humidity = 60 + (lon_factor * 3); // More humid in some regions
  const humidity = base_humidity + (minute_factor % 15 - 7);
  
  // Pressure varies by altitude (simulated by lat/lon)
  const base_pressure = 1013 + (lat_factor * 2) - (lon_factor * 1);
  const pressure = base_pressure + (new Date().getDate() % 10 - 5);
  
  // Wind varies by location
  const wind_speed = 3 + (lat_factor + lon_factor) % 8;
  const windDirection = (lat_factor * 36 + lon_factor * 18) % 360;
  
  // Weather description varies by location and time
  const weather_conditions = ["Clear", "Partly Cloudy", "Cloudy", "Sunny", "Overcast"];
  const description = weather_conditions[(lat_factor + lon_factor + time_factor) % weather_conditions.length];
  
  // Location name based on coordinates
  const location_names: Record<string, string> = {
    "28.6,77.2": "New Delhi",
    "19.0,72.8": "Mumbai", 
    "12.9,77.6": "Bangalore",
    "22.5,88.3": "Kolkata",
    "13.0,80.2": "Chennai",
    "18.5,73.8": "Pune",
    "26.9,75.8": "Jaipur",
    "17.3,78.4": "Hyderabad"
  };
  
  // Find closest known location or use coordinates
  let location_name = `Location ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  let min_distance = Infinity;
  
  for (const [coords, name] of Object.entries(location_names)) {
    const [known_lat, known_lon] = coords.split(',').map(Number);
    const distance = Math.sqrt((lat - known_lat) ** 2 + (lon - known_lon) ** 2);
    if (distance < min_distance && distance < 0.5) { // Within ~50km
      location_name = name;
      min_distance = distance;
    }
  }
  
  return {
    temperature,
    humidity,
    pressure,
    windSpeed: Math.round(wind_speed * 10) / 10,
    windDirection,
    description,
    location: location_name,
    timestamp: new Date()
  };
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    // Try direct OpenWeatherMap API call first
    if (WEATHER_API_KEY && WEATHER_API_KEY !== 'your_openweathermap_api_key') {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: Math.round(data.wind.speed * 10) / 10,
          windDirection: data.wind.deg,
          description: data.weather[0].description,
          location: data.name,
          timestamp: new Date()
        };
      }
    }
  } catch (error) {
    console.log('OpenWeatherMap API not available, using city-specific mock data');
  }

  // Return city-specific mock data
  const cityVariations: Record<string, { baseTemp: number; baseHumidity: number; basePressure: number; description: string }> = {
    'delhi': { baseTemp: 28, baseHumidity: 60, basePressure: 1013, description: 'Partly Cloudy' },
    'mumbai': { baseTemp: 32, baseHumidity: 75, basePressure: 1015, description: 'Humid' },
    'bangalore': { baseTemp: 26, baseHumidity: 70, basePressure: 1012, description: 'Pleasant' },
    'chennai': { baseTemp: 33, baseHumidity: 80, basePressure: 1014, description: 'Hot and Humid' },
    'kolkata': { baseTemp: 31, baseHumidity: 78, basePressure: 1013, description: 'Tropical' },
    'hyderabad': { baseTemp: 30, baseHumidity: 65, basePressure: 1012, description: 'Dry' },
    'pune': { baseTemp: 27, baseHumidity: 68, basePressure: 1011, description: 'Moderate' },
    'jaipur': { baseTemp: 29, baseHumidity: 55, basePressure: 1010, description: 'Dry' },
    'ahmedabad': { baseTemp: 34, baseHumidity: 70, basePressure: 1012, description: 'Hot' },
    'kochi': { baseTemp: 30, baseHumidity: 85, basePressure: 1016, description: 'Tropical Humid' }
  };
  
  const cityData = cityVariations[city.toLowerCase()] || cityVariations['delhi'];
  const timeFactor = new Date().getHours();
  const minuteFactor = new Date().getMinutes();
  
  return {
    temperature: cityData.baseTemp + (timeFactor % 8 - 4) + (minuteFactor % 3 - 1),
    humidity: cityData.baseHumidity + (minuteFactor % 15 - 7),
    pressure: cityData.basePressure + (new Date().getDate() % 10 - 5),
    windSpeed: 4 + (timeFactor % 6) + (minuteFactor % 3),
    windDirection: (timeFactor * 15 + minuteFactor * 2) % 360,
    description: cityData.description,
    location: city,
    timestamp: new Date()
  };
};

// Get user's location and fetch weather data
export const getCurrentLocationWeather = async (): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to New Delhi coordinates if geolocation is not available
      console.log('Geolocation not available, using New Delhi coordinates');
      resolve(fetchWeatherData(28.6139, 77.2090));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Getting weather for location: ${latitude}, ${longitude}`);
        try {
          const weatherData = await fetchWeatherData(latitude, longitude);
          resolve(weatherData);
        } catch (error) {
          console.error('Error fetching weather for current location:', error);
          // Fallback to New Delhi if current location fails
          try {
            const fallbackData = await fetchWeatherData(28.6139, 77.2090);
            resolve(fallbackData);
          } catch (fallbackError) {
            reject(fallbackError);
          }
        }
      },
      async (error) => {
        console.log('Geolocation denied or failed:', error.message);
        // Default to New Delhi coordinates if user denies location access
        try {
          const fallbackData = await fetchWeatherData(28.6139, 77.2090);
          resolve(fallbackData);
        } catch (fallbackError) {
          reject(fallbackError);
        }
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        enableHighAccuracy: false
      }
    );
  });
};

// Forecast data
export const getWeatherForecast = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Forecast API request failed');
    }
    
    const data = await response.json();
    return data.list.slice(0, 5).map((item: any) => ({
      time: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return [];
  }
};