import React, {useState  } from 'react';
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
import { DASHBOARD ,DASHBOARD_PRINTER,DASHBOARD_STAFF_ORDER} from '../../../constants/routes';
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
  const [selectedIndex,setIndex] = useState(0)
  const navigate  =  async (url,index) =>{ 
     await history.push(url)
     setIndex(index)
  }
  const active = (index) =>{ 
       return  index === selectedIndex ? styles.active : undefined
  }
  const urls = [
    {
      url : DASHBOARD,
      name: "Quản lý Order"
    },
    {
      url: DASHBOARD_STAFF_ORDER,
      name: "Nhân viên Order"
    },
    {
      url: DASHBOARD_PRINTER,
      name: "Thiết lập máy in"
    }
  ]
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
          {urls.map((u,index)=>(
            <>
              <ListItem button onClick={()=>navigate(u.url,index)} className={active(index)} >
              <ListItemText primary={u.name}  />
            </ListItem>
            </>
          ))}
        </List>
      </Drawer>
    </>
  );
};
export default CustomDrawer;
