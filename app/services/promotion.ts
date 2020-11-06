import apiConfig from './apiConfig';





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
}

export default PromotionService