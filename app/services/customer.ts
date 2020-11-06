import apiConfig from './apiConfig';

import {Order} from '../containers/dashboard/children/dashboard-staff-order/types'




type SendOrderDto = { 
    customerId: number | null
    customerName: string | null
    orders : Order[]
    staffId:number
    staffName: string
    storeId: string
    tableId:string
    userType:string
    request: any
}
class CustomerService { 
    constructor() {

    }
    static async sendOrder(data:SendOrderDto) {
        try{
            await apiConfig.post('customer/send-order',data)
        }catch(err){

        }
    }
}

export default CustomerService