// Weather API integration for environmental data
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_openweathermap_api_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    // Try backend API first
    const backendResponse = await fetch(`${BACKEND_URL}/weather/current?lat=${lat}&lon=${lon}`);
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      return {
        ...data,
        timestamp: new Date(data.timestamp)
      };
    }

    // Fallback to direct API call
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
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
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data if API fails
    return {
      temperature: 28,
      humidity: 65,
      pressure: 1013,
      windSpeed: 5.2,
      windDirection: 180,
      description: 'Partly cloudy',
      location: 'India',
      timestamp: new Date()
    };
  }
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    // Try backend API first
    const backendResponse = await fetch(`${BACKEND_URL}/weather/${encodeURIComponent(city)}`);
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      return {
        ...data,
        timestamp: new Date(data.timestamp)
      };
    }

    // Fallback to direct API call
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
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
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get user's location and fetch weather data
export const getCurrentLocationWeather = async (): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to New Delhi coordinates if geolocation is not available
      resolve(fetchWeatherData(28.6139, 77.2090));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await fetchWeatherData(latitude, longitude);
          resolve(weatherData);
        } catch (error) {
          // Fallback to New Delhi if current location fails
          try {
            const fallbackData = await fetchWeatherData(28.6139, 77.2090);
            resolve(fallbackData);
          } catch (fallbackError) {
            reject(fallbackError);
          }
        }
      },
      async () => {
        // Default to New Delhi coordinates if user denies location access
        try {
          const fallbackData = await fetchWeatherData(28.6139, 77.2090);
          resolve(fallbackData);
        } catch (error) {
          reject(error);
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