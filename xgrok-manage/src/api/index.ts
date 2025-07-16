import {getAction, postAction, putAction, deleteAction} from "./manage.js"
import md5 from "js-md5"
import qs from "qs"

const url = {
    oauth: {
        authorize: "/oauth/authorize"
    },
    dict: {
        list: '/api/sysDict/query'
    },
    user: {
        query: '/api/user/query',
        detail: '/api/user/detail',
        modify:'/api/user'
    },
    order: {
        query: '/api/order/query',
        modify: '/api/order',
        modifyManual:'/api/order/manual'
    },
    server: {
        query: '/api/server/query',
        modify: '/api/server',
    },
    product: {
        query: '/api/product/query'
    }
}

export function getDict(key: string) {
    return getAction(url.dict.list, {key, pageNumber: 1, pageSize: 99})
}

export function login(data: any): Promise<ResultType<any>> {
    data = Object.assign({
        grant_type: "password",
        scope: "all",
        client_id: "web",
        client_secret: "abf7162029b76303d1ed302545a56b31",
        timestamp: new Date().valueOf()
    }, data)
    data.password = md5(data.password)
    data.signature = md5(data.password + data.client_secret + data.timestamp)
    const _headers = {} as any
    _headers[window.project.variable.tokenKey] = null
    return postAction(url.oauth.authorize, qs.stringify(data), _headers)
}

export function userQuery(data: any): Promise<ResultType<PaginationDataType<UserType>>> {
    return getAction(url.user.query, data)
}

export function detailUser(data: any): Promise<ResultType<UserType>> {
    return getAction(url.user.detail, data)
}

export function addUser(data: UserType): Promise<ResultType<any>> {
    return putAction(url.user.modify, data)
}

export function editUser(data: UserType): Promise<ResultType<any>> {
    return postAction(url.user.modify, data)
}

export function orderQuery(data: any): Promise<ResultType<PaginationDataType<OrderType>>> {
    return getAction(url.order.query, data)
}

export function addOrder(data: OrderType): Promise<ResultType<any>> {
    return postAction(url.order.modifyManual, data)
}

export function editOrder(data: OrderType): Promise<ResultType<any>> {
    return putAction(url.order.modify, data)
}

export function serverQuery(data: any): Promise<ResultType<PaginationDataType<{[key:string]:any}>>> {
    return getAction(url.server.query, data)
}

export function detailServer(data: any): Promise<ResultType<any>> {
    return putAction(url.server.modify, data)
}

export function productQuery(data:any):Promise<ResultType<PaginationDataType<ProductType>>> {
    return getAction(url.product.query, data)
}