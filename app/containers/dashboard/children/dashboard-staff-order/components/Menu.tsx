import React, { Fragment, useContext, useEffect, useState,useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import {BsFillTrashFill} from 'react-icons/bs'
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import {RiSubtractLine} from 'react-icons/ri';
import { Context } from "../Context";
import MenuService from "../../../../../services/menu";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../../features/user/userSlice";
import { Order } from "../types";
import {convertToVnd} from '../../../../../utils'
import CustomerService from "../../../../../services/customer";
import CustomAlert from "../../../../../components/Alert";
import SelectTopping from "./SelectTopping";
import StaffService from "../../../../../services/staff";
import CustomerPayment from "./CustomerPayment";
import Coupon from "./Coupon";



const Cagtegory = styled.div`
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  padding-left: 10px;
  line-height: 40px;
  height: 40px;
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
    color: #1e90ff;
  }
`;
const IncrementInput = styled.input`
  text-align: center;
  border: none;
  border-bottom: 1px solid #3333;
  height: 39px !important;
  height: 100%;
  padding: 0;
  width:30%;
  bottom:0;
  &:focus {
    outline: none;
  }
  @media only screen and (min-width:1000px){
    height: 40px !important;
  }
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 40px;
  height: 40px;
`;
const P = styled.div`
  font-size:16px;
  
`
const NoteInput = styled.input`
  outline:none;
  &:focus { 
    outline:none;
  }
  font-size:13px;
  border:0;
`
const OrderItem = (props:Menu) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        marginBottom:"10px"
      }}
    >
      <div style={{ width: "auto" }}>
        <img
          style={{ height: "150px", width: "150px" }}
          src={props.image}
        />
      </div>
      <div
        style={{
          width: "60%",
          display: "flex",
          marginLeft:"2%",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <div>
        <P>{props.name}</P>
        </div>
        <div>Đơn giá: {convertToVnd(props.price)}</div>
        <div>
          <IncrementButton {...props} />
        </div>
      </div>
    </div>
  );
};
const useStyles = makeStyles(()=>({
    active: {
        backgroundColor:"#e6e6e6",
    },
    menu : {
        height:"70%",
    }
}))
const IncrementButton = (props) => {
    const {billment,setBillMent,setOrder,setOpenSelectTopping} = useContext(Context)
    const {menu} = useContext(MenuContext)
    
    const handleAddItem =() =>{       
      let orders= billment.orders
      if(props.toppings && props.options){
        setOpenSelectTopping(true)
        setOrder({...props,foodId:props.id,price:props.price})
      }else{
        const index =  orders.findIndex(o=> o.foodId === props.id)
        if(index>-1){
            orders.forEach(o=>{
              if(o.foodId === props.id){
                o.quantity+=1
                o.amount = o.price * o.quantity
              }
            })
        }else{
            orders = [...orders,{amount:props.price,index:billment.orders.length,name:props.name,foodId:props.id,price:props.price,quantity:1,stt:`${orders.length}`}]
        }
        setBillMent({...billment,orders,payment_info:{...billment.payment_info,total:billment.payment_info?.total + props.price,sub_total:billment.payment_info?.sub_total + props.price}})
        increaseCount("add")
      }
      
    }
    const increaseCount = (type) => {
        let _menu = menu
        _menu.forEach(m=>{
            if(m.id === props.id){
                type === "add" ? m.count+=1 : m.count-=1
            }
        })
    }
  
  return (
    <Fragment>
        <Button onClick={()=>handleAddItem()} style={{ borderRadius: "0",bottom:0, height: "40px" }} variant="outlined">
        <MdAdd fontSize={20} />
      </Button>
      <IncrementInput value={props.count} disabled />  
    </Fragment>
  );
};
type Category = {
    category:string,
}
type Menu = {
    id:number,
    name:string,
    price:number,
    status:boolean,
    image:string,
    group_id:number,
    options:string,
    toppings:string,
    count:number,    
}
type Data = { 
    name : string,
    menus : Menu[]
}

type IMenuContext = {
    menu : Menu[]
    data: Data[]
    setMenu : (menu:Menu[]) => void,
    setData: (dat:Data[]) => void
    selectedCategory:string
}
///

const MenuContext = React.createContext<IMenuContext>({
    menu:[],
    data: [],
    setMenu:()=>{},
    setData : () => {},
    selectedCategory :""
})
const MenuProvider = MenuContext.Provider

