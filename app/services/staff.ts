import apiConfig from './apiConfig';


type SearchOrderHistoryDTO  = { 
    fromDate?:string | null
    limit?: number
    offset?: number
    status?: string | null
    toDate?: string | null
    type?: string | null
}

type SearchBillHistoryDTO =  {
    fromDate: string
    limit: number
    offset: number
    phoneNumber: string
    status: string | null
    table: number | null
    toDate: string
}

type MergeTableDTO = {
    table_id: number
    merge_with: Array<number>
}
type CleanTableDTO = {
    tableId : number
}
type ChangeTableDTO ={
    table_id_new: number 
    table_id_old: number
}
type SearchPhoneDTO = {
    phone_number: string
}
type UpdateCustomerIntoOrderDTO = {
    orderId: number
    cusId: number
}
type CancelOrderDTO = {
    customerId: number
    customerName: string
    foods: Array<any>
    orderId: Array<number>
    orders: Array<any>
    request: null
    staffId: number
    staffName: string
    table: string    
    tableId: number
    time: string
    totalPrice: number
    type: string
    userType: string
}
type UpdateStoreOrderInfo = {
    id: number
    customer_id: number
    customer_name: string
    table_id: number
    table_name: string
    total: number | 0
    foods: Array<any>
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
    rate_discount?: number | 0
    store_id?: string
    service: Array<any>
    promotionId: Array<any>
}
type SendCancelFoodDTO = {
    customerId:  number | null
    customerName: string
    orderId: Array<any>
    orders: Array<any>
    staffId: number
    staffName: string
    table: string
    tableId: number
    userType: string
}
type UpdateOrderToApprovedDTO = {
    id: number
    phoneNumber: string   | null 
}
class StaffService { 
    constructor() {
    }
    static async getPaymentInfo(tableID) { 
        try{
            const response = await apiConfig.post('staff/get-payment-info', {
                id : tableID
            })
            return response.data.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async mergeTable(data:MergeTableDTO){
        try{            
            const response = await apiConfig.post('staff/merge-table',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async cleanTable(data:CleanTableDTO){
        try{            
            const response = await apiConfig.post('staff/clean-table',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async  searchOrderHistory(data:SearchOrderHistoryDTO){        
        try{
            if(data.type === "all"){
                data.type = null
            }
            if(data.status === "all"){
                data.status = null
            }
            const response = await apiConfig.post('staff/search-order-his',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async changeTable(data:ChangeTableDTO){
        try{
            const response = await apiConfig.post('staff/change-table',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async  searchBillHistory(data:SearchBillHistoryDTO){        
        try{
            if(data.status === "all"){
                data.status = null
            }
            const response = await apiConfig.post('staff/search-total-order-his',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async searchCustomer(data:SearchPhoneDTO){
        try{
            const response = await apiConfig.post('staff/search-customer',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async updateCustomerIntoOrder(data:UpdateCustomerIntoOrderDTO){
        try{
            const response = await apiConfig.post('staff/update-cus-into-order',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }   
    }
    static async getOrderInfo(id){
        try{
            const response = await apiConfig.post('staff/get-order-info',{id})
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async cancelOrder(data:CancelOrderDTO){
        try{
            const response = await apiConfig.post('staff/send-cancel-order',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async updatStoreOrderInfo(data:Partial<UpdateStoreOrderInfo>){
        try{
            const response = await apiConfig.post('staff/update-store-order-info',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async confirmPayMent(data:Partial<UpdateStoreOrderInfo>){
        try{
            const response = await apiConfig.post('staff/confirm-payment',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async sendCancelFood(data:SendCancelFoodDTO){
        try{
            const response = await apiConfig.post('staff/send-cancel-food',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async updateOrderStatusToApproved(data:UpdateOrderToApprovedDTO){
        try{
            const response = await apiConfig.post('staff/update-order-status-to-approved',{...data,status: "approved",type: "order"})
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async getBillMentInfo  (orderId){
        try {   
            const response = await apiConfig.post('staff/get-bill-info-for-print',{orderId})
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async staffOption(){
        try{
            const response = await apiConfig.get('staff/staff-option')
            return response.data
        }catch(err){

        }
    }
}

export default StaffService