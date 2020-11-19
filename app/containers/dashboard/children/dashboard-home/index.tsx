import React, { useEffect, useState, Fragment, useContext } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Grid, makeStyles } from "@material-ui/core";
import { GiKnifeFork, GiCancel } from "react-icons/gi";
import OrderService from "../../../../services/order";
import CustomAlert from "../../../../components/Alert";
import { manageOrderSocket }  from "../../../../utils/socket"
import {Order, Orders} from './types'
const electron = require('electron') 
const BrowserWindow = electron.remote.BrowserWindow
const Store = require('electron-store')
const store = new Store()
import { DashBoarHomeContext, Provider } from "./Context";
import Sound  from '../../../../assets/mp3/onmessage.mp3'
import { useSelector } from "react-redux";
import { userSelector } from "../../../../features/user/userSlice";
import { useHistory } from "react-router";
import { DASHBOARD_BILL_HISTORY, DASHBOARD_ORDER_HISTORY } from "../../../../constants/routes";
import OrderDetail from "../../../../components/OrderDetail";
import _ from 'lodash'
import StaffService from "../../../../services/staff";
import { ipcRenderer } from "electron";
import { convertToVnd,parseKitchenBillToHtml } from "../../../../utils";
const Wrapper = styled.div`
  padding: 5%;
`;
const List = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Item = styled.div`
  width: auto;
  color: black;
  font-size: 20px;
`;

