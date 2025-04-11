import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import PortRangeModel from "../model/portRangeModel.js";
const tag = tags(['PortRange'])
import PortRangeService from '../service/portRangeService.js'
import ResultModel from "../model/sys/resultModel.js";

export default class PortRangeController {
    constructor() {
        if(!this.portRangeService){
            this.portRangeService = new PortRangeService()
        }
    }

    @request('get', '/portRange/query')
    @summary('查询端口范围')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel.swaggerDocument,...PortRangeModel.swaggerDocument})
    async queryPortRange(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const queryModel = new PortRangeModel(ctx.validatedQuery)
        const res = await this.portRangeService.queryPortRange(pagination,orderBy,queryModel)
        ctx.result(res)
    }

    @request('get', '/portRange/detail')
    @summary('查询端口范围详情')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel.swaggerDocument,...PortRangeModel.swaggerDocument})
    async detailPortRange(ctx) {
        const portRangeModel = new PortRangeModel(ctx.request.query)
        const portRangeDetail = await this.portRangeService.detailPortRange(portRangeModel)
        const res = portRangeDetail?new ResultModel(portRangeDetail,null,true):new ResultModel(null,'未找到该数据！',false)
        ctx.result(res)
    }

    @request('post', '/portRange')
    @summary('新增端口范围')
    @tag
    @body(PortRangeModel.swaggerDocument)
    async addPortRange(ctx) {
        const res = await this.portRangeService.addPortRange(ctx)
        ctx.result(res)
    }

    @request('put', '/portRange')
    @summary('修改端口范围')
    @tag
    @body(PortRangeModel.swaggerDocument)
    async editPortRange(ctx) {
        const res = await this.portRangeService.editPortRange(ctx)
        ctx.result(res)
    }


    @request('delete', '/portRange')
    @summary('删除端口范围')
    @tag
    @query({
        id: {type: "string", required: true, description: 'id'}
    })
    async delPortRange(ctx) {
       const res = await this.portRangeService.delPortRange(ctx)
        ctx.result(res)
    }

}
