import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Input,
  TextField,
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdAdd } from 'react-icons/md';
import TableService from '../../../../services/tables';
import { Context, Provider } from './Context';
import { Billment, Table } from './types';
import Menu from './components/Menu';
import StaffService from '../../../../services/staff';

const Wrapper = styled.div`
  padding: 5%;
  flex-wrap: wrap;
  flex-flow: row wrap;
  display: flex;
`;

const Box = styled.div`
  border-radius: 10px;
  width: 100px;
  height: 100px;
  margin: 5px;
  background-color: green;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    background-color: #e8e8e8;
  }
`;
const RenderTable = () =>{ 
  const {tables,setOpenMenu,billment,setBillMent} = useContext(Context)
  const openMenu = async (table) =>{
    setOpenMenu(true)
    setBillMent({...billment,table_name:table.fields.name,tableId:table.pk.toString()})
  }
  return ( 
    <Fragment>
        {tables.map((table,index)=> ( 
          <Box onClick={()=>openMenu(table)} key={index}>{table.fields.name}</Box>
      ))}
    </Fragment>
  )
}
const StaffOrder = (props: any) => {
  const [tables,setTables] = useState<Table[]>([])
  const [openMenu,setOpenMenu] = useState(false)
  const [billment,setBillMent] = useState<Billment>({all_price:0,price:0,coupon:"",currency_type:"",orders:[],table_name:'',tableId:""})
  const fetch = async () =>{ 
    const data = await TableService.listByCounter()
    setTables(data.data)
  }
  useEffect(()=>{
      fetch()
  },[])
  return (
    <Provider value={{
        tables,
        openMenu,
        setOpenMenu,
        billment,
        setBillMent
    }}>
    <Wrapper>
      {openMenu && (
        <Menu/>
      )}
      <RenderTable/>  
    </Wrapper>
    </Provider>
   
  );
};
export default StaffOrder;
