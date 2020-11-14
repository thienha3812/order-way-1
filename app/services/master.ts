import apiConfig from './apiConfig';






class MasterService { 
    constructor() {

    }
    static async getCity() {
        try{
            const {data} = await apiConfig.post('master/city')
            return data
        }catch(err){
            return Promise.reject(err)
        }
    }
    static async getDistrict(cityID) {
        try{
            const {data} = await apiConfig.post(`master/city/${cityID}/district`)
            return data
        }catch(err){
            return Promise.reject(err)
        }
    }
}

export default MasterService