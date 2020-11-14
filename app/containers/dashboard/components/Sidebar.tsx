import React, { useContext } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { DashBoardContext } from '../Context';
import { useHistory } from 'react-router';

const Sidebar = styled.div`
  height: 100%;
  position: fixed;
  width: 25%;
  z-index: 1;
  top: 0;
  left: 0;
  transition: 2s;
`;

const CustomSidebar = () => {
    const history = useHistory()
    
  return (
    <>
      <Sidebar>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemIcon />
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button>
            <ListItemIcon />
            <ListItemText primary="Drafts" />
          </ListItem>
        </List>
        <Divider />
      </Sidebar>
    </>
  );
};

export default CustomSidebar;
