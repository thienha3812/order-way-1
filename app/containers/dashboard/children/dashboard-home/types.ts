export type Order = {
    orderId: number,
    table_id: number,
  table: string,
  customerName: string,
  totalPrice: number,
  time: string,
  staff_name: string,
  type: string,
  orders: Array<string>,
};


export type Orders = {
    orders_approved: Array<Order>,
    orders_doing: Array<Order>,
    orders_done: Array<Order>,
    orders_finish: Array<Order>,
    orders_canceled: Array<Order>,
    orders_created: Array<Order>,   
}