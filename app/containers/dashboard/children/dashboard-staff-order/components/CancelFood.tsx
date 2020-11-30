import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import React, { useContext, useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import CustomAlert from '../../../../../components/Alert'
import { userSelector } from '../../../../../features/user/userSlice'
import StaffService from '../../../../../services/staff'
import { Context } from '../Context'

const Input = styled.input`
    &:focus{
        outline:none;
        appearance: textfield;
    }
    &:hover{
        appearance: textfield;
    }
    
    height: 40px;
    width:40px;
    margin-left:5px;
    text-align:center;
    appearance: textfield;
`

const CancelFood = () =>{ 
    const {billment,setOpenCancelOrder,setOpenCancelFood,openCancelFood} = useContext(Context)
    const [order,setOrder] = useState({have_cancel:false,payment_info: {request:null,customerId:0,customerName:"",orderId:[],tableId:0,time:"",table:"",foods:[]}})
    const [currentFoods,setFoods] = useState([])
    const {payment_info,have_cancel} = order
    const [loading,setLoading] = useState(false)
    const {user:{staff_info}} = useSelector(userSelector)
    const [messageBox,setMessagBox] = useState({open:false,message:"",type:""})
    const fetch = async () =>{ 
        const {data} = await StaffService.getOrderInfo(billment.tableId)
        const {have_cancel,payment_info}  = data
        setFoods(data.payment_info.foods.map(f=>({...f,quantity:0})))
        setOrder({have_cancel,payment_info})
        setLoading(true)
    }
    useEffect(()=>{
        fetch()
    },[])
    const handleChangeInput = (event,food) =>{
        let _foods = JSON.parse(JSON.stringify(currentFoods))
        _foods.forEach(f=>{
            if(f.foodId === food.foodId){
                let allowQuantity = order.payment_info.foods.filter(f => f.foodId == food.foodId)[0].quantity
                if(Number(event.target.value) > allowQuantity){
                    event.target.value = f.quantity      
                    setMessagBox({type:"warning",message:"Số lượng hủy không được vượt quá số lượng đã đặt",open:true}) 
                    return
                }
                f.quantity = Number(event.target.value)
            }
        })

        setFoods([..._foods])
    }
    const handleCloseMessageBox =() =>{
        setMessagBox({...messageBox,open:false})
      }
    const confirmCancelOrder = () =>{
        let foods = currentFoods
        StaffService.sendCancelFood({
            customerId:order.payment_info.customerId,
            customerName:order.payment_info.customerName,
            orderId:order.payment_info.orderId,
            orders : foods,
            table: order.payment_info.table,
            tableId: order.payment_info.tableId,
            staffId: staff_info.pk,
            staffName: staff_info.fields.name,
            userType: "staff"
        }).then((result)=>{
            setOpenCancelFood(false)
        }).catch(err=>{
            setOpenCancelFood(false)
        })
    }
    return ( 
        <>
            <Dialog onClose={()=>setOpenCancelFood(false)} open={openCancelFood} fullWidth maxWidth="md">
                <DialogTitle>
                    Hủy Món
                </DialogTitle>
                <DialogContent>
                    {(loading == true && have_cancel == true) && ( 
                      <div>
                        <h4 style={{color:"red"}}>Bạn có yêu cầu hủy trước đó chưa được xác nhận. Hãy xác nhận lần hủy trước để thực hiện yêu cầu hủy tiếp theo</h4>
                    </div>  
                    )}
                    {(loading == true && have_cancel == false && payment_info.foods.length > 0) && ( 
                      <div>
                      <ul>
                      {order.payment_info.foods.map((food,index)=>(
                          <li>
                              {food.name}
                              {", Đã đặt x" + food.quantity}
                              {", Số lượng cần hủy: "}
                              <Input defaultValue="0" aria-label="Số lượng cần hủy" onChange={(event)=>handleChangeInput(event,food)} key={index}   />
                          </li>
                      ))}
                      </ul>
                  </div>
                    )}
                </DialogContent>
                <DialogActions>
                  
                    <Button onClick={()=>setOpenCancelFood(false)}>Quay lại</Button>
                    <Button onClick={confirmCancelOrder} >Xác nhận</Button>
                </DialogActions>
            </Dialog>
            <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
        </>
    )
}

export default CancelFood