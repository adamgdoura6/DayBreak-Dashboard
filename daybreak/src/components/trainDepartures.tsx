import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './card';
import { TrainDeparture } from '../types';

const TrainDepartureItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eaedf2;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TrainLine = styled.div`
  display: flex;
  align-items: center;
`;

interface TrainIndicatorProps {
  color: string;
}

const TrainIndicator = styled.div<TrainIndicatorProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-right: 12px;
`;

const TrainDestination = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const TrainTime = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const TrainDepartures: React.FC = () => {
  const [departures, setDepartures] = useState<TrainDeparture[]>([
    { id: 1, line: 'L1', color: '#4285f4', destination: 'Downtown', time: '8:15 AM' },
    { id: 2, line: 'L2', color: '#ea4335', destination: 'Eastside', time: '8:23 AM' },
    { id: 3, line: 'L3', color: '#34a853', destination: 'Westpark', time: '8:37 AM' }
  ]);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const res = await fetch('/api/trains');
        const data: TrainDeparture[] = await res.json();
        
        if (data && Array.isArray(data)) {
          setDepartures(data);
        }
      } catch (error) {
        console.error('Failed to fetch trains:', error);
      }
    };

    fetchTrains();
    
    // Update every 5 minutes
    const interval = setInterval(fetchTrains, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Train Departures">
      {departures.map(train => (
        <TrainDepartureItem key={train.id}>
          <TrainLine>
            <TrainIndicator color={train.color}>{train.line}</TrainIndicator>
            <TrainDestination>{train.destination}</TrainDestination>
          </TrainLine>
          <TrainTime>{train.time}</TrainTime>
        </TrainDepartureItem>
      ))}
    </Card>
  );
};

export default TrainDepartures;