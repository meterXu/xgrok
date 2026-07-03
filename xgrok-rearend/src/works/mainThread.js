import {isMainThread} from "worker_threads";
import WebSocket from "ws";
import OAuthTokensService from "../service/oauthTokensService.js";
import {isNotify, notifyType, status} from "../utils/enum.js";
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
                    case 'checkPlanExpired':{
                        await this.checkPlanExpired(result)
                    }break
                }
            })
        }
    }

    sendWebSocketMsg(data){
        global.webSocket.sendToClient(data)
    }

    async checkPlanExpired(data){
        if(isEmail(data.email)){
            console.log(`send [${data.category}] message to email [${data.email}]`)
            let emailData = data.category==='expireInOneDay'?{
                subject:'捐赠通知📢 xgrok',
                html:'👋<br/>你的捐赠将在一天后过期，为了不影响你的应用正常运行，请在24H内继续捐赠！<br/>💵💵💵'
            }:{
                subject:'捐赠通知📢 xgrok',
                html:'😊<br/>你的捐赠已过期，系统已自动将其更新为【不捐赠】，欢迎再次捐赠！<br/>🙏🙏🙏'
            }
            await this.emailService.sendEmail(data.email,emailData.subject,emailData.html)
        }
        if(data.category==='haveExpired'){
            console.log(`update order [${data.orderId}] status  is disabled`)
            Promise.all([this.orderService.editOrder({
                id:data.orderId,
                status:status.disable,
                is_expired_notify:isNotify.yes,
                expired_notify_time:new Date().valueOf(),
            }),this.orderService.queryPayPlan(data.userId)]).then(resAll=>{
                console.log(`update order [${data.orderId}] status successful, send websocket message to user [${data.userId}]`)
                data.plan = resAll[1]
                global.webSocket.sendToClient(data)
            })
        }else if(data.category==='expireInOneDay'){
            console.log(`update order [${data.orderId}] is_will_expire_notify  is yes`)
            await this.orderService.editOrder({
                id:data.orderId,
                is_will_expire_notify:isNotify.yes,
                will_expire_notify_time:new Date().valueOf(),
            })
        }
    }
}
