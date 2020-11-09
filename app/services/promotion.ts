import apiConfig from './apiConfig';



type CheckPmtDTO = { 
    pmt_id:string
    totalPrice: number
}

class PromotionService { 
    constructor() {

    }
    static async getMenuByStoreID() {
        try{
            const response = await apiConfig.get('get-promo-by-store')
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async checkPmt(data:CheckPmtDTO){
        try{
            const response = await apiConfig.post('promotion/check-pmt',data)
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async getPromotionByStore(){
        try{
            const response = await apiConfig.get('promotion/get-promo-by-store')
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
}

export default PromotionService