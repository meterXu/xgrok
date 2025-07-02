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
    },
    order: {
        query: '/api/order/query',
    },
    server: {
        query: '/api/server/query',
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

export function userQuery(data: any): Promise<ResultType<PaginationDataType>> {
    return getAction(url.user.query, data)
}

export function detailUser(data: any): Promise<ResultType<any>> {
    return postAction(url.user.detail, data)
}

export function orderQuery(data: any): Promise<ResultType<PaginationDataType>> {
    return getAction(url.order.query, data)
}

export function serverQuery(data: any): Promise<ResultType<PaginationDataType>> {
    return getAction(url.server.query, data)
}