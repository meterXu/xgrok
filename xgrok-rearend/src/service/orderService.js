import {
    aliPayPaymentToSys,
    getPayRefundEmail,
    getPaySuccessEmail, getSubjectName,
    isEmail,
    isSysPaySuccess,
    randomUUID
} from "../utils/index.js";
import {isDelete, isNotify, payStatus, planType, status, VIPType} from "../utils/enum.js";
import {Prisma} from "@prisma/client";
import ProductService from "./productService.js";
import moment from "moment";
import config from "../config.js";
import EmailService from "./emailService.js";
import OAuthUsersService from "./oauthUsersService.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class OrderService {
    constructor() {
        if(!this.productService){
            this.productService  = new ProductService()
        }
        if(!this.oauthUsersService){
            this.oauthUsersService = new OAuthUsersService()
        }
        if(!this.emailService){
            this.emailService = new EmailService()
        }
    }

    async queryOrder(pagination, orderBy, orderModel) {
        const where = [
            orderModel.pay_time_start && `a.payed_time >= '${orderModel.pay_time_start}'`,
            orderModel.pay_time_end && `a.payed_time <= '${orderModel.pay_time_end}'`,
            orderModel.pay_status && `a.pay_status = ${orderModel.pay_status}`,
            orderModel.creator && `a.creator = '${orderModel.creator}'`,
            `a.status=${status.enable}`,
            `a.is_delete=${isDelete.false}`
        ].filter(c => c).join(' and ')

        const totalSql =   `
        select count(*) _all from ng_order a
        inner join ng_product b on a.product_id = b.id and b.status=${status.enable} and b.is_delete=${isDelete.false}
        ${where ? `where ${where}` : ''} `

        const querySql = `
        select a.id,b.name,b.type,a.expired_time,a.pay_price,a.pay_status,a.payed_time,a.refund_time,a.remark from ng_order a
        inner join ng_product b on a.product_id = b.id and b.status=${status.enable} and b.is_delete=${isDelete.false}
        ${where ? `where ${where}` : ''}
        order by a.sort asc,a.created_time desc  
        limit ${(pagination.pageNumber - 1) * pagination.pageSize},${pagination.pageSize}
        `
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all,recordRes]
    }

    async queryOrderList(orderQuery){
        const where = [
            orderQuery.pay_status!==undefined && `pay_status = ${orderQuery.pay_status}`,
            `status=${status.enable}`,
            `is_delete=${isDelete.false}`
        ].filter(c => c).join(' and ')
        return await prisma.$queryRaw(Prisma.raw(`select * from ng_order ${where ? `where ${where}` : ''}`))
    }

    async detailOrder(orderModel) {
        return await prisma.ng_order.findUnique({where: {id: orderModel.id}})
    }

    async detailOrderByOrderId(orderModel) {
        return await prisma.ng_order.findFirst({where: {trade_no: orderModel.trade_no}})
    }

    async addOrder(orderModel,userId) {
        const productModel = await this.productService.detailProduct({id:orderModel.product_id})
        let out_trade_no = new moment().format('yyyyMMDDHHmmssms').toString()
        const pay_total_amount = (parseFloat(productModel.price)*orderModel.pay_num).toString()
        const subject = getSubjectName(productModel.name,orderModel.pay_num)
        let alipayRes =  await this.createAliPayOrder(out_trade_no,pay_total_amount,subject)
        if(alipayRes.hasOwnProperty('qrCode')){
            orderModel.alipay_qrCode = alipayRes.qrCode
            orderModel.alipay_traceId = alipayRes.traceId
            let nowPlan = await this.queryPayPlan(userId)
            let res = await prisma.ng_order.create({
                data:{
                    /** generate by CodeGirl */
                    id: orderModel.id || randomUUID(),
                    trade_no: out_trade_no,
                    product_id: orderModel.product_id,
                    remark: orderModel.remark,
                    pay_total_amount: pay_total_amount,
                    pay_price: productModel.price,
                    pay_num: orderModel.pay_num,
                    payed_time: orderModel.payed_time,
                    pay_status: payStatus.unPayment,
                    refund_time:orderModel.refund_time,
                    alipay_qrCode:orderModel.alipay_qrCode,
                    alipay_traceId:orderModel.alipay_traceId,
                    sort: orderModel.sort,
                    creator: userId,
                    editor: orderModel.editor,
                    created_time: orderModel.created_time,
                    modified_time: orderModel.modified_time,
                    expired_time:this.getPlanExpiredTime(nowPlan,productModel.type,orderModel.pay_num),
                    status: orderModel.status,
                    is_delete: orderModel.is_delete,
                }
            })
            if(res){
                return Object.assign(alipayRes,{id:res.id})
            }else{
                return null
            }
        }else{
            console.error(`调用alipay.trade.pay失败,${JSON.stringify(alipayRes)}`)
            return null
        }
    }

    async editOrder(orderModel) {
        let res = await prisma.ng_order.update({where: {id: orderModel.id}, data: orderModel});
        return res
    }

    async delOrder(id) {
        const res = await prisma.ng_order.update({data: {is_delete: isDelete.true,}, where: {id: id}})
        return res
    }

    async queryPayPlan(userId){
        const querySql = `select b.name,b.type,a.expired_time,a.pay_status from ng_order a
                            inner join ng_product b on a.product_id = b.id and b.status=${status.enable} and b.is_delete=${isDelete.false}
                            where a.creator='${userId}' 
                            and a.status=${status.enable} and a.is_delete=${isDelete.false} and a.pay_status in (${payStatus.paymentSuccess},${payStatus.paymentFinished})
                            and a.expired_time > now()
                            order by a.created_time desc limit 0,1`
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return recordRes.length>0?{
            ...VIPType.vip,
            plan:{
                name:recordRes[0].name,
                type:recordRes[0].type,
                expired_time:recordRes[0].expired_time
            }
        }:{
            ...VIPType.no,
            plan: {
                name:'免费计划',
                type:0,
                expired_time:new Date("2999-12-31T23:59:59Z")
            }
        }
    }

    getPlanExpiredTime(nowPlan,productType,payNum){
        let expiredTime,amount,unit = null
        switch (productType){
            case planType.year:{
                amount = 1*payNum
                unit='year'
            }break
            case planType.quarter:{
                amount = 3*payNum
                unit='month'
            }break
            default:{
                amount = 1*payNum
                unit = 'month'
            }break
        }
        expiredTime = new moment(nowPlan.value===planType.free?new Date():nowPlan.expired_time).add(amount,unit).toDate()
        return expiredTime
    }

    async createAliPayOrder(out_trade_no,total_amount,subject){
        return global.alipaySdk.exec("alipay.trade.precreate", {
            notify_url:config.notify_url,
            bizContent: {
                out_trade_no: out_trade_no,
                total_amount: total_amount,
                subject: subject,
            },
        });
    }

    async checkOrder(orderId){
        const orderModel = await this.detailOrder({id:orderId})
        if(orderModel){
            if(orderModel.pay_status===payStatus.unPayment){
                console.log(`go to alipay to check the status of your order`)
                const alipayOrderRes = await this.queryAliPayOrder(orderModel.trade_no)
                const _aliPayStatusSys = aliPayPaymentToSys(alipayOrderRes.tradeStatus)
                console.log(`alipay return order status is ${JSON.stringify(alipayOrderRes)}`)
                if(orderModel.pay_status!==_aliPayStatusSys){
                    orderModel.pay_status = _aliPayStatusSys
                    orderModel.payed_time = alipayOrderRes.sendPayDate?new Date(alipayOrderRes.sendPayDate):null
                    const editRes = await this.editOrder(orderModel)
                    if(editRes){
                        let user = await this.oauthUsersService.detail(orderModel.creator)
                        let product = await this.productService.detailProduct({id:orderModel.product_id})
                        if(isSysPaySuccess(_aliPayStatusSys)&&user&&product&&isEmail(user.username)){
                            // 发送付款成功邮件
                            console.log(`Send an email about the user[${user.username}]'s order, order's payment status is [${alipayOrderRes.tradeStatus}]`)
                            const emailContent = getPaySuccessEmail({
                                out_trade_no:alipayOrderRes.outTradeNo,
                                total_amount:alipayOrderRes.totalAmount,
                                gmt_create:alipayOrderRes.sendPayDate,
                                trade_status:alipayOrderRes.tradeStatus,
                                subject:getSubjectName(product.name,orderModel.pay_num)
                            })
                            await this.emailService.sendEmail(user.username,emailContent.subject,emailContent.html)
                        }
                        return _aliPayStatusSys
                    }else{
                        return payStatus.paymentClose
                    }
                }else{
                    return orderModel.pay_status
                }
            }else{
                return orderModel.pay_status
            }
        }else{
            return payStatus.unPayment
        }
    }

    async closeOrder(orderId){
        const order = await this.detailOrder({id:orderId})
        if(order.pay_status===payStatus.unPayment){// 真的没有付款
            order.pay_status=payStatus.paymentClose
            // 关闭订单
            const editRes = await this.editOrder(order)
            await this.closeAliPayOrder(order.trade_no)
            return !!editRes
        }else {
            return order.pay_status===payStatus.paymentClose
        }
    }

    queryAliPayOrder(out_trade_no){
        return global.alipaySdk.exec("alipay.trade.query", {
            bizContent: {
                out_trade_no: out_trade_no,
            }
        })
    }
    closeAliPayOrder(out_trade_no){
        return global.alipaySdk.exec("alipay.trade.close", {
            bizContent: {
                out_trade_no: out_trade_no,
            }
        })
    }

    async queryExpireTaskOrder(){
        const expiresAfterOneDay=`SELECT a.id,a.creator,a.expired_time,c.username FROM ng_order a JOIN (
SELECT creator, MAX(expired_time) AS max_expired_time FROM ng_order
WHERE status = 1 AND is_delete = 0 AND pay_status = 1 AND is_will_expire_notify = ${isNotify.no}  AND expired_time BETWEEN NOW() AND NOW() + INTERVAL 1 DAY
GROUP BY creator
) b ON a.creator = b.creator AND a.expired_time = b.max_expired_time
left join oauth_users c on a.creator = c.id`

        const itHasExpired = `select a.id,a.creator,a.expired_time,c.username from ng_order a JOIN (
select a.creator,max(a.expired_time) max_expired_time from ng_order a
where a.status=1 and a.is_delete=0  and a.pay_status=1 and is_expired_notify = ${isNotify.no} and a.expired_time<=now()
group by a.creator
) b ON a.creator = b.creator AND a.expired_time = b.max_expired_time
left join oauth_users c on a.creator = c.id`

        return prisma.$transaction([
            prisma.$queryRaw(Prisma.raw(expiresAfterOneDay)),
            prisma.$queryRaw(Prisma.raw(itHasExpired))
        ])
    }

    async refund(out_trade_no,refund_amount,refund_reason,out_request_no=out_trade_no){
        const alipayRefundRes =  await global.alipaySdk.exec("alipay.trade.refund",{
            bizContent:{
                out_trade_no: out_trade_no,
                refund_amount: refund_amount,
                refund_reason: refund_reason,
                out_request_no: out_request_no,
            }
        })
        if(alipayRefundRes.code==='10000'){
            let orderModel = await this.detailOrderByOrderId({trade_no:out_trade_no})
            orderModel.pay_status = payStatus.paymentRefund
            orderModel.refund_time = new Date()
            orderModel.refund_amount = refund_amount
            orderModel.refund_reason = refund_reason
            orderModel.out_request_no = out_request_no
            await this.editOrder(orderModel)
            let user = await this.oauthUsersService.detail(orderModel.creator)
            let product = await this.productService.detailProduct({id:orderModel.product_id})
            if(isEmail(user.username)&&product&&orderModel){

                // 发送退款成功邮件
                console.log(`Send a refund success email to user [${user.username}]`)
                const emailContent = getPayRefundEmail({
                    out_trade_no:out_trade_no,
                    subject:getSubjectName(product.name,orderModel.pay_num),
                    total_amount:orderModel.pay_total_amount,
                    refund_amount:refund_amount,
                    refund_reason:refund_reason,
                    refund_time:new Date()
                })
                await this.emailService.sendEmail(user.username,emailContent.subject,emailContent.html)
                // 向前端发送付款状态
                global.webSocket.sendToClient({
                    type:'order',
                    userId:orderModel.creator,
                    isRefundSuccess:true,
                    orderId:orderModel.id
                })
            }
            return true
        }else{
            return false
        }

    }
}