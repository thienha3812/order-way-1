export type Table = {
    pk : number,
    model:string,
    fields: { 
        name:string,
        status:number,
        parent_id:number,
        parent_name:string
    }
}

export type Billment  = { 
    table_name:string,
    price:number,
    all_price:number,
    currency_type:string,
    coupon: any,
    orders: Array<Order>
    tableId: string
    
}
export type Order = {
    amount:number
    foodId:number
    index:number
    name:string
    price:number
    quantity:number
    stt:string

}


// amount: 56000
// foodId: 219
// index: 1
// name: "Chả chiên giòn"
// price: 56000
// quantity: 1
// stt: "01"