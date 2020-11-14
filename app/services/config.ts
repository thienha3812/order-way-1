import apiConfig from './apiConfig';






class ConfigService { 
    constructor() {

    }
    static async getConfig() {
        try{
            const {data} = await apiConfig.get('sys-config/detail')
            return data
        }catch(err){
            return Promise.reject(err)
        }
    }
    
}

export default ConfigService