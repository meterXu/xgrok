import {isMainThread} from "worker_threads";
import WebSocket from "ws";
import OAuthTokensService from "../service/oauthTokensService.js";
import {clientIds, isNotify, status} from "../utils/enum.js";
import EmailService from "../service/emailService.js";
import {isEmail} from "../utils/index.js";
import OrderService from "../service/orderService.js";
export default class MainThreadWorker{
    constructor() {
        if(!this.oauthTokensService)
            this.oauthTokensService = new OAuthTokensService()
        if(!this.emailService)
            this.emailService = new EmailService()
        if(!this.orderService)
            this.orderService = new OrderService()
        if(isMainThread){
            global.heartBeatWorker.on("message",async result=>{
                switch(result.type){
                    case 'order':{
                        this.sendWebSocketMsg(result)
                    }break
                    case 'heartbeatToken':{
                        this.heartbeatToken(result)
                    }break
                    case 'checkPlanExpired':{
                        this.checkPlanExpired(result)
                    }break
                }
            })
        }
    }

    sendWebSocketMsg(data){
        global.webSocket.sendToClient(data)
    }

    heartbeatToken(data){
        // check user is online
        let findClient = null
        global.webSocket.ws.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN && client.userId === data.userId){
                findClient = client
            }
        })
        if(findClient){
            //update token
            console.log(`user [${findClient.userId}] online, refresh accessToken`)
            this.oauthTokensService.createOrUpdateOAuthToken({
                user:{id:data.userId},
                client:{id:clientIds.web},
                accessToken:data.access_token,
                accessTokenExpiresAt:data.access_token_expires_at,
                refreshToken:data.refresh_token,
                refreshTokenExpiresAt:data.refresh_token_expires_at
            }).then(()=>{
                console.log(`refresh accessToken [${findClient.userId}] successful, send websocket message to user [${data.userId}]`)
                global.webSocket.sendToClient(data)
            })
        }else{
            console.log(`user [${data.userId}] offline, delete accessToken by id [${data.access_token_id}]`)
            this.oauthTokensService.delToken(data.access_token_id)
        }
    }

    checkPlanExpired(data){
        if(isEmail(data.email)){
            console.log(`send [${data.category}] message to email [${data.email}]`)
            let emailData = data.category==='expireInOneDay'?{
                subject:'订阅通知📢 xgrok',
                html:'👋<br/>你的订阅将在一天后过期，为了不影响你的应用正常运行，请在24H内延长订阅！<br/>💵💵💵'
            }:{
                subject:'订阅通知📢 xgrok',
                html:'😊<br/>你的订阅已过期，系统已自动将其更新为【免费计划】，欢迎再次订阅！<br/>🙏🙏🙏'
            }
            this.emailService.sendEmail(data.email,emailData.subject,emailData.html)
        }
        if(data.category==='haveExpired'){
            console.log(`update order [${data.orderId}] status  is disabled`)
            Promise.all([this.orderService.editOrder({
                id:data.orderId,
                status:status.disable,
                is_expired_notify:isNotify.yes,
                expired_notify_time:new Date()
            }),this.orderService.queryPayPlan(data.userId)]).then(resAll=>{
                console.log(`update order [${data.orderId}] status successful, send websocket message to user [${data.userId}]`)
                data.plan = resAll[1]
                global.webSocket.sendToClient(data)
            })
        }else if(data.category==='expireInOneDay'){
            console.log(`update order [${data.orderId}] is_will_expire_notify  is yes`)
            this.orderService.editOrder({
                id:data.orderId,
                is_will_expire_notify:isNotify.yes,
                will_expire_notify_time:new Date()
            })
        }
    }
}