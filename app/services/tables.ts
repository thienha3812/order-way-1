import apiConfig from './apiConfig';





class TableService { 
    constructor() {

    }
  
    static async listByCounter() { 
        try{
            const response = await apiConfig.get('table/list-by-counter')
            return response.data
        }catch(err){
            return Promise.reject(err)
        }
    }
}

export default TableService