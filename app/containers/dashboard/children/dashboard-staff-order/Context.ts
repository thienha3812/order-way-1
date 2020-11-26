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
    openChangeTable : boolean
    setOpenChangeTable : (boolean) => void
    openCancelOrder : boolean
    setOpenCancelOrder : (boolean) => void
    openScanCoupon : boolean
    setOpenScanCoupon : (boolean) => void
    openTypeCoupon : boolean
    setOpenTypeCoupon : (boolean) => void
    openCancelFood : boolean
    setOpenCancelFood : (boolean) => void
    paidOrder : any 
    setPaidOrder : (any) => void
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
    openChangeTable: false,
    setOpenChangeTable :(value:boolean) =>{},
    setOpenCancelOrder : (value:boolean) =>{ },
    openCancelOrder : false,
    openScanCoupon:false,
    setOpenScanCoupon:(value:boolean) =>{},
    openTypeCoupon:false,
    setOpenTypeCoupon:(value:boolean) =>{},
    openCancelFood : false,
    setOpenCancelFood : (value:boolean) =>{},
    paidOrder:{},
    setPaidOrder: (value:any) =>{ }
})


export const Provider = Context.Provider