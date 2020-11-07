import React from 'react'
import { Billment, Order, Table } from './types'



type IContext = {
    tables : Array<Table>
    openMenu:boolean
    setOpenMenu : (boolean) => void
    billment:Billment
    setBillMent : (billment:Billment) => void
    selectedOrder : Order | null
    setOrder: (order:Order | null) => void
    setOpenSelectTopping : (boolean) => void
    openSelectTopping: boolean
    openMergeTable : boolean
    setOpenMergeTable : (boolean) => void
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
    setOpenSelectTopping :(boolean) =>{ },
    openSelectTopping : false,
    setOrder : (order:Order | null) => {},
    setBillMent : (billment:Billment) => {},
    selectedOrder : null,
    openMergeTable : false,
    setOpenMergeTable : (value:boolean) =>{},
})


export const Provider = Context.Provider