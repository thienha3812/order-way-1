import React, {  } from 'react';
import Drawer from '@material-ui/core/Drawer';
import {
  List,
  ListItemText,
  ListItem,
  makeStyles,
  Divider,
} from '@material-ui/core';
import styled from 'styled-components';
import Logo from '../../../assets/images/logo.png'
import { useHistory } from 'react-router';
import { DASHBOARD ,DASHBOARD_STAFF_ORDER} from '../../../constants/routes';
const useStyles = makeStyles(() => ({
  paper: {
    width: '25%',
  },
  active: {
    backgroundColor:"#e6e6e6",
    }
}));

const Title = styled.div`
    font-family: 'Baumans', cursive;
    font-size:30px;
    text-align:center;

`
const TitleImg = styled.div`
    background-image: url(${Logo});
    background-size:30% 40%;
    background-position: center;
    background-repeat:no-repeat;
    height:20%;
`
const CustomDrawer = () => {
    const styles = useStyles()
    const history  = useHistory() 
  const navigate  =  async (url) =>{ 
     await history.push(url)
  }
  const active = (url) =>{ 
       return  history.location.pathname === url ? styles.active : undefined
  }
  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        classes={{
          paper: styles.paper,
        }}
        open
      >
        <TitleImg/>
        <Title>
            Order Way
        </Title>
        <Divider/>
        <List>
          <ListItem button onClick={()=>navigate(DASHBOARD)} className={active(DASHBOARD)} >
            <ListItemText primary="Quản lý Order"  />
          </ListItem>
          <ListItem button  onClick={()=>navigate(DASHBOARD_STAFF_ORDER)} className={active(DASHBOARD_STAFF_ORDER)}>
            <ListItemText primary="Nhân viên  Order" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
export default CustomDrawer;
