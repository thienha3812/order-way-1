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
    pmts?: Array<any>
    status?: number
    payment_info?: Partial<PaymentInfo>
}
type PaymentInfo = {
    id: number
    customer_id: number
    customer_name: string
    table_id: number
    table_name: string
    total: number | 0
    foods: Array<Food>
    sub_total: number | 0
    discount_amount: number
    content_discount: number
    vat_percent: number
    vat_value: number
    bill_sequence:number
    bill_number: number
    is_payment: boolean
    cus_order_id: Array<number>
    time_in: string
    address: string 
    store_name: string
    phone_number: string
    cash: number
    credit: number
    e_money: number
    store_id?: string
    service: Array<any>
}
type Food = {
    index: number 
    stt: string
    foodId: number
    name: string
    price: number
    quantity: number
    amout: number
} 
export type Order = {
    amount?:number
    foodId?:number
    index?:number
    name?:string
    price?:number
    quantity?:number
    stt?:string
    toppings?: Array<Topping>
    topping?: Array<any>
    toppingPrice?: number
    options?: Array<Option>
}
export type Topping  = {
    id: number
    name: string
    price: number
    selected : boolean
}
export type Option = {
    type: string
    value: string
    price: number
    default: string
    selected:boolean
}


// amount: 56000
// foodId: 219
// index: 1
// name: "Chả chiên giòn"
// price: 56000
// quantity: 1
// stt: "01"