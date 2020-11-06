import React from 'react'
import { Billment, Table } from './types'



type IContext = {
    tables : Array<Table>
    openMenu:boolean
    setOpenMenu : (boolean) => void
    billment:Billment
    setBillMent : (billment:Billment) => void
}


export const Context = React.createContext<IContext>({
    tables : [],
    openMenu:false,
    setOpenMenu : () =>{},
    billment: { 
        all_price:0,
        price:0,
        coupon:null,
        currency_type:"",
        orders:[],
        table_name:"",
        tableId:""
    },
    setBillMent : (billment:Billment) => {},
})


export const Provider = Context.Provider