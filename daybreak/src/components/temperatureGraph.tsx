// components/TemperatureGraph.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Card from './card';
import { HourlyTemp, DayForecast } from '../types';
import { WiTime3 } from 'react-icons/wi';

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

const GraphContainer = styled.div`
  position: relative;
  height: 100px;
  width: 100%;
  margin-bottom: 5px;
  margin-top: 20px;
`;

const GraphBar = styled.div<{ height: string, left: string }>`
  position: absolute;
  bottom: 25px;
  left: ${props => props.left};
  height: ${props => props.height};
  width: 2px;
  background-color: #6340f0;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #6340f0;
  }
`;

const GraphLine = styled.div`
  position: absolute;
  bottom: 25px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(99, 64, 240, 0.2);
`;

const TimeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #888;
`;

const TempLabel = styled.div<{ left: string }>`
  position: absolute;
  bottom: 0;
  left: ${props => props.left};
  font-size: 11px;
  color: #444;
  font-weight: 500;
  transform: translateX(-50%);
  text-align: center;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #888;
  margin: 30px 0;
  font-size: 14px;
`;

interface TemperatureGraphProps {
  hourlyTemps?: HourlyTemp[];
  weeklyForecast?: DayForecast[];
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ 
  hourlyTemps = [], 
  weeklyForecast = [] 
}) => {
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');

  const TemperatureTabs = (
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

  // Render day graph
  const renderDayGraph = () => {
    if (!hourlyTemps || hourlyTemps.length === 0) {
      return <NoDataMessage>No hourly data available</NoDataMessage>;
    }
    
    // Find min and max temps to scale the graph
    const temps = hourlyTemps.map(h => h.temp);
    const minTemp = Math.min(...temps) - 1; // Add 1 degree buffer
    const maxTemp = Math.max(...temps) + 1;
    const tempRange = maxTemp - minTemp || 1; // Avoid division by zero
    
    return (
      <>
        <GraphContainer>
          <GraphLine />
          {hourlyTemps.map((hourData, index) => {
            const left = `${(index / (hourlyTemps.length - 1)) * 100}%`;
            
            // Calculate height based on temperature
            // We'll use 70px as max height
            const heightPercentage = ((hourData.temp - minTemp) / tempRange);
            const height = `${Math.max(5, heightPercentage * 70)}px`;
            
            return (
              <React.Fragment key={hourData.time}>
                <GraphBar height={height} left={left} />
                <TempLabel left={left}>
                  {Math.round(hourData.temp)}°
                </TempLabel>
              </React.Fragment>
            );
          })}
        </GraphContainer>
        <TimeLabels>
          {hourlyTemps.map(hourData => (
            <div key={hourData.time}>{hourData.time}</div>
          ))}
        </TimeLabels>
      </>
    );
  };

  // Render week graph
  const renderWeekGraph = () => {
    if (!weeklyForecast || weeklyForecast.length === 0) {
      return <NoDataMessage>No weekly forecast available</NoDataMessage>;
    }

    // Extract min and max temperatures
    const maxTemps = weeklyForecast.map(day => day.maxTemp);
    const minTemps = weeklyForecast.map(day => day.minTemp);
    
    // Find overall min and max for scaling
    const overallMin = Math.min(...minTemps) - 1;
    const overallMax = Math.max(...maxTemps) + 1;
    const tempRange = overallMax - overallMin || 1;

    return (
      <>
        <GraphContainer>
          <GraphLine />
          {weeklyForecast.map((day, index) => {
            const left = `${(index / (weeklyForecast.length - 1)) * 100}%`;
            
            // Calculate heights for min and max temps
            const minHeightPercentage = ((day.minTemp - overallMin) / tempRange);
            const maxHeightPercentage = ((day.maxTemp - overallMin) / tempRange);
            const height = `${Math.max(5, maxHeightPercentage * 70)}px`;
            
            return (
              <React.Fragment key={day.date}>
                <GraphBar height={height} left={left} />
                <TempLabel left={left}>
                  {Math.round(day.minTemp)}°-{Math.round(day.maxTemp)}°
                </TempLabel>
              </React.Fragment>
            );
          })}
        </GraphContainer>
        <TimeLabels>
          {weeklyForecast.map(day => (
            <div key={day.date}>{day.date.substring(0, 3)}</div> // Show first 3 chars of day name
          ))}
        </TimeLabels>
      </>
    );
  };

  return (
    <Card title="Temperature Trends" rightHeader={TemperatureTabs}>
      {activeTab === 'day' ? renderDayGraph() : renderWeekGraph()}
    </Card>
  );
};

export default TemperatureGraph;