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
}

export default StaffService