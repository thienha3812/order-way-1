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
import { DashBoarHomeContext, Provider } from "./Context";
import Sound  from '../../../../assets/mp3/onmessage.mp3'
import { useSelector } from "react-redux";
import { userSelector } from "../../../../features/user/userSlice";
import { useHistory } from "react-router";
import { DASHBOARD_BILL_HISTORY, DASHBOARD_ORDER_HISTORY } from "../../../../constants/routes";
import OrderDetail from "../../../../components/OrderDetail";

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
            setMessagBox({open:true,message:"Cập nhật Order thành công!",type:"success"})    
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
            setMessagBox({open:true,message:"Cập nhật Order thành công!",type:"success"})
        }).catch((err)=>{
            setMessagBox({open:true,message:err.toString(),type:"error"})
        })
        setOrders({...orders,orders_doing:[...orders.orders_doing,order],orders_approved:[...orders.orders_approved.filter(o=> o.orderId !== order.orderId)]})
    }
    const handleCloseMessageBox =() =>{
        setMessagBox({open:false,message:"",type:messageBox.type})
    } 
  return (
    <Fragment >
      {orders[selected].map((order: Order,index) => (
            <Grid style={{ paddingTop: "2%", paddingBottom: "2%",borderBottom:"1px solid #e6e6e6" }} container key={index}>
                      <Grid item xs={6}>            
            <OrderDetail {...order} />
          </Grid>
          <Grid item xs={6}>
            {selected=="orders_approved" && (
                <Button onClick={()=>handleUpdateToDoing(order)} color="primary" variant="contained">
                Làm <GiKnifeFork fontSize={20} />
              </Button>
            )}
            {selected=="orders_doing" && (
                <Button onClick={()=>handleUpdateToDone(order)} color="primary" variant="contained">
                Xong <GiKnifeFork fontSize={20} />
              </Button>
            )}
            <br />
            {selected=="orders_done"  && ( 
                     <Button
                        onClick={()=>handleUpdateToFinish(order)}
                       style={{ marginTop: "2%" }}
                       color="secondary"
                       variant="contained"
                     >
                       Giao
                     </Button>                  
            )}
            {selected=="orders_approved" && ( 
                 <Button
                 onClick={()=>handleCancleOrder(order)}
                   style={{ marginTop: "2%" }}
                   color="secondary"
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
  useEffect(() => {
  //   let win = BrowserWindow.getFocusedWindow() 
  //   var options = { 
  //     silent: true, 
  //     printBackground: true, 
  //     color: false, 
  //     margin: { 
  //         marginType: 'printableArea'
  //     }, 
  //     pageSize:'A5',
  //     landscape: false, 
  //     pagesPerSheet: 1, 
  //     collate: false, 
  //     copies: 1, 
  //     header: 'Header of the Page', 
  //     footer: 'Footer of the Page'
  // } 
  //   const printers  = win?.webContents.getPrinters()
  //   console.log(printers)
  //   win?.webContents.print(options,(success,fail)=>{
  //     if(!success)console.log(fail)
  //   })
    fetch();    
  }, []);  
  useEffect(()=>{
    socket.onmessage = function(){   
      let sound = new Audio(Sound)    
      sound.play()
      fetch()      
    }   
  },[orders])  
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
          <Button color="primary" variant="contained" onClick={()=>history.push(DASHBOARD_BILL_HISTORY)}>
              Lịch sử Bill
            </Button>
          </Item>
          <Item style={{ width: "50%" }}>
            <Button color="primary" variant="contained" onClick={()=>history.push(DASHBOARD_ORDER_HISTORY)}>
              Lịch sử Order
            </Button>
          </Item>
        </Item>
      </List>
      <Divider />
      <List style={{ justifyContent: "flex-start" }}>
        {Object.keys(orders).map((key,index) => (
          <Item className={toggleActive(key)} style={{ fontSize: "16px" }} key={index}>
            <Button onClick={() => handleSelect(key)}>
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
