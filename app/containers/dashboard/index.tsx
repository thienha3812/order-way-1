import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Grid,
} from '@material-ui/core';
import CustomNavbar from './components/Navbar';
import Routes from './Routes';
import './style.scss';
import CustomDrawer from './components/Drawer';
import { ContextProvider } from './Context';
import { app, BrowserWindow,ipcMain,remote ,screen,Menu} from 'electron';
import { current } from '@reduxjs/toolkit';




const Wrapper = styled.div`
  height: 100vh;
`;
const Body = styled.div`
  width: 100%;
  color: black;
`;
declare global {
  interface Window  {
    manageOrderSocket:any
  }
}
const DashboardPage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const value = {
    openDrawer,
    setOpenDrawer,
  };
  
  return (
    <ContextProvider value={value}>
      <Wrapper>
        <Body>
          <div style={{display:'flex'}}>
            {openDrawer && (
              <div style={{width:"220px"}} >
                <CustomDrawer />
              </div>
            )}
            <div style={{width:'100%'}}>
              <CustomNavbar />
              <Routes />
            </div>
          </div>
        </Body>
      </Wrapper>
    </ContextProvider>
  );
};

export default DashboardPage;
