interface ProjectType {
    nameSpace: string,
    variable: {
        tokenKey: string,
        baseApi: string,
        base: string,
    },
    redirect: { index: string, login: string, "404": string, '403': string },
    style: { theme: string, layout: string, multiPage: boolean },
    config: {
        logo: string,
        favicon: string,
        title: string,
        login: { title: string, desc: string, },
        menu: { mode: string },
        head: {
            hamburger: boolean,
            logo: { show: boolean, },
            title: { show: boolean, desktop: string, mobile: string },
            breadcrumb: { show: boolean, },
            searchMenu: { show: boolean },
            helper: { show: boolean, href: string, target: string },
            fullscreen: { show: boolean, },
            user: {
                show: boolean,
                username: boolean,
                menu: { show: boolean, clearCache: boolean, changePwd: boolean, exitSystem: boolean }
            }
        },
        sideMenu: {
            title: string,
            width: string,
            logo: { show: boolean, },
            hamburger: boolean,
            user: {
                show: boolean,
                username: boolean,
                tag: boolean,
                menu: { show: boolean, clearCache: boolean, changePwd: boolean, exitSystem: boolean }
            }
        },
        tabs: { show: boolean, icon: boolean },
        footer: {
            show: boolean,
            links: any[],
            copyright: { content: string, year: number, href: string, target: string }
        },
        plugins: object
    }
}
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
declare type UserType={
    id:string,
    username:string,
    password:string,
    nickName:string,
}
declare type OrderType={
    id:string,
    trade_no:string,
    product_id:string,
    remark:string,
    pay_price:string,
    pay_num:string,
    pay_total_amount:string,
    payed_time:string,
    pay_time_start:string,
    pay_time_end:string,
    refund_time:string,
    pay_status:number,
    alipay_qrCode:string,
    alipay_traceId:string,
    sort:number,
    creator:string,
    username:string,
    editor:string,
    created_time:string,
    modified_time:string,
    expired_time:string,
    status:number,
    is_delete:number
}