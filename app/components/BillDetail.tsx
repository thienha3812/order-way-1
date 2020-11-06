import React from 'react'
import { convertToVnd } from '../utils'




const BillDetail  = ({service_price,pmts,cash,credit,e_money,table_name,total,sub_total,vat_value,service,foods,discount_amount,customer_name,bill_number,is_payment}) =>{ 
    return( 
        <ul  style={{ margin: "0" }}>
        <li style={{ fontSize: "25px" }}>Bàn: {table_name}</li>
        <li>Trạng thái: {is_payment? "Đã thanh toán" :"Chưa thanh toán"}</li>
        <li>Số hóa đơn: {bill_number}</li>
        <li>Khách hàng: {customer_name}</li>
        <li>Tổng tiền món: {convertToVnd(sub_total)}</li>
    <li>Tổng phí dịch vụ, phụ thu:{convertToVnd(service_price)}</li>
      <li>Tổng khuyến mãi:{convertToVnd(discount_amount)}</li>
        <li>Thuế VAT: {convertToVnd(vat_value)}</li>
        <li>Thành tiền:{convertToVnd(total)} </li>
        <li>Tiền mặt:{convertToVnd(cash)} </li>
        <li>Chuyển khoản:{convertToVnd(credit)} </li>
    <li>Tiền điện tử: {convertToVnd(e_money)}</li>
        <li>Chi tiết món: 
          <ul>
              {foods.map((f,index)=>(
                <li key={index}>{f.quantity + "x"} {f.name + "(" + convertToVnd(f.price) + ")"} {": " + convertToVnd(f.amount)} </li>
                
              ))}
            </ul>
        </li>
       {service.length > 0 && (
          <li>Chi tiết dịch vụ, phụ thu:
          <ul>
            {service.map((s,index)=>(
                <li key={index}>
                    {"Loại: " + (s.type == "service" ? "Dịch vụ,v" : "Phụ thu, " )}  {"Tên:" + s.name +", "} {"Giá: " + convertToVnd(s.price)}
                </li>
            ))}
            
          </ul>
      </li>
       )}
        {pmts.length > 0 && (
          <li>Chi tiết khuyến mãi:
          <ul>
            {pmts.map((p,index)=>(
              <li key={index}>{p.quantity + 'x'} {p.name}</li>
            ))}
          </ul>

        </li>
        )}
        
      </ul>
    )
}
export default React.memo(BillDetail)