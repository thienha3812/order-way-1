import apiConfig from './apiConfig';





class MoneyBoxService { 
    constructor() {

    }
    static async getDetail() {
        try{
            const response = await apiConfig.get('money-box/detail')
            return response.data
        }catch(err){

        }
    }
}

export default MoneyBoxService