


export const convertToVnd = (number) =>{ 
    return Number(number).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
}

export const caculateValueDiscount = (billment) =>{
    let value = 0
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0)
    if(pmts?.length > 0){
        pmts?.forEach(p=>{
          if(p.discount_percent > 0 && p.type === "discount"){
            value += Number (p.discount_percent*p.quantity_apply)
          }
        })
    }
    return billment.payment_info.sub_total * (value/100)
  }
  export const caculateValueFreeItem = (billment) =>{
    let value = 0 
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0 && p.type === "free_item")
    pmts?.forEach((p)=>{
      const current_apply = p.quantity_apply
      const sortFollowAmount = billment.payment_info.foods?.filter(f=> f.foodId == p.item_free).sort((a,b)=> a.price < b.price)
      let applied = 0
      if(sortFollowAmount?.length > 0){
        sortFollowAmount.forEach((food)=>{
          value += Math.min(current_apply - applied,food.quantity) * food.price
          applied += Math.min(current_apply - applied,food.quantity)
        })
      }
    })
    return value
  }
  export const caculateMaxValueVoucher = (billment) => {
    let value = 0
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0 && p.type === "discount_with_max_value")
    pmts?.forEach(p=>{
      if(billment.payment_info?.sub_total >= p.discount_on_amount){
          let discountOnPercent = (p.discount_percent/100) * billment.payment_info?.sub_total 
          value += Math.min(discountOnPercent,p.max_discount) * p.quantity_apply
      }
    })
    return value 
  }
  export const caculateValueVoucher = (billment) =>{
    let sum = 0
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0)
    if(pmts?.length > 0){
        pmts?.forEach(p=>{
          if(p.value_of_voucher > 0 &&  p.type=== "voucher"){
            sum += Number(p.value_of_voucher * p.quantity_apply)
          }
        })
    }
    return sum
  }
  export const caculateAllValue = (billment) => {
      let valueVoucher = caculateValueVoucher(billment)
      let valueMaxVoucher = caculateMaxValueVoucher(billment)
      let valueDiscount = caculateValueDiscount(billment)
      let valueFreeItem = caculateValueFreeItem(billment)
      return valueDiscount + valueFreeItem + valueVoucher + valueMaxVoucher
  }

  export const parseBillMentToHtml = (data) => {
    let content = data.data
    const nameStoreText = `
          <h3 style="text-align:center;font-size:1rem;">${content.store_name}</h3>
    ` 
    const phoneText = `
        <p style="text-align:center;font-size:1rem;">${content.phone_number}</p>
    `
    const tableText = `
      <div style="font-size:0.7rem;">Bàn: ${content.table_name}</div>
    `
    const bilDateText  = `
                    <div style="font-size:0.7rem;">Ngày: ${content.bill_date}</div>
    `
    const staffText = `
          <div style="font-size:0.7rem;">Nhân viên: ${content.staff_name}</div>
    `
    const billTimeText = `
              <div style="font-size:0.7rem;">Giờ: ${content.bill_time}</div>   
    `
    const foodsText = content.foods.reduce((a,b) => a + `
      <tr>
                            <td style="text-align:start;font-size:0.7rem">${b.name}</td>
                            <td style="text-align:center;font-size:0.7rem;">${b.quantity}</td>
                            <td style="text-align:center;font-size:0.7rem">${b.price}</td>
                                    <td style="text-align:end;font-size:0.7rem;">${b.price * b.quantity}</td>
          </tr> 
    `,'')
    const timeInText = `
                      <div style="width:100%;font-size:0.7rem;">Vào: ${content.time_in}</div>
    `
    const timeOutText = `
                        <div style="width:100%;font-size:0.7rem;">Ra  : ${content.time_out}</div>
      
    `
    const convertToVnd = (number) =>{ 
        return Number(number).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    }
    const totalPriceFoodsText = content.foods.reduce((a,b) => a + b.quantity * b.price,0)

    const pmtsText = content.pmts.reduce((a,b) => a + `
      <div style="display:flex;justify-content:center">
                        <div style="width:50%;font-size:0.7rem;" >${b.name}</div>
                        <div style="width:50%;font-size:0.7rem;">${b.quantity}</div>
        </div>
    `,'')
    const totalText = `
                          <div style="width:50%;font-size:0.7rem;">${convertToVnd(content.sub_total)}</div>
    `
    const discountText =  `
                        <div style="width:50%;font-size:0.7rem;">- ${convertToVnd(content.discount_amount)}</div>	
    ` 
    const contentHtml = `
        <div>
            ${nameStoreText}
            ${phoneText}
                    <h4 style="text-align:center;font-size:1rem;">Hóa đơn tạm tính</h4>
                    <div style="display:flex;justify-content:space-between;">
            ${tableText}
            ${bilDateText}
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                ${staffText}
                ${billTimeText}
                    </div>
                    <div>
                        <table style="width:100%;border-bottom:1px solid #e6e6e6">
                        <tr>
                            <th style="width:30%;text-align:start;font-size:0.7rem;font-weight:400;">Tên</th>
                            <th style="text-align:center;font-size:0.7rem;font-weight:400;">Số lượng</th>
                            <th style="text-align:center;font-size:0.7rem;font-weight:400;">Đơn giá</th>
                            <th style="text-align:end;font-size:0.7rem;font-weight:400;">Thành tiền</th>
                        </tr>
                        ${foodsText}   
                        </table>
                    </div>
                    <div style="display:flex;justify-content:flex-end;border-bottom:1px solid #e6e6e6">
                        <div style="width:50%;font-size:0.7rem;" >Tổng cộng</div>
                        <div style="width:50%;font-size:0.7rem;">${convertToVnd(totalPriceFoodsText)}</div>
                    </div>
                    <div style="display:flex;justify-content:center;border-bottom:1px solid #e6e6e6">
                        <div style="width:50%;font-size:0.7rem;" >Tên khuyến mãi</div>
                        <div style="width:50%;font-size:0.7rem;">SL</div>
                    </div>
                    ${pmtsText}
                    <div style="display:flex;justify-content:center;border-top:1px solid #e6e6e6">
                        <div style="width:50%;font-size:0.7rem;" >Tổng giảm giá</div>
                        ${discountText}
                    </div>
                    <div style="display:flex;justify-content:center;border-top:1px solid #e6e6e6">
                        <div style="width:50%;font-size:0.7rem;" >Thành tiền</div>
              ${totalText}
                    </div>
                    <div style="display:flex;justify-content:start;">
              ${timeInText}
                    </div>
                    <div style="display:flex;justify-content:start;">
                      ${timeOutText}
                    </div>
                    <div style="padding-bottom:8cm;display:flex;justify-content:center;border-top:1px solid #e6e6e6">
                      <h3 style="text-align:center;width:100%;font-size:1rem;" >Cảm ơn quý khách và hẹn gặp lại!</h3>
                    </div>                
        
                </div>
    `
    return contentHtml
  }
export  const parseKitchenBillToHtml = (data) => {
    let content = data
    const tableText = `
      <div style="font-size:0.7rem;">Bàn: ${content.table}</div>
    `
    const bilDateText  = `
                    <div style="font-size:0.7rem;">Ngày: ${content.time}</div>
    `
    const ordersText = content.orders.reduce((a,b) => a + `
    	<div style="font-size:0.8rem">
                  ${b}
        </div>
    `,'')
    const contentHtml = `
      
                    <h4 style="text-align:center;font-size:1rem;">Danh sách món</h4>
                    <div style="display:flex;justify-content:space-between;">
          			  ${tableText}
	            		${bilDateText}
                    </div>
                    ${ordersText}
    `
    return contentHtml
  }