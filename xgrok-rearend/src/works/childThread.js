import OrderSchedule from "./orderSchedule.js";
import {getAlipaySdk, initLog} from "../utils/index.js";
import OAuthTokensService from "../service/oauthTokensService.js";
const {parentPort} = require("worker_threads");
import moment from "moment";
import Model from "../oauth/password/Model.js";
import OrderService from "../service/orderService";

global.alipaySdk = getAlipaySdk()
global.parentPort = parentPort
start()

function heartbeatToken(){
    async function _task(){
        console.log('heart beat accessTokens started')
        const oAuthTokensService = new OAuthTokensService()
        let startTime = new moment().format('yyyy-MM-DD HH:mm:ss').toString()
        let endTime = new moment().add(1,'hour').format('yyyy-MM-DD HH:mm:ss').toString()
        console.log(`Filter accessTokens that are about to expire, time range [${startTime}], [${endTime}]`)
        const tokenRes = await oAuthTokensService.queryToken({pageSize: 999, pageNumber: 1}, {}, {
            access_token_expires_at_start: startTime,
            access_token_expires_at_end:endTime
        })
        console.log(`${tokenRes[0]} accessTokens are about to expire`)
        for(let token of tokenRes[1]){
            console.log(`accessToken [${token.access_token}] will expire at ${token.access_token_expires_at}`)
            const newAccessToken = Model.createNewToken('accessToken')
            const newRefreshToken = Model.createNewToken('refreshToken')
            parentPort.postMessage({
                type: 'heartbeatToken',
                userId: token.user_id,
                access_token_id:token.id,
                access_token:newAccessToken.value,
                access_token_expires_at:newAccessToken.expiresTime,
                refresh_token:newRefreshToken.value,
                refresh_token_expires_at:newRefreshToken.expiresTime,
            })
        }
        console.log(`heartbeatToken: wait 1h for the execution to continue`)
        setTimeout(async () => {
            _task()
        },3600*1000)//每小时执行一次
    }
    _task()
}

function checkPlanExpired(){
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
            _task()
        },3600*1000)//每小时执行一次
    }
    _task()
}

function start(){
    initLog()
    console.log('worker thead started')
    const orderSchedule = new OrderSchedule()
    orderSchedule.create()
    heartbeatToken()
    checkPlanExpired()
}