import {
  makeStyles,
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import TableService from '../../../../services/tables';
import { Context, Provider } from './Context';
import { Billment, Order, Table } from './types';
import Menu from './components/Menu';
import StaffService from '../../../../services/staff';
import SelectTopping from './components/SelectTopping';
import { useSelector } from 'react-redux';
import { userSelector } from '../../../../features/user/userSlice';
import {counterSocket} from '../../../../utils/socket'
import MergeTable from './components/MergeTable';
import ChangeTable from './components/ChangeTable';
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
  text-align:center;
  background-color: green;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    background-color: #e8e8e8;
    color:black;
  }  
`;
const useStyles = makeStyles(()=>({
  not_active : {
    backgroundColor:"#FF6347",
    color:"white"
  }
}))
const RenderTable = () =>{ 
  const styles = useStyles()  
  const {tables,setOpenMenu,billment,setBillMent} = useContext(Context)
  const openMenu = async (table) =>{
    const {payment_info,pmts} = await StaffService.getPaymentInfo(table.pk)
    if(payment_info.length === 0){
      setBillMent({...billment,table_name:table.fields.name,status:table.fields.status,tableId:table.pk.toString(),payment_info:{cash:0,sub_total:0,total:0},pmts:[]})
      setOpenMenu(true)
      return
    }
    setBillMent({...billment,table_name:table.fields.name,status:2,tableId:table.pk.toString(),payment_info,pmts})
    setOpenMenu(true)
  }
  const isActive = (status) => {
    return status === 0 ? styles.not_active : undefined
  }
  return ( 
    <Fragment>
        {tables.map((table,index)=> ( 
          <Box className={isActive(table.fields.status)} onClick={()=>openMenu(table)} key={index}>
            {table.fields.name}<br/>
            {table.fields.parent_name  !== null  && (
              "(Gộp " + table.fields.parent_name + ")"
            )}
            {/* {table.fields.parent_name !== "" & ( 
                "Gộp bàn" + table.fields.parent_name
            )} */}
          </Box>
      ))}
    </Fragment>
  )
}
const StaffOrder = () => {
  const {user:{staff_info}} = useSelector(userSelector)
  // const _counterSocket = counterSocket(staff_info.fields.store_id | 47)
  const [tables,setTables] = useState<Table[]>([])
  const [openMenu,setOpenMenu] = useState(false)
  const [openMergeTable,setOpenMergeTable] =useState(false)
  const [openSelectTopping,setOpenSelectTopping] = useState(false)
  const [selectedOrder,setOrder] = useState<Order | null>(null)
  const [openChangeTable,setOpenChangeTable] = useState(false)
  const [billment,setBillMent] = useState<Billment>({all_price:0,price:0,coupon:"",currency_type:"",orders:[],table_name:'',tableId:"",payment_info:{total:0,sub_total:0}})
  const fetch = async () =>{ 
    const data = await TableService.listByCounter()
    setTables(data.data)
  }
  useEffect(()=>{
      fetch()
      // _counterSocket.onmessage = function(){
      //   fetch()
      // }
  },[])
  useEffect(()=>{
    fetch()
  },[openMergeTable,openMenu])
  return (
    <Provider value={{
        tables,
        openMenu,
        setOpenMenu,
        billment,
        setBillMent,
        selectedOrder,
        setOrder,
        openSelectTopping,
        setOpenSelectTopping,
        openMergeTable,
        setOpenMergeTable,
        openChangeTable,
        setOpenChangeTable
    }}>
       <Wrapper>
      {openMenu && (
        <Menu/>
      )}
      {( openSelectTopping ) &&  (
        <SelectTopping {...selectedOrder}  />
      )}      
      {openMergeTable && (
        <MergeTable />
      )}      
      {
        openChangeTable && (
          <ChangeTable/>
        )
      }
      <RenderTable/>  
    </Wrapper>
    </Provider>
   
  );
};
export default StaffOrder;
