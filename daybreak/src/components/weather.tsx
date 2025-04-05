import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './card';
import { WeatherData } from '../types';

interface WidgetTabProps {
  active: boolean;
}

const WidgetTabs = styled.div`
  display: flex;
  gap: 5px;
`;

const WidgetTab = styled.div<WidgetTabProps>`
  background-color: ${props => props.active ? '#6340f0' : '#f0f2f5'};
  color: ${props => props.active ? 'white' : 'inherit'};
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
`;

const WeatherInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WeatherDetails = styled.div`
  flex: 1;
`;

const WeatherTime = styled.div`
  font-size: 14px;
  color: #444;
`;

const WeatherTemp = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px;
`;

const WeatherLocation = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const WeatherIcon = styled.div`
  width: 100px;
  height: 100px;
`;

const WeatherDescription = styled.div`
  color: #888;
  font-size: 14px;
  margin-top: 15px;
`;

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 25,
    condition: 'Drizzling',
    location: 'Golden City, Sylhet',
    time: '07:32 AM',
    description: "Today's weather is very nice."
  });
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (data && !data.error) {
          setWeather(data);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
    // Update time every minute
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const WeatherTabs = (
    <WidgetTabs>
      <WidgetTab 
        active={activeTab === 'day'} 
        onClick={() => setActiveTab('day')}
      >
        Day
      </WidgetTab>
      <WidgetTab 
        active={activeTab === 'week'} 
        onClick={() => setActiveTab('week')}
      >
        Week
      </WidgetTab>
    </WidgetTabs>
  );

  // Weather icon SVG
  const weatherIcon = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='40' r='20' fill='%23FFD700'/>
      <path d='M30,70 Q50,50 70,70 Q85,85 70,90 Q50,100 30,90 Q15,85 30,70' fill='%23E0E0E0'/>
      <path d='M40,85 L37,95 M50,85 L47,98 M60,85 L57,95' stroke='%236340f0' stroke-width='3' stroke-linecap='round'/>
    </svg>
  `;

  return (
    <Card title="Today's Weather" rightHeader={WeatherTabs}>
      <WeatherInfo>
        <WeatherDetails>
          <WeatherTime>{weather.time}</WeatherTime>
          <WeatherTemp>{weather.condition} / {weather.temp}°C</WeatherTemp>
          <WeatherLocation>{weather.location}</WeatherLocation>
        </WeatherDetails>
        <WeatherIcon dangerouslySetInnerHTML={{ __html: weatherIcon }} />
      </WeatherInfo>
      <WeatherDescription>{weather.description}</WeatherDescription>
    </Card>
  );
};

export default Weather;