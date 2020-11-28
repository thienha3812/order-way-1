import React, { Fragment, useContext, useEffect, useState,useCallback, useRef, useMemo } from "react";
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
import {caculateAllValue,parseInvoiceBillToHtml,parseBillMentToHtml, convertToVnd} from '../../../../../utils'
import CustomerService from "../../../../../services/customer";
import CustomAlert from "../../../../../components/Alert";
import {FaRegEdit} from 'react-icons/fa';
import StaffService from "../../../../../services/staff";
import CustomerPayment from "./CustomerPayment";
import Coupon from "./Coupon";
import Service from "./Service";
import Currency from "./Currency";
import { ipcRenderer } from "electron";
import Store from 'electron-store'
import ChangePriceDialog from "./ChangePrice";
import ChangeQuantityDialog from "./ChangeQuantity";
const store = new Store()


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
  height: 30px;
  padding: 0;
  width:30%;
  bottom:0;
  &:focus {
    outline: none;
  }
  
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 40px;
  height: 40px;
`;
const P = styled.div`
  font-size:14px;
  
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
          style={{ height: "80px", width: "80px" }}
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
        <P><b>{props.name}</b></P>
        </div>
        <div><P>Đơn giá: {convertToVnd(props.price)}</P></div>
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
                o.can_edit_price = props.can_edit_price
                o.can_edit_quantity = props.can_edit_quantity
                o.note = ""
              }
            })
        }else{
            orders = [...orders,{amount:props.price,index:billment.orders.length,name:props.name,foodId:props.id,price:props.price,quantity:1,stt:`${orders.length}`,can_edit_quantity:props.can_edit_quantity,can_edit_price:props.can_edit_price,note:props.note}]
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
      <IconButton onClick={()=>handleAddItem()}size="small" style={{backgroundColor:"green",color:"white",height:"30px",borderRadius:"0"}} disableFocusRipple disableRipple>
                        <MdAdd fontSize={25}/>
        </IconButton>
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
  const {  openMenu, setOpenMenu,setPaidOrder} = useContext(Context);
  const [isLoading,setLoading] = useState(false)
  const [categories,setCategories] = useState<Category[]>([])
  const [data,setData]  = useState<Data[]>([])
  const {billment,setBillMent,setOpenCancelFood,setOpenMergeTable,setOpenChangeTable,setOpenCancelOrder,setOpenScanCoupon,setOpenTypeCoupon} = useContext(Context)
  const [selectedCategory,setSelectedCategory] = useState("")
  const [menu,setMenu] = useState<Menu[]>([])
  const [messageBox,setMessagBox] = useState({open:false,message:"",type:""})
  const [selectedOrder,setSelectedOrder] = useState({})
  const [changePriceDialog,setChangePriceDialog] = useState(false)
  const [changeQuantityDialog,setChangeQuantityDialog] = useState(false)
  const fetch = async () => {
    const response = await MenuService.getMenuByStoreID(47)
    setCategories([{category:"Tất cả"},...response.data.map(d=>({category:d.name}))])
    setData(response.data)
    initMenu(response.data)
    setSelectedCategory("Tất cả")
  };
  const initMenu =(data)=> {
    let d = data
    d.forEach(m=>{
        m.menus.forEach(_m=>{
            _m.count = 0
        })
    })
    setMenu(d.map(d=> d.menus).flat())
    
  }
  const active = (category) => {
    return category === selectedCategory ? styles.active : undefined
  }
  useEffect(() => {
      fetch()
  }, []);  
  const handleSelect = useCallback((category)=>{
      setSelectedCategory(category)
      if(category === "Tất cả"){
        return setMenu(data.map(d=> d.menus).flat())
      }
      let {menus} = data.filter(d => d.name === category)[0]
      setMenu(menus)
  },[selectedCategory])
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
    setLoading(true)
    if(billment.orders.length === 0 ){
      setMessagBox({open:true,message:"Vui lòng chọn món ăn trước khi đặt món !",type:"warning"})      
      return 
    }
    if(billment.orders.every(o=>o.quantity == 0)){
      setMessagBox({open:true,message:"Vui lòng chọn món ăn trước khi đặt món !",type:"warning"})      
      return 
    }
    let orders = billment.orders.filter(o=>o.quantity !== 0)
    orders.forEach((o)=>{
      if(o.note !== ""){
        o.name = o.name  + "(Note:" + o.note + ")" 
      }      
    })
    CustomerService.sendOrder({customerId:null,customerName:null, tableId:billment.tableId,userType:"staff",staffId:user.staff_info.pk,storeId:user.staff_info.fields.store_id.toString(),request:null,staffName:user.staff_info.fields.name,orders}).then(async()=>{
        setMessagBox({open:true,message:"Đặt món thành công vui lòng chờ đợi !",type:"info"})      
        resetData()
        let {payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
        if(billment.status === 0){
            setBillMent({...billment,status:1,payment_info,pmts,orders:[]})
        }else{
          let allValue = caculateAllValue({payment_info,pmts})
          allValue = Math.max(0,payment_info.sub_total - allValue)          
          payment_info.total = allValue
          await StaffService.updatStoreOrderInfo({...payment_info,promotionId:pmts})
          setBillMent({...billment,payment_info:{...payment_info,total:allValue},pmts,orders:[]})
        }
      }).catch(err=>{
        setMessagBox({open:true,message:err.toString(),type:"error"})      
      })
    setLoading(false)
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
    setMessagBox({...messageBox,open:false})
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
  const caculateValueForPromotion = promotion =>{ 
    let sub_total = billment.payment_info?.sub_total
    if(promotion.type === "discount"){
        return sub_total * (Number.parseInt(promotion.discount_percent*promotion.quantity_apply)/100)
    }
    if(promotion.type === "voucher"){
        return Number.parseFloat(promotion.value_of_voucher * promotion.quantity_apply)
    }
    if(promotion.type === "discount_with_max_value"){
      let value = 0
        if(sub_total>= promotion.discount_on_amount){
          let discountOnPercent = (promotion.discount_percent/100) * sub_total
          value +=  Math.min(discountOnPercent,promotion.max_discount) * promotion.quantity_apply
        }
      return value
    }
    if(promotion.type === "free_item"){
        let value = 0
        let foods = billment.payment_info?.foods
        const current_apply = promotion.quantity_apply
        const sortFollowAmount = foods?.filter(f=> f.foodId == promotion.item_free).sort((a,b)=> a.price < b.price)
        let applied = 0
        if(sortFollowAmount?.length > 0){
          sortFollowAmount.forEach((food)=>{
            value += Math.min(current_apply - applied,food.quantity) * food.price
            applied += Math.min(current_apply - applied,food.quantity)
          })
        }
        return value
    }
    return 0
  }
  const removePromotionInOrder =(promotion) =>{
    const valueDecrease = caculateValueForPromotion(promotion)
      let pmts = billment.pmts.filter(p=> p.id !== promotion.id)
      let payment_info = billment.payment_info
      StaffService.updatStoreOrderInfo({
        address: payment_info?.address,
            bill_number:payment_info?.bill_number,
            bill_sequence:payment_info?.bill_sequence,
            cash: Math.min(payment_info.cash + valueDecrease,payment_info?.sub_total),
            content_discount: payment_info?.content_discount,
            credit:payment_info.credit,
            cus_order_id:payment_info?.cus_order_id,
            customer_id:payment_info?.customer_id,
            customer_name:payment_info?.customer_name,
            discount_amount:payment_info?.discount_amount,
            e_money:payment_info.e_money,
            foods:payment_info.foods,
            id:payment_info?.id,
            is_payment:payment_info?.is_payment,
            phone_number:payment_info?.phone_number,
            promotionId: pmts,
            service:payment_info?.service,
            store_id:payment_info?.store_id,
            store_name:payment_info?.store_name,
            sub_total:payment_info?.sub_total,
            table_id:payment_info?.table_id,
            table_name: payment_info.table_name,
            time_in:payment_info?.time_in,
            total: Math.min(payment_info.total + valueDecrease,payment_info?.sub_total),
            vat_percent:payment_info?.vat_percent,
            vat_value:payment_info?.vat_value
      }).then(async()=>{
          const {payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
          setBillMent({...billment,pmts,payment_info})
      }).catch(err=>{
      })
  }
  const confirmPayment = async () =>{ 
      const {payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
      StaffService.confirmPayMent({...payment_info,promotionId:pmts}).then(()=>{
        setMessagBox({open:true,message:"Thanh toán thành công!",type:"success"})
        setOpenMenu(false)
        return payment_info.id
      }).then(async(orderId) => {
        try{
          const {autoPrintWhenPayment} = store.get("orderBill")
          if(!autoPrintWhenPayment){
            return
          }
          const data = await StaffService.getBillMentInfo(orderId)
          const contentHtml = parseBillMentToHtml(data)
          ipcRenderer.send('print',{contentHtml,type:"printOrderBill"})
        }catch(err){
          setMessagBox({type:"error",message:"Chưa kết nối máy in",open:true})
        }
      }).catch(err=>{
        const {mess} = JSON.parse(err.request.response)
        setMessagBox({open:true,message:mess,type:"error"}) 
      })
  }
  const handlePrintInvoice = async () =>{
      try{
        const data = await StaffService.getBillMentInfo(billment.payment_info.id)
    const contentHtml = parseInvoiceBillToHtml(data)
    ipcRenderer.send('print',{contentHtml,type:"printOrderBill"})
      }catch(err){

      }
  }
  const handleCloseChangePriceDialog = (props) =>{
    const {index,canceled,price:oldPrice,quantity} = props
    if(canceled){
      setChangePriceDialog(false)
      return
    }
    const newPrice = Number(props.newPrice)
    billment.orders.forEach(o=>{
      if(o.index=== index){
        o.price = newPrice
        o.amount = o.quantity * newPrice
      }
    })
    if(oldPrice<newPrice){
      let amount = (newPrice - oldPrice) * quantity
      setBillMent({
        ...billment,
        payment_info:{
          ...billment.payment_info,
          total: billment.payment_info.total + amount,
          sub_total: billment.payment_info.sub_total + amount
        }
      })
    }else{
      let amount = (oldPrice-newPrice) * quantity
      setBillMent({
        ...billment,
        payment_info:{
          ...billment.payment_info,
          total: billment.payment_info.total - amount,
          sub_total: billment.payment_info.sub_total - amount
        }
      })
    }
    setChangePriceDialog(false)
  }
  const handleOpenChangePriceDialog = async (order) =>{
    setSelectedOrder(order)
    setChangePriceDialog(true)
  }
  const handleOpenChangeQuantityDialog = (order) =>{ 
    setSelectedOrder(order)
    setChangeQuantityDialog(true)
  }
  const handleCloseChangeQuantityDialog  = (props) =>{
    const {index,canceled,price,quantity,newQuantity} = props
    if(canceled){
      setChangeQuantityDialog(false)
      return
    }   
    billment.orders.forEach(o=>{
      if(o.index=== index){
        o.quantity =  newQuantity
        o.amount = o.quantity * o.price
      }
    })
    if(Number(quantity) < Number(newQuantity)){
        let _quantity = newQuantity
        let newAmount = (_quantity * price) - (quantity * price)
        setBillMent({
          ...billment,
          payment_info:{
            ...billment.payment_info,
            total: billment.payment_info.total + newAmount,
            sub_total: billment.payment_info.sub_total + newAmount
          }
        })
    }    
    if(Number(quantity) > Number(newQuantity)){
      let _quantity = newQuantity
      let newAmount =   (quantity * price) - (_quantity * price)
      setBillMent({
        ...billment,
        payment_info:{
          ...billment.payment_info,
          total: billment.payment_info.total - newAmount,
          sub_total: billment.payment_info.sub_total - newAmount
        }
      })
    }
    setChangeQuantityDialog(false)
  }
  const handleNoteChange = (inputValue,index) =>{
      billment.orders[index].note =  inputValue
  }  
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
      BackdropProps={{
        style:{
            backgroundColor:"transparent"
        }
      }}
      onClose={handleCloseMenu}
    >
      <DialogTitle
        style={{ color: "black !important" }}
        id="simple-dialog-title"
      >
        <Button style={{backgroundColor:"#444444",color:"white"}} variant="contained" onClick={handleCloseMenu}>
          Quay lại
        </Button>
        <span style={{marginLeft:'20px'}}>Order</span>
      </DialogTitle>
      <DialogContent>
        <Divider style={{ marginBottom: "2%" }} />
        <Grid spacing={3} container >
          <Grid item xs={"auto"}  style={{borderRight:"1px solid #333",height:"100vh"}} >
              {categories.map((c,index)=>(
                <Cagtegory key={index} className={active(c.category)} onClick={()=>handleSelect(c.category)}>{c.category}</Cagtegory>
            ))}  
          </Grid>
          <Grid item xs={3}  style={{borderRight:"1px solid #333",height:"100vh"}}>
            {menu.map((m,index)=> ( 
                <OrderItem key={index}  {...m} />
            ))}
          </Grid>
          <Grid item xs={4} style={{borderRight:"1px solid #333",height:"100vh",fontSize:'14px'}}>    
                <Grid container style={{width:'100%'}} alignItems="center" justify="flex-end">
                  <Grid item xs={6} style={{display:'flex',justifyContent:"flex-end"}}>
                      <Button onClick={handleSendOrder}  disabled={(isLoading || !billment.orders.some(o=>o.quantity > 0))} style={{opacity:1,backgroundColor:"#444444",color:"white"}}  variant="outlined">Gọi món</Button>
                  </Grid>
                </Grid>         
                {billment.orders.filter(o=> o.quantity !==0 ).map((o,index)=>( 
                  <Fragment key={index}>
                  <div style={{display:'flex',alignItems:'flex-start',marginTop:"10px"}}>
                    <IconButton onClick={()=>updateAmount(o,"add")} size="small" style={{backgroundColor:"green",color:"white",height:"30px",borderRadius:"0"}} disableFocusRipple disableRipple>
                        <MdAdd fontSize={25}/>
                    </IconButton>
                    <div style={{color:'red',display:'flex',alignItems:'center',marginLeft:'5px'}}>
                      <b>{o.quantity}</b>                      
                    </div>
                    {(o.can_edit_quantity || user.staff_info.fields.role_name == "ADMIN" && (
                          <IconButton onClick={()=>handleOpenChangeQuantityDialog(o)} style={{borderRadius:"0"}}><FaRegEdit fontSize={15}/></IconButton>
                      ))}
                    <IconButton  onClick={()=>updateAmount(o,"sub")} size="small" style={{backgroundColor:"#e0e0e0",marginLeft:"5px",color:"white",height:"30px",borderRadius:"0"}} disableFocusRipple disableRipple>
                        <RiSubtractLine fontSize={25}/>
                    </IconButton>
                    <div style={{display:"flex",flexDirection:"column"}}>
                      <div style={{marginLeft:"5px"}}>{o.name}</div>
                      <div style={{marginLeft:"5px"}}>Giá: {convertToVnd(o.price)}
                      {(o.can_edit_price || user.staff_info.fields.role_name == "ADMIN" && (
                            <IconButton onClick={()=>handleOpenChangePriceDialog(o)} style={{borderRadius:"0"}}><FaRegEdit fontSize={15}/></IconButton>
                        ))}
                      </div>    
                    </div>                 
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <NoteInput onChange={(event) => handleNoteChange(event.target.value,index)}  placeholder="Thêm ghi chú..."/>                    
                    <small><b>{convertToVnd(o.amount)}</b></small>
                  </div>
                  <Divider/>
                  </Fragment>
                ))}
                {billment.orders.some(o=>o.quantity > 0) ? (
                  <Text>
                  Tổng tiền: {sumPrice()}
                </Text>
                ) : "" }
                
             
          </Grid>
          <Grid item xs={3}  style={{fontSize:'14px'}} >
          <Grid spacing={3} container style={{width:'100%'}} alignItems="center" justify="center">
                    <Grid item xs={7} style={{textAlign:'center'}}>
                      <Button onClick={handlePrintInvoice} style={{fontSize:"12px",backgroundColor:"#444444",color:"white"}}>In hóa đơn tạm tính</Button>
                    </Grid>
                    <Grid style={{textAlign:'center'}} item xs={5}>
                        <Button   onClick={confirmPayment} disabled={( billment.payment_info.foods.length == 0 && !billment.orders.some(o => o.quantity > 0) )? true : billment.orders.some(o => o.quantity > 0) ? true : false} style={{height:"100%",opacity:1,fontSize:"12px",backgroundColor:"#444444",color:"white"}} variant="outlined">Thanh toán</Button>
                    </Grid>
              </Grid>
            <Text style={{margin:"0",padding:'0',height:'25px'}}><b>Bàn: </b> {billment.payment_info?.table_name || billment.table_name}</Text>
            <Text style={{margin:"0",padding:'0',height:'25px'}}><b>Thành tiền:</b>{convertToVnd(billment.payment_info.total)}</Text>
            <Text style={{margin:"0",padding:'0',height:'25px'}}><b>Tổng giảm giá: </b> {convertToVnd(Math.max(0,billment.payment_info?.sub_total - billment.payment_info?.total))}</Text>
            <Text style={{margin:"0",padding:'0',height:'25px'}}  ><b>Tổng tiền món: </b> {convertToVnd(billment.payment_info?.sub_total || 0)}</Text>
            <CustomerPayment/>
            <Coupon/> 
            <Service/>
            <Currency/>
            <Text><b>Khuyến mãi đang áp dụng:</b></Text>
            <div>
              <ul>
                {billment.pmts?.filter(p=>p.quantity_apply !==0).map((p,index)=>(

                  <li key={index}>{p.quantity_apply} x {p.name} 
                    <BsFillTrashFill onClick={()=>removePromotionInOrder(p)}/>
                   </li>
                ))}
              </ul>
            </div>
            <Text><b>Chi tiết:</b></Text>
            <div>
                <ul>
                  {billment.payment_info?.foods.filter(f => f.quantity !== 0).map((f,index)=>(
                    <li key={index}>
                        {f.quantity + " x "}
                        {f.name}
                        {": " + convertToVnd(f.amount)}
                    </li>
                  ))}
                </ul>
            </div>
           
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>       
        <Button style={{backgroundColor:"#444444",color:"white"}} variant="contained"  onClick={()=> setOpenMergeTable(true)}>Gộp bàn</Button>
          {billment.status !== 0 && (
            <>
            <Button variant="contained" style={{backgroundColor:"#444444",color:"white"}} onClick={()=>setOpenCancelOrder(true)} >Hủy order</Button>
          <Button variant="contained" style={{backgroundColor:"#444444",color:"white"}} onClick={()=>setOpenCancelFood(true)}>Hủy món</Button>
          <Button variant="contained" style={{backgroundColor:"#444444",color:"white"}} onClick={cleanTable}>Dọn bàn</Button>
          <Button variant="contained" style={{backgroundColor:"#444444",color:"white"}} onClick={()=>setOpenChangeTable(true)}>Đổi bàn</Button>
            </>
          )}
      </DialogActions>
    </Dialog>    
    <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
    <ChangePriceDialog {...selectedOrder} open={changePriceDialog} onClose={handleCloseChangePriceDialog} />
    <ChangeQuantityDialog {...selectedOrder} open={changeQuantityDialog} onClose={handleCloseChangeQuantityDialog} />
    </MenuProvider>
    
  );
};

export default React.memo(Menu)
