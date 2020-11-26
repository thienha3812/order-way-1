
const Store = require('electron-store')
const store = new Store()


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
  export const parseInvoiceBillToHtml = (data) => {
    const { fontSizeOrderBill } = store.get("orderBill")
    const fontSize = (fontSizeOrderBill/16) + 'rem'
    const fontSizeForTitle = ((fontSizeOrderBill/16) + 0.2) + 'rem'
    let content = data.data
    const nameStoreText = `
          <h3 style="text-align:center;font-size:${fontSizeForTitle};">${content.store_name}</h3>
          <h3 style="text-align:center;font-size:${fontSize};">${content.address}</h3>
    ` 
    const phoneText = `
        <p style="text-align:center;font-size:${fontSize};">${content.phone_number}</p>
    `
    const tableText = `
      <div style="font-size:${fontSize};">Bàn: ${content.table_name}</div>
    `
    const billNumberText  = `
       <h4 style="text-align:center;font-size:${fontSize};">Số hóa đơn: ${content.bill_number}</h4>
    `
    const bilDateText  = `
                    <div style="font-size:${fontSize};">Ngày: ${content.bill_date}</div>
    `
    const staffText = `
          <div style="font-size:${fontSize}">Nhân viên: ${content.staff_name}</div>
    `
    const billTimeText = `
              <div style="font-size:${fontSize};">Giờ: ${content.bill_time}</div>   
    `
    const foodsText = content.foods.reduce((a,b) => a + `
      <tr>
                            <td style="text-align:start;font-size:0.7rem">
                            <div style="display:flex;flex-direction:column;justify-content:center">
                            	<div>
                                	${b.name}
                                </div>
                                <div style="margin-left:25px" >
									${b.quantity}
                                </div>
                            </div>
                            </td>

                            <td style="text-align:center;font-size:0.7rem;">
                            	<div></div><br/>
                                <div>
	                                ${b.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                                </div>
                            </td>
                            <td style="text-align:end;font-size:0.7rem;">
                            	<div></div><br/>
                                <div>
                                	${(b.price * b.quantity).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
								</div>
                            </td>
          </tr> 
    `,'')
    const timeInText = `
                      <div style="width:100%;font-size:${fontSize};">Vào: ${content.time_in}</div>
    `
    const timeOutText = `
                        <div style="width:100%;font-size:${fontSize};">Ra  : ${content.time_out}</div>
      
    `
    const convertToVnd = (number) =>{ 
        return Number(number).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    }
    const totalPriceFoodsText = content.foods.reduce((a,b) => a + b.quantity * b.price,0)

    const pmtsText = content.pmts.length > 0 ? content.pmts.reduce((a,b) => a + `
      <div style="display:flex;justify-content:center">
                        <div style="width:50%;font-size:${fontSize};" >${b.name}</div>
                        <div style="width:50%;font-size:${fontSize};">${b.quantity}</div>
        </div>
    `,'') : ""
    const totalText = `
                          <div style="width:50%;font-size:${fontSize};">${convertToVnd(content.sub_total)}</div>
    `
    const discountText =  `
                        <div style="width:50%;font-size:${fontSize};">- ${convertToVnd(content.discount_amount)}</div>	
    ` 
    const titlePmts = `
    <div style="display:flex;justify-content:center;">
    <div style="width:50%;font-size:${fontSize};" >Tên khuyến mãi</div>
    <div style="width:50%;font-size:${fontSize};">SL</div>
    </div>
    `
    const contentHtml = `
        <div>
            ${nameStoreText}
            ${phoneText}
                    <h4 style="text-align:center;font-size:${fontSizeForTitle};">Hóa đơn tạm tính</h4>
                    ${billNumberText}            
                    <div style="display:flex;justify-content:space-between;">           
                    ${tableText}
                    ${bilDateText}
                    </div>                    
                    <div style="display:flex;justify-content:space-between;">
                ${staffText}
                ${billTimeText}
                    </div>
                    <div>
                        <table style="width:100%;">
                        <tr>
                            <th style="width:30%;text-align:start;font-size:${fontSize};font-weight:400;">Tên</th>
                            <th style="text-align:center;font-size:${fontSize};font-weight:400;">Đơn giá</th>
                            <th style="text-align:end;font-size:${fontSize};font-weight:400;">Thành tiền</th>
                        </tr>
                        ${foodsText}   
                        </table>
                    </div>
                    <div style="display:flex;justify-content:flex-end;">
                        <div style="width:50%;font-size:${fontSize};" >Tổng cộng</div>
                        <div style="width:50%;font-size:${fontSize};">${convertToVnd(totalPriceFoodsText)}</div>
                    </div>
                    ${content.pmts.length > 0 ? titlePmts :"" }
                    ${pmtsText}
                    <div style="display:flex;justify-content:center;">
                        <div style="width:50%;font-size:${fontSize};" >Tổng giảm giá</div>
                        ${discountText}
                    </div>
                    <div style="display:flex;justify-content:center;">
                        <div style="width:50%;font-size:${fontSize};" >Thành tiền</div>
              ${totalText}
                    </div>
                    <div style="display:flex;justify-content:start;">
              ${timeInText}
                    </div>
                    <div style="display:flex;justify-content:start;">
                      ${timeOutText}
                    </div>
                    <div style="padding-bottom:8cm;display:flex;justify-content:center;">
                      <h3 style="text-align:center;width:100%;font-size:${fontSizeForTitle};" >Cảm ơn quý khách và hẹn gặp lại!</h3>
                    </div>                
        
                </div>
    `
    return contentHtml
  }
  
    
  export const parseBillMentToHtml = (data) => {
    const { fontSizeOrderBill } = store.get("orderBill")
    const fontSize = (fontSizeOrderBill/16) + 'rem'
    const fontSizeForTitle = ((fontSizeOrderBill/16) + 0.2) + 'rem'
    let content = data.data
    const nameStoreText = `
          <h3 style="text-align:center;font-size:${fontSizeForTitle};">${content.store_name}</h3>
          <h3 style="text-align:center;font-size:${fontSize};">${content.address}</h3>
    ` 
    const phoneText = `
        <p style="text-align:center;font-size:${fontSize};">${content.phone_number}</p>
    `
    const tableText = `
      <div style="font-size:${fontSize};">Bàn: ${content.table_name}</div>
    `
    const billNumberText  = `
       <h4 style="text-align:center;font-size:${fontSize};">Số hóa đơn: ${content.bill_number}</h4>
    `
    const bilDateText  = `
                    <div style="font-size:${fontSize};">Ngày: ${content.bill_date}</div>
    `
    const staffText = `
          <div style="font-size:${fontSize}">Nhân viên: ${content.staff_name}</div>
    `
    const billTimeText = `
              <div style="font-size:${fontSize};">Giờ: ${content.bill_time}</div>   
    `
    const foodsText = content.foods.reduce((a,b) => a + `
      <tr>
                            <td style="text-align:start;font-size:0.7rem">
                            <div style="display:flex;flex-direction:column;justify-content:center">
                            	<div>
                                	${b.name}
                                </div>
                                <div style="margin-left:25px" >
									${b.quantity}
                                </div>
                            </div>
                            </td>

                            <td style="text-align:center;font-size:0.7rem;">
                            	<div></div><br/>
                                <div>
	                                ${b.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                                </div>
                            </td>
                            <td style="text-align:end;font-size:0.7rem;">
                            	<div></div><br/>
                                <div>
                                	${(b.price * b.quantity).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
								</div>
                            </td>
          </tr> 
    `,'')
    const timeInText = `
                      <div style="width:100%;font-size:${fontSize};">Vào: ${content.time_in}</div>
    `
    const timeOutText = `
                        <div style="width:100%;font-size:${fontSize};">Ra  : ${content.time_out}</div>
      
    `
    const convertToVnd = (number) =>{ 
        return Number(number).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    }
    const totalPriceFoodsText = content.foods.reduce((a,b) => a + b.quantity * b.price,0)

    const pmtsText = content.pmts.length > 0 ? content.pmts.reduce((a,b) => a + `
      <div style="display:flex;justify-content:center">
                        <div style="width:50%;font-size:${fontSize};" >${b.name}</div>
                        <div style="width:50%;font-size:${fontSize};">${b.quantity}</div>
        </div>
    `,'') : ""
    const totalText = `
                          <div style="width:50%;font-size:${fontSize};">${convertToVnd(content.sub_total)}</div>
    `
    const discountText =  `
                        <div style="width:50%;font-size:${fontSize};">- ${convertToVnd(content.discount_amount)}</div>	
    ` 
    const titlePmts = `
    <div style="display:flex;justify-content:center;">
    <div style="width:50%;font-size:${fontSize};" >Tên khuyến mãi</div>
    <div style="width:50%;font-size:${fontSize};">SL</div>
    </div>
    `
    const contentHtml = `
        <div>
            ${nameStoreText}
            ${phoneText}
                    <h4 style="text-align:center;font-size:${fontSizeForTitle};">Hóa đơn thanh toán</h4>
                    ${billNumberText}            
                    <div style="display:flex;justify-content:space-between;">           
                    ${tableText}
                    ${bilDateText}
                    </div>                    
                    <div style="display:flex;justify-content:space-between;">
                ${staffText}
                ${billTimeText}
                    </div>
                    <div>
                        <table style="width:100%;">
                        <tr>
                            <th style="width:30%;text-align:start;font-size:${fontSize};font-weight:400;">Tên</th>
                            <th style="text-align:center;font-size:${fontSize};font-weight:400;">Đơn giá</th>
                            <th style="text-align:end;font-size:${fontSize};font-weight:400;">Thành tiền</th>
                        </tr>
                        ${foodsText}   
                        </table>
                    </div>
                    <div style="display:flex;justify-content:flex-end;">
                        <div style="width:50%;font-size:${fontSize};" >Tổng cộng</div>
                        <div style="width:50%;font-size:${fontSize};">${convertToVnd(totalPriceFoodsText)}</div>
                    </div>
                    ${content.pmts.length > 0 ? titlePmts :"" }
                    ${pmtsText}
                    <div style="display:flex;justify-content:center;">
                        <div style="width:50%;font-size:${fontSize};" >Tổng giảm giá</div>
                        ${discountText}
                    </div>
                    <div style="display:flex;justify-content:center;">
                        <div style="width:50%;font-size:${fontSize};" >Thành tiền</div>
              ${totalText}
                    </div>
                    <div style="display:flex;justify-content:start;">
              ${timeInText}
                    </div>
                    <div style="display:flex;justify-content:start;">
                      ${timeOutText}
                    </div>
                    <div style="padding-bottom:8cm;display:flex;justify-content:center;">
                      <h3 style="text-align:center;width:100%;font-size:${fontSizeForTitle};" >Cảm ơn quý khách và hẹn gặp lại!</h3>
                    </div>                
        
                </div>
    `
    return contentHtml
}
export  const parseKitchenBillToHtml = (data) => {
    const { fontSizeKitchenBill } = store.get("kitchenBill")
    const fontSize = (fontSizeKitchenBill/16) + 'rem'
    const fontSizeForTitle = ((fontSizeKitchenBill/16) + 0.2) + 'rem'
    let content = data
    const tableText = `
      <div style="font-size:${fontSizeForTitle};"><b>Bàn: ${content.table}<b/></div>
    `
    const bilDateText  = `
                    <div style="font-size:${fontSize};">Thời gian: ${content.time}</div>
    `
    const ordersText = content.orders.reduce((a,b) => a + `
    	<div style="font-size:${fontSize}">
                  ${b}
        </div>
    `,'')
    const contentHtml = `
      
                    <div>
          			      ${tableText}	            		
                    </div>
                    <div>
                      ${bilDateText}
                    </div>
                    ${ordersText}
    `
    return contentHtml
  }