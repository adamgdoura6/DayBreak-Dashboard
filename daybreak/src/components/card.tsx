import React, { ReactNode } from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 20px;
  padding: 20px;
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const WidgetTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #444;
`;

interface CardProps {
  title: string;
  children: ReactNode;
  rightHeader?: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, rightHeader }) => {
  return (
    <CardContainer>
      <WidgetHeader>
        <WidgetTitle>{title}</WidgetTitle>
        {rightHeader}
      </WidgetHeader>
      {children}
    </CardContainer>
  );
};

export default Card;