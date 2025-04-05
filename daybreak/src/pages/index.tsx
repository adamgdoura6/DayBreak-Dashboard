import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Weather from '../components/weather';
import SpotifyPlayer from '../components/spotifyPlayer';
import Motivation from '../components/motivation';
import TrainDepartures from '../components/trainDepartures';
import TemperatureGraph from '@/components/temperatureGraph';
import { WeatherData } from '@/types';

const AppContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  margin-left: 90px;
  padding: 20px;
  width: calc(100% - 90px);
  max-width: 1400px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export default function Home() {
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (data && !data.error) {
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    };

    fetchWeather();
    // Set up refresh interval if needed
  }, []);
  return (
    <div>
      <Head>
        <title>DayBreak - Start Your Day Right</title>
        <meta name="description" content="Your personal morning dashboard with weather, motivation, and more" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppContainer>
        <Sidebar />
        <MainContent>
          <Header username="Adam" />
          <ContentGrid>
            <Weather />
            <TemperatureGraph 
              hourlyTemps={weatherData?.hourlyTemps} 
              weeklyForecast={weatherData?.forecast}
            />
            <SpotifyPlayer />
            <Motivation />
            <TrainDepartures />
          </ContentGrid>
        </MainContent>
      </AppContainer>
    </div>
  );
}