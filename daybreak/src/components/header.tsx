import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Greeting = styled.div`
  display: flex;
  flex-direction: column;
`;

const GreetingTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
  margin-top: 0;
`;

const GreetingSubtitle = styled.p`
  color: #888;
  font-size: 15px;
  margin: 0;
`;

const TimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Time = styled.div`
  font-size: 28px;
  font-weight: 600;
`;

const Date = styled.div`
  color: #888;
  font-size: 14px;
`;

interface HeaderProps {
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ username = 'Muminul' }) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
        const now = new global.Date();
      
      // Update time
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
      
      // Update date
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      setDate(now.toLocaleDateString('en-US', options));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <HeaderContainer>
      <Greeting>
        <GreetingTitle>Good Morning, {username}</GreetingTitle>
        <GreetingSubtitle>Have a nice day.</GreetingSubtitle>
      </Greeting>
      <TimeDisplay>
        <Time>{time}</Time>
        <Date>{date}</Date>
      </TimeDisplay>
    </HeaderContainer>
  );
};

export default Header;

