


export const manageOrderSocket   =(storeId) => new WebSocket(`wss://api.orderway.vn/join-group/admin-${storeId}`)
export const notificationSocket = (storeId) => new WebSocket(`wss://api.orderway.vn/join-group/admin_noti-${storeId}`)
export const counterSocket = (storeId) => new WebSocket(`wss://api.orderway.vn/join-group/counter-${storeId}`)