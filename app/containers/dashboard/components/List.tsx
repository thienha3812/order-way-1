import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { FaKey } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/user/userSlice';
import { useHistory } from 'react-router';

const Item = styled.div`
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }
`;
const ListMenu = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const handleLogout = () =>{
      dispatch(logout())
      history.push("/")
  }
  return (
    <List dense>
      {/* <Item>
        <ListItem>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <FaKey fontSize={15} />
          </ListItemIcon>
          <ListItemText primary="Đổi mật khẩu" />
        </ListItem>
      </Item> */}
      <Item onClick={handleLogout}>
        <ListItem>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <FiLogOut fontSize={15} />
          </ListItemIcon>
          <ListItemText primary="Thoát" />
        </ListItem>
      </Item>
    </List>
  );
};

export default React.memo(ListMenu);
