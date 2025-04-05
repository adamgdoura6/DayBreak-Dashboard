import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './card';
import { WeatherData } from '../types';
import { 
  WiDaySunny, 
  WiNightClear,
  WiDayCloudy,
  WiNightCloudy,
  WiCloud,
  WiCloudy,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiDust,
  WiFog,
  WiWindy
} from 'react-icons/wi';

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
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6340f0;
  svg {
    width: 80px;
    height: 80px;
  }
`;

const WeatherDescription = styled.div`
  color: #888;
  font-size: 14px;
  margin-top: 15px;
`;

const TomorrowContainer = styled.div`
  background-color: #f8f9fd;
  border-radius: 12px;
  padding: 12px;
  margin-top: 15px;
  display: flex;
  align-items: center;
`;

const TomorrowInfo = styled.div`
  flex: 1;
`;

const TomorrowTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #444;
`;

const TomorrowDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 3px;
`;

const TomorrowIcon = styled.div`
  color: #6340f0;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const WeekContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WeekDay = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f2f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DayName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #444;
  width: 100px;
`;

const DayCondition = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  color: #6340f0;
  svg {
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
`;

const DayTemp = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: right;
`;

const RainChance = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #4285f4;
  margin-left: 10px;
  svg {
    width: 15px;
    height: 15px;
    margin-right: 2px;
  }
`;

const getWeatherIcon = (condition: string, isNight: boolean = false) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return isNight ? <WiNightClear /> : <WiDaySunny />;
  }
  if (conditionLower.includes('partly cloudy')) {
    return isNight ? <WiNightCloudy /> : <WiDayCloudy />;
  }
  if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
    return conditionLower.includes('heavy') ? <WiCloudy /> : <WiCloud />;
  }
  if (conditionLower.includes('rain')) {
    return conditionLower.includes('light') ? <WiShowers /> : <WiRain />;
  }
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <WiThunderstorm />;
  }
  if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('ice')) {
    return <WiSnow />;
  }
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return <WiFog />;
  }
  if (conditionLower.includes('dust') || conditionLower.includes('sand')) {
    return <WiDust />;
  }
  if (conditionLower.includes('wind')) {
    return <WiWindy />;
  }
  
  // Default to sunny/clear if no match
  return isNight ? <WiNightClear /> : <WiDaySunny />;
};

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 25,
    condition: 'Drizzling',
    location: 'Golden City, Sylhet',
    time: '07:32 AM',
    description: "Today's weather is very nice.",
    forecast: []
  });
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');
  const [isNight, setIsNight] = useState(false);

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

    const checkDayNight = () => {
      const hours = new global.Date().getHours();
      setIsNight(hours >= 18 || hours < 6);
    };

    fetchWeather();
    checkDayNight();

    // Update time every minute and check day/night
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        time: new global.Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      checkDayNight();
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

  // Get tomorrow's forecast if available
  const tomorrow = weather.forecast && weather.forecast.length > 1 ? weather.forecast[1] : null;

  return (
    <Card title="Today's Weather" rightHeader={WeatherTabs}>
      {activeTab === 'day' ? (
        <>
          <WeatherInfo>
            <WeatherDetails>
              <WeatherTime>{weather.time}</WeatherTime>
              <WeatherTemp>{weather.condition} / {weather.temp}°C</WeatherTemp>
              <WeatherLocation>{weather.location}</WeatherLocation>
            </WeatherDetails>
            <WeatherIcon>
              {getWeatherIcon(weather.condition, isNight)}
            </WeatherIcon>
          </WeatherInfo>
          <WeatherDescription>{weather.description}</WeatherDescription>
          
          {/* Tomorrow's Forecast */}
          {tomorrow && (
            <TomorrowContainer>
              <TomorrowInfo>
                <TomorrowTitle>Tomorrow</TomorrowTitle>
                <TomorrowDetails>
                  {tomorrow.condition}, {tomorrow.minTemp}°C - {tomorrow.maxTemp}°C
                  {tomorrow.chanceOfRain > 0 && `, ${tomorrow.chanceOfRain}% chance of rain`}
                </TomorrowDetails>
              </TomorrowInfo>
              <TomorrowIcon>
                {getWeatherIcon(tomorrow.condition)}
              </TomorrowIcon>
            </TomorrowContainer>
          )}
        </>
      ) : (
        <WeekContainer>
          {weather.forecast && weather.forecast.map((day, index) => (
            <WeekDay key={day.date}>
              <DayName>{day.date}</DayName>
              <DayCondition>
                {getWeatherIcon(day.condition)}
                {day.condition}
              </DayCondition>
              <DayTemp>
                {day.minTemp}° - {day.maxTemp}°
                {day.chanceOfRain > 0 && (
                  <RainChance>
                    <WiRain />
                    {day.chanceOfRain}%
                  </RainChance>
                )}
              </DayTemp>
            </WeekDay>
          ))}
        </WeekContainer>
      )}
    </Card>
  );
};

export default Weather;