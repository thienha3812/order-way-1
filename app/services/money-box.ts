import apiConfig from './apiConfig';



type Add = {
    cash: number
    credit: number
    e_money: number
    moneyContent: string
    moneyNumber: number
    toDay: string 
    type: 'fund'  | "plus" | 'minus'
}
type Search = {
    limit: number
    moneyType: any
    offset: number
    staff: any
    type: any
}

class MoneyBoxService { 
    constructor() {

    }
    static async getDetail(toDay:string) {
        try{
            const response = await apiConfig.post(`money-box/detail`,{toDay})
            return response.data
        }catch(err){

        }
    }
    static async add(data:Add){
        try{
            const response = await apiConfig.post('/money-box/add',data)
            return response.data
        }catch(err){

        }
    }
    static async search(data:Search){
        try{
            const response = await apiConfig.post('/money-box/search',data)
            return response.data
        }catch(err){

        }
    }
    static async closeDay(){
        try{
            const response = await apiConfig.get('/money-box/close-day')
            return response.data
        }catch(err){

        }
    }
}

export default MoneyBoxService