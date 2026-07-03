import OrderSchedule from "./orderSchedule.js";
import {getAlipaySdk, initLog} from "../utils/index.js";
import OrderService from "../service/orderService";

const {parentPort} = require("worker_threads");
global.alipaySdk = getAlipaySdk()
global.parentPort = parentPort
start()

async function checkPlanExpired(){
    async function _task(){
        console.log('check plan expire started')
        const orderService = new OrderService()
        const queryRes = await orderService.queryExpireTaskOrder()
        if(queryRes[0].length>0){
            console.log(`[${queryRes[0].length}] orders expire in one day`)
            for(let order of queryRes[0]){
                parentPort.postMessage({
                    type: 'checkPlanExpired',
                    category:'expireInOneDay',
                    userId: order.creator,
                    orderId: order.id,
                    email:order.username
                })
            }
        }
        if(queryRes[1].length>0){
            console.log(`[${queryRes[1].length}] orders  have expired`)
            for(let order of queryRes[1]){
                parentPort.postMessage({
                    type: 'checkPlanExpired',
                    category:'haveExpired',
                    userId: order.creator,
                    orderId: order.id,
                    email:order.username
                })
            }
        }
        console.log(`checkPlanExpired: wait 1h for the execution to continue`)
        setTimeout(async () => {
            await _task()
        },process.env.NODE_ENV==='development'?6*1000:1800*1000)//开发模式6s执行一次，正式环境每半时执行一次
    }
    await _task()
}

async function start(){
    initLog()
    console.log('worker thead started')
    const orderSchedule = new OrderSchedule()
    await orderSchedule.create()
    await checkPlanExpired()
}