const Menu = () => {
  const {user} = useSelector(userSelector)
  const styles=  useStyles()
  const {  openMenu, setOpenMenu} = useContext(Context);
  const [categories,setCategories] = useState<Category[]>([])
  const [data,setData]  = useState<Data[]>([])
  const {billment,setBillMent,setOpenMergeTable,setOpenChangeTable,setOpenCancelOrder,setOpenScanCoupon,setOpenTypeCoupon} = useContext(Context)
  const [selectedCategory,setSelectedCategory] = useState("")
  const [menu,setMenu] = useState<Menu[]>([])
  const [messageBox,setMessagBox] = useState({open:false,message:"",type:""})

  const fetch = async () => {
    const response = await MenuService.getMenuByStoreID(47)
    setCategories([{category:"Tất cả"},...response.data.map(d=>({category:d.name}))])
    setData(response.data)
    initMenu(response.data)
    setSelectedCategory(response.data[0].name)
  };
  const initMenu =(data)=> {
    let d = data
    d.forEach(m=>{
        m.menus.forEach(_m=>{
            _m.count = 0
        })
    })
    setMenu(d[0].menus)
  }
  const active = (category) => {
    return category === selectedCategory ? styles.active : undefined
  }
  useEffect(() => {
      fetch()
  }, []);
  const handleSelect=  (category) =>{ 
      setSelectedCategory(category)
      if(category === "Tất cả"){
        return setMenu(data.map(d=> d.menus).flat())
      }
      let {menus} = data.filter(d => d.name === category)[0]
      setMenu(menus)
  }
  const handleCloseMenu = () => {
    setOpenScanCoupon(false)
    setOpenTypeCoupon(false)
    setBillMent({all_price:0,price:0,coupon:"",currency_type:"",orders:[],table_name:'',tableId:"",pmts:[],payment_info:{}})
    setOpenMenu(false)
  }
  const sumPrice = () => {
    let sum = 0
    billment.orders.forEach(o=>{      
      sum += o.amount 
    })
    return convertToVnd(sum)
  }
  const handleSendOrder = async () => {
    if(billment.orders.length === 0 ){
      setMessagBox({open:true,message:"Vui lòng chọn món ăn trước khi đặt món !",type:"warning"})      
      return 
    }
    if(billment.orders.every(o=>o.quantity == 0)){
      setMessagBox({open:true,message:"Vui lòng chọn món ăn trước khi đặt món !",type:"warning"})      
      return 
    }
    let orders = billment.orders.filter(o=>o.quantity !== 0)
    CustomerService.sendOrder({customerId:null,customerName:null, tableId:billment.tableId,userType:"staff",staffId:user.staff_info.pk,storeId:user.staff_info.fields.store_id.toString(),request:null,staffName:user.staff_info.fields.name,orders}).then(async()=>{
        setMessagBox({open:true,message:"Đặt món thành công vui lòng chờ đợi !",type:"info"})      
        resetData()
        if(billment.status === 0){
            const {payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
            setBillMent({...billment,status:1,payment_info,pmts,orders:[]})
        }

      }).catch(err=>{
        setMessagBox({open:true,message:err.toString(),type:"error"})      
      })
  }
  const resetData = () => {
      let _menu = menu 
      _menu.forEach(m=>{
        m.count = 0
      })
      setBillMent({...billment,orders:[]})
      setMenu(menu)
  }
  const handleCloseMessageBox =() =>{
    setMessagBox({open:false,message:"",type:"info"})
  }
  const updateAmount = (order:Order,type) =>{ 
    let orders = billment.orders  
    if(type === "sub"){
      orders.forEach(o=>{
        if(o.foodId === order.foodId && o.quantity >=1  && order.index === o.index){
            o.quantity -= 1
            o.amount -= o.price
            setBillMent({...billment,orders,payment_info:{...billment.payment_info,total:billment.payment_info?.total - order.price ,sub_total:billment.payment_info?.sub_total-order.price}})
        }
      })
    }  
    if(type === "add"){
      orders.forEach(o=>{
        if(o.foodId === order.foodId && order.index === o.index){
            o.quantity += 1
            o.amount += o.price

        }
      })
      setBillMent({...billment,orders,payment_info:{...billment.payment_info,total:billment.payment_info?.total + order.price,sub_total:billment.payment_info?.sub_total+order.price}})
    }
    let _menu = menu
        _menu.forEach(m=>{
            if(m.id === order.foodId){
              if(type === "add"){
                m.count+=1
              }else{
                if(m.count>=1){
                  m.count-=1
                }
              }
              
            }
    })
  } 
  const cleanTable = async() =>{
      StaffService.cleanTable({tableId:Number(billment.tableId)}).then(()=>{
        setOpenMenu(false)
      }).catch(err=>{
        const {mess} = JSON.parse(err.request.response)
        setMessagBox({open:true,message:mess,type:"error"}) 
      })
      
  }
  const removePromotionInOrder =(promotion) =>{
    console.log(promotion)
  }
  const caculatorTotal = useCallback(()=>{
    let rate_discount = billment.payment_info?.rate_discount
    return convertToVnd(billment.payment_info?.sub_total * Number.parseFloat((100-rate_discount)/100))
  },[billment.payment_info?.rate_discount,billment.payment_info?.total])
  return (
      <MenuProvider value={{
          menu,
          setMenu,
          setData,
          data,
          selectedCategory
      }}>
            <Dialog
      open={openMenu}
      aria-labelledby="simple-dialog-title"
      fullScreen
      onClose={handleCloseMenu}
    >
      <DialogTitle
        style={{ color: "black !important" }}
        id="simple-dialog-title"
      >
        Order
      </DialogTitle>
      <DialogContent>
        <Divider style={{ marginBottom: "2%" }} />
        <Grid spacing={3} container >
          <Grid item xs={2}  style={{borderRight:"1px solid #333",height:"100vh"}} >
              {categories.map((c,index)=>(
                <Cagtegory key={index} className={active(c.category)} onClick={()=>handleSelect(c.category)}>{c.category}</Cagtegory>
            ))}  
          </Grid>
          <Grid item xs={4}  style={{borderRight:"1px solid #333",height:"100vh"}}>
            {menu.map((m,index)=> ( 
                <OrderItem key={index}  {...m} />
            ))}
          </Grid>
          <Grid item xs={3} style={{borderRight:"1px solid #333",height:"100vh"}}>
                {billment.orders.map((o)=>( 
                  <Fragment>
                  <div style={{display:'flex',alignItems:'center'}}>
                    <IconButton onClick={()=>updateAmount(o,"add")} size="small" style={{backgroundColor:"green",color:"white",height:"30px",borderRadius:"0"}} disableFocusRipple disableRipple>
                        <MdAdd fontSize={25}/>
                    </IconButton>
                    <div style={{color:'red',marginLeft:'5px'}}>
                      <b>{o.quantity}</b>
                    </div>
                    <IconButton  onClick={()=>updateAmount(o,"sub")} size="small" style={{backgroundColor:"#e0e0e0",marginLeft:"5px",color:"white",height:"30px",borderRadius:"0"}} disableFocusRipple disableRipple>
                        <RiSubtractLine fontSize={25}/>
                    </IconButton>
                    <p style={{marginLeft:"5px"}}>{o.name}</p>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <NoteInput  placeholder="Thêm ghi chú..."/>                    
                    <small><b>{convertToVnd(o.amount)}</b></small>
                  </div>
                  <Divider/>
                  </Fragment>
                ))}
                <Text>
                  Tổng tiền: {sumPrice()}
                </Text>
                <Grid container style={{width:'100%'}} alignItems="center" justify="center">
                <Grid item xs={6}>
                    <Button onClick={handleSendOrder}  variant="outlined">Gọi món</Button>
                </Grid>
            </Grid>
          </Grid>
          {/* style={{position:"fixed",width:"40%",paddingTop:"0",marginLeft:"60%"}} */}
          <Grid item xs={3}  >
            <Text><b>Bàn: </b> {billment.payment_info?.table_name || billment.table_name}</Text>
            <Text><b>Thành tiền:</b>{convertToVnd(billment.payment_info.total)}</Text>
            <Text><b>Tổng giảm giá: </b> {convertToVnd(billment.payment_info?.sub_total - billment.payment_info?.total)}</Text>
            <Text><b>Tổng tiền món: </b> {convertToVnd(billment.payment_info?.sub_total || 0)}</Text>
            <CustomerPayment/>
            <Coupon/> 
            <Text>Phí dịch vụ, phụ thu:</Text>
            <Text>Loại tiền:</Text>
            <Text>Khuyến mãi đang áp dụng:</Text>
            <ul>
              {billment.pmts?.filter(p=>p.quantity_apply !==0).map((p,index)=>(
                // <BsFillTrashFill onClick={()=>removePromotionInOrder(p)}/>
                <li key={index}>{p.quantity_apply} x {p.name} </li>
              ))}
            </ul>
            <Text>Chi tiết:</Text>
            <Grid container style={{width:'100%'}} alignItems="center" justify="center">
                <Grid item xs={6}>
                    <Button  variant="outlined">Thanh toán</Button>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCloseMenu}>
          Quay lại
        </Button>
        <Button variant="contained"  onClick={()=> setOpenMergeTable(true)}>Gộp bàn</Button>
          {billment.status !== 0 && (
            <>
            <Button variant="contained" onClick={()=>setOpenCancelOrder(true)} >Hủy order</Button>
          <Button variant="contained">Hủy món</Button>
          <Button variant="contained" onClick={cleanTable}>Dọn bàn</Button>
          
          <Button variant="contained" onClick={()=>setOpenChangeTable(true)}>Đổi bàn</Button>
            </>
          )}
      </DialogActions>
    </Dialog>
    <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
      </MenuProvider>
    
  );
};

export default React.memo(Menu)
