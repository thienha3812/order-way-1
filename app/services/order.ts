import { url } from 'inspector';
import apiConfig from './apiConfig';




type CancleOrderDTO = {
    id:number,
    phoneNumber?:string,
    status: string,
    type:string,
}
type SendOrderDTO = {
    id:number,
    phoneNumber?:string,
} 
type UpdateToDoneDTO = { 
    id:number,
    phoneNumber? : string,
}
type UpdateToFinishDTO = { 
    id:number,
    phoneNumber? : string,
}
class OrderService { 
    constructor() {

    }
    static async  getOrderHistory(){
        try{
            const response = await apiConfig.post('staff/order-his')
            return response
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async cancleOrder(data:CancleOrderDTO){
        try{
            await apiConfig.post('staff/update-order-status-to-canceled',data)
        }catch(err){
            return Promise.reject(err)
        }
    }    
    static async updateStatusOrderToDoing(data:SendOrderDTO){
        try{
            await apiConfig.post('staff/update-order-status-to-doing',{...data,type:"order",status:"doing"})
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async updateStatusOrderToDone(data:UpdateToDoneDTO){
        try{
            await apiConfig.post('staff/update-order-status-to-done',{...data,type:"order",status:"done"})
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async updateStatusOrderToFinish(data:UpdateToFinishDTO){
        try{
            await apiConfig.post('staff/update-order-status-to-finished',{...data,phoneNumber:null,type:"order",status:"finished"})
        }catch(err){
            return Promise.reject(err)
        }
    }
}

export default OrderService