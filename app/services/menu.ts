import apiConfig from './apiConfig';





class MenuService { 
    constructor() {

    }
    static async getMenuByStoreID(storeID:number) {
        try{
            const response = await apiConfig.get(`menu/customer/${storeID}`)
            return response.data
        }catch(err){

        }
    }
}

export default MenuService