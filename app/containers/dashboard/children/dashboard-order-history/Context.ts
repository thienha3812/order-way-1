import React from 'react'



type IContext = { 
    status: string
    setStatus: (value:string) => void 
    type: string
    setType : (value:string) => void,
    setFromDate : (value:Date) => void,
    setToDate : (value:Date) => void,
    fromDate:Date,
    toDate:Date,
}

export const Context = React.createContext<IContext>({
    setStatus: (value:string) => {},
    setType : (value:string) => {},
    type: "",
    status:"",
    toDate:new Date(),
    fromDate:new Date(),
    setFromDate: (value:Date) => {},
    setToDate: (value:Date) => {}
})

export const Provider = Context.Provider