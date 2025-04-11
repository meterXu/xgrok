import {request, summary, tags} from "koa-swagger-decorator";
import ResultModel from "../model/sys/resultModel.js";
import GatewayService from "../service/gatewayService.js";
import AlipayNotifyModel from "../model/alipayNotifyModel.js";
import EmailService from "../service/emailService";

const tag = tags(['gateway'])
export default class GatewayController {
    constructor() {
        if(!this.gatewayService){
            this.gatewayService = new GatewayService()
        }
        if(!this.emailService){
            this.emailService = new EmailService()
        }
    }
    @request('get', '/gateway')
    @summary('支付网关')
    @tag
    async acceptMessage(ctx) {
        await this.gatewayService.acceptMessage()
        const res = new ResultModel('hello world', null, true)
        ctx.result(res)
    }

    @request('post', '/gateway/notify')
    @summary('通知回调地址')
    @tag
    async notify(ctx) {
        console.log('alipay notify post formData',ctx.request.body)
        const alipayNotifyModel = new AlipayNotifyModel(ctx.request.body)
        const result = await this.gatewayService.dealWithNotify(alipayNotifyModel)
        if(result){
            // 向前端发送付款状态
            global.webSocket.sendToClient({
                type:'order',
                userId:result.creator,
                isPaySuccess:true,
                orderId:result.id
            })
        }
        const res = new ResultModel('hello world', null, !!result)
        ctx.result(res)
    }

}