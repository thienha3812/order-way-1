import React from 'react'
import { convertToVnd } from '../utils'




const OrderDetail  = (props ) =>{ 
    return( 
        <ul {...props} style={{ margin: "0" }}>
        <li style={{ fontSize: "25px" }}>Bàn: {props.table}</li>
        <li>Nhân viên: {props.staff_name}</li>
        <li>Khách hàng: {props.customerName}</li>
        <li>Thời gian: {props.time}</li>
        <li>Tổng tiền món: {convertToVnd(props.totalPrice)}</li>
        <li>Chi tiết:
            <ul>
              {props.orders.map((value,index)=>( 
                  <li key={index}>{value}</li>
              ))}
              </ul>
        </li>
      </ul>
    )
}
export default React.memo(OrderDetail)