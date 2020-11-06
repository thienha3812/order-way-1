


export const manageOrderSocket   =(storeId) => new WebSocket(`wss://api.orderway.vn/join-group/admin-${storeId}`)
