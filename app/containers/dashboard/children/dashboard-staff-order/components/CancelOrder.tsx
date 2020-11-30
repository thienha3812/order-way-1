import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import React, { useContext, useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../../../../features/user/userSlice'
import StaffService from '../../../../../services/staff'
import { Context } from '../Context'



const CancelOrder = () =>{ 
    const {billment,setOpenCancelOrder} = useContext(Context)
    const {user:{staff_info}} = useSelector(userSelector)
    const [order,setOrder] = useState({payment_info: {request:null,customerId:0,customerName:"",orderId:[],tableId:0,time:"",table:"",foods:[]}})
    const {payment_info} = order
    const fetch = async () =>{ 
        const {data} = await StaffService.getOrderInfo(billment.tableId)
        setOrder(data)
    }
    useEffect(()=>{
        fetch()
    },[])
    const handleCancelOrder = async () =>{ 
        StaffService.cancelOrder({
            customerId:payment_info.customerId,
            customerName:payment_info.customerName,
            orders:payment_info.foods,
            foods:payment_info.foods,
            orderId:payment_info.orderId[0],
            request:payment_info.request,
            staffId:staff_info.pk,
            staffName:staff_info.fields.name,
            table: payment_info.table,
            tableId:payment_info.tableId,
            time:payment_info.time,
            type:payment_info.type,
            totalPrice:payment_info.price,
            userType:"staff"
        }).then((result)=>{
            setOpenCancelOrder(false)
        }).catch(err=>{
            setOpenCancelOrder(false)
        })
    }
    return ( 
        <>
            <Dialog open={true} fullWidth maxWidth="md">
                <DialogTitle>
                    Hủy Order
                </DialogTitle>
                <DialogContent>
                    <div>
                        {order.have_cancel && ( 
                            <h4 style={{color:"red"}}>Bạn có yêu cầu hủy trước đó chưa được xác nhận. Hãy xác nhận lần hủy trước để thực hiện yêu cầu hủy tiếp theo</h4>
                        )}
                    </div>
                    {(order.payment_info !== null && order.have_cancel == false ) && ( 
                       <>
                        <h3>Bàn: {order.payment_info.table}</h3>
                        <h3>Danh sách món đã Order</h3>
                        <div>
                            <ul>
                                {order.payment_info.foods.map((food,index)=>(
                                    <li key={index}>{food.quantity} X {food.name}</li>
                                ))}
                            </ul>
                        </div>
                       </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpenCancelOrder(false)}>Quay lại</Button>
                    <Button disabled={order.payment_info==null} onClick={handleCancelOrder}>Hủy Order</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CancelOrder