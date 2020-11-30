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
import {counterSocket,notificationSocket} from '../../../../utils/socket'
import MergeTable from './components/MergeTable';
import ChangeTable from './components/ChangeTable';
import CancelOrder from './components/CancelOrder';
import Sound  from '../../../../assets/mp3/onmessage.mp3'
import { caculateAllValue, parseBillMentToHtml } from '../../../../utils';
import CancelFood from './components/CancelFood';
import { ipcRenderer } from 'electron';
const Store = require("electron-store")
const store = new Store()


const Wrapper = styled.div`
  padding: 5%;
  flex-wrap: wrap;
  flex-flow: row wrap;
  display: flex;
  margin-top:80px;
`;

const Box = styled.div`
  border-radius: 10px;
  width: 100px;
  height: 100px;
  margin: 5px;
  text-align:center;
  background-color: #3a3a3a;
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
    backgroundColor:"#999999",
    color:"white"
  }
}))
const RenderTable = () =>{ 
  const styles = useStyles()  
  const {tables,setOpenMenu,billment,setBillMent} = useContext(Context)
  const openMenu = async (table) =>{
    const {payment_info,pmts} = await StaffService.getPaymentInfo(table.pk)
    if(payment_info.length === 0){
      setBillMent({...billment,table_name:table.fields.name,status:table.fields.status,tableId:table.pk.toString(),payment_info:{rate_discount:0,cash:0,sub_total:0,total:0,service:[],foods:[]},pmts:[]})
      setOpenMenu(true)
      return
    }
    let discount_amount = caculateAllValue({payment_info,pmts})
    setBillMent({...billment,table_name:table.fields.name,status:2,tableId:table.pk.toString(),payment_info:{...payment_info,total:payment_info.total,discount_amount},pmts})
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
          </Box>
      ))}
    </Fragment>
  )
}
const StaffOrder = () => {
  const {user:{staff_info}} = useSelector(userSelector)
  const _counterSocket = counterSocket(staff_info.fields.store_id)
  const _notificationSocket = notificationSocket(staff_info.fields.store_id)
  const [tables,setTables] = useState<Table[]>([])
  const [openMenu,setOpenMenu] = useState(false)
  const [openMergeTable,setOpenMergeTable] =useState(false)
  const [openSelectTopping,setOpenSelectTopping] = useState(false)
  const [openCancelOrder,setOpenCancelOrder] = useState(false)
  const [selectedOrder,setOrder] = useState<Order | null>(null)
  const [openChangeTable,setOpenChangeTable] = useState(false)
  const [paidOrder,setPaidOrder] = useState({})
  const [ openScanCoupon,setOpenScanCoupon] = useState(false)
  const [openTypeCoupon,setOpenTypeCoupon] = useState(false)
  const [openCancelFood ,setOpenCancelFood] = useState(false)
  const [billment,setBillMent] = useState<Billment>({all_price:0,price:0,coupon:"",currency_type:"",orders:[],table_name:'',tableId:"",payment_info:{foods:[],service:[],total:0,sub_total:0}})
  
  const fetch = async () =>{ 
      const data = await TableService.listByCounter()
      setTables(data.data)
  }  
  const updateTable = async (tableID,payment_id) =>{
    if(!billment.payment_info.table_id){
      return
    }
    if(payment_id){
      return
    }
    if(openMenu && (billment.payment_info.table_id == tableID || tableID == billment.tableId)){
      const {payment_info,pmts} = await StaffService.getPaymentInfo(tableID)
      let allValue = caculateAllValue({payment_info,pmts})
      allValue = Math.max(0,payment_info.sub_total - allValue)
      setBillMent({...billment,payment_info:{...payment_info,total:allValue},pmts,orders:[]})  
    }
  }
  useEffect(()=>{
    fetch()
  },[])
  useEffect(()=>{
      _counterSocket.onmessage = async function(message){
          const payment_id = JSON.parse(message.data).text.payment_id
          const tableID = JSON.parse(message.data).text.tables[0].pk
          const createdBy = JSON.parse(message.data).text.created_by
          if(createdBy != staff_info.pk){
            updateTable(tableID,payment_id)
          }
          const { autoPrintWhenStaffPayment } = store.get("orderBill")
          if(autoPrintWhenStaffPayment && createdBy !== staff_info.pk){
              const {payment_id} = JSON.parse(message.data).text
              if(!payment_id){
                return
              }
              const data = await StaffService.getBillMentInfo(payment_id)
              const contentHtml = parseBillMentToHtml(data)
              ipcRenderer.send('print',{contentHtml,type:"printKitchenBill"})
          }
      }
      _notificationSocket.onmessage = async function(){
          const audio = new Audio(Sound)
          await audio.play()       
      }
      return (()=>{
        _notificationSocket.close()
      })
  },[billment,openMenu,paidOrder])
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
        setOpenChangeTable,
        openCancelOrder,
        setOpenCancelOrder,
        openScanCoupon,
        setOpenScanCoupon,
        openTypeCoupon,
        setOpenTypeCoupon,
        setOpenCancelFood,
        openCancelFood,
        paidOrder,
        setPaidOrder
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
      {openCancelOrder && (
        <CancelOrder/>
      )}
      {openCancelFood && (
          <CancelFood/>
      )}
      <RenderTable/>  
    </Wrapper>
    </Provider>
   
  );
};
export default React.memo(StaffOrder);
