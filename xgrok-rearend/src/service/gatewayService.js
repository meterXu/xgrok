import OrderService from "./orderService.js";
import {notifyStatus} from "../utils/enum.js";
import {aliPayPaymentToSys, getPaySuccessEmail, isEmail, isSysPaySuccess} from "../utils/index.js";
import EmailService from "./emailService.js";
import OAuthUsersService from "./oauthUsersService.js";
import config from "../config.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class GatewayService {
    constructor() {
        if(!this.orderService){
            this.orderService = new OrderService()
        }
        if(!this.oauthUsersService){
            this.oauthUsersService = new OAuthUsersService()
        }
        if(!this.emailService){
            this.emailService = new EmailService()
        }
    }

    async acceptMessage() {
    }

    async dealWithNotify(alipayNotifyModel,username){
        if(alipayNotifyModel.isSignPass()){
            const order = await this.orderService.detailOrderByOrderId({trade_no:alipayNotifyModel.out_trade_no})
            const _aliPayPaymentToSys  = aliPayPaymentToSys(alipayNotifyModel.trade_status)
            if(order&&alipayNotifyModel.app_id===config.alipay_appId&&order.pay_status!==_aliPayPaymentToSys){
                order.payed_time = new Date(alipayNotifyModel.gmt_payment)
                order.pay_status = _aliPayPaymentToSys
                order.is_notify = notifyStatus.yes
                order.notify_time = new Date(alipayNotifyModel.gmt_create)
                let res = await this.orderService.editOrder(order)
                let user = await this.oauthUsersService.detail(order.creator)
                if(res&&user&&isSysPaySuccess(_aliPayPaymentToSys)&&isEmail(user.username)){
                    // 发送付款成功邮件
                    console.log(`Send an email about the user[${user.username}]'s order, order's payment status is [${alipayNotifyModel.trade_status}]`)
                    const emailContent = getPaySuccessEmail(alipayNotifyModel)
                    await this.emailService.sendEmail(user.username,emailContent.subject,emailContent.html)
                }
                return  res
            }
        }else{
            return false
        }
    }
}