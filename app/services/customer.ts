import apiConfig from './apiConfig';

import {Order} from '../containers/dashboard/children/dashboard-staff-order/types'


import moment from 'moment'

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
export type AddCustomerByStaffDTO = {
    birthday: string | null | Date
    city_id: number
    district_id: number
    name: string
    gender: "1" | "2" | "3"
    phone: string
    phone_number: string
}
class CustomerService { 
    constructor() {

    }
    static async sendOrder(data:SendOrderDto) {
        try{
            await apiConfig.post('customer/send-order',data)
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async addCustomerByStaff(data:AddCustomerByStaffDTO){
        try{
            const response = await apiConfig.post('customer/add-by-staff',{...data,birthday:moment(data.birthday).format('YYYY-MM-DD')})
            return response.data

        }catch(err){
            return Promise.reject(err)
        }
    }
}

export default CustomerService