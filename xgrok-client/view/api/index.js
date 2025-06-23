import {
    deleteAction,
    getAction,
    postAction,
    postActionNoToken,
    getActionNoToken,
    postActionSSO,
    putAction,
    postActionSSONoToken,
    getActionSSONoToken
} from "./manage"
import md5 from "js-md5"
import qs from "qs"
import {ACCESS_TOKEN} from "xxweb-box/utils/mutation-types";
import {serverEnum} from "@/libs/enums";

const url = {
    oauth:{
        authorize:"/authorize",
        validateCode:'/validateCode',
        checkUserIsExist:'/checkUserIsExist',
        sendValidateCode:'/sendValidateCode',
        register:'/register',
        changePwd:'/changePwd'
    },
    server:{
      query:'/server/query',
      detail:'/server/detail',
      checkServerOnline:'/server/checkServerOnline'
    },
    user:{
        tunnelWebConfig:'/user/tunnelWebConfig',
        tunnelServiceConfig:'/user/tunnelServiceConfig',
        queryPayPlan:'/user/queryPayPlan'
    },
    tunnel:{
        createWeb:'/tunnelWeb',
        createService:'/tunnelService',
        deleteTunnelWebBatch:'/tunnelWeb/deleteBatch',
        deleteTunnelServiceBatch:'/tunnelService/deleteBatch'
    },
    compliance:{
        queryRange:'/portRange/query',
        checkName:'/user/checkName',
        checkPort:'/user/checkPort'
    },
    client:{
        query:'/client/query',
        createClient:'/client'
    },
    email:{
        query:'/email/query',
        createEmail:'email'
    },
    product:{
        query:'/product/query',
        detail:'/product/detail'
    },
    order:{
        create:'/order',
        detail:'/order/detail',
        check:'/order/check'
    }
}

export function login(data){
    data = Object.assign({
        grant_type: "password",
        scope: "all",
        client_id: "app",
        client_secret: "abf7162029b76303d1ed302545a56b31",
        timestamp: new Date().valueOf()
    },data)
    data.password = md5(data.password)
    data.signature = md5(data.password+data.client_secret+data.timestamp)
    return postActionSSO(url.oauth.authorize,qs.stringify(data))
}
export function queryServersConfig(type=serverEnum.ngrok){
   return getAction(url.server.query,{pageNumber:1,pageSize:99,type})
}
export function detailServerConfig(id){
    return getAction(url.server.detail,{id})
}
export function queryTunnelWebConfig(serverId,clientId){
    return getAction(url.user.tunnelWebConfig,{serverId,clientId})
}
export function queryTunnelServiceConfig(serverId,clientId){
    return getAction(url.user.tunnelServiceConfig,{serverId,clientId})
}
export function updateTunnelWeb(model){
    return putAction(url.tunnel.createWeb,model)
}
export function createTunnelWeb(model){
    return postAction(url.tunnel.createWeb,model)
}
export function updateTunnelService(model){
    return putAction(url.tunnel.createService,model)
}
export function createTunnelService(model){
    return postAction(url.tunnel.createService,model)
}
export function queryRange(server_id,type){
    return getAction(url.compliance.queryRange,{
        pageNumber:1,
        pageSize:99,
        server_id,
        type})
}
export function checkName(domain,type,port,name,server_id,client_id,id){
    return getAction(url.compliance.checkName,{domain,type,port,name,server_id,client_id,id})
}
export function checkPort(domain,port,server_id,id,type){
    return getAction(url.compliance.checkPort,{domain,port,server_id,id,type})
}
export function deleteTunnelWebBatch(ids){
    return deleteAction(url.tunnel.deleteTunnelWebBatch,{ids})
}
export function deleteTunnelServiceBatch(ids){
    return deleteAction(url.tunnel.deleteTunnelServiceBatch,{ids})
}
export function queryClient(hostname){
    return getAction(url.client.query,{pageNumber:1,pageSize:1,hostname})
}
export function createClient(model){
    return postAction(url.client.createClient,model)
}
export function updateClient(model){
    return putAction(url.client.createClient,model)
}
export function getSystemInfo(){
    if(window.project.variable.mode!=='browser'){
        return window.electronAPI.getSystemInfo()
    }else{
        return Promise.resolve({
            success:true,
            data:{
                hostname:'test',
                osVersion:'v1.0'
            }
        })
    }

}
export function sendValidateCode(email,type=0){
    return getActionSSONoToken(url.oauth.sendValidateCode,{email,type})
}
export function validateCode(code,email){
    return postActionSSONoToken(url.oauth.validateCode,{email,code})
}
export function register(model){
    return postActionSSONoToken(url.oauth.register,model)
}
export function changePwd(model){
    return postActionSSONoToken(url.oauth.changePwd,model)
}
export function checkUserIsExist(username){
    return getActionSSONoToken(url.oauth.checkUserIsExist,{username})
}
export function queryPayPlan(){
    return getAction(url.user.queryPayPlan)
}
export function initWebSocket(callback){
    if(!window.ws){
        let protocols = []
        const token = window.app.config.globalProperties.$ls.get(ACCESS_TOKEN)
        if(token){
            const time = new Date().valueOf()
            protocols = [
                token.split(' ')[0],
                md5([token.split(' ')[1],time,'isaacxu'].join(' ')),
                token.split(' ')[1],
                time
            ]
        }
        window.ws  = new WebSocket(window.project.variable.wsUrl,protocols)
        window.ws.onopen=function (){
            console.log('Connected to the WebSocket server');
        }
        window.ws.onmessage=function (event){
            const data = JSON.parse(event.data)
            if(data.type==='connection')
                console.log(`Received: ${event.data}`);
            else
                callback&&callback(data)
        }
        window.ws.onclose=function (){
            console.log('Disconnected from the WebSocket server');
        }
    }
}
export function closeWebSocket(){
    window.ws&&window.ws.close(1000,'Closing normally')
    delete window.ws
}
export function queryProduct(){
    return getAction(url.product.query,{pageNumber:1,pageSize:99})
}
export function detailProduct(productId){
    return getAction(url.product.detail,{id:productId})
}
export function createOrder(product_id,pay_num){
    return postAction(url.order.create,{product_id,pay_num})
}
export function detailOrder(orderId){
    return getAction(url.order.detail,{id:orderId})
}
export function checkOrder(orderId){
    return getAction(url.order.check,{id:orderId})
}
export function checkServerOnline(domain,port){
    return getAction(url.server.checkServerOnline,{domain,port})
}
