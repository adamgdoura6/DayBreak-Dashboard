import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './card';
import { QuoteData } from '../types';

const Quote = styled.div`
  font-size: 17px;
  line-height: 1.5;
  margin-bottom: 10px;
  font-style: italic;
`;

const Author = styled.div`
  text-align: right;
  font-size: 14px;
  color: #888;
`;

const Motivation: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData>({
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs"
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkTime = () => {
      const now = new global.Date();
      const hours = now.getHours();
      setIsVisible(hours < 10);
    };

    // Check time immediately
    checkTime();

    // Check time every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch('/api/motivation');
        const data = await res.json();
        
        if (data && !data.error) {
          setQuote({
            text: data.quote,
            author: data.author
          });
        }
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      }
    };

    fetchQuote();
    
    // Fetch a new quote every 6 hours
    const interval = setInterval(fetchQuote, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Card title="Daily Motivation">
      <Quote>"{quote.text}"</Quote>
      <Author>- {quote.author}</Author>
    </Card>
  );
};

export default Motivation;