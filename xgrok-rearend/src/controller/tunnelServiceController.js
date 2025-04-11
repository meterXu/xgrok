import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import TunnelServiceModel from "../model/tunnelServiceModel.js";
const tag = tags(['TunnelService'])
import TunnelServiceService from '../service/tunnelServiceService.js'
import ResultModel from "../model/sys/resultModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import UserService from "../service/userService.js";

export default class TunnelServiceController {
    constructor() {
        if(!this.tunnelServiceService){
            this.tunnelServiceService = new TunnelServiceService()
        }
        if(!this.userService)
            this.userService = new UserService()
    }

    @request('get', '/tunnelService/query')
    @summary('查询服务隧道')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel,...TunnelServiceModel.swaggerDocument})
    async queryTunnelService(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const tunnelServiceQuery = new TunnelServiceModel(ctx.validatedQuery)
        const queryRes = await this.tunnelServiceService.queryTunnelService(pagination,orderBy,tunnelServiceQuery)
        const res = new ResultModel({
            total: queryRes[0],
            records: queryRes[1],
            pagination: pagination
        },null,true)
        ctx.result(res)
    }

    @request('get', '/tunnelService/detail')
    @summary('查询服务隧道详情')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel,...TunnelServiceModel.swaggerDocument})
    async detailTunnelService(ctx) {
        const tunnelServiceQuery = new TunnelServiceModel(ctx.validatedQuery)
        const tunnelServiceDetail = await this.tunnelServiceService.detailTunnelService(tunnelServiceQuery)
        const res = tunnelServiceDetail?new ResultModel(tunnelServiceDetail,null,true):new ResultModel(null,'未找到该数据！',false)
        ctx.result(res)
    }

    @request('post', '/tunnelService')
    @summary('新增服务隧道')
    @tag
    @body(TunnelServiceModel.swaggerDocument)
    async addTunnelService(ctx) {
        let countRes = await this.userService.checkTunnelNum(ctx.token.user.id,ctx.validatedBody.server_id,ctx.validatedBody.client_id,'service')
        if(!countRes.success){
            ctx.result(countRes)
            return false
        }
        const tunnelServiceModel = new TunnelServiceModel(ctx.validatedBody)
        tunnelServiceModel.creator=ctx.token.user.id
        const addRes = await this.tunnelServiceService.addTunnelService(tunnelServiceModel)
        const res = new ResultModel(addRes.id,null,true)
        ctx.result(res)
    }

    @request('put', '/tunnelService')
    @summary('修改服务隧道')
    @tag
    @body(TunnelServiceModel.swaggerDocument)
    async editTunnelService(ctx) {
        const tunnelServiceModel = new TunnelServiceModel(ctx.validatedBody)
        tunnelServiceModel.editor = ctx.token.user.id
        const res = await this.tunnelServiceService.editTunnelService(tunnelServiceModel)
        ctx.result(res)
    }


    @request('delete', '/tunnelService')
    @summary('删除服务隧道')
    @tag
    @query({
        id: {type: "string", required: true, description: 'id'}
    })
    async delTunnelService(ctx) {
       let id = ctx.validatedQuery.id;
       const res = await this.tunnelServiceService.delTunnelService(id)
        ctx.result(res)
    }

    @request('delete', '/tunnelService/deleteBatch')
    @summary('批量删除服务隧道')
    @tag
    @query({
        ids: {type: "string", required: true, description: 'ids'}
    })
    async delTunnelServiceBatch(ctx) {
        let ids = ctx.validatedQuery.ids.split(',');
        const res = await this.tunnelServiceService.delTunnelServiceBatch(ids)
        ctx.result(res)
    }
}
