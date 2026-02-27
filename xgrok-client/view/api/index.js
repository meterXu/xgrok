import {
    deleteAction,
    getAction,
    postAction,
    postActionSSO,
    putAction,
    postActionSSONoToken,
    getActionSSONoToken,
    getActionNoToken,
    getActionWebClient,
    putActionWebClient
} from "./manage"
import md5 from "js-md5"
import qs from "qs"
import {ACCESS_TOKEN} from "xxweb-util";
import {clientType, isDeleteType, serverEnum, statusType} from "@/libs/enums";
import reconnectingWebSocket from 'reconnecting-websocket'
import {useClientType, useClientTypeExecute} from "@/libs/useAction";
import {useAppStore} from "@/store";

const url = {
    oauth: {
        authorize: "/authorize",
        validateCode: '/validateCode',
        checkUserIsExist: '/checkUserIsExist',
        sendValidateCode: '/sendValidateCode',
        register: '/register',
        changePwd: '/changePwd'
    },
    server: {
        query: '/server/query',
        detail: '/server/detail',
        checkServerOnline: '/server/checkServerOnline'
    },
    user: {
        tunnelWebConfig: '/user/tunnelWebConfig',
        tunnelServiceConfig: '/user/tunnelServiceConfig',
        queryPayPlan: '/user/queryPayPlan',
        queryTunnelCount: '/user/queryTunnelCount'
    },
    tunnel: {
        createWeb: '/tunnelWeb',
        createService: '/tunnelService',
        deleteTunnelWebBatch: '/tunnelWeb/deleteBatch',
        deleteTunnelServiceBatch: '/tunnelService/deleteBatch'
    },
    compliance: {
        queryRange: '/portRange/query',
        checkName: '/user/checkName',
        checkPort: '/user/checkPort',
        checkWeb: '/user/checkWeb',
        checkService: '/user/checkService'
    },
    client: {
        query: '/client/query',
        queryList: '/client/queryList',
        queryByHostNameOrDeviceId:'/client/queryByHostNameOrDeviceId',
        createClient: '/client'
    },
    email: {
        query: '/email/query',
        createEmail: 'email'
    },
    product: {
        query: '/product/query',
        detail: '/product/detail'
    },
    order: {
        create: '/order',
        detail: '/order/detail',
        check: '/order/check'
    },
    version: {
        list: '/version/list',
        latest: '/version/latest'
    },
    assets: {
        detail: '/assets/detail'
    },
    webClient: {
        config: {
            appConfig: '/config/appConfig'
        },
        system:{
            info:'/system/info',
            turnOn:'/system/turnOn',
            turnOff:'/system/turnOff',
            log:'/system/log'
        }
    },
    system:{
        checkTcpLatency:'/system/checkTcpLatency',
        speedAndTraffic:'/system/speedAndTraffic'
    }
}

export function login(data) {
    data = Object.assign({
        grant_type: "password",
        scope: "all",
        client_id:  useClientType().value===clientType.electron?'app':'web',
        client_secret: "abf7162029b76303d1ed302545a56b31",
        timestamp: new Date().valueOf()
    }, data)
    data.password = md5(data.password)
    data.signature = md5(data.password + data.client_secret + data.timestamp)
    return postActionSSO(url.oauth.authorize, qs.stringify(data))
}

export function queryServersConfig(type = serverEnum.ngrok,clientId) {
    return getAction(url.server.query, {
        pageNumber: 1,
        pageSize: 99,
        type,
        clientId,
        status: statusType.enable,
        is_delete: isDeleteType.no
    })
}

export function detailServerConfig(id) {
    return getAction(url.server.detail, {id})
}

export function queryTunnelWebConfig(serverId, clientId) {
    return getAction(url.user.tunnelWebConfig, {serverId, clientId})
}

export function queryTunnelServiceConfig(serverId, clientId) {
    return getAction(url.user.tunnelServiceConfig, {serverId, clientId})
}

export function updateTunnelWeb(model) {
    return putAction(url.tunnel.createWeb, model)
}

export function createTunnelWeb(model) {
    return postAction(url.tunnel.createWeb, model)
}

export function updateTunnelService(model) {
    return putAction(url.tunnel.createService, model)
}

export function createTunnelService(model) {
    return postAction(url.tunnel.createService, model)
}

export function queryRange(server_id, type) {
    return getAction(url.compliance.queryRange, {
        pageNumber: 1,
        pageSize: 99,
        server_id,
        type,
        status: statusType.enable,
        is_delete: isDeleteType.no
    })
}

export function checkName(domain, type, port, name, server_id, client_id, id) {
    return getAction(url.compliance.checkName, {domain, type, port, name, server_id, client_id, id})
}

export function checkWeb(name, domain, port) {
    return getAction(url.compliance.checkWeb, {name, domain, port})
}

