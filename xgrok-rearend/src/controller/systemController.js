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
}