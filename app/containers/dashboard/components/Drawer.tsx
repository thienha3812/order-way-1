import React, {useState  } from 'react';
import Drawer from '@material-ui/core/Drawer';
import {
  List,
  ListItemText,
  ListItem,
  makeStyles,
  Divider,
} from '@material-ui/core';
import {MdAttachMoney} from 'react-icons/md'
import {FaFirstOrder,FaPrint,FaCalculator} from 'react-icons/fa'
import styled from 'styled-components';
import Logo from '../../../assets/images/logo.jpg'
import { useHistory } from 'react-router';
import { DASHBOARD ,DASHBOARD_MONEY_BOX,DASHBOARD_PRINTER,DASHBOARD_STAFF_ORDER} from '../../../constants/routes';
import { userSelector } from '../../../features/user/userSlice';
import { useSelector } from 'react-redux';
const useStyles = makeStyles(() => ({
  paper: {
    width: '200px',
  },
  active: {
    backgroundColor:"#e6e6e6",
    }
}));

const TitleImg = styled.div`
    background-image: url(${Logo});
    background-size:150px 150px;
    background-position: center;
    background-repeat:no-repeat;
    height:200px;
`
const CustomDrawer = () => {
  const styles = useStyles()
  const {user:{staff_info}} = useSelector(userSelector)
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
      name: "Quản lý Order",
      icon: <FaFirstOrder/>
    },
    {
      url: DASHBOARD_STAFF_ORDER,
      name: "Nhân viên Order",
      icon : <FaCalculator/>
    },
    {
      url:DASHBOARD_MONEY_BOX,
      name: "Két tiền - Thu chi",
      icon: <MdAttachMoney/>
    },
    {
      url: DASHBOARD_PRINTER,
      name: "Thiết lập máy in",
      icon: <FaPrint />
    },
    
  ]
  const kitchen_urls =  [
    {
      url : DASHBOARD,
      name: "Quản lý Order",
      icon: <FaFirstOrder/>
    },
    {
      url: DASHBOARD_PRINTER,
      name: "Thiết lập máy in",
      icon: <FaPrint />
    },
  ]
  const staff_urls = [
    {
      url : DASHBOARD,
      name: "Quản lý Order",
      icon: <FaFirstOrder/>
    },
    {
      url: DASHBOARD_STAFF_ORDER,
      name: "Nhân viên Order",
      icon : <FaCalculator/>
    },
    {
      url: DASHBOARD_PRINTER,
      name: "Thiết lập máy in",
      icon: <FaPrint />
    },
  ]
  const selectMenusFromRole = () =>{ 
    const { role_name } = staff_info.fields
    if(role_name === "ADMIN" || role_name === "CASHIER"){
      return urls
    }
    if(role_name === "KITCHEN"){
      return kitchen_urls
    }
    if(role_name === "STAFF"){
      return staff_urls
    }
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
        <Divider/>
        <List>
          {selectMenusFromRole().map((u,index)=>(
            <>
              <ListItem button onClick={()=>navigate(u.url,index)} className={active(index)} >
                {u.icon}
              <ListItemText style={{marginLeft:"10px"}} primary={u.name}  />
            </ListItem>
            </>
          ))}
        </List>
      </Drawer>
    </>
  );
};
export default CustomDrawer;
