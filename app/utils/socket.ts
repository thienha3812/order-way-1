

var _mSocket = undefined
var _notificationSocket = undefined
var _counterSocket = undefined
export const manageOrderSocket   =(storeId) => {
    if(!_mSocket){
        _mSocket = new WebSocket(`wss://api.orderway.vn/join-group/admin-${storeId}`)
        return _mSocket
    }
    return _mSocket
}

export const notificationSocket = (storeId) => new WebSocket(`wss://api.orderway.vn/join-group/admin_noti-${storeId}`)
export const counterSocket = (storeId) => {
    if(!_counterSocket){
        _counterSocket = new WebSocket(`wss://api.orderway.vn/join-group/counter-${storeId}`)
        return _counterSocket
    }
    return _counterSocket
}