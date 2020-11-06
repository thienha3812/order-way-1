import React from 'react'



type IContext = { 
    status: string
    setStatus: (value:string) => void 
    table: number | null
    setTable : (value:number) => void,
    setFromDate : (value:Date) => void,
    setToDate : (value:Date) => void,
    fromDate:Date,
    toDate:Date,
    phone: string | null
    setPhone: (value:string) => void 
}

export const Context = React.createContext<IContext>({
    setStatus: (value:string) => {},
    setTable : (value:number) => {},
    table: null,
    status:"",
    toDate:new Date(),
    fromDate:new Date(),
    setFromDate: (value:Date) => {},
    setToDate: (value:Date) => {},
    setPhone : (value:string) => {},
    phone: ""
})

export const Provider = Context.Provider