const RenderList = ()  => {
    const {orders,selected,setOrders} = useContext(DashBoarHomeContext)
    const [messageBox,setMessagBox] = useState({open:false,message:"",type:""})

    const handleCancleOrderInOrdersCreated = async(order) =>{ 
      OrderService.cancleOrder({id:order.orderId,type:"order",status:"canceled"}).then(()=>{
        setMessagBox({open:true,message:"Hủy Order thành công!",type:"success"})
        setOrders({...orders,orders_created:[...orders.orders_created.filter(o=> o.orderId !== order.orderId)]})
    }).catch(err=>{
        setMessagBox({open:true,message:err.toString(),type:"error"})
    })   
    }
    const handleCancleOrder =  async (order:Order) =>{ 
        OrderService.cancleOrder({id:order.orderId,type:"order",status:"canceled"}).then(()=>{
            setMessagBox({open:true,message:"Hủy Order thành công!",type:"success"})
            setOrders({...orders,orders_approved:[...orders.orders_approved.filter(o=> o.orderId !== order.orderId)]})
        }).catch(err=>{
            setMessagBox({open:true,message:err.toString(),type:"error"})
        })   
    }
    const handleUpdateToFinish  = async (order:Order) => {
        OrderService.updateStatusOrderToFinish({id:order.orderId}).then(()=>{
            setMessagBox({open:true,message:"Hủy Order thành công!",type:"success"})    
            setOrders({...orders,orders_finish:[...orders.orders_finish,order],orders_done:[...orders.orders_done.filter(o => o.orderId !== order.orderId)]})
        }).catch(err=>{ 
            setMessagBox({open:true,message:err.toString(),type:"error"})
        })
    }
    const handleUpdateToDone = async (order:Order) =>{ 
            OrderService.updateStatusOrderToDone({id:order.orderId}).then(()=>{                
                setMessagBox({open:true,message:"Cập nhật Order thành công!",type:"success"})    
                setOrders({...orders,orders_done:[...orders.orders_done,order],orders_doing:[...orders.orders_doing.filter(o => o.orderId !== order.orderId)]})
            }).catch((err)=>{
                setMessagBox({open:true,message:err.toString(),type:"error"})
            })
    }
    const handleUpdateToDoing = async (order:Order) =>{ 
        OrderService.updateStatusOrderToDoing({id:order.orderId}).then(()=>{
            setOrders({...orders,orders_doing:[...orders.orders_doing,order],orders_approved:[...orders.orders_approved.filter(o=> o.orderId !== order.orderId)]})
            setMessagBox({open:true,message:"Cập nhật Order thành công!",type:"success"})
        }).catch((err)=>{
            setMessagBox({open:true,message:err.toString(),type:"error"})
        })
    }
    const handleCloseMessageBox =() =>{
        setMessagBox({...messageBox,open:false})
    } 
    const handleUpdateCreatedOrder = order =>{
      if(order.type === "cancel_order"){
        OrderService.confirmCancelOrder({tableId:order.table_id,order_id:order.orderId}).then(()=>{
          setMessagBox({open:true,message:"Hủy Order thành công!",type:"success"})
          setOrders({...orders,orders_created:[...orders.orders_created.filter(o=> o.orderId !== order.orderId)]})
        })
        return
      }
      if(order.type === "cancel_food"){
        OrderService.confirmCancelFood({tableId:order.table_id,order_id:order.orderId}).then(()=>{
          setMessagBox({open:true,message:"Hủy món thành công!",type:"success"})
          setOrders({...orders,orders_created:[...orders.orders_created.filter(o=> o.orderId !== order.orderId)]})
        })
        return 
      }
      if(order.type === "order"){
        StaffService.updateOrderStatusToApproved({id:order.orderId,phoneNumber:null}).then(()=>{
          setMessagBox({open:true,message:"Xác nhận Order thành công!",type:"success"})     
          setOrders({...orders,orders_approved:[...orders.orders_approved,order],orders_created:[...orders.orders_created.filter(o=> o.orderId !== order.orderId)]})
          const {autoPrintWhenAcceptOrder } = store.get("kitchenBill")
          if(autoPrintWhenAcceptOrder){
            const contentHtml = parseKitchenBillToHtml(order)
            ipcRenderer.send("print",{contentHtml,type:"printKitchenBill"})
          }     
        })
      }
    }
  return (
    <Fragment >
      {orders[selected].map((order: Order,index) => (
            <Grid style={{ paddingTop: "2%", paddingBottom: "2%",borderBottom:"1px solid #e6e6e6" }} container key={index}>
              <Grid item xs={6}>            
              <OrderDetail {...order} />
          </Grid>
          <Grid item xs={6}>
          {selected=="orders_created" && (
                <Button onClick={()=>handleUpdateCreatedOrder(order)} style={{backgroundColor:"#444444",color:"white"}} variant="contained">
                Xác nhận <GiKnifeFork fontSize={20} />
              </Button>
            )}
            <br/>
            {selected=="orders_created" && (
              <Button style={{marginTop:"3%",backgroundColor:"#444444",color:"white"}} onClick={()=>handleCancleOrderInOrdersCreated(order)}  variant="contained">
                Hủy <GiKnifeFork fontSize={20} />
              </Button>
            )}
            {selected=="orders_approved" && (
                <Button onClick={()=>handleUpdateToDoing(order)} style={{backgroundColor:"#444444",color:"white"}} variant="contained">
                Làm <GiKnifeFork fontSize={20} />
              </Button>
            )}
            {selected=="orders_doing" && (
                <Button onClick={()=>handleUpdateToDone(order)}  style={{backgroundColor:"#444444",color:"white"}} variant="contained">
                Xong <GiKnifeFork fontSize={20} />
              </Button>
            )}
            <br />
            {selected=="orders_done"  && ( 
                     <Button
                        onClick={()=>handleUpdateToFinish(order)}
                       style={{ marginTop: "2%" ,backgroundColor:"#444444",color:"white"}}                       
                       variant="contained"
                     >
                       Giao
                     </Button>                  
            )}
            {selected=="orders_approved" && ( 
                 <Button
                 onClick={()=>handleCancleOrder(order)}
                   style={{marginTop:"3%",backgroundColor:"#444444",color:"white"}}
                   variant="contained"
                 >
                   Hủy <GiCancel fontSize={20} />
                 </Button>  
            ) }
           
            
          </Grid>
            </Grid>
      ))}
      <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
    </Fragment>
  );
};
const useStyles = makeStyles(() => ({
  active: {
    backgroundColor: "#e6e6e6",
  },
}));
const DashboardHome = (props: any) => {
  const {user:{staff_info}} = useSelector(userSelector)
  const styles = useStyles();
  const history  = useHistory()
  const [selected, setSelected] = useState("orders_approved");
  const socket = manageOrderSocket(staff_info.fields.store_id)
  const [orders, setOrders] = useState<Orders>({
    orders_created: [],
    orders_approved: [],
    orders_doing: [],
    orders_done: [],
    orders_finish: [],
    orders_canceled: [],
  });
  const labelOrder = {
    orders_approved: "Bếp",
    orders_doing: "Đang làm",
    orders_done: "Đã xong",
    orders_finish: "Hoàn thành",
    orders_canceled: "Đã hủy",
    orders_created: "Đã nhận",
  };
  const fetch = async () => {
    const response = await OrderService.getOrderHistory();
    setOrders(response.data.data);
  };
  const printBill = order =>{
      const {autoPrintStaffOrder } = store.get("kitchenBill")
      if(autoPrintStaffOrder){
        const contentHtml = parseKitchenBillToHtml(order)
        ipcRenderer.send("print",{contentHtml,type:"printKitchenBill"})
      }  
  }
  useEffect(() => {
      fetch() 
      socket.onmessage = async function(message){   
          setTimeout(async()=>{  
            fetch()                
            let sound = new Audio(Sound)
            await sound.play()
            const order = JSON.parse(message.data)
            printBill(order.text)
          },1000)
      }       
  }, []);    
  const handleSelect = (status) => {
    setSelected(status);
  };
  const toggleActive = (status) => {
    return status === selected ? styles.active : undefined;
  };
  return (
   <Provider value={{
       orders,
       setOrders,
       selected
   }}>
        <Wrapper {...props}>
      <List style={{ marginBottom: "2%" }}>
        <Item>Quản lý gọi món</Item>
        <Item style={{ width: "40%", display: "flex" }}>
          <Item style={{ width: "50%" }}>
          <Button style={{backgroundColor:"#444444",color:"white"}} variant="contained" onClick={()=>history.push(DASHBOARD_BILL_HISTORY)}>
              Lịch sử Bill
            </Button>
          </Item>
          <Item style={{ width: "50%" }}>
            <Button style={{backgroundColor:"#444444",color:"white"}} variant="contained" onClick={()=>history.push(DASHBOARD_ORDER_HISTORY)}>
              Lịch sử Order
            </Button>
          </Item>
        </Item>
      </List>
      <Divider />
      <List style={{ justifyContent: "flex-start" }}>
        {Object.keys(orders).map((key,index) => (
          <Item className={toggleActive(key)} style={{ fontSize: "16px" }} key={index}>
            <Button  onClick={() => handleSelect(key)}>
              {labelOrder[key]} {(labelOrder[key] !== "Hoàn thành" && labelOrder[key] !== "Đã hủy")  && ("("+orders[key].length+")")}              
            </Button>
          </Item>
        ))}
      </List>
      <Divider />
      <RenderList  />     
    </Wrapper>
  
   </Provider>
  );
};

export default React.memo(DashboardHome);
