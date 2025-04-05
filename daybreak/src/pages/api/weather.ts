import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherData, DayForecast, HourlyTemp } from '../../types'; // Make sure to import HourlyTemp
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
    { date: "Today", maxTemp: 28, minTemp: 20, condition: "Sunny", chanceOfRain: 0, time: "12:00 PM" },
    { date: "Tomorrow", maxTemp: 27, minTemp: 18, condition: "Sunny", chanceOfRain: 0, time: "12:00 PM" },
    { date: "Sunday", maxTemp: 25, minTemp: 17, condition: "Partly cloudy", chanceOfRain: 20, time: "12:00 PM" },
    { date: "Monday", maxTemp: 23, minTemp: 16, condition: "Light rain", chanceOfRain: 70, time: "12:00 PM" },
    { date: "Tuesday", maxTemp: 22, minTemp: 15, condition: "Overcast", chanceOfRain: 30, time: "12:00 PM" },
    { date: "Wednesday", maxTemp: 24, minTemp: 16, condition: "Sunny", chanceOfRain: 10, time: "12:00 PM" },
    { date: "Thursday", maxTemp: 26, minTemp: 18, condition: "Clear", chanceOfRain: 0, time: "12:00 PM" }
  ],
  hourlyTemps: [
    { time: "00", temp: -1 },
    { time: "03", temp: -3 },
    { time: "06", temp: -2 },
    { time: "09", temp: 4 },
    { time: "12", temp: 8 },
    { time: "15", temp: 9 },
    { time: "18", temp: 6 },
    { time: "21", temp: 3 }
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

      // Get forecast (including hourly)
      const forecastResponse = await axios.get(FORECAST_URL, {
        params: {
          key: API_KEY,
          q: CITY,
          days: 7,
        },
      });

      // Initialize hourly temperatures array
      const hourlyTemps: HourlyTemp[] = [];
      
      // Extract hourly temperature data for today
      if (forecastResponse.data.forecast.forecastday[0]?.hour) {
        // Get temperature for every 3 hours
        for (let i = 0; i < 24; i += 3) {
          const hourData = forecastResponse.data.forecast.forecastday[0].hour[i];
          if (hourData) {
            const hourTime = new Date(hourData.time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              hour12: false
            });
            
            hourlyTemps.push({
              time: hourTime,
              temp: hourData.temp_c
            });
          }
        }
      }

      // Format forecast data
      const forecastData: DayForecast[] = forecastResponse.data.forecast.forecastday.map(
        (day: any, index: number) => {
          const date = new Date(day.date);
          const dayName = index === 0 ? "Today" : 
                          index === 1 ? "Tomorrow" : 
                          date.toLocaleDateString('en-US', { weekday: 'long' });
          
          // Get the noon hour forecast for the temperature time
          const noonForecast = day.hour.find((h: any) => 
            new Date(h.time).getHours() === 12
          ) || day.hour[0];

          // Format the time for the forecast
          const forecastTime = new Date(noonForecast.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return {
            date: dayName,
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            condition: day.day.condition.text,
            chanceOfRain: day.day.daily_chance_of_rain,
            time: forecastTime
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
        forecast: forecastData,
        hourlyTemps: hourlyTemps  // Add the hourly temperatures
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