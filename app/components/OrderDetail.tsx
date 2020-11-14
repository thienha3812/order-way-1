import React from 'react'
import styled from 'styled-components'
import { convertToVnd } from '../utils'


const Wrapper = styled.div`
  ul li {
    margin-top:10px;
  }
`

const OrderDetail  = (props ) =>{ 
    return( 
      <Wrapper>
        <ul style={{ margin: "0" }}>
        <li style={{ fontSize: "25px" }}><b>Bàn:</b> {props.table}</li>
       {props.type === "cancel_food" && (
          <li style={{color:'red'}}><b>Loại:Hủy món</b></li>
       ) }
       {props.type === "cancel_order" && (
          <li style={{color:'red'}}><b>Loại:Hủy order</b></li>
       ) }
       {props.type === "order" && (
          <li><b>Loại:Order</b></li>
       ) }
        <li><b>Nhân viên:</b> {props.staff_name}</li>
        <li><b>Khách hàng:</b> {props.customerName}</li>
        <li><b>Thời gian:</b> {props.time}</li>
        <li><b>Tổng tiền món:</b> {convertToVnd(props.totalPrice)}</li>
        <li><b>Chi tiết:</b>
            <ul>
              {props.orders.map((value,index)=>( 
                  <li key={index}>{value}</li>
              ))}
              </ul>
        </li>
      </ul>
      </Wrapper>
    )
}
export default React.memo(OrderDetail)