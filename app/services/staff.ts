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
}

export default StaffService