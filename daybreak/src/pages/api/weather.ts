import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherData, DayForecast } from '../../types';
import axios from 'axios';

const CITY = process.env.WEATHER_CITY || 'Munich';
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';
const FORECAST_URL = 'http://api.weatherapi.com/v1/forecast.json';

// Mock data for fallback
const mockWeather: WeatherData = {
  temp: 25,
  condition: 'Drizzling',
  location: 'Munich, Germany',
  time: new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }),
  description: "Clear sky with gentle breeze",
  forecast: [
    { date: "Tomorrow", maxTemp: 27, minTemp: 18, condition: "Sunny", chanceOfRain: 0 },
    { date: "Sunday", maxTemp: 25, minTemp: 17, condition: "Partly cloudy", chanceOfRain: 20 },
    { date: "Monday", maxTemp: 23, minTemp: 16, condition: "Light rain", chanceOfRain: 70 },
    { date: "Tuesday", maxTemp: 22, minTemp: 15, condition: "Overcast", chanceOfRain: 30 },
    { date: "Wednesday", maxTemp: 24, minTemp: 16, condition: "Sunny", chanceOfRain: 10 },
    { date: "Thursday", maxTemp: 26, minTemp: 18, condition: "Clear", chanceOfRain: 0 },
    { date: "Friday", maxTemp: 28, minTemp: 19, condition: "Sunny", chanceOfRain: 0 }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherData | { error: string }>
) {
  if (req.method === 'GET') {
    // If no API key is configured, return mock data
    if (!API_KEY) {
      console.warn('Weather API key not found, using mock data');
      return res.status(200).json(mockWeather);
    }

    try {
      // Get current weather
      const currentResponse = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: CITY,
        },
      });

      // Get 7-day forecast
      const forecastResponse = await axios.get(FORECAST_URL, {
        params: {
          key: API_KEY,
          q: CITY,
          days: 7,
        },
      });

      // Format forecast data
      const forecastData: DayForecast[] = forecastResponse.data.forecast.forecastday.map(
        (day: any, index: number) => {
          const date = new Date(day.date);
          const dayName = index === 0 ? "Today" : 
                         index === 1 ? "Tomorrow" : 
                         date.toLocaleDateString('en-US', { weekday: 'long' });
          
          return {
            date: dayName,
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            condition: day.day.condition.text,
            chanceOfRain: day.day.daily_chance_of_rain
          };
        }
      );

      const weatherData: WeatherData = {
        temp: currentResponse.data.current.temp_c,
        condition: currentResponse.data.current.condition.text,
        location: `${currentResponse.data.location.name}, ${currentResponse.data.location.country}`,
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        description: `${currentResponse.data.current.condition.text} with ${currentResponse.data.current.wind_kph} km/h wind`,
        forecast: forecastData
      };

      res.status(200).json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      // Return mock data as fallback on error
      res.status(200).json(mockWeather);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}