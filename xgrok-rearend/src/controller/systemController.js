import {body, query, request, summary, tags} from "koa-swagger-decorator";
import SystemService from "../service/systemService";
import ResultModel from "../model/sys/resultModel";

const tag = tags(['System'])
export default class SystemController {
    constructor() {
        if (!this.systemService) {
            this.systemService = new SystemService()
        }
    }

    @request('get', '/system/numberStatistics')
    @summary('查询订单、用户、金额数')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false},
    })
    async numberOfNewOrders(ctx) {
        const {startTime, endTime} = ctx.validatedQuery
        const orderCount = await this.systemService.numberStatistics(startTime, endTime)
        const res = new ResultModel(orderCount, null, true)
        ctx.result(res)
    }

    @request('get', '/system/salesVolumeStatistics')
    @summary('销售额统计')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false},
        type: {type: "string", required: true, description: "统计类型", nullable: false}
    })
    async salesVolumeStatistics(ctx) {
        const {startTime, endTime, type} = ctx.validatedQuery
        const resRecords = await this.systemService.salesVolumeStatistics(startTime, endTime, type)
        const res = new ResultModel(resRecords, null, true)
        ctx.result(res)
    }

    @request('get', '/system/productSales')
    @summary('产品销量统计')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false},
    })
    async productSales(ctx) {
        const {startTime, endTime} = ctx.validatedQuery
        const resRecords = await this.systemService.productSales(startTime, endTime)
        const res = new ResultModel(resRecords, null, true)
        ctx.result(res)
    }

    @request('get', '/system/userOrderTop')
    @summary('用户订单数top统计')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false},
    })
    async userOrderTop(ctx) {
        const {startTime, endTime, top} = ctx.validatedQuery
        const resRecords = await this.systemService.userOrderTop(startTime, endTime, top)
        const res = new ResultModel(resRecords, null, true)
        ctx.result(res)
    }

    @request('get', '/system/userTunnelTop')
    @summary('用户隧道数top统计')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false},
        type:{type: "string", required: true, description: '隧道类型', nullable: false},
    })
    async userTunnelTop(ctx){
        const {startTime, endTime, top, type} = ctx.validatedQuery
        const resRecords = await this.systemService.userTunnelTop(startTime, endTime, top, type)
        const res = new ResultModel(resRecords, null, true)
        ctx.result(res)
    }

    @request('get', '/system/tunnelUsage')
    @summary('隧道使用分布图')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false}
    })
    async tunnelUsage(ctx){
        const {startTime, endTime} = ctx.validatedQuery
        const resRecords = await this.systemService.tunnelUsage(startTime, endTime)
        const res = new ResultModel(resRecords, null, true)
        ctx.result(res)
    }

    @request('get', '/system/serverUsage')
    @summary('服务器使用分布图')
    @tag
    @query({
        startTime: {type: "number", required: true, description: "开始时间", nullable: false},
        endTime: {type: "number", required: true, description: '结束时间', nullable: false},
        type:{type: "string", required: true, description: '隧道类型', nullable: false},
    })
    async serverUsage(ctx){
        const {startTime, endTime,type} = ctx.validatedQuery
        const resRecords = await this.systemService.serverUsage(startTime, endTime,type)
        const res = new ResultModel(resRecords, null, true)
        ctx.result(res)
    }

    @request('get', '/system/checkTcpLatency')
    @summary('测量TCP握手延迟')
    @tag
    async checkTcpLatency(ctx){
        const {serverId} = ctx.validatedQuery
        const res = await this.systemService.checkTcpLatency(serverId)
        ctx.result(new ResultModel(res, null, true))
    }

    @request('get', '/system/networkSpeed')
    @summary('测量用户客户端和服务端之间的速率')
    @tag
    async networkSpeed(ctx){
        const {serverId,clientId} = ctx.validatedQuery
        const res = await this.systemService.networkSpeed(serverId,clientId,ctx.token.user.id)
        ctx.result(new ResultModel(res, null, true))
    }
}
