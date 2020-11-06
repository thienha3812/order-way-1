import React from 'react';
import { Order, Orders } from './types';


type IContext = {
  orders: Orders;
  setOrders: (orders:Orders) => void;
  selected : string
};
export const DashBoarHomeContext = React.createContext<IContext>({
  orders: {
    orders_approved:[],
    orders_canceled:[],
    orders_created:[],
    orders_doing:[],
    orders_done:[],
    orders_finish:[]
  } ,
  setOrders: (orders:Orders) => {},
  selected:""
});
export const Provider = DashBoarHomeContext.Provider;