export function checkService(domain, port, type) {
    return getAction(url.compliance.checkService, {domain, port, type})
}

export function checkPort(domain, port, server_id, id, type) {
    return getAction(url.compliance.checkPort, {domain, port, server_id, id, type})
}

export function deleteTunnelWebBatch(ids) {
    return deleteAction(url.tunnel.deleteTunnelWebBatch, {ids})
}

export function deleteTunnelServiceBatch(ids) {
    return deleteAction(url.tunnel.deleteTunnelServiceBatch, {ids})
}

export function queryByHostNameOrDeviceId(hostname,device_id) {
    return getAction(url.client.queryByHostNameOrDeviceId, {
        hostname,
        device_id
    })
}

export function queryClientList(){
    return getAction(url.client.queryList)
}

export function createClient(model) {
    return postAction(url.client.createClient, model)
}

export function updateClient(model) {
    return putAction(url.client.createClient, model)
}

export function getSystemInfo() {
    return useClientTypeExecute(()=>{
        return getActionWebClient(url.webClient.system.info)
    },()=>{
        return window.electronAPI.getSystemInfo()
    })
}

export function sendValidateCode(email, type = 0) {
    return getActionSSONoToken(url.oauth.sendValidateCode, {email, type})
}

export function validateCode(code, email) {
    return postActionSSONoToken(url.oauth.validateCode, {email, code})
}

export function register(model) {
    return postActionSSONoToken(url.oauth.register, model)
}

export function changePwd(model) {
    return postActionSSONoToken(url.oauth.changePwd, model)
}

export function checkUserIsExist(username) {
    return getActionSSONoToken(url.oauth.checkUserIsExist, {username})
}

export function queryPayPlan() {
    return getAction(url.user.queryPayPlan)
}

export function initWebSocket(callback) {
    if (!window.ws) {
        window.ws = new reconnectingWebSocket(()=>{
            const token = window.app.config.globalProperties.$ls.get(ACCESS_TOKEN)
            const store = useAppStore()
            return window.project.variable.wsUrl+'?token='+token?.split(' ')[1]+`&clientId=${store.clientId.value}`
        },  ['isaacxu',useClientType().value===clientType.electron?'app':'web'], {
            maxReconnectionDelay: 20000, // 断开后最大的重连时间： 20s，每多一次重连，会增加 1.3 倍，5 * 1.3 * 1.3 * 1.3...
            minReconnectionDelay: 5000, // 断开后最短的重连时间： 5s
            maxRetries: 5
        })
        window.ws.onopen = function () {
            console.log('Connected to the WebSocket server');
        }
        window.ws.onmessage = function (event) {
            const data = JSON.parse(event.data)
            if (data.type === 'connection')
                console.log(`Received: ${event.data}`);
            else
                callback && callback(data)
        }
        window.ws.onclose = function () {
            console.log('Disconnected from the WebSocket server');
        }
    }
}

export function closeWebSocket() {
    window.ws && window.ws.close(1000, 'Closing normally')
    delete window.ws
}

export function queryProduct() {
    return getAction(url.product.query, {
        pageNumber: 1, pageSize: 99, status: statusType.enable,
        is_delete: isDeleteType.no
    })
}

export function detailProduct(productId) {
    return getAction(url.product.detail, {id: productId})
}

export function createOrder(product_id, pay_num) {
    return postAction(url.order.create, {product_id, pay_num})
}

export function detailOrder(orderId) {
    return getAction(url.order.detail, {id: orderId})
}

export function checkOrder(orderId) {
    return getAction(url.order.check, {id: orderId})
}

export function checkServerOnline(domain, port) {
    return getAction(url.server.checkServerOnline, {domain, port})
}

export function versionList() {
    return getActionNoToken(url.version.list)
}

export function versionLatest() {
    return getActionNoToken(url.version.latest)
}

export function detailAssets(name) {
    return getAction(url.assets.detail, {name})
}

export function queryTunnelCount(serverId, clientId) {
    return getAction(url.user.queryTunnelCount, {serverId, clientId})
}

export function getXgrokAppCfg() {
    return getActionWebClient(url.webClient.config.appConfig)
}

export function setXgrokAppCfg(data) {
    return putActionWebClient(url.webClient.config.appConfig,data)
}

export function serviceTurnOn(data){
    return putActionWebClient(url.webClient.system.turnOn,data)
}

export function serviceTurnOff(data){
    return putActionWebClient(url.webClient.system.turnOff,data)
}

export function getLog(startIndex,length){
    return getActionWebClient(url.webClient.system.log+`?startIndex=${startIndex}&length=${length}`)
}

export function checkTcpLatency(serverId){
    return getAction(url.system.checkTcpLatency, {serverId})
}

export function speedAndTraffic(serverId,clientId){
    return getAction(url.system.speedAndTraffic,{serverId,clientId})
}
