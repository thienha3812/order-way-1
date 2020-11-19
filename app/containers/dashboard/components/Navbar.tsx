import React, { useContext } from "react";
import styled from "styled-components";
import { MdReorder, MdHome, MdPerson } from "react-icons/md";
import {FaUserAlt} from 'react-icons/fa'
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { useDispatch, useSelector } from "react-redux";
import ListMenu from "./List";
import { userSelector } from "../../../features/user/userSlice";
import { DashBoardContext } from "../Context";
import { useHistory } from "react-router";
import IconA from '../../../assets/images/icon1.png'
import IconB from '../../../assets/images/icon2.png'
const Navbar = styled.div`
  display: flex;
  height: 8vh;
  padding-left: 5%;
  background-color: #444444;
  align-items: center;
`;

const Item = styled.div`
  width: 7%;
  color: black;
`;
const CustomNavbar = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory()
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
  return (
    <Navbar {...props}>
      <Item>
        <IconButton  onClick={handleOpenDrawer}>
          <img style={{width:"40px",height:"40px"}} src={IconB} />
        </IconButton>
      </Item>
      {/* <Item>
        <IconButton onClick={()=>history.push(DASHBOARD)}>
          <MdHome color="#fff" fontSize={35} />
        </IconButton>
      </Item> */}
      <Item style={{ marginLeft: "auto", textAlign: "end", color: "#fff" }}>
        {staff_info.fields.name}
      </Item>
      <Item>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <img style={{width:"40px",height:"40px"}} src={IconA} />
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
