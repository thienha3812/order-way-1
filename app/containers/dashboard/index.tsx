import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Grid,
} from '@material-ui/core';
import CustomNavbar from './components/Navbar';
import Routes from './Routes';
import './style.scss';
import CustomDrawer from './components/Drawer';
import { ContextProvider } from './Context';

const Wrapper = styled.div`
  height: 100vh;
`;
const Body = styled.div`
  width: 100%;
  color: black;
`;
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
          <Grid container>
            {openDrawer && (
              <Grid item xs={3}>
                <CustomDrawer />
              </Grid>
            )}
            <Grid item xs={openDrawer ? 9 : 12}>
              <CustomNavbar />
              <Routes />
            </Grid>
          </Grid>
        </Body>
      </Wrapper>
    </ContextProvider>
  );
};

export default DashboardPage;
