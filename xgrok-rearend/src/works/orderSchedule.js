import OrderService from '../service/orderService.js'
import {isDelete, payStatus, status} from '../utils/enum.js'
import {initLog, isSysPaySuccess} from "../utils/index.js";

export default class OrderSchedule {
    constructor() {
        this.taskTimer = null
        this.taskNum = 0
        this.taskLoop = 60*1000
        this.taskLoopNum = 5
        this.createLoop = 10*60*1000
        if(!this.orderService){
            this.orderService = new OrderService()
        }
    }
    // 获取未完成的订单
    async queryUnPaymentOrders(){
        try {
            this.unPaymentOrders = await this.orderService.queryOrderList({
                status:status.enable,
                isDelete:isDelete.false,
                pay_status:payStatus.unPayment
            })
        }catch (err){
            this.unPaymentOrders = []
        }
    }
    //每1min获取未完成订单，总共轮询5次，若真没付款则关闭该订单，结束后的等待10分钟之后继续轮询
    async create(){
        console.log('order pay status monitor started')
        this.taskNum = 0
        await this.queryUnPaymentOrders()
        await this.task()
    }
    destroyed(){
        clearTimeout(this.taskTimer)
        this.taskTimer = null
    }
    async task(){
        try {
            if(this.unPaymentOrders.length>0){
                console.log(`[${this.unPaymentOrders.length}] orders need to be processed`)
                this.taskNum++
                let orderSuccessIds =[]
                for (let order of this.unPaymentOrders){
                    const checkRes = await this.orderService.checkOrder(order.id)
                    console.log(`order check result is ${checkRes}`)
                    // 如果订单已完成，则发送完成通知
                    if(isSysPaySuccess(checkRes)){
                        orderSuccessIds.push(order.id)
                        console.log(`order[${order.id}] finished,send message`)
                        global.parentPort.postMessage({
                            type:'order',
                            userId:order.creator,
                            isPaySuccess:true,
                            orderId:order.id
                        })
                    }
                }
                // 过滤已完成的订单
                this.unPaymentOrders = this.unPaymentOrders.filter(c=>!orderSuccessIds.includes(c.id))
                if(this.taskNum<this.taskLoopNum){
                    console.log(`The number[${this.taskNum}] of times does not exceed [${this.taskLoopNum}], wait for ${this.taskLoop}ms to continue`)
                    this.taskTimer = setTimeout(()=>{this.task.call(this)},this.taskLoop)
                }else{ // 次数已到，关闭未付款的订单
                    console.log(`The number[${this.taskLoopNum}] of times has expired, closing the unpaid order`)
                    for (let order of this.unPaymentOrders){
                        // 关闭订单
                        await this.orderService.closeOrder(order.id)
                    }
                    console.log(`wait for ${this.createLoop}ms to continue`)
                    this.taskTimer = setTimeout(()=>{
                        this.create.call(this)
                    },this.createLoop)
                }
            } else{ // 没未付款订单，等待几分钟之后再执行
                console.log(`orderSchedule: wait for ${this.createLoop}ms to continue`)
                this.taskTimer = setTimeout(()=>{
                    this.create.call(this)
                },this.createLoop)
            }
        }catch (err){
            console.log(err)
            console.log(`orderSchedule: wait for ${this.createLoop}ms to continue`)
            // 等待几分钟之后再执行
            this.taskTimer = setTimeout(()=>{
                this.create.call(this)
            },this.createLoop)
        }
    }


}