interface PermissionType{
    path:string,
    meta:{
        title:string
    },
    children?:PermissionType[]
}
interface ResultType<T>{
    data?:T,
    message: string,
    success: boolean,
    code: number
}
interface PaginationType{
    total?:number,
    pageNumber: number,
    pageSize: number,
    pageSizes?:number[],
    layout?:string
}
interface PaginationDataType<T>{
    total:number,
    records: T[],
    pagination: PaginationType
}
interface DictItemType{
    key: string,
    code: string,
    chn_value: string,
    eng_value: string,
}
interface BaseType{
    sort:number,
    creator:string,
    editor:string,
    created_time:string,
    modified_time:string,
    status:number,
    is_delete:number
}
interface UserType extends BaseType{
    id:string,
    username:string,
    password:string,
    confirmPassword:string,
    nickname:string,
}
interface OrderType extends BaseType{
    id:string,
    trade_no:string,
    product_id:string,
    remark:string,
    pay_price:string,
    pay_num:number,
    pay_total_amount:string,
    payed_time:string,
    pay_time_start:string,
    pay_time_end:string,
    refund_time:string,
    pay_status:number,
    alipay_qrCode:string,
    alipay_traceId:string,
    expired_time:string
}
interface ProductType extends BaseType{
    id:string,
    name:string,
    type:number,
    price:number,
    remark:string,
}
interface ServerType extends BaseType{
    id:string,
    name:string,
    domain:string,
    port:number,
    http_port:number,
    https_port:number,
    has_ssl:number,
    ssl_expired_time:string,
    up_speed:string,
    down_speed:string,
    is_vip:number,
    is_online:number,
    region:string,
    operator:string,
    month_total_traffic:number,
    month_used_traffic:number,
    type:number
}
