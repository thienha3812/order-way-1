import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { useSelector } from "react-redux";
import ListMenu from "./List";
import { userSelector } from "../../../features/user/userSlice";
import { DashBoardContext } from "../Context";
import IconA from '../../../assets/images/icon1.png'
import IconB from '../../../assets/images/icon2.png'
import { remote } from "electron";
const Navbar = styled.div`
  display: flex;
  height: 80px;
  padding-left: 5%;
  background-color: #444444;
  align-items: center;
`;

const Item = styled.div`
  width: 10%;
  color: black;
`;
const CustomNavbar = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { openDrawer,setOpenDrawer } = useContext(DashBoardContext);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const {
    user: { staff_info },
  } = useSelector(userSelector);
  const handleOpenDrawer = () =>{
     setOpenDrawer(!openDrawer)
  }
  const changeMarginWhenOpenDrawer = useCallback(()=>{      
        return openDrawer ? "300px" : "100px"
  },[openDrawer])
  return (
    <Navbar {...props} style={{position:'fixed',width:'100vw',zIndex:999}}>
      <Item>
        <IconButton  onClick={handleOpenDrawer}>
          <img style={{width:"60px",height:"60px"}} src={IconB} />
        </IconButton>
      </Item>
      {/* <Item>
        <IconButton onClick={()=>history.push(DASHBOARD)}>
          <MdHome color="#fff" fontSize={35} />
        </IconButton>
      </Item> */}
      <div style={{ width:'100%',marginLeft: "auto",fontSize:"25px", textAlign: "end", color: "#fff" }}>
        {staff_info.fields.name}
      </div>
      <Item style={{marginRight:changeMarginWhenOpenDrawer()}}>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <img style={{width:"60px",height:"60px"}} src={IconA} />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <ListMenu />
        </Popover>
      </Item>
    </Navbar>
  );
};

export default React.memo(CustomNavbar);
