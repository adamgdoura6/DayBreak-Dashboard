import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherData } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherData | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      // In a real app, fetch from a weather API
      // Example: OpenWeatherMap
      // const apiKey = process.env.OPENWEATHER_API_KEY;
      // const city = 'YourCity';
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      // const data = await response.json();
      
      // For now, return mock data
      res.status(200).json({
        temp: 25,
        condition: 'Drizzling',
        location: 'Golden City, Sylhet',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        description: "Today's weather is very nice."
      });
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}