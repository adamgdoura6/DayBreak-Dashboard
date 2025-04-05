import React from 'react';
import styled from 'styled-components';
import { FiHome, FiSettings } from 'react-icons/fi';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 70px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 10px rgba(0,0,0,0.05);
  z-index: 10;
`;

interface SidebarIconProps {
  active?: boolean;
}

const SidebarIcon = styled.div<SidebarIconProps>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  color: ${props => props.active ? 'white' : '#888'};
  background-color: ${props => props.active ? '#6340f0' : 'transparent'};
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#6340f0' : '#f0f0f5'};
  }
`;

const Logo = styled.div`
  font-size: 28px;
  color: #6340f0;
  margin-bottom: 40px;
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Logo>⬢</Logo>
      <SidebarIcon active={true}><FiHome size={20} /></SidebarIcon>
      <SidebarIcon><FiSettings size={20} /></SidebarIcon>
    </SidebarContainer>
  );
};

export default Sidebar;