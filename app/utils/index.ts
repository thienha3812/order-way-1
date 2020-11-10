


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
    return value
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