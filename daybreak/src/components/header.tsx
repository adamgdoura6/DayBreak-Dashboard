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
  gap: 5px;
`;

const GreetingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const GreetingTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
`;

const GreetingSubtitle = styled.p`
  color: #888;
  font-size: 15px;
  margin: 0;
`;

const ArabicText = styled.span`
  direction: rtl;
  unicode-bidi: bidi-override;
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
  const [greeting, setGreeting] = useState<string>('');
  const [greetingMessage, setGreetingMessage] = useState<string>('Have a nice day.');
  const [arabicGreeting, setArabicGreeting] = useState<string>('');
  const [arabicMessage, setArabicMessage] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new global.Date();
      
      // Update time
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Update greeting based on time
      if (hours >= 5 && hours < 12) {
        setGreeting('Good Morning');
        setGreetingMessage('Have a great start to your day!');
        setArabicGreeting('صباح الخير');
        setArabicMessage('نهار زين إن شاء الله');
      } else if (hours >= 12 && hours < 17) {
        setGreeting('Good Afternoon');
        setGreetingMessage('Hope your day is going well!');
        setArabicGreeting('مساء الخير');
        setArabicMessage('نهارك زين');
      } else if (hours >= 17 && hours < 22) {
        setGreeting('Good Evening');
        setGreetingMessage('Time to wind down and relax.');
        setArabicGreeting('مساء الخير');
        setArabicMessage('ليلة طيبة');
      } else {
        setGreeting('Good Night');
        setGreetingMessage('Sweet dreams!');
        setArabicGreeting('تصبح على خير');
        setArabicMessage('أحلام سعيدة');
      }
      
      // Format time for display
      hours = hours % 12;
      hours = hours ? hours : 12;
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
        <GreetingRow>
          <GreetingTitle>{greeting}, {username}</GreetingTitle>
          <GreetingTitle><ArabicText>{arabicGreeting}</ArabicText></GreetingTitle>
        </GreetingRow>
        <GreetingRow>
          <GreetingSubtitle>{greetingMessage}</GreetingSubtitle>
          <GreetingSubtitle><ArabicText>{arabicMessage}</ArabicText></GreetingSubtitle>
        </GreetingRow>
      </Greeting>
      <TimeDisplay>
        <Time>{time}</Time>
        <Date>{date}</Date>
      </TimeDisplay>
    </HeaderContainer>
  );
};

export default Header;

