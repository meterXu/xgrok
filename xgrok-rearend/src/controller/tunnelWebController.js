import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import TunnelWebModel from "../model/tunnelWebModel.js";
const tag = tags(['TunnelWeb'])
import TunnelWebService from '../service/tunnelWebService.js'
import ResultModel from "../model/sys/resultModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import UserService from "../service/userService.js";

export default class TunnelWebController {
    constructor() {
        if(!this.tunnelWebService){
            this.tunnelWebService = new TunnelWebService()
        }
        if(!this.userService)
            this.userService = new UserService()
    }

    @request('get', '/tunnelWeb/query')
    @summary('查询web隧道')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel,...TunnelWebModel.swaggerDocument})
    async queryTunnelWeb(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(query)
        const tunnelWebQuery = new TunnelWebModel(query)
        const queryRes = await this.tunnelWebService.queryTunnelWeb(pagination,orderBy,tunnelWebQuery)
        const res = new ResultModel({
            total: queryRes[0],
            records: queryRes[1],
            pagination: pagination
        },null,true)
        ctx.result(res)
    }

    @request('get', '/tunnelWeb/detail')
    @summary('查询web隧道详情')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel,...TunnelWebModel.swaggerDocument})
    async detailTunnelWeb(ctx) {
        const tunnelWebQuery = new TunnelWebModel(ctx.validatedQuery)
        const tunnelDetail = await this.tunnelWebService.detailTunnelWeb(tunnelWebQuery)
        const res=tunnelDetail?new ResultModel(tunnelDetail,null,true):new ResultModel(null,'未找到该数据！',false)
        ctx.result(res)
    }

    @request('post', '/tunnelWeb')
    @summary('新增web隧道')
    @tag
    @body(TunnelWebModel.swaggerDocument)
    async addTunnelWeb(ctx) {
        let countRes = await this.userService.checkTunnelNum(ctx.token.user.id,ctx.validatedBody.server_id,ctx.validatedBody.client_id,'web')
        if(!countRes.success){
            ctx.result(countRes)
            return false
        }
        const tunnelWebModel = new TunnelWebModel(ctx.validatedBody)
        tunnelWebModel.creator=ctx.token.user.id
        const res = await this.tunnelWebService.addTunnelWeb(tunnelWebModel)
        ctx.result(res)
    }

    @request('put', '/tunnelWeb')
    @summary('修改web隧道')
    @tag
    @body(TunnelWebModel.swaggerDocument)
    async editTunnelWeb(ctx) {
        const tunnelWebModel = new TunnelWebModel(ctx.validatedBody)
        tunnelWebModel.editor = ctx.token.user.id
        const res = await this.tunnelWebService.editTunnelWeb(tunnelWebModel)
        ctx.result(res)
    }


    @request('delete', '/tunnelWeb')
    @summary('删除web隧道')
    @tag
    @query({
        id: {type: "string", required: true, description: 'id'}
    })
    async delTunnelWeb(ctx) {
        let id = ctx.validatedQuery.id;
        const res = await this.tunnelWebService.delTunnelWeb(id)
        ctx.result(res)
    }

    @request('delete', '/tunnelWeb/deleteBatch')
    @summary('批量删除web隧道')
    @tag
    @query({
        ids: {type: "string", required: true, description: 'ids'}
    })
    async delTunnelWebBatch(ctx) {
        let ids = ctx.validatedQuery.ids.split(',');
        const res = await this.tunnelWebService.delTunnelWebBatch(ids)
        ctx.result(res)
    }

}